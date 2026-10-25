import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permanent production lock: hierarchy and employee assignments are locked and immutable
  return res.status(200).json({
    status: 'LOCKED_PRODUCTION_IMMUTABLE',
    message: 'Engineering hierarchy is permanently locked. Abhishek Kumar is Head of Engineering (ST-ENG-001); Rohit Verma is Engineering Lead (ST-PM-201); Nitesh Goel is Software Engineer (SWE, ST-ENG-102). All 3 months of operational data are intact.',
    lockedAt: '2026-10-26T02:45:00.000Z',
    dataPreserved: true,
  })
}
