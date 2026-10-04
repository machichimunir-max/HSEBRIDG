import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupTestCourses() {
  console.log("🔍 Searching for test courses...\n");

  // Find all test courses
  const testCourses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: "Test Course", mode: "insensitive" } },
        { title: { contains: "QHSE Test Course", mode: "insensitive" } },
      ],
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
      enrollments: true,
    },
  });

  if (testCourses.length === 0) {
    console.log("✅ No test courses found. Database is clean.");
    return;
  }

  console.log(`📋 Found ${testCourses.length} test course(s):\n`);

  testCourses.forEach((course, index) => {
    console.log(`${index + 1}. "${course.title}"`);
    console.log(`   - ID: ${course.id}`);
    console.log(`   - Modules: ${course.modules.length}`);
    console.log(`   - Lessons: ${course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}`);
    console.log(`   - Enrollments: ${course.enrollments.length}`);
    console.log(`   - Created: ${course.createdAt.toISOString()}`);
    console.log("");
  });

  console.log("⚠️  WARNING: This will DELETE:");
  const totalModules = testCourses.reduce((sum, c) => sum + c.modules.length, 0);
  const totalLessons = testCourses.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
    0
  );
  const totalEnrollments = testCourses.reduce((sum, c) => sum + c.enrollments.length, 0);

  console.log(`   - ${testCourses.length} courses`);
  console.log(`   - ${totalModules} modules`);
  console.log(`   - ${totalLessons} lessons`);
  console.log(`   - ${totalEnrollments} enrollments`);
  console.log(`   - Associated progress records\n`);

  console.log("🚨 This action CANNOT be undone!");
  console.log("💡 Run this script with --confirm flag to proceed:");
  console.log("   npx tsx scripts/cleanup-test-courses.ts --confirm\n");

  const shouldDelete = process.argv.includes("--confirm");

  if (!shouldDelete) {
    console.log("❌ Deletion cancelled (no --confirm flag provided).");
    return;
  }

  console.log("🗑️  Deleting test courses (cascading to modules, lessons, enrollments, progress)...\n");

  for (const course of testCourses) {
    try {
      await prisma.course.delete({
        where: { id: course.id },
      });
      console.log(`✅ Deleted: "${course.title}"`);
    } catch (error) {
      console.error(`❌ Failed to delete "${course.title}":`, error);
    }
  }

  console.log("\n✨ Cleanup complete!");
}

cleanupTestCourses()
  .catch((error) => {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
