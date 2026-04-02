const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'admin@fintrack.com', password: 'admin123', role: 'ADMIN' },
    { email: 'analyst@fintrack.com', password: 'analyst123', role: 'ANALYST' },
    { email: 'viewer@fintrack.com', password: 'viewer123', role: 'VIEWER' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, password: hashed, role: u.role },
    });
  }

  console.log('Seeded 3 users: ADMIN, ANALYST, VIEWER');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());