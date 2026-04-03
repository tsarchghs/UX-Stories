const { PrismaClient } = require("@prisma/client");

const prismaDb = new PrismaClient();

module.exports = prismaDb;
