"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
}

interface Course {
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  level?: string | null;
  duration: number;
  price?: number | null;
  isFree: boolean;
  isPublished: boolean;
  modules: {
    lessons: Lesson[];
  }[];
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [id, setId] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    thumbnail: "",
    category: "",
    level: "",
    duration: 0,
    price: "",
    isFree: false,
    isPublished: false,
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    async function loadCourse() {
      const resolvedParams = await params;
      const resolvedId = resolvedParams.id;
      setId(resolvedId);
      try {
        const response = await fetch(`/api/courses/${resolvedId}`);
        if (!response.ok) {
          setError("Course not found");
          setLoading(false);
          return;
        }
        const data = await response.json();
        setCourse(data);
        setFormData({
          title: data.title,
          slug: data.slug,
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          thumbnail: data.thumbnail || "",
          category: data.category || "",
          level: data.level || "",
          duration: data.duration || 0,
          price: String(data.price || ""),
          isFree: data.isFree,
          isPublished: data.isPublished,
        });
        setLessons(
          data.modules
            .flatMap((m: { lessons: Lesson[] }) => m.lessons)
            .filter((l: Lesson) => l.title && l.title.trim() !== "")
        );
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.currentTarget.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonTitleChange = (lessonId: string, newTitle: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, title: newTitle } : l))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body: Record<string, unknown> = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription || undefined,
        description: formData.description || undefined,
        thumbnail: formData.thumbnail || undefined,
        category: formData.category || undefined,
        level: formData.level || undefined,
        duration: formData.duration || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        isFree: formData.isFree || undefined,
        isPublished: formData.isPublished || undefined,
      };

      if (lessons.length > 0) {
        body.lessons = lessons.map((l) => ({ id: l.id, title: l.title }));
      }

      const response = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update course: ${text}`);
      }

      router.push("/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-slate-300">Loading course...</p>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
          <p className="text-rose-300">{error}</p>
          <Link href="/admin/courses" className="mt-4 inline-block rounded-lg bg-[#FDCD1A] px-4 py-2 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit course</h1>
          <p className="mt-1 text-sm text-slate-400">Update course information</p>
        </div>
        <Link href="/admin/courses" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800 transition-colors">
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Slug</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">
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
            <label className="mb-2 block text-sm text-slate-300">Level</label>
            <select name="level" value={formData.level} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">
              <option value="">Select level</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Duration (minutes)</label>
          <input
            name="duration"
            type="number"
            min="0"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Short description</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Thumbnail URL</label>
          <input
            name="thumbnail"
            type="url"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            />
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input
              id="isFree"
              name="isFree"
              type="checkbox"
              checked={formData.isFree}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="isFree" className="text-sm text-slate-300">
              Free course
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="isPublished" className="text-sm text-slate-300">
            Publish this course
          </label>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <h3 className="mb-3 text-base font-semibold text-white">Lessons</h3>
          <p className="mb-4 text-sm text-slate-400">
            Update lesson titles directly. Changes apply across the platform (catalog, student pages, admin).
          </p>
          <div className="space-y-3">
            {lessons.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No lessons yet — add some via the course wizard.</p>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    Lesson #{lessons.indexOf(lesson) + 1} title
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => handleLessonTitleChange(lesson.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {error ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <Link href="/admin/courses" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#FDCD1A] px-5 py-2.5 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save course"}
          </button>
        </div>
      </form>
    </div>
  );
}
