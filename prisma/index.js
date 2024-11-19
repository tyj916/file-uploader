const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.session.findMany();
  console.log(allUsers);
}

main()
.catch(async (e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
})