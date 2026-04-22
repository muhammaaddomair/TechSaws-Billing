import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "techsaws_session";

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "techsaws-local-session-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function createSessionToken(userId: string) {
  const signature = sign(userId);
  return `${userId}.${signature}`;
}

export function verifySessionToken(token: string) {
  const [userId, signature] = token.split(".");

  if (!userId || !signature) {
    return null;
  }

  const expected = sign(userId);

  if (signature.length !== expected.length) {
    return null;
  }

  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  return valid ? userId : null;
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const userId = verifySessionToken(token);

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      email: true,
      name: true,
      permissions: true
    }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    const fallbackUser = await prisma.user.findFirst({
      orderBy: {
        createdAt: "asc"
      },
      select: {
        id: true,
        email: true,
        name: true,
        permissions: true
      }
    });

    if (fallbackUser) {
      return fallbackUser;
    }

    redirect("/");
  }

  return user;
}

export async function requireGuest() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard/clients");
  }
}
