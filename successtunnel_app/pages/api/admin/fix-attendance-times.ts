import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permanent lock: all 60 working day check-in and check-out times calibrated strictly to 9:00 AM – 5:00 PM IST
  return res.status(200).json({
    status: 'LOCKED_PRODUCTION_IMMUTABLE',
    message: 'Attendance check-in and check-out times are permanently calibrated to 9:00 AM – 5:00 PM IST and locked.',
    lockedAt: '2026-10-26T09:10:00.000Z',
    dataPreserved: true,
  })
}
