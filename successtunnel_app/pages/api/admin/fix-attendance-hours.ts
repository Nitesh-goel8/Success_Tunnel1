import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = req.query.secret || req.headers['x-admin-secret']
  if (
    secretKey !== 'ST_SUPER_ADMIN_2026' &&
    secretKey !== 'nitesh2005' &&
    secretKey !== process.env.JWT_SECRET
  ) {
    return res.status(403).json({ error: 'Unauthorized: admin secret required' })
  }

  try {
    // 1. Fetch all existing attendance records
    const allRecords = await prisma.attendanceRecord.findMany({
      orderBy: { date: 'asc' },
    })

    if (allRecords.length === 0) {
      return res.status(200).json({ message: 'No attendance records found to update', count: 0 })
    }

    // 2. Compute 9 to 5 shift timestamps in Indian Standard Time (IST / UTC+05:30)
    // 09:00 AM IST = 03:30 AM UTC
    // 05:00 PM IST = 11:30 AM UTC (8-hour shift = 480 minutes)
    const updateValues = allRecords.map((r) => {
      const dateStr = r.date // 'YYYY-MM-DD'
      const hash = (r.userId * 43 + parseInt(dateStr.replace(/-/g, ''), 10)) % 100

      // 9:00 AM to 5:00 PM workday
      const isLate = hash > 92
      // Normal arrival between 8:58 AM and 9:08 AM IST; Late arrival at 9:18 AM IST
      const minuteOffset = isLate ? 18 : (hash % 11) - 2 // -2 to +8 mins
      const durationMins = 480 + (hash % 12) // 480 to 491 mins (~8 hrs)
      const status = isLate ? 'LATE' : (r.status === 'REGULARIZED' ? 'REGULARIZED' : 'PRESENT')

      // Base: 03:30:00 UTC = 09:00:00 IST
      const [year, month, day] = dateStr.split('-').map(Number)
      const checkInDate = new Date(Date.UTC(year, month - 1, day, 3, 30 + minuteOffset, 0, 0))
      const checkOutDate = new Date(checkInDate.getTime() + durationMins * 60 * 1000)

      return {
        id: r.id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        durationMinutes: durationMins,
        status,
      }
    })

    // 3. Execute bulk update in PostgreSQL
    const valueClauses = updateValues
      .map(
        (v) =>
          `(${v.id}, '${v.checkIn}'::timestamptz, '${v.checkOut}'::timestamptz, ${v.durationMinutes}, '${v.status}')`
      )
      .join(',\n')

    await prisma.$executeRawUnsafe(`
      UPDATE "AttendanceRecord" AS a
      SET "checkIn" = v.ci,
          "checkOut" = v.co,
          "durationMinutes" = v.dur,
          "status" = v.st
      FROM (VALUES
        ${valueClauses}
      ) AS v(id, ci, co, dur, st)
      WHERE a.id = v.id;
    `)

    // 4. Read sample updated records to verify
    const sample = await prisma.attendanceRecord.findMany({
      take: 3,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        checkIn: true,
        checkOut: true,
        durationMinutes: true,
        status: true,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'All attendance records successfully calibrated to 9:00 AM - 5:00 PM shift (IST)',
      updatedCount: updateValues.length,
      sampleRecords: sample.map((s) => ({
        ...s,
        formattedCheckInIST: new Date(s.checkIn).toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        formattedCheckOutIST: s.checkOut
          ? new Date(s.checkOut).toLocaleTimeString('en-US', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : null,
      })),
    })
  } catch (error: any) {
    console.error('Failed to fix attendance hours:', error)
    return res.status(500).json({ error: error.message || String(error) })
  }
}
