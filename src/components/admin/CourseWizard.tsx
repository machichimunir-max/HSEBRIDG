"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: "Basic", description: "Course basics" },
  { id: 2, title: "Info", description: "Course information" },
  { id: 3, title: "Modules & Lessons", description: "Course content" },
  { id: 4, title: "Media", description: "Thumbnail & images" },
  { id: 5, title: "SEO", description: "Search optimization" },
  { id: 6, title: "Publish", description: "Review & publish" },
];

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  isPreview: boolean;
}

interface CourseFormData {
  // Basic
  title: string;
  slug: string;
  category: string;
  level: string;
  language: string;
  shortDescription: string;
  description: string;

  // Info
  duration: number;
  requirements: string;
  learningOutcomes: string;

  // Modules & Lessons
  modules: Module[];

  // Media
  thumbnail: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
}

export default function CourseWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    slug: "",
    category: "",
    level: "",
    language: "Français",
    shortDescription: "",
    description: "",
    duration: 0,
    requirements: "",
    learningOutcomes: "",
    modules: [],
    thumbnail: "",
    metaTitle: "",
    metaDescription: "",
  });

  const updateField = (field: keyof CourseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    updateField("title", title);
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      updateField("slug", generateSlug(title));
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: `Module ${formData.modules.length + 1}`,
      lessons: [],
    };
    updateField("modules", [...formData.modules, newModule]);
  };

  const updateModule = (moduleId: string, title: string) => {
    updateField(
      "modules",
      formData.modules.map((m) => (m.id === moduleId ? { ...m, title } : m))
    );
  };

  const deleteModule = (moduleId: string) => {
    updateField(
      "modules",
      formData.modules.filter((m) => m.id !== moduleId)
    );
  };

  const moveModule = (moduleId: string, direction: "up" | "down") => {
    const index = formData.modules.findIndex((m) => m.id === moduleId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.modules.length - 1)
    ) {
      return;
    }

    const newModules = [...formData.modules];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newModules[index], newModules[targetIndex]] = [
      newModules[targetIndex],
      newModules[index],
    ];
    updateField("modules", newModules);
  };

  const addLesson = (moduleId: string) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${module.lessons.length + 1}`,
      videoUrl: "",
      duration: 0,
      isPreview: false,
    };

    updateField(
      "modules",
      formData.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  };

  const updateLesson = (
    moduleId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ) => {
    updateField(
      "modules",
      formData.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : m
      )
    );
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    updateField(
      "modules",
      formData.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  const moveLesson = (
    moduleId: string,
    lessonId: string,
    direction: "up" | "down"
  ) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const index = module.lessons.findIndex((l) => l.id === lessonId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === module.lessons.length - 1)
    ) {
      return;
    }

    const newLessons = [...module.lessons];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newLessons[index], newLessons[targetIndex]] = [
      newLessons[targetIndex],
      newLessons[index],
    ];

    updateField(
      "modules",
      formData.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: newLessons } : m
      )
    );
  };

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!formData.title) return "Title is required";
        if (!formData.slug) return "Slug is required";
        if (!formData.category) return "Category is required";
        if (!formData.level) return "Level is required";
        break;
      case 2:
        if (!formData.requirements) return "Requirements are needed";
        if (!formData.learningOutcomes) return "Learning outcomes are needed";
        break;
      case 3:
        if (formData.modules.length === 0) return "Add at least one module";
        break;
    }
    return null;
  };

  const nextStep = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isPublished: publish,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const result = await response.json();
      router.push(`/admin/courses/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Course</h1>
        <p className="mt-1 text-sm text-slate-400">
          Follow the steps to create your course
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  disabled={step.id > currentStep}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    step.id === currentStep
                      ? "bg-[#FDCD1A] text-[#0A0A0A]"
                      : step.id < currentStep
                      ? "bg-[#073022] text-[#FDCD1A] hover:bg-[#073022]/80"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </button>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      step.id === currentStep ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 lg:w-24 ${
                    step.id < currentStep ? "bg-[#073022]" : "bg-slate-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Step 1: Basic */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Sécurité Santé au Travail - Niveau 1"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Slug * <span className="text-xs text-slate-500">(auto-generated, editable)</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="sst-niveau-1"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                >
                  <option value="">Select category</option>
                  <option value="SST">SST</option>
                  <option value="Incendie">Incendie</option>
                  <option value="Travail en hauteur">Travail en hauteur</option>
                  <option value="Risque électrique">Risque électrique</option>
                  <option value="EPI">EPI</option>
                  <option value="ISO 45001">ISO 45001</option>
                  <option value="ISO 14001">ISO 14001</option>
                  <option value="LOTO">LOTO</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => updateField("level", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                >
                  <option value="">Select level</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => updateField("language", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Français">Français</option>
                <option value="English">English</option>
                <option value="العربية">العربية</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Short Description
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => updateField("shortDescription", e.target.value)}
                rows={3}
                placeholder="Brief overview (displayed in course cards)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={6}
                placeholder="Detailed course description"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Info */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration || ""}
                onChange={(e) => updateField("duration", parseInt(e.target.value) || 0)}
                min="0"
                placeholder="e.g., 120"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Requirements *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                rows={5}
                placeholder="What students need before taking this course (one per line)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
              <p className="mt-1 text-xs text-slate-500">Enter each requirement on a new line</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                What Students Will Learn *
              </label>
              <textarea
                value={formData.learningOutcomes}
                onChange={(e) => updateField("learningOutcomes", e.target.value)}
                rows={6}
                placeholder="Learning outcomes (one per line)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
              <p className="mt-1 text-xs text-slate-500">Enter each outcome on a new line</p>
            </div>
          </div>
        )}

        {/* Step 3: Modules & Lessons */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Course Content</h3>
              <button
                onClick={addModule}
                className="flex items-center gap-2 rounded-lg bg-[#073022] px-4 py-2 text-sm font-medium text-[#FDCD1A] transition-colors hover:bg-[#0a4030]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Module
              </button>
            </div>

            {formData.modules.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                <p className="text-sm text-slate-400">No modules yet. Add your first module to get started.</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
                >
                  {/* Module header */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveModule(module.id, "up")}
                        disabled={moduleIndex === 0}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30"
                        title="Move up"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveModule(module.id, "down")}
                        disabled={moduleIndex === formData.modules.length - 1}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30"
                        title="Move down"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(module.id, e.target.value)}
                          placeholder="Module title"
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-2 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                        />
                        <button
                          onClick={() => deleteModule(module.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete module"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Lessons */}
                      <div className="mt-4 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 p-3"
                          >
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveLesson(module.id, lesson.id, "up")}
                                disabled={lessonIndex === 0}
                                className="rounded p-0.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveLesson(module.id, lesson.id, "down")}
                                disabled={lessonIndex === module.lessons.length - 1}
                                className="rounded p-0.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, {
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Lesson title"
                                className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none"
                              />
                              <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                  type="text"
                                  value={lesson.videoUrl}
                                  onChange={(e) =>
                                    updateLesson(module.id, lesson.id, {
                                      videoUrl: e.target.value,
                                    })
                                  }
                                  placeholder="Video URL"
                                  className="rounded border border-slate-700 bg-slate-950 p-2 text-sm text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none"
                                />
                                <input
                                  type="number"
                                  value={lesson.duration || ""}
                                  onChange={(e) =>
                                    updateLesson(module.id, lesson.id, {
                                      duration: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  placeholder="Duration (min)"
                                  min="0"
                                  className="rounded border border-slate-700 bg-slate-950 p-2 text-sm text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none"
                                />
                              </div>
                              <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input
                                  type="checkbox"
                                  checked={lesson.isPreview}
                                  onChange={(e) =>
                                    updateLesson(module.id, lesson.id, {
                                      isPreview: e.target.checked,
                                    })
                                  }
                                  className="h-4 w-4 rounded border-slate-700"
                                />
                                Free preview
                              </label>
                            </div>

                            <button
                              onClick={() => deleteLesson(module.id, lesson.id)}
                              className="rounded p-1 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                              title="Delete lesson"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => addLesson(module.id)}
                          className="w-full rounded-lg border border-dashed border-slate-700 p-2 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-300"
                        >
                          + Add Lesson
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Upload thumbnail
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                data-testid="thumbnail-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    setError("Thumbnail must be smaller than 2MB");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    updateField("thumbnail", reader.result as string);
                    setError("");
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#073022] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#FDCD1A] hover:file:bg-[#0a4030]"
              />
              <p className="mt-1 text-xs text-slate-500">PNG, JPG or WebP. Recommended: 1280x720px, max 2MB.</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Or thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail.startsWith("data:") ? "" : formData.thumbnail}
                onChange={(e) => updateField("thumbnail", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
              <p className="mt-1 text-xs text-slate-500">Recommended: 1280x720px, max 2MB</p>
            </div>

            {formData.thumbnail && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="mb-3 text-sm font-medium text-slate-300">Preview</p>
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="h-auto w-full max-w-md rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 5: SEO */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                placeholder={formData.title || "Course title for search engines"}
                maxLength={60}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.metaTitle.length}/60 characters
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                placeholder={formData.shortDescription || "Brief description for search results"}
                maxLength={160}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Publish */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Course Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-medium text-white">{formData.title || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-medium text-white">{formData.category || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Level:</span>
                  <span className="font-medium text-white">{formData.level || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-medium text-white">
                    {formData.duration ? `${formData.duration} minutes` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modules:</span>
                  <span className="font-medium text-white">{formData.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Lessons:</span>
                  <span className="font-medium text-white">
                    {formData.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex gap-3">
                <svg className="h-6 w-6 flex-shrink-0 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-amber-200">
                  <p className="font-medium">Ready to publish?</p>
                  <p className="mt-1 text-amber-300/80">
                    You can save as draft and publish later, or publish now to make it available to students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep === steps.length ? (
              <>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-[#FDCD1A] px-5 py-2 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#e5b917] disabled:opacity-50"
                >
                  {loading ? "Publishing..." : "Publish Course"}
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 rounded-lg bg-[#FDCD1A] px-5 py-2 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#e5b917]"
              >
                Next
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
