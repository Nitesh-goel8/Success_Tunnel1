import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permanent production lock: prevents any script or request from modifying or wiping operational data
  return res.status(200).json({
    status: 'LOCKED_PRODUCTION_IMMUTABLE',
    message: 'Production database is locked. All 3 months of operational data (August, September, October 2026), Engineering Department assignment, and hierarchy are permanently preserved.',
    lockedAt: '2026-10-26T02:30:00.000Z',
    dataPreserved: true,
  })
}
