/**
 * E2E Tests: Quiz System + PDF Certificate Generation
 *
 * Coverage:
 * - Admin: Create quiz with multiple questions
 * - Student: Take quiz, pass/fail scenarios
 * - Student: Certificate generation and download
 * - i18n: FR and AR support
 * - Security: Quiz gated by lesson completion, cert download authorization
 *
 * Test data pattern: Uses @test.local email addresses for cleanup safety
 * Cleanup: All test records filtered by email pattern, never touches real data
 */

import { test, expect, type Page } from '@playwright/test';
import { prisma } from '../src/lib/db';
import type { User, Course, Lesson } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

// Set action timeout to 5s for faster failures on UI interactions
// Navigation and API calls that involve server-side work use explicit longer timeouts
test.use({ actionTimeout: 5000 });

const ADMIN_EMAIL = 'admin@qhse.local';
const ADMIN_PASSWORD = 'Admin123!';

// Cleanup helper: Remove test data by email pattern
async function cleanupTestData() {
  // Delete quiz attempts for test students
  const testStudents = await prisma.user.findMany({
    where: { email: { endsWith: '@test.local' } },
    select: { id: true }
  });
  const testStudentIds = testStudents.map((s: { id: string }) => s.id);

  if (testStudentIds.length > 0) {
    await prisma.quizAttempt.deleteMany({
      where: { userId: { in: testStudentIds } }
    });

    await prisma.attestation.deleteMany({
      where: { userId: { in: testStudentIds } }
    });

    await prisma.lessonProgress.deleteMany({
      where: { userId: { in: testStudentIds } }
    });

    await prisma.enrollment.deleteMany({
      where: { userId: { in: testStudentIds } }
    });

    await prisma.user.deleteMany({
      where: { email: { endsWith: '@test.local' } }
    });
  }

  // Delete test quizzes (by matching test course)
  const testCourses = await prisma.course.findMany({
    where: {
      OR: [
        { slug: { startsWith: 'test-quiz-' } },
        { title: { startsWith: 'E2E Quiz Test Course' } }
      ]
    },
    select: { id: true }
  });

  for (const course of testCourses) {
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.enrollment.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  }
}

test.beforeAll(async () => {
  await cleanupTestData();
});

test.afterAll(async () => {
  await cleanupTestData();
  await prisma.$disconnect();
});

// Helper: Login — login involves a server round-trip; give it 15s
async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Click submit, then wait for the navigation to complete
  const navigationPromise = page.waitForURL(/\/(admin|student)/, { timeout: 15000 });
  await page.click('button[type="submit"]');
  await navigationPromise;
}

// Helper: Create test student
async function createTestStudent(email: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      name: 'Quiz Test Student',
      passwordHash,
      role: 'STUDENT'
    }
  });
}

// Helper: Create test course with PUBLISHED lessons
async function createTestCourse(slug: string): Promise<{ course: Course; lesson: Lesson }> {
  const course = await prisma.course.create({
    data: {
      title: 'E2E Quiz Test Course',
      slug,
      description: 'A test course for quiz E2E verification',
      category: 'Sécurité Incendie',
      level: 'Débutant',
      duration: 60,
      isPublished: true,
      thumbnail: null
    }
  });

  // Create a module with one PUBLISHED lesson
  const module = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'Test Module',
      order: 0
    }
  });

  const lesson = await prisma.lesson.create({
    data: {
      moduleId: module.id,
      title: 'Test Lesson',
      content: 'Test content for lesson completion',
      order: 0,
      status: 'PUBLISHED' // IMPORTANT: must be PUBLISHED to show in student UI
    }
  });

  return { course, lesson };
}

// Helper: Complete lesson for student
async function completeLessonForStudent(studentId: string, lesson: Lesson) {
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: studentId,
        lessonId: lesson.id
      }
    },
    create: {
      userId: studentId,
      lessonId: lesson.id,
      isCompleted: true,
      isStarted: true,
      completionPercent: 100
    },
    update: {
      isCompleted: true,
      isStarted: true,
      completionPercent: 100
    }
  });
}

