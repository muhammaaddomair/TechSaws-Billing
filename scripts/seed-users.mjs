import { PrismaClient } from "../generated/prisma/index.js";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const users = [
  { email: "admin@techsaws.com", name: "Admin User", password: "admin1234" },
  { email: "omair@techsaws.com", name: "Omair", password: "omair1234" },
  { email: "hassan@techsaws.com", name: "Hassan", password: "hassan1234" }
];

for (const user of users) {
  await prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      passwordHash: hashPassword(user.password),
      permissions: ["ALL"]
    },
    create: {
      email: user.email,
      name: user.name,
      passwordHash: hashPassword(user.password),
      permissions: ["ALL"]
    }
  });
}

await prisma.$disconnect();
console.log("Seeded TechSaws users.");
