/** @type { import("drizzle-kit").Config} */

export default {
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:ob8vxA3pwlHD@ep-rough-sunset-a5xi12ak.us-east-2.aws.neon.tech/ai-interview?sslmode=require',
  }
};
