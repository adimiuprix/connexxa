import prisma from "../libs/prisma";

async function checkEnum() {
    try {
        const result = await prisma.$queryRaw`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = 'Availability'`;
        console.log("Availability Enum Values:", result);
    } catch (e) {
        console.error("Could not check enum:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkEnum();
