import { test, expect, Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import { join } from "path";

const BASE_URL = "http://localhost:3000";
const ADMIN_EMAIL = "admin@local.dev";
const ADMIN_PASSWORD = "admin-dev-password";
const STUDENT_EMAIL = "student@local.dev";
const STUDENT_PASSWORD = "student-dev-password";

// Unique prefix so cleanup ONLY ever touches data created by this test.
const E2E_PREFIX = "E2E-TEST-";
const TIMESTAMP = Date.now().toString();
const COURSE_TITLE = `${E2E_PREFIX}Formation Animateur HSE ${TIMESTAMP}`;
const EDITED_LESSON_TITLE = `${E2E_PREFIX}Leçon modifiée ${TIMESTAMP}`;

let createdCourseId: string | undefined;

interface StepResult {
  step: string;
  status: "PASS" | "FAIL" | "SKIP";
  reason?: string;
}
const stepResults: StepResult[] = [];

async function runStep(name: string, fn: () => Promise<void>) {
  // If a previous step failed, mark the rest as skipped (cannot run reliably).
  if (stepResults.some((s) => s.status === "FAIL")) {
    stepResults.push({ step: name, status: "SKIP", reason: "skipped: an earlier step failed" });
    return;
  }
  try {
    await fn();
    stepResults.push({ step: name, status: "PASS" });
    console.log(`PASS - ${name}`);
  } catch (err) {
    const reason = err instanceof Error ? err.message.split("\n")[0] : String(err);
    stepResults.push({ step: name, status: "FAIL", reason });
    console.log(`FAIL - ${name} -- ${reason}`);
  }
}

// 1x1 transparent PNG, generated at runtime so no fixture file is needed.
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

async function loginAs(page: Page, email: string, password: string, redirectPath: string) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(`**${redirectPath}`, { timeout: 20000 });
}

