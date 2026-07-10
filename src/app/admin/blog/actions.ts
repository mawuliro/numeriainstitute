"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createPostAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const isPublished = formData.get("isPublished") === "on";

  await db.blogPost.create({
    data: {
      title, slug, excerpt, content, category,
      authorId: session.user.id,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  redirect("/admin/blog");
}

export async function updatePostAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const isPublished = formData.get("isPublished") === "on";

  await db.blogPost.update({
    where: { id },
    data: {
      title, excerpt, content, category,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  redirect("/admin/blog");
}

export async function deletePostAction(formData: FormData) {
  const id = formData.get("id") as string;
  await db.blogPost.delete({ where: { id } });
  redirect("/admin/blog");
}
