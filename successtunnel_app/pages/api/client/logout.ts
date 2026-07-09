import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'st_client_auth=; HttpOnly; Path=/; Max-Age=0')
  return res.json({ ok: true })
}
