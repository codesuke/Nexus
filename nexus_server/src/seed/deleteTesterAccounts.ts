import dotenv from "dotenv";
import { createClerkClient } from "@clerk/backend";

dotenv.config();

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) throw new Error("CLERK_SECRET_KEY is not defined");
const clerkClient = createClerkClient({ secretKey });

const EMAILS = ["nexus.tester.teacher@example.com", "nexus.tester.student@example.com"];

async function main() {
  for (const email of EMAILS) {
    const existing = await clerkClient.users.getUserList({ emailAddress: [email] });
    for (const user of existing.data) {
      await clerkClient.users.deleteUser(user.id);
      console.log(`Deleted ${email} -> ${user.id}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
