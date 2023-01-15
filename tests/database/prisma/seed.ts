import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const loops = 10;

for (let i = 0; i < loops; i++) {
  prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      passwordHash: faker.random.alphaNumeric(30),
    },
  });
}

console.log("Successfull!!!!");
