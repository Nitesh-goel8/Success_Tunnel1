import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permanent lock: working tree aligned with Nitesh Goel as SWE Trainee under mentor Abhishek Kumar
  return res.status(200).json({
    status: 'LOCKED_PRODUCTION_IMMUTABLE',
    message: 'Working tree is permanently locked: Nitesh Goel is Software Engineering Trainee (SWE Trainee) under mentor Abhishek Kumar and delivery manager Rohit Verma.',
    lockedAt: '2026-10-26T04:02:00.000Z',
    dataPreserved: true,
  })
}
