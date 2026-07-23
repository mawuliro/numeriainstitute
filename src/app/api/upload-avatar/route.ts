export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { checkIpRateLimit } from "@/lib/security";
import sharp from "sharp";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const AVATAR_SIZE = 256;
const AVATAR_QUALITY = 85;

/**
 * Upload-avatar endpoint (works on Vercel serverless too — no filesystem write).
 * Receives a multipart file, resizes it with sharp, and returns a base64 data URL
 * that can be stored directly in the User.avatarUrl column.
 *
 * Tradeoff: data URLs are larger than file URLs (≈ 30-100 KB per avatar), but
 * they survive serverless cold-starts and don't require external storage
 * (S3, Vercel Blob, etc.). Switch to Vercel Blob or S3 when you scale.
 */
export async function POST(req: NextRequest) {
  // Rate limit per IP (allow guests for signup flow)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = checkIpRateLimit(`avatar-upload:${ip}`, 10, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans un instant." },
      { status: 429 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "L'image ne doit pas dépasser 5 Mo." },
        { status: 413 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté. Utilise JPG, PNG, WEBP ou GIF." },
        { status: 415 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Resize + optimize with sharp, output WEBP
    const processed = await sharp(bytes)
      .resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: AVATAR_QUALITY })
      .toBuffer();

    // Encode as data URL — survives Vercel serverless (no filesystem write)
    const base64 = processed.toString("base64");
    const dataUrl = `data:image/webp;base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'image." },
      { status: 500 },
    );
  }
}
