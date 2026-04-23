export function assertDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Create a .env or .env.local file in the project root and set DATABASE_URL to your PostgreSQL connection string."
    );
  }

  if (hasPlaceholderDatabaseUrl(databaseUrl)) {
    throw new Error(
      "DATABASE_URL still contains placeholder values. In Vercel, replace DATABASE_URL with the real pooled Neon connection string in Project Settings > Environment Variables."
    );
  }

  const directUrl = process.env.DIRECT_URL;
  if (directUrl && hasPlaceholderDatabaseUrl(directUrl)) {
    throw new Error(
      "DIRECT_URL still contains placeholder values. In Vercel, replace DIRECT_URL with the real direct Neon connection string in Project Settings > Environment Variables."
    );
  }
}

function hasPlaceholderDatabaseUrl(value: string) {
  const upper = value.toUpperCase();

  return [
    "EP-POOLER-HOST",
    "EP-DIRECT-HOST",
    "YOUR-NEON-POOLER-HOST",
    "YOUR-NEON-DIRECT-HOST",
    "USER:PASSWORD",
    "DB_NAME"
  ].some((placeholder) => upper.includes(placeholder));
}
