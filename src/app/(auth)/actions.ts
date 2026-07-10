"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";

export async function signupAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit faire au moins 6 caractères" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "STUDENT",
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch {
    return { error: "Email ou mot de passe incorrect" };
  }
}
