import { requireGuest } from "@/lib/auth";
import { LoginPage } from "@/components/auth/login-page";

export default async function HomePage() {
  await requireGuest();
  return <LoginPage />;
}
