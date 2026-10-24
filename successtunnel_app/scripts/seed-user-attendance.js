const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedUserAttendance() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: 'admin@successtunnel.in' },
        { email: 'niteshgoel@successtunnel.in' }
      ]
    }
  });

  console.log('Found users to populate attendance for:', users.map(u => ({ id: u.id, email: u.email, name: u.name })));

  const now = new Date();
  
  for (const user of users) {
    // Ensure employee profile exists
    await prisma.employeeProfile.upsert({
      where: { userId: user.id },
      update: {
        designation: user.role === 'super_admin' ? 'Managing Director & Principal Architect' : 'Senior Engineering Lead',
        workLocation: 'Headquarters - Panipat, Haryana',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        isDemo: true,
      },
      create: {
        userId: user.id,
        employeeCode: user.role === 'super_admin' ? 'ST-DIR-001' : 'ST-DIR-002',
        designation: user.role === 'super_admin' ? 'Managing Director & Principal Architect' : 'Senior Engineering Lead',
        workLocation: 'Headquarters - Panipat, Haryana',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        isDemo: true,
      }
    });

    let recordsCreated = 0;
    // Exactly 30 calendar days backwards from today
    for (let d = 29; d >= 0; d--) {
      const targetDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      const dayOfWeek = targetDate.getDay(); // 0 = Sun, 6 = Sat
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue; // Skip weekends
      }

      const dateStr = targetDate.toISOString().split('T')[0];
      const hash = (user.id * 43 + parseInt(dateStr.replace(/-/g, ''), 10)) % 100;

      let inHour = 9;
      let inMin = 10 + (hash % 18); // 9:10 to 9:28 AM
      let durationMinutes = 510 + (hash % 45); // 8h 30m to 9h 15m
      let status = 'PRESENT';
      let notes = 'Regular operational shift at Panipat headquarters';

      if (hash > 88) {
        // Occasional slight late arrival
        status = 'LATE';
        inHour = 9;
        inMin = 48 + (hash % 10);
        durationMinutes = 480;
        notes = 'Transit delay logged';
      }

      const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`);
      const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000);

      await prisma.attendanceRecord.upsert({
        where: { userId_date: { userId: user.id, date: dateStr } },
        update: {
          checkIn,
          checkOut,
          durationMinutes,
          status,
          notes,
          isDemo: true,
        },
        create: {
          userId: user.id,
          date: dateStr,
          checkIn,
          checkOut,
          durationMinutes,
          status,
          notes,
          isDemo: true,
        }
      });
      recordsCreated++;
    }
    console.log(`✅ Created ${recordsCreated} weekday attendance records across 30 days for ${user.email} (${user.name})`);
  }
}

seedUserAttendance()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
