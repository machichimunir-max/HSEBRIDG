"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useEffect } from "react";

const CATEGORIES = ["SST", "Incendie", "Travail en hauteur", "Risque électrique", "EPI", "ISO 45001", "ISO 14001", "LOTO"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];

export default function CatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 md:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold">Formations QHSE</h1>
          <p className="mt-2 text-slate-400">Découvrez nos formations en ligne en Qualité, Hygiène, Sécurité et Environnement</p>
        </header>

        <div className="mb-8 space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Rechercher</label>
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Niveau</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="">Tous les niveaux</option>
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Chargement des formations...</div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-400">{filteredCourses.length} formation(s) trouvée(s)</p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center text-slate-400">
                  Aucune formation ne correspond à votre recherche.
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const totalLessons = course.modules?.reduce((sum: number, module: any) => sum + (module.lessons?.length || 0), 0) || 0;
                  return (
                    <article key={course.id} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
                      <div className="h-44 overflow-hidden bg-slate-800">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-500">Formation QHSE</div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">
                            {course.category || "QHSE"}
                          </span>
                          <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                            {course.level || "Tous niveaux"}
                          </span>
                        </div>
                        <h2 className="mt-3 text-lg font-semibold text-white">{course.title}</h2>
                        <p className="mt-2 text-sm text-slate-400">{course.shortDescription || course.description || "Aucune description"}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                          <span>{course.modules?.length || 0} modules</span>
                          <span>{totalLessons} leçons</span>
                          {course.duration && <span>{course.duration} min</span>}
                        </div>
                        <Link href={`/courses/${course.slug}`} className="mt-5 inline-block w-full rounded-xl bg-cyan-500 px-4 py-3 text-center font-medium text-slate-950 hover:bg-cyan-600">
                          Voir la formation
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
