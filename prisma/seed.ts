import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
async function main() {
//   const alice = await prisma.coffee
//   console.log({ alice })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })