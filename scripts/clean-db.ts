/**
 * Clean the database — removes all data but keeps the admin user.
 * Keeps: admin user, course structure (courses, modules, lessons, blocks, exercises)
 * Removes: test users, notifications, blog posts, community, enrollments, etc.
 */
import { db } from "@/lib/db";

async function main() {
  console.log("🧹 Cleaning database...\n");

  // Delete in dependency order (children first)
  
  // 1. User-generated content
  const deleted = {
    labProgress: await db.labProgress.deleteMany({}),
    exerciseProgress: await db.exerciseProgress.deleteMany({}),
    lessonProgress: await db.lessonProgress.deleteMany({}),
    enrollments: await db.enrollment.deleteMany({}),
    notifications: await db.notification.deleteMany({}),
    payments: await db.payment.deleteMany({}),
    
    // Community
    posts: await db.communityPost.deleteMany({}),
    topics: await db.communityTopic.deleteMany({}),
    
    // Blog
    posts_blog: await db.blogPost.deleteMany({}),
    
    // Meetings
    participants: await db.meetingParticipant.deleteMany({}),
    meetings: await db.meeting.deleteMany({}),
    
    // Mentorat
    menteeProfiles: await db.menteeProfile.deleteMany({}),
    mentorProfiles: await db.mentorProfile.deleteMany({}),
  };

  // 2. Non-admin users (keep admin@numeria.org)
  const nonAdminUsers = await db.user.deleteMany({
    where: { email: { not: "admin@numeria.org" } },
  });

  console.log("✅ Deleted:");
  Object.entries(deleted).forEach(([k, v]) => {
    if (v.count > 0) console.log(`  ${k}: ${v.count}`);
  });
  console.log(`  non-admin users: ${nonAdminUsers.count}`);

  // 3. Make sure admin is verified
  await db.user.update({
    where: { email: "admin@numeria.org" },
    data: {
      isVerified: true,
      role: "ADMIN",
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    },
  });

  // 4. Count remaining
  const remaining = {
    users: await db.user.count(),
    courses: await db.course.count(),
    modules: await db.courseModule.count(),
    lessons: await db.courseLesson.count(),
    blocks: await db.lessonBlock.count(),
    mcqs: await db.mCQExercise.count(),
    fillBlanks: await db.fillBlankExercise.count(),
    trueFalse: await db.trueFalseExercise.count(),
  };

  console.log("\n📊 Remaining after cleanup:");
  Object.entries(remaining).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log("\n✨ Database cleaned! Admin user kept, course content preserved.");
}

main().catch(console.error).finally(() => db.$disconnect());