test("Course wizard E2E: create -> reorder -> thumbnail -> publish -> edit -> student catalog", async ({
  page,
  browser,
}) => {
  test.setTimeout(240_000);

  // ---------- Step 1: admin login + open wizard ----------
  await runStep("1. Admin login and open course wizard", async () => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD, "/admin");
    await page.goto(`${BASE_URL}/admin/courses/new`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByPlaceholder("e.g., Sécurité Santé au Travail - Niveau 1")
    ).toBeVisible({ timeout: 20000 });
  });

  // ---------- Step 2: wizard step 1 (Basic) ----------
  await runStep("2. Wizard step 1 (Basic)", async () => {
    await page
      .getByPlaceholder("e.g., Sécurité Santé au Travail - Niveau 1")
      .fill(COURSE_TITLE);
    const slugInput = page.getByPlaceholder("sst-niveau-1");
    await expect(slugInput).toHaveValue(/e2e-test-formation-animateur-hse-/);
    const selects = page.locator("select");
    await selects.nth(0).selectOption("SST"); // category
    await selects.nth(1).selectOption("Débutant"); // level
    await page
      .getByPlaceholder("Brief overview (displayed in course cards)")
      .fill(`E2E test course ${TIMESTAMP}.`);
    await page
      .getByPlaceholder("Detailed course description")
      .fill(`Automated E2E test course description (${COURSE_TITLE}).`);
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("label", { hasText: "Requirements" }).first()).toBeVisible({
      timeout: 15000,
    });
  });

  // ---------- Step 3: wizard step 2 (Info) ----------
  await runStep("3. Wizard step 2 (Info)", async () => {
    await page.getByPlaceholder("e.g., 120").fill("480");
    await page
      .getByPlaceholder(/What students need before/)
      .fill("Avoir suivi la formation SST de base.");
    await page
      .getByPlaceholder(/Learning outcomes/)
      .fill("Identifier les risques sur un chantier.\nAppliquer les consignes de sécurité.");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByRole("button", { name: "Add Module" })).toBeVisible({
      timeout: 15000,
    });
  });

  // ---------- Step 4: wizard step 3 (2 modules, 3 lessons, reorder) ----------
  await runStep("4. Wizard step 3 (create 2 modules with 3 lessons and reorder)", async () => {
    const addModule = page.getByRole("button", { name: "Add Module" });
    await addModule.click();
    await addModule.click();

    const moduleBlocks = page.locator("div.rounded-2xl.border.border-slate-800");
    await expect(moduleBlocks).toHaveCount(2);

    const module1 = moduleBlocks.nth(0);
    const module2 = moduleBlocks.nth(1);

    await module1.getByPlaceholder("Module title").fill("Module 1 - Introduction aux risques");
    await module2.getByPlaceholder("Module title").fill("Module 2 - Gestion de crise");

    await module1.getByRole("button", { name: "+ Add Lesson" }).click();
    await module1.getByRole("button", { name: "+ Add Lesson" }).click();
    await module2.getByRole("button", { name: "+ Add Lesson" }).click();

    const lessonRows1 = module1.locator("div.rounded-lg.border.border-slate-700");
    await expect(lessonRows1).toHaveCount(2);
    const lessonRows2 = module2.locator("div.rounded-lg.border.border-slate-700");
    await expect(lessonRows2).toHaveCount(1);

    await lessonRows1.nth(0).getByPlaceholder("Lesson title").fill("E2E L1 - Notions de base");
    await lessonRows1
      .nth(0)
      .getByPlaceholder("Duration (min)")
      .fill("30");
    await lessonRows1
      .nth(1)
      .getByPlaceholder("Lesson title")
      .fill("E2E L2 - Equipements de protection");
    await lessonRows1.nth(1).getByPlaceholder("Duration (min)").fill("45");
    await lessonRows2.nth(0).getByPlaceholder("Lesson title").fill("E2E L3 - Protocole crise");
    await lessonRows2.nth(0).getByPlaceholder("Duration (min)").fill("20");
    await lessonRows2.nth(0).getByRole("checkbox").check(); // free preview

    // Reorder: move "E2E L2 - Equipements de protection" up above "E2E L1 - Notions de base".
    // Lesson move buttons have no title attrs; per row: nth(0)=up, nth(1)=down, nth(2)=delete.
    await lessonRows1.nth(1).locator("button").nth(0).click();
    await expect(
      module1.locator("div.rounded-lg.border.border-slate-700").nth(0).getByPlaceholder("Lesson title")
    ).toHaveValue("E2E L2 - Equipements de protection");

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByTestId("thumbnail-file-input")).toBeVisible({ timeout: 15000 });
  });

  // ---------- Step 5: wizard step 4 (thumbnail upload) ----------
  await runStep("5. Wizard step 4 (upload thumbnail file)", async () => {
    await page.getByTestId("thumbnail-file-input").setInputFiles({
      name: "e2e-thumbnail.png",
      mimeType: "image/png",
      buffer: Buffer.from(PNG_BASE64, "base64"),
    });
    await expect(page.locator('img[alt="Thumbnail preview"]')).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("label", { hasText: "Meta Title" })).toBeVisible({
      timeout: 15000,
    });
  });

  // ---------- Step 6: wizard step 5 (SEO) ----------
  await runStep("6. Wizard step 5 (SEO)", async () => {
    await page.locator('input[maxlength="60"]').fill(`${COURSE_TITLE} - Certification`);
    await page
      .locator('textarea[maxlength="160"]')
      .fill(`Inscrivez-vous a ${COURSE_TITLE}. Formation certifiante.`);
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByRole("heading", { name: "Course Summary" })).toBeVisible({
      timeout: 15000,
    });
  });

  // ---------- Step 7: wizard step 6 (review & publish) ----------
  await runStep("7. Wizard step 6 (review count 2 modules / 3 lessons and publish)", async () => {
    const summary = page.locator("div.rounded-2xl.border.border-slate-800", {
      has: page.getByRole("heading", { name: "Course Summary" }),
    });
    await expect(summary).toContainText("Modules:");
    await expect(summary).toContainText("Total Lessons:");
    await page.getByRole("button", { name: "Publish Course" }).click();
    await page.waitForURL(/\/admin\/courses\/[^/]+$/, { timeout: 30000 });
    const match = page.url().match(/\/admin\/courses\/([^/]+)$/);
    createdCourseId = match ? match[1] : undefined;
    expect(createdCourseId, "course id should be captured from post-publish URL").toBeTruthy();
  });

  // ---------- Step 8: verify Published + module count on /admin/courses ----------
  await runStep("8. /admin/courses shows the course as Published with 2 modules", async () => {
    await page.goto(`${BASE_URL}/admin/courses`, { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("Search courses...").fill(COURSE_TITLE);
    const row = page
      .locator("div.rounded-2xl.border.border-slate-800", { hasText: COURSE_TITLE })
      .first();
    await expect(row).toBeVisible({ timeout: 20000 });
    await expect(row).toContainText(/Published/i);
    await expect(row).toContainText(/2\s*modules/i);
    await expect(row).toContainText(/3\s*lessons/i);
  });

  // ---------- Step 9: edit a lesson title, save, reload, verify ----------
  await runStep("9. Edit a lesson title, save, reload and verify persistence", async () => {
    await page.goto(`${BASE_URL}/admin/courses/${createdCourseId}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: "Edit course" })).toBeVisible({
      timeout: 20000,
    });
    const lessonsSection = page.locator("div.rounded-xl.border.border-slate-700", {
      has: page.getByRole("heading", { name: "Lessons" }),
    });
    const lessonInputs = lessonsSection.locator('input[type="text"]');
    await expect(lessonInputs.first()).toBeVisible({ timeout: 15000 });
    expect(await lessonInputs.count()).toBe(3);
    await lessonInputs.nth(0).fill(EDITED_LESSON_TITLE);
    await page.getByRole("button", { name: "Save course" }).click();
    await page.waitForURL(/\/admin\/courses\/?$/, { timeout: 30000 });

    // Reload and verify the new title was persisted.
    await page.goto(`${BASE_URL}/admin/courses/${createdCourseId}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: "Edit course" })).toBeVisible({
      timeout: 20000,
    });
    const reloadedInputs = page
      .locator("div.rounded-xl.border.border-slate-700", {
        has: page.getByRole("heading", { name: "Lessons" }),
      })
      .locator('input[type="text"]');
    const values = await reloadedInputs.evaluateAll((els) =>
      (els as HTMLInputElement[]).map((el) => el.value)
    );
    expect(values).toContain(EDITED_LESSON_TITLE);
  });

  // ---------- Step 10: student login + catalog ----------
  await runStep("10. Student login and course visible in catalog", async () => {
    // Fresh context so the admin session cannot leak into the student visit.
    const studentCtx = await browser.newContext();
    const studentPage = await studentCtx.newPage();
    try {
      await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD, "/student");
      await studentPage.goto(`${BASE_URL}/courses`, { waitUntil: "domcontentloaded" });
      await studentPage.getByPlaceholder(/Search by title/).fill(COURSE_TITLE);
      await expect(
        studentPage
          .locator("article", { hasText: COURSE_TITLE })
          .first()
      ).toBeVisible({ timeout: 20000 });
    } finally {
      await studentCtx.close();
    }
  });

  // ---------- Per-step report ----------
  console.log("\n================ E2E STEP REPORT ================");
  for (const r of stepResults) {
    console.log(`${r.status} - ${r.step}${r.reason ? ` -- ${r.reason}` : ""}`);
  }
  console.log("=================================================\n");

  const failures = stepResults.filter((s) => s.status === "FAIL");
  expect(failures, `E2E step failures:\n${failures.map((f) => `${f.step}: ${f.reason}`).join("\n")}`).toHaveLength(0);
});

