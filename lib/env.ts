export function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Create a .env or .env.local file in the project root and set DATABASE_URL to your PostgreSQL connection string."
    );
  }
}
