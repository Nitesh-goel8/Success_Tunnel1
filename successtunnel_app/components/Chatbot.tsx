import { useState, useRef, useEffect } from 'react'
import {
  IoClose,
  IoSend,
  IoRefreshOutline,
  IoPersonOutline,
} from 'react-icons/io5'
import { TbRobot } from 'react-icons/tb'

type Message = {
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I am your SuccessTunnel RAG Advisor. Ask me basic questions about GST, Income Tax slabs, MSME registration, company setup, or PAN/TAN. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    "When is GST mandatory?",
    "What are the new Income Tax slabs?",
    "What are the benefits of MSME?",
    "How to register a Pvt Ltd company?"
  ]

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return

    const userMsg: Message = { sender: 'user', text: textToSend, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: data.answer || "I'm having trouble retrieving details right now. Please try again.", timestamp: new Date() }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "Sorry, I encountered a connection error. Please try again.", timestamp: new Date() }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const clearChat = () => {
    setMessages([{
      sender: 'bot',
      text: "Hello! I am your SuccessTunnel RAG Advisor. Ask me basic questions about GST, Income Tax slabs, MSME registration, company setup, or PAN/TAN. How can I help you today?",
      timestamp: new Date()
    }])
  }

  return (
    <div className="chatbot-launcher" style={{ position: 'fixed', right: '22px', bottom: '22px', zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>

      {/* Closed State: Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #0b3a86, #165df5)',
            color: '#fff',
            border: 'none',
            minWidth: '84px',
            height: '54px',
            padding: '0 16px 0 12px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(22, 93, 245, 0.40)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(22, 93, 245, 0.50)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(22, 93, 245, 0.40)'
          }}
          aria-label="Open AI Chatbot"
        >
          <span style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.16)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TbRobot size={18} />
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.01em' }}>Bot</span>
        </button>
      )}

      {/* Open State: Chat Panel */}
      {isOpen && (
        <div style={{
          width: 'min(380px, calc(100vw - 44px))',
          height: '520px',
          background: '#fff',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'absolute',
          bottom: '0',
          right: '0',
        }}>

          {/* ── Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0b3a86, #165df5)',
            color: '#fff',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TbRobot size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.93rem', fontWeight: 800, fontFamily: 'Sora, sans-serif', letterSpacing: '-0.01em' }}>
                  AI Bot
                </h4>
                <span style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
                  Ask about GST, tax, and education
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={clearChat}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                title="Clear Chat"
              >
                <IoRefreshOutline size={17} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                title="Close"
              >
                <IoClose size={19} />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div style={{
            flex: 1, padding: '14px 16px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '10px',
            background: '#f8fafc'
          }}>
            {messages.map((msg, i) => {
              const isBot = msg.sender === 'bot'
              return (
                <div key={i} style={{ display: 'flex', gap: '8px', alignSelf: isBot ? 'flex-start' : 'flex-end', maxWidth: '88%', flexDirection: isBot ? 'row' : 'row-reverse' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: isBot ? 'var(--primary)' : 'var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '2px',
                    color: isBot ? '#fff' : 'var(--muted)',
                  }}>
                    {isBot ? <TbRobot size={14} /> : <IoPersonOutline size={14} />}
                  </div>
                  {/* Bubble */}
                  <div style={{
                    background: isBot ? '#fff' : 'var(--primary)',
                    color: isBot ? 'var(--text)' : '#fff',
                    padding: '10px 14px',
                    borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    border: isBot ? '1px solid var(--line)' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontSize: '0.86rem', lineHeight: '1.55', whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', maxWidth: '88%' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <TbRobot size={14} />
                </div>
                <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '12px 16px', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--accent)', display: 'inline-block',
                      animation: `bounce-dot 1.2s ${i * 0.2}s infinite ease-in-out`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Suggestions ── */}
          {messages.length === 1 && (
            <div style={{ padding: '10px 14px', background: '#fff', borderTop: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px' }}>
                <TbRobot size={12} color="var(--muted)" />
                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Try asking</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      background: 'var(--surface-soft)', color: 'var(--accent)',
                      border: '1px solid var(--line)', padding: '5px 10px',
                      borderRadius: '8px', fontSize: '0.74rem', fontWeight: 600,
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-soft)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-soft)'; e.currentTarget.style.borderColor = 'var(--line)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input ── */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(input) }}
            style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', display: 'flex', gap: '8px', background: '#fff', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Ask about GST, tax, MSME..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              style={{
                flex: 1, border: '1.5px solid var(--line)', borderRadius: '12px',
                padding: '9px 14px', fontSize: '0.86rem', outline: 'none',
                transition: 'border-color 0.2s', background: '#f8fafc',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--line)'}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #0b3a86, #165df5)',
                color: '#fff', border: 'none', borderRadius: '12px',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                opacity: (!input.trim() || loading) ? 0.5 : 1, transition: 'opacity 0.2s',
              }}
            >
              <IoSend size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
