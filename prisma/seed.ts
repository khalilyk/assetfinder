import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/password";
import crypto from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const name = process.argv[3] ?? "Admin";
  if (!email) {
    console.error("Usage: tsx prisma/seed.ts <email> [name]");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists (id: ${existing.id}). Nothing to do.`);
    return;
  }

  const password = crypto.randomBytes(12).toString("base64url");
  const passwordHash = await hashPassword(password);

  const user = await prisma.adminUser.create({
    data: { email, name, passwordHash, role: "SUPER_ADMIN" },
  });

  console.log("Created super admin:");
  console.log(`  id:       ${user.id}`);
  console.log(`  email:    ${user.email}`);
  console.log(`  password: ${password}`);
  console.log("Save this password now — it will not be shown again.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
