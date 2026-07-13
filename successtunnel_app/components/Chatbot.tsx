import { useEffect, useRef, useState } from 'react'
import { IoClose, IoPersonOutline, IoRefreshOutline, IoSend } from 'react-icons/io5'
import { TbRobot } from 'react-icons/tb'

type Message = { sender: 'user' | 'bot'; text: string }

const welcomeMessage = 'Hi! I can help with basic questions about GST, income tax, MSME registration, company setup, PAN and TAN.'
const quickQuestions = ['When is GST mandatory?', 'What are the benefits of MSME?', 'How do I register a company?']

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ sender: 'bot', text: welcomeMessage }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isOpen])

  const sendMessage = async (text: string) => {
    const message = text.trim()
    if (!message || loading) return

    setMessages(current => [...current, { sender: 'user', text: message }])
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
      const data = await response.json()
      setMessages(current => [...current, { sender: 'bot', text: data.answer || 'I could not find that right now. Please try again or contact our team.' }])
    } catch {
      setMessages(current => [...current, { sender: 'bot', text: 'I could not connect just now. Please try again or contact our team.' }])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => setMessages([{ sender: 'bot', text: welcomeMessage }])

  return <div className={'chatbot ' + (isOpen ? 'is-open' : '')}>
    {!isOpen ? <button className="chatbot-trigger" type="button" onClick={() => setIsOpen(true)} aria-label="Open help chat"><span><TbRobot /></span>Need help?</button> : <div className="chatbot-panel" role="dialog" aria-label="SuccessTunnel help chat">
      <header className="chatbot-header"><div><span className="chatbot-avatar"><TbRobot /></span><div><strong>Quick help</strong><small>Ask about GST, tax, MSME and setup</small></div></div><div><button type="button" onClick={resetChat} aria-label="Start a new chat" title="Start again"><IoRefreshOutline /></button><button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat"><IoClose /></button></div></header>
      <div className="chatbot-messages">{messages.map((message, index) => <div key={index} className={'chat-message ' + message.sender}>{message.sender === 'bot' && <span className="chat-message-avatar"><TbRobot /></span>}<p>{message.text}</p>{message.sender === 'user' && <span className="chat-message-avatar"><IoPersonOutline /></span>}</div>)}{loading && <div className="chat-message bot"><span className="chat-message-avatar"><TbRobot /></span><p className="chat-typing"><i /><i /><i /></p></div>}<div ref={messagesEndRef} /></div>
      {messages.length === 1 && <div className="chatbot-suggestions"><span>Popular questions</span><div>{quickQuestions.map(question => <button type="button" key={question} onClick={() => sendMessage(question)}>{question}</button>)}</div></div>}
      <form className="chatbot-input" onSubmit={event => { event.preventDefault(); sendMessage(input) }}><input value={input} onChange={event => setInput(event.target.value)} disabled={loading} placeholder="Type your question" aria-label="Your question" /><button type="submit" disabled={loading || !input.trim()} aria-label="Send question"><IoSend /></button></form>
    </div>}
  </div>
}
