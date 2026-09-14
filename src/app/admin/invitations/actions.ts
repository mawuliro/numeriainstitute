"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security";
import { generateToken, hashToken } from "@/lib/security";
import { sendInvitationEmail } from "@/lib/email";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const INVITATION_EXPIRY_DAYS = 7;

export async function createInvitationAction(formData: FormData) {
  await requireAdmin();

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const courseId = (formData.get("courseId") as string) || null;
  const message = (formData.get("message") as string)?.trim() || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/admin/invitations?error=invalid-email");
  }

  // Check if user already exists with this email
  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true, deletedAt: true },
  });

  if (existingUser && !existingUser.deletedAt) {
    redirect(`/admin/invitations?error=user-exists&email=${encodeURIComponent(email)}`);
  }

  // Check if there's already a pending invitation for this email
  const existingInvite = await db.invitation.findFirst({
    where: {
      email,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (existingInvite) {
    redirect(`/admin/invitations?error=already-invited&email=${encodeURIComponent(email)}`);
  }

  // Get course title if courseId provided
  let courseTitle: string | null = null;
  if (courseId) {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });
    courseTitle = course?.title ?? null;
  }

  // Create invitation with token
  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  // Get admin user ID from session
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  const adminId = session!.user.id;

  const invitation = await db.invitation.create({
    data: {
      email,
      token: hashedToken,
      invitedBy: adminId,
      courseId: courseId || null,
      message,
      expiresAt,
    },
  });

  // Send the invitation email (with the RAW token, not the hash)
  const emailSent = await sendInvitationEmail(
    email,
    rawToken,
    BASE_URL,
    courseTitle,
    message,
  );

  if (!emailSent) {
    // Email failed but invitation was created — show a warning
    redirect(`/admin/invitations?created=${invitation.id}&warning=email-failed`);
  }

  revalidatePath("/admin/invitations");
  redirect(`/admin/invitations?created=${invitation.id}`);
}

export async function revokeInvitationAction(formData: FormData) {
  await requireAdmin();

  const invitationId = formData.get("invitationId") as string;
  if (!invitationId) redirect("/admin/invitations");

  await db.invitation.delete({ where: { id: invitationId } });
  revalidatePath("/admin/invitations");
  redirect("/admin/invitations?revoked=1");
}

export async function resendInvitationAction(formData: FormData) {
  await requireAdmin();

  const invitationId = formData.get("invitationId") as string;
  if (!invitationId) redirect("/admin/invitations");

  const invitation = await db.invitation.findUnique({
    where: { id: invitationId },
    include: { course: { select: { title: true } } },
  });

  if (!invitation) redirect("/admin/invitations");

  // Generate a fresh token (old one is invalidated)
  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await db.invitation.update({
    where: { id: invitationId },
    data: { token: hashedToken, expiresAt },
  });

  await sendInvitationEmail(
    invitation.email,
    rawToken,
    BASE_URL,
    invitation.course?.title ?? null,
    invitation.message,
  );

  revalidatePath("/admin/invitations");
  redirect("/admin/invitations?resent=1");
}
