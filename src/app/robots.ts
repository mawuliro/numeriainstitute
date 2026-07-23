import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/profil",
          "/dashboard",
          "/communaute/nouveau",
          "/login",
          "/signup",
          "/verifier-email",
          "/verifier-email-sent",
          "/mot-de-passe-oublie",
          "/reinitialiser-mdp",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
