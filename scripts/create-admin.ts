/**
 * Create (or upgrade) an admin account.
 *
 * Usage:
 *   bun run scripts/create-admin.ts
 *
 * Reads credentials from env vars (or falls back to the values below).
 * Idempotent: if the user already exists, it updates the role to ADMIN,
 * verifies the email, and resets the password.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "numeriainstitute@gmail.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Numeria2026@";
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Numeria";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "Institute";

async function main() {
  console.log("🔧 Creating admin account...");
  console.log(`   Email:     ${ADMIN_EMAIL}`);
  console.log(`   First name: ${ADMIN_FIRST_NAME}`);
  console.log(`   Last name:  ${ADMIN_LAST_NAME}`);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const fullName = `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`.trim();

  const user = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      name: fullName,
      passwordHash,
      role: "ADMIN",
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
      deletedAt: null,
    },
    create: {
      email: ADMIN_EMAIL,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      name: fullName,
      passwordHash,
      role: "ADMIN",
      isVerified: true,
      preferredLanguage: "fr",
    },
  });

  console.log("✅ Admin account ready:");
  console.log(`   ID:         ${user.id}`);
  console.log(`   Role:       ${user.role}`);
  console.log(`   Verified:   ${user.isVerified}`);
  console.log("");
  console.log("🔐 Login URL: https://numeriainstitute.vercel.app/login");
  console.log("   (or http://localhost:3000/login in dev)");
}

main()
  .catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
