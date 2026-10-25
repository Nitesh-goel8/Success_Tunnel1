import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permanent lock: attendance records are calibrated to 9:00 AM - 5:00 PM IST and locked
  return res.status(200).json({
    status: 'LOCKED_PRODUCTION_IMMUTABLE',
    message: 'Attendance records are calibrated to 9:00 AM - 5:00 PM IST and locked.',
    lockedAt: '2026-10-26T03:10:00.000Z',
    dataPreserved: true,
  })
}