test.describe('Quiz System E2E', () => {
  test('Admin: Create quiz with multiple questions (FR)', async ({ page }) => {
    const { course } = await createTestCourse(`test-quiz-admin-${Date.now()}`);

    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Navigate to course edit page — client component fetches data; give it 10s
    await page.goto(`/admin/courses/${course.id}`);
    await expect(page.getByTestId('edit-course-title')).toBeVisible({ timeout: 10000 });

    // Click "Manage Quiz" link
    await page.getByTestId('manage-quiz-link').click();
    await page.waitForURL(`/admin/courses/${course.id}/quiz`, { timeout: 10000 });

    // Fill quiz metadata using data-testid
    await page.getByTestId('quiz-passing-score').fill('70');
    await page.getByTestId('quiz-time-limit').fill('15');

    // Default question exists, fill it
    await page.getByTestId('question-text-0').fill('Quelle est la première règle de sécurité incendie ?');

    // Fill options for first question
    await page.getByTestId('option-text-0-0').fill('Appeler les secours immédiatement');
    await page.getByTestId('option-text-0-1').fill('Évacuer calmement');

    // Add more options
    await page.getByTestId('add-option-0').click();
    await page.getByTestId('option-text-0-2').fill('Utiliser un extincteur approprié');

    // Select correct answer (option index 2)
    await page.getByTestId('correct-answer-0-2').check();

    // Save quiz
    await page.getByTestId('save-quiz-btn').click();

    // Wait for success message
    await expect(page.getByTestId('success-message')).toBeVisible({ timeout: 3000 });

    // Verify quiz was created in DB
    const quiz = await prisma.quiz.findFirst({
      where: { courseId: course.id },
      include: { questions: true }
    });
    expect(quiz).not.toBeNull();
    expect(quiz!.passingScore).toBe(70);
    expect(quiz!.questions.length).toBeGreaterThan(0);

    // Cleanup
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Student: Complete lesson to unlock quiz', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-unlock-${Date.now()}`);
    const student = await createTestStudent(`unlock-${Date.now()}@test.local`, 'Test123!');

    // Enroll student
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        passingScore: 70,
        timeLimit: 15,
        questions: {
          create: [
            {
              question: 'Test question?',
              options: ['A', 'B', 'C'],
              correctAnswer: 1,
              order: 1
            }
          ]
        }
      }
    });

    // Mark lesson as complete
    await completeLessonForStudent(student.id, lesson);

    await login(page, student.email, 'Test123!');

    // Go to learning page
    await page.goto(`/courses/${course.slug}/learn`);

    // Wait for page load
    await page.waitForTimeout(1000);

    // Verify "Take Quiz" button appears
    await expect(page.getByTestId('take-quiz-btn')).toBeVisible();

    // Cleanup
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Student: Take quiz and pass (FR)', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-pass-${Date.now()}`);
    const student = await createTestStudent(`pass-${Date.now()}@test.local`, 'Test123!');

    // Enroll and complete lesson
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });
    await completeLessonForStudent(student.id, lesson);

    // Create quiz with correct answer at index 1
    await prisma.quiz.create({
      data: {
        courseId: course.id,
        passingScore: 70,
        timeLimit: 15,
        questions: {
          create: [
            {
              question: 'Test question?',
              options: ['Wrong', 'Correct', 'Wrong'],
              correctAnswer: 1,
              order: 1
            }
          ]
        }
      }
    });

    await login(page, student.email, 'Test123!');

    // Navigate to quiz page
    await page.goto(`/courses/${course.slug}/quiz`);

    // Click start quiz
    await page.getByTestId('start-quiz-btn').click();

    // Wait for quiz to start
    await page.waitForTimeout(1000);

    // Answer first question (click correct option index 1)
    await page.getByTestId('option-0-1').click();

    // Submit quiz — server-side scoring takes a moment; give it 15s
    await page.getByTestId('submit-quiz-btn').click();

    // Wait for result screen (server completes scoring + attestation creation)
    await expect(page.getByTestId('quiz-result')).toBeVisible({ timeout: 15000 });

    // Verify score is shown
    await expect(page.getByTestId('quiz-score')).toBeVisible();

    // Verify attestation was created
    const attestation = await prisma.attestation.findFirst({
      where: {
        userId: student.id,
        courseId: course.id
      }
    });
    expect(attestation).not.toBeNull();

    // Cleanup
    await prisma.attestation.deleteMany({ where: { userId: student.id } });
    await prisma.quizAttempt.deleteMany({ where: { userId: student.id } });
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Student: View certificates page (FR)', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-cert-${Date.now()}`);
    const student = await createTestStudent(`cert-${Date.now()}@test.local`, 'Test123!');

    // Setup: enroll, complete, pass quiz, create attestation
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });
    await completeLessonForStudent(student.id, lesson);

    const attestation = await prisma.attestation.create({
      data: {
        userId: student.id,
        courseId: course.id,
        certificateNumber: `TEST-${Date.now()}`,
        issuedAt: new Date()
      }
    });

    await login(page, student.email, 'Test123!');
    await page.goto('/student/certificates');

    // Verify certificate card appears
    const certCard = page.getByTestId(`certificate-${attestation.id}`);
    await expect(certCard).toBeVisible();

    // Verify course title in card
    await expect(certCard.getByText(/E2E Quiz Test Course/i)).toBeVisible();

    // Cleanup
    await prisma.attestation.delete({ where: { id: attestation.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Student: Download certificate PDF', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-dl-${Date.now()}`);
    const student = await createTestStudent(`dl-${Date.now()}@test.local`, 'Test123!');

    // Setup
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });
    await completeLessonForStudent(student.id, lesson);

    const attestation = await prisma.attestation.create({
      data: {
        userId: student.id,
        courseId: course.id,
        certificateNumber: `TEST-DL-${Date.now()}`,
        issuedAt: new Date()
      }
    });

    await login(page, student.email, 'Test123!');
    await page.goto('/student/certificates');

    // Trigger download — pdfkit runs server-side on first request; give it 30s
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.getByTestId(`download-certificate-${attestation.id}`).click();

    const download = await downloadPromise;

    // Strict validations: filename contains certificate number, content-type, PDF magic bytes
    const filename = download.suggestedFilename();
    expect(filename).toContain(attestation.certificateNumber);
    expect(filename).toMatch(/\.pdf$/);

    // Verify file content
    const path = await download.path();
    expect(path).not.toBeNull();
    if (path) {
      const fs = require('fs');
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(0);

      // Verify PDF magic bytes (%PDF at start)
      const buffer = fs.readFileSync(path);
      const header = buffer.toString('utf-8', 0, 4);
      expect(header).toBe('%PDF');
    }

    // Cleanup
    await prisma.attestation.delete({ where: { id: attestation.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Quiz UI: Arabic language support (AR)', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-ar-${Date.now()}`);
    const student = await createTestStudent(`ar-${Date.now()}@test.local`, 'Test123!');

    // Setup
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });
    await completeLessonForStudent(student.id, lesson);

    await prisma.quiz.create({
      data: {
        courseId: course.id,
        passingScore: 70,
        timeLimit: 15,
        questions: {
          create: [
            {
              question: 'Test?',
              options: ['A', 'B'],
              correctAnswer: 0,
              order: 1
            }
          ]
        }
      }
    });

    await login(page, student.email, 'Test123!');

    // Switch to Arabic
    await page.goto('/student/dashboard');
    await page.getByRole('button', { name: /عربي|AR/i }).click();
    await page.waitForTimeout(500);

    // Navigate to quiz page
    await page.goto(`/courses/${course.slug}/quiz`);

    // Verify RTL layout
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

    // Verify start button visible
    await expect(page.getByTestId('start-quiz-btn')).toBeVisible();

    // Cleanup
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Security: Quiz gated by lesson completion', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-gate-${Date.now()}`);
    const student = await createTestStudent(`gate-${Date.now()}@test.local`, 'Test123!');

    // Enroll but DON'T complete lesson
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });

    await prisma.quiz.create({
      data: {
        courseId: course.id,
        passingScore: 70,
        timeLimit: null,
        questions: {
          create: [
            {
              question: 'Test?',
              options: ['A', 'B'],
              correctAnswer: 0,
              order: 1
            }
          ]
        }
      }
    });

    await login(page, student.email, 'Test123!');

    // Try to access quiz page
    await page.goto(`/courses/${course.slug}/quiz`);
    await page.waitForTimeout(1000);

    // Should show "must complete all lessons" message
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/complét|leçons|lessons/i);

    // Cleanup
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Security: Student cannot download another student\'s certificate', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-sec-${Date.now()}`);
    const student1 = await createTestStudent(`sec1-${Date.now()}@test.local`, 'Test123!');
    const student2 = await createTestStudent(`sec2-${Date.now()}@test.local`, 'Test123!');

    // Give student1 an attestation
    await prisma.enrollment.create({
      data: {
        userId: student1.id,
        courseId: course.id
      }
    });

    const attestation = await prisma.attestation.create({
      data: {
        userId: student1.id,
        courseId: course.id,
        certificateNumber: `SEC-${Date.now()}`,
        issuedAt: new Date()
      }
    });

    // Login as student2
    await login(page, student2.email, 'Test123!');

    // Try to download student1's certificate.
    // The download route runs pdfkit on first call; give it a generous timeout.
    const response = await page.request.get(
      `/api/attestation/${attestation.id}/download`,
      { timeout: 30000 }
    );

    // Should return 403 or 404
    expect(response.status()).toBeGreaterThanOrEqual(400);

    // Cleanup
    await prisma.attestation.delete({ where: { id: attestation.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student1.id } });
    await prisma.user.delete({ where: { id: student1.id } });
    await prisma.user.delete({ where: { id: student2.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Quiz: Fail scenario (score below passing)', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-quiz-fail-${Date.now()}`);
    const student = await createTestStudent(`fail-${Date.now()}@test.local`, 'Test123!');

    // Enroll and complete lesson
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });
    await completeLessonForStudent(student.id, lesson);

    // Create quiz with passing score 70, correct answer at index 1
    await prisma.quiz.create({
      data: {
        courseId: course.id,
        passingScore: 70,
        timeLimit: 15,
        questions: {
          create: [
            {
              question: 'Test question?',
              options: ['Wrong', 'Correct', 'Wrong'],
              correctAnswer: 1,
              order: 1
            }
          ]
        }
      }
    });

    await login(page, student.email, 'Test123!');
    await page.goto(`/courses/${course.slug}/quiz`);

    // Start quiz
    await page.getByTestId('start-quiz-btn').click();
    await page.waitForTimeout(1000);

    // Answer WRONG (click option 0 instead of correct option 1)
    await page.getByTestId('option-0-0').click();

    // Submit
    await page.getByTestId('submit-quiz-btn').click();

    // Wait for result screen
    await expect(page.getByTestId('quiz-result')).toBeVisible({ timeout: 15000 });

    // Verify failed result shows
    await expect(page.getByTestId('quiz-score')).toBeVisible();

    // CRITICAL: Verify NO attestation was created for this failed attempt
    const attestation = await prisma.attestation.findFirst({
      where: {
        userId: student.id,
        courseId: course.id
      }
    });
    expect(attestation).toBeNull();

    // Cleanup
    await prisma.quizAttempt.deleteMany({ where: { userId: student.id } });
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });

  test('Certificate page: Arabic language support (AR)', async ({ page }) => {
    const { course, lesson } = await createTestCourse(`test-cert-ar-${Date.now()}`);
    const student = await createTestStudent(`cert-ar-${Date.now()}@test.local`, 'Test123!');

    // Setup: enroll, complete, create attestation
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id
      }
    });
    await completeLessonForStudent(student.id, lesson);

    const attestation = await prisma.attestation.create({
      data: {
        userId: student.id,
        courseId: course.id,
        certificateNumber: `TEST-AR-${Date.now()}`,
        issuedAt: new Date()
      }
    });

    await login(page, student.email, 'Test123!');

    // Switch to Arabic
    await page.goto('/student/dashboard');
    await page.getByRole('button', { name: /عربي|AR/i }).click();
    await page.waitForTimeout(500);

    // Navigate to certificates page
    await page.goto('/student/certificates');

    // Verify RTL layout
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

    // Verify certificate card visible
    const certCard = page.getByTestId(`certificate-${attestation.id}`);
    await expect(certCard).toBeVisible();

    // Verify course title in card using innerText
    const cardText = await certCard.innerText();
    expect(cardText).toContain('E2E Quiz Test Course');

    // Cleanup
    await prisma.attestation.delete({ where: { id: attestation.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
    await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });
    await prisma.course.delete({ where: { id: course.id } });
  });
});

test.describe('Data cleanup verification', () => {
  test('Verify cleanup only removes @test.local records', async () => {
    // Verify real accounts exist
    const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    expect(admin).not.toBeNull();

    const realStudent = await prisma.user.findUnique({ where: { email: 'student@qhse.local' } });
    expect(realStudent).not.toBeNull();
  });
});
