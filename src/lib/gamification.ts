import { db } from "@/lib/db";

const BADGES = [
  { type: "first_lesson", name: "Premier pas", emoji: "🎯", desc: "Compléter ta première leçon" },
  { type: "streak_7", name: "Régulier", emoji: "🔥", desc: "7 jours de streak" },
  { type: "streak_30", name: "Assidu", emoji: "⚡", desc: "30 jours de streak" },
  { type: "course_complete", name: "Champion", emoji: "🏆", desc: "Terminer un cours complet" },
  { type: "forum_post", name: "Actif", emoji: "💬", desc: "Premier message sur le forum" },
  { type: "explorer", name: "Explorateur", emoji: "🧭", desc: "Visiter 5 cours différents" },
];

export async function awardBadge(userId: string, badgeType: string) {
  try {
    await db.userBadge.upsert({
      where: { userId_badgeType: { userId, badgeType } },
      update: {},
      create: { userId, badgeType },
    });
    await db.notification.create({
      data: { userId, title: "Nouveau badge ! 🏆", message: `Tu as débloqué le badge "${BADGES.find(b => b.type === badgeType)?.name ?? badgeType}" !`, link: "/profil" },
    });
  } catch {}
}

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existing = await db.userStreak.findUnique({ where: { userId } });
  
  if (!existing) {
    await db.userStreak.create({ data: { userId, currentStreak: 1, longestStreak: 1, lastActivityDate: today, totalXP: 10 } });
    await awardBadge(userId, "first_lesson");
    return;
  }

  if (existing.lastActivityDate) {
    const last = new Date(existing.lastActivityDate);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return; // Already active today
    if (diffDays === 1) {
      const newStreak = existing.currentStreak + 1;
      await db.userStreak.update({ where: { userId }, data: { currentStreak: newStreak, longestStreak: Math.max(existing.longestStreak, newStreak), lastActivityDate: today, totalXP: { increment: 10 } } });
      if (newStreak === 7) await awardBadge(userId, "streak_7");
      if (newStreak === 30) await awardBadge(userId, "streak_30");
    } else {
      await db.userStreak.update({ where: { userId }, data: { currentStreak: 1, lastActivityDate: today, totalXP: { increment: 10 } } });
    }
  } else {
    await db.userStreak.update({ where: { userId }, data: { currentStreak: 1, lastActivityDate: today, totalXP: { increment: 10 } } });
  }
}

export { BADGES };
