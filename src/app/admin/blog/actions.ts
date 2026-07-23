"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/security";
import { redirect } from "next/navigation";

// Note: actions used directly as <form action={...}> must return void/Promise<void>.
// Errors are surfaced via redirect to an error page or via the toast on next render.

export async function createPostAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() ?? "";
  const content = formData.get("content") as string;
  const category = (formData.get("category") as string)?.trim() || "General";
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !slug || !content) {
    redirect("/admin/blog/nouveau?error=missing");
  }

  try {
    await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        authorId: admin.id,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
  } catch {
    redirect("/admin/blog/nouveau?error=slug-taken");
  }

  redirect("/admin/blog");
}

export async function updatePostAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() ?? "";
  const content = formData.get("content") as string;
  const category = (formData.get("category") as string)?.trim() || "General";
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title || !content) {
    redirect(`/admin/blog/${id}?error=missing`);
  }

  // Only set publishedAt the first time it's published
  const existing = await db.blogPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  const publishedAt = isPublished
    ? existing?.publishedAt ?? new Date()
    : null;

  await db.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      category,
      isPublished,
      publishedAt,
    },
  });

  redirect("/admin/blog");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) redirect("/admin/blog");
  await db.blogPost.delete({ where: { id } });
  redirect("/admin/blog");
}