// Cleanup: delete ONLY E2E-TEST- courses (cascade removes modules/lessons)
// and ONLY the thumbnail files that belong to those courses.
test.afterEach(async () => {
  const prisma = new PrismaClient();
  try {
    const doomed = await prisma.course.findMany({
      where: { title: { startsWith: E2E_PREFIX } },
      select: { thumbnail: true },
    });
    const result = await prisma.course.deleteMany({
      where: { title: { startsWith: E2E_PREFIX } },
    });
    console.log(`CLEANUP deleted ${result.count} course(s) with prefix "${E2E_PREFIX}"`);

    for (const c of doomed) {
      if (c.thumbnail && c.thumbnail.startsWith("/uploads/thumbnails/")) {
        const filePath = join(process.cwd(), "public", c.thumbnail);
        try {
          await unlink(filePath);
          console.log(`CLEANUP removed thumbnail file ${c.thumbnail}`);
        } catch {
          console.warn(`CLEANUP could not remove ${c.thumbnail} (already gone?)`);
        }
      }
    }
    if (result.count > 0 && failuresStillPending()) {
      console.log("CLEANUP ran after a failed test -- E2E data removed anyway.");
    }
  } catch (err) {
    console.error("CLEANUP error:", err);
  } finally {
    await prisma.$disconnect();
  }
});

function failuresStillPending() {
  return stepResults.some((s) => s.status === "FAIL");
}
