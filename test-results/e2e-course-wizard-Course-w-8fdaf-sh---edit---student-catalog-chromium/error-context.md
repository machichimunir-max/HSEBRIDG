# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\course-wizard.spec.ts >> Course wizard E2E: create -> reorder -> thumbnail -> publish -> edit -> student catalog
- Location: tests\e2e\course-wizard.spec.ts:56:5

# Error details

```
Error: E2E step failures:
1. Admin login and open course wizard: page.waitForURL: Timeout 20000ms exceeded.

expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"reason": "page.waitForURL: Timeout 20000ms exceeded.", "status": "FAIL", "step": "1. Admin login and open course wizard"}]
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]: "{\"error\":\"Invalid email or password\"}"
```

# Test source

```ts
  175 |     await page.locator('input[maxlength="60"]').fill(`${COURSE_TITLE} - Certification`);
  176 |     await page
  177 |       .locator('textarea[maxlength="160"]')
  178 |       .fill(`Inscrivez-vous a ${COURSE_TITLE}. Formation certifiante.`);
  179 |     await page.getByRole("button", { name: "Next" }).click();
  180 |     await expect(page.getByRole("heading", { name: "Course Summary" })).toBeVisible({
  181 |       timeout: 15000,
  182 |     });
  183 |   });
  184 | 
  185 |   // ---------- Step 7: wizard step 6 (review & publish) ----------
  186 |   await runStep("7. Wizard step 6 (review count 2 modules / 3 lessons and publish)", async () => {
  187 |     const summary = page.locator("div.rounded-2xl.border.border-slate-800", {
  188 |       has: page.getByRole("heading", { name: "Course Summary" }),
  189 |     });
  190 |     await expect(summary).toContainText("Modules:");
  191 |     await expect(summary).toContainText("Total Lessons:");
  192 |     await page.getByRole("button", { name: "Publish Course" }).click();
  193 |     await page.waitForURL(/\/admin\/courses\/[^/]+$/, { timeout: 30000 });
  194 |     const match = page.url().match(/\/admin\/courses\/([^/]+)$/);
  195 |     createdCourseId = match ? match[1] : undefined;
  196 |     expect(createdCourseId, "course id should be captured from post-publish URL").toBeTruthy();
  197 |   });
  198 | 
  199 |   // ---------- Step 8: verify Published + module count on /admin/courses ----------
  200 |   await runStep("8. /admin/courses shows the course as Published with 2 modules", async () => {
  201 |     await page.goto(`${BASE_URL}/admin/courses`, { waitUntil: "domcontentloaded" });
  202 |     await page.getByPlaceholder("Search courses...").fill(COURSE_TITLE);
  203 |     const row = page
  204 |       .locator("div.rounded-2xl.border.border-slate-800", { hasText: COURSE_TITLE })
  205 |       .first();
  206 |     await expect(row).toBeVisible({ timeout: 20000 });
  207 |     await expect(row).toContainText(/Published/i);
  208 |     await expect(row).toContainText(/2\s*modules/i);
  209 |     await expect(row).toContainText(/3\s*lessons/i);
  210 |   });
  211 | 
  212 |   // ---------- Step 9: edit a lesson title, save, reload, verify ----------
  213 |   await runStep("9. Edit a lesson title, save, reload and verify persistence", async () => {
  214 |     await page.goto(`${BASE_URL}/admin/courses/${createdCourseId}`, {
  215 |       waitUntil: "domcontentloaded",
  216 |     });
  217 |     await expect(page.getByRole("heading", { name: "Edit course" })).toBeVisible({
  218 |       timeout: 20000,
  219 |     });
  220 |     const lessonsSection = page.locator("div.rounded-xl.border.border-slate-700", {
  221 |       has: page.getByRole("heading", { name: "Lessons" }),
  222 |     });
  223 |     const lessonInputs = lessonsSection.locator('input[type="text"]');
  224 |     await expect(lessonInputs.first()).toBeVisible({ timeout: 15000 });
  225 |     expect(await lessonInputs.count()).toBe(3);
  226 |     await lessonInputs.nth(0).fill(EDITED_LESSON_TITLE);
  227 |     await page.getByRole("button", { name: "Save course" }).click();
  228 |     await page.waitForURL(/\/admin\/courses\/?$/, { timeout: 30000 });
  229 | 
  230 |     // Reload and verify the new title was persisted.
  231 |     await page.goto(`${BASE_URL}/admin/courses/${createdCourseId}`, {
  232 |       waitUntil: "domcontentloaded",
  233 |     });
  234 |     await expect(page.getByRole("heading", { name: "Edit course" })).toBeVisible({
  235 |       timeout: 20000,
  236 |     });
  237 |     const reloadedInputs = page
  238 |       .locator("div.rounded-xl.border.border-slate-700", {
  239 |         has: page.getByRole("heading", { name: "Lessons" }),
  240 |       })
  241 |       .locator('input[type="text"]');
  242 |     const values = await reloadedInputs.evaluateAll((els) =>
  243 |       (els as HTMLInputElement[]).map((el) => el.value)
  244 |     );
  245 |     expect(values).toContain(EDITED_LESSON_TITLE);
  246 |   });
  247 | 
  248 |   // ---------- Step 10: student login + catalog ----------
  249 |   await runStep("10. Student login and course visible in catalog", async () => {
  250 |     // Fresh context so the admin session cannot leak into the student visit.
  251 |     const studentCtx = await browser.newContext();
  252 |     const studentPage = await studentCtx.newPage();
  253 |     try {
  254 |       await loginAs(studentPage, STUDENT_EMAIL, STUDENT_PASSWORD, "/student");
  255 |       await studentPage.goto(`${BASE_URL}/courses`, { waitUntil: "domcontentloaded" });
  256 |       await studentPage.getByPlaceholder(/Search by title/).fill(COURSE_TITLE);
  257 |       await expect(
  258 |         studentPage
  259 |           .locator("article", { hasText: COURSE_TITLE })
  260 |           .first()
  261 |       ).toBeVisible({ timeout: 20000 });
  262 |     } finally {
  263 |       await studentCtx.close();
  264 |     }
  265 |   });
  266 | 
  267 |   // ---------- Per-step report ----------
  268 |   console.log("\n================ E2E STEP REPORT ================");
  269 |   for (const r of stepResults) {
  270 |     console.log(`${r.status} - ${r.step}${r.reason ? ` -- ${r.reason}` : ""}`);
  271 |   }
  272 |   console.log("=================================================\n");
  273 | 
  274 |   const failures = stepResults.filter((s) => s.status === "FAIL");
> 275 |   expect(failures, `E2E step failures:\n${failures.map((f) => `${f.step}: ${f.reason}`).join("\n")}`).toHaveLength(0);
      |                                                                                                       ^ Error: E2E step failures:
  276 | });
  277 | 
  278 | // Cleanup: delete ONLY E2E-TEST- courses (cascade removes modules/lessons)
  279 | // and ONLY the thumbnail files that belong to those courses.
  280 | test.afterEach(async () => {
  281 |   const prisma = new PrismaClient();
  282 |   try {
  283 |     const doomed = await prisma.course.findMany({
  284 |       where: { title: { startsWith: E2E_PREFIX } },
  285 |       select: { thumbnail: true },
  286 |     });
  287 |     const result = await prisma.course.deleteMany({
  288 |       where: { title: { startsWith: E2E_PREFIX } },
  289 |     });
  290 |     console.log(`CLEANUP deleted ${result.count} course(s) with prefix "${E2E_PREFIX}"`);
  291 | 
  292 |     for (const c of doomed) {
  293 |       if (c.thumbnail && c.thumbnail.startsWith("/uploads/thumbnails/")) {
  294 |         const filePath = join(process.cwd(), "public", c.thumbnail);
  295 |         try {
  296 |           await unlink(filePath);
  297 |           console.log(`CLEANUP removed thumbnail file ${c.thumbnail}`);
  298 |         } catch {
  299 |           console.warn(`CLEANUP could not remove ${c.thumbnail} (already gone?)`);
  300 |         }
  301 |       }
  302 |     }
  303 |     if (result.count > 0 && failuresStillPending()) {
  304 |       console.log("CLEANUP ran after a failed test -- E2E data removed anyway.");
  305 |     }
  306 |   } catch (err) {
  307 |     console.error("CLEANUP error:", err);
  308 |   } finally {
  309 |     await prisma.$disconnect();
  310 |   }
  311 | });
  312 | 
  313 | function failuresStillPending() {
  314 |   return stepResults.some((s) => s.status === "FAIL");
  315 | }
  316 | 
```