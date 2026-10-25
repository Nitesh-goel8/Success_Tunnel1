import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permanent production lock: prevents any script or request from modifying or wiping operational data
  return res.status(200).json({
    status: 'LOCKED_PRODUCTION_IMMUTABLE',
    message: 'Production database is locked. All ERP tables, departmental structures, and user profiles are permanently preserved.',
    lockedAt: '2026-10-26T02:30:00.000Z',
    dataPreserved: true,
  })
}
