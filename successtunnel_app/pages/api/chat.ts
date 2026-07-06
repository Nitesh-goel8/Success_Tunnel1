import type { NextApiRequest, NextApiResponse } from 'next'
import { RAG_KNOWLEDGE } from '../../lib/ragKnowledge'

const STOP_WORDS = new Set([
  'is', 'the', 'a', 'an', 'are', 'what', 'how', 'when', 'why', 'where', 'who', 'which', 'to', 'for', 'in', 'on', 'at', 'of', 'with', 'about', 'by', 'does', 'do', 'can', 'should', 'would', 'could', 'limit', 'rate', 'regime'
])

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message query is required' })
  }

  const query = message.toLowerCase().trim()
  const queryTokens = query
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token))

  if (queryTokens.length === 0) {
    return res.status(200).json({
      answer: "Hello! I am SuccessTunnel's RAG Assistant. Please ask any basic CA or taxation questions, such as:\n\n* When is GST registration mandatory?\n* What are the new Income Tax slabs?\n* What are the benefits of MSME registration?\n* How do I incorporate a Private Limited company?"
    })
  }

  let bestDoc = null
  let maxScore = 0

  for (const doc of RAG_KNOWLEDGE) {
    let score = 0

    // 1. Keyword matching (high weight)
    for (const kw of doc.keywords) {
      const kwTokens = kw.split(/\s+/)
      for (const token of queryTokens) {
        if (kwTokens.includes(token)) {
          score += 4
        }
      }
    }

    // 2. Question matching (medium weight)
    const questionTokens = doc.question.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    for (const token of queryTokens) {
      if (questionTokens.includes(token)) {
        score += 2
      }
    }

    // 3. Answer matching (low weight)
    const answerTokens = doc.answer.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    for (const token of queryTokens) {
      if (answerTokens.includes(token)) {
        score += 0.5
      }
    }

    if (score > maxScore) {
      maxScore = score
      bestDoc = doc
    }
  }

  // Threshold for matching
  if (bestDoc && maxScore >= 2) {
    return res.status(200).json({
      answer: `**[RAG Retrieval Success - Topic: ${bestDoc.category}]**\n\n${bestDoc.answer}\n\n*Need detailed corporate advice? You can speak with our Principal Advisor, Neeraj Aggarwal (CA), at +91 89507 71205.*`
    })
  }

  // Fallback response with suggested questions
  return res.status(200).json({
    answer: `I searched our CA Knowledge Base but couldn't find a direct match for your question. \n\nI can help you with basic questions on:\n* **GST Compliance** (thresholds, required documents)\n* **Income Tax** (slabs under the new regime, 80C deductions)\n* **Company Setup** (incorporation steps, Pvt Ltd vs LLP)\n* **MSME Registration** (Udyam benefits)\n* **PAN & TAN** (definitions and differences)\n\nTry asking: *"What are the benefits of MSME?"* or *"What is the GST limit?"*`
  })
}
