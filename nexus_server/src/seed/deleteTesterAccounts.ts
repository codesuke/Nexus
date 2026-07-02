import dotenv from "dotenv";
import { createClerkClient } from "@clerk/backend";
import { TEACHER_EMAIL, STUDENT_EMAIL } from "./testerAccounts.constants";

dotenv.config();

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) throw new Error("CLERK_SECRET_KEY is not defined");
const clerkClient = createClerkClient({ secretKey });

const EMAILS = [TEACHER_EMAIL, STUDENT_EMAIL];

async function main() {
  for (const email of EMAILS) {
    const existing = await clerkClient.users.getUserList({ emailAddress: [email] });
    if (existing.data.length === 0) {
      console.warn(`No Clerk user found for ${email} - nothing deleted`);
      continue;
    }
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
