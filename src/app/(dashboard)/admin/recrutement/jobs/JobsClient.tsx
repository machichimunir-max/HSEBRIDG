"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { RecrutementIcon } from "@/components/icons/HseIcons";

interface Job {
  id: string;
  titleFr: string;
  titleAr: string;
  domain: string;
  contractType: "INTERIM" | "CDD" | "CDI";
  scope: "NATIONAL" | "INTERNATIONAL";
  location: string | null;
  descriptionFr: string | null;
  descriptionAr: string | null;
  requirementsFr: string | null;
  requirementsAr: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { applications: number };
}

interface JobsClientProps {
  initialJobs: Job[];
}

export function JobsClient({ initialJobs }: JobsClientProps) {
  const { t, isRtl } = useI18n();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterContract, setFilterContract] = useState("");
  const [filterActive, setFilterActive] = useState("");

  const [formData, setFormData] = useState({
    titleFr: "",
    titleAr: "",
    domain: "",
    contractType: "CDI" as "INTERIM" | "CDD" | "CDI",
    scope: "NATIONAL" as "NATIONAL" | "INTERNATIONAL",
    location: "",
    descriptionFr: "",
    descriptionAr: "",
    requirementsFr: "",
    requirementsAr: "",
    isActive: true,
  });

  const domains = [
    "Coordinateur HSE BTP",
    "Superviseur HSE Chantier",
    "HSE Officer Industries",
    "Animateur Prévention",
    "Formateur SST",
    "Auditeur QSE",
    "Ergonome",
    "Hygiéniste Industriel",
  ];

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        titleFr: job.titleFr,
        titleAr: job.titleAr,
        domain: job.domain,
        contractType: job.contractType,
        scope: job.scope,
        location: job.location || "",
        descriptionFr: job.descriptionFr || "",
        descriptionAr: job.descriptionAr || "",
        requirementsFr: job.requirementsFr || "",
        requirementsAr: job.requirementsAr || "",
        isActive: job.isActive,
      });
    } else {
      setEditingJob(null);
      setFormData({
        titleFr: "",
        titleAr: "",
        domain: "",
        contractType: "CDI",
        scope: "NATIONAL",
        location: "",
        descriptionFr: "",
        descriptionAr: "",
        requirementsFr: "",
        requirementsAr: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingJob
        ? `/api/admin/recrutement/jobs/${editingJob.id}`
        : "/api/admin/recrutement/jobs";
      const method = editingJob ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save job");
      }

      const { job } = await response.json();

      if (editingJob) {
        setJobs(jobs.map((j) => (j.id === job.id ? job : j)));
      } else {
        setJobs([{ ...job, _count: { applications: 0 } }, ...jobs]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving job:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm(t.admin.confirmDeleteMessage)) return;

    try {
      const response = await fetch(`/api/admin/recrutement/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.titleAr.includes(searchTerm) ||
      job.domain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain = !filterDomain || job.domain === filterDomain;
    const matchesContract = !filterContract || job.contractType === filterContract;
    const matchesActive =
      !filterActive ||
      (filterActive === "active" && job.isActive) ||
      (filterActive === "inactive" && !job.isActive);

    return matchesSearch && matchesDomain && matchesContract && matchesActive;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase">
              {t.admin.manageJobs}
            </h1>
            <p className="text-sm text-slate-400">
              Gestion des offres publiées et pipelines de candidatures
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="rounded-xl bg-[#FDCD1A] px-6 py-3 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
        >
          + {t.admin.newJob}
        </button>
      </header>

      {/* Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none"
        />

        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
        >
          <option value="">Tous les domaines</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={filterContract}
          onChange={(e) => setFilterContract(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
        >
          <option value="">Tous les contrats</option>
          <option value="INTERIM">{t.admin.contractInterim}</option>
          <option value="CDD">{t.admin.contractCDD}</option>
          <option value="CDI">{t.admin.contractCDI}</option>
        </select>

        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Offres actives</option>
          <option value="inactive">Offres inactives</option>
        </select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">Aucune offre d'emploi trouvée.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-white">{job.titleFr}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        job.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {job.isActive ? t.admin.jobActive : t.admin.jobInactive}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
                    <span>{job.domain}</span>
                    <span>•</span>
                    <span>
                      {job.contractType === "INTERIM" && t.admin.contractInterim}
                      {job.contractType === "CDD" && t.admin.contractCDD}
                      {job.contractType === "CDI" && t.admin.contractCDI}
                    </span>
                    <span>•</span>
                    <span>
                      {job.scope === "NATIONAL" ? t.admin.scopeNational : t.admin.scopeInternational}
                    </span>
                    {job.location && (
                      <>
                        <span>•</span>
                        <span>{job.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:w-48">
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-center">
                    <p className="text-2xl font-extrabold text-[#FDCD1A]">
                      {job._count.applications}
                    </p>
                    <p className="text-xs text-slate-400">{t.admin.applications}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(job)}
                      className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                    >
                      {t.admin.editJob}
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                    >
                      {t.admin.deleteJob}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div data-testid="job-modal" className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-8">
            <h2 className="text-2xl font-extrabold text-white mb-6">
              {editingJob ? t.admin.editJob : t.admin.newJob}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titles */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobTitleFr} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleFr}
                    onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="Ex: Superviseur HSE Chantier BTP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobTitleAr} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="مشرف السلامة والصحة في موقع البناء"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Domain, Contract, Scope, Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobDomain} *
                  </label>
                  <select
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                  >
                    <option value="">Sélectionnez...</option>
                    {domains.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobContractType} *
                  </label>
                  <select
                    required
                    value={formData.contractType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractType: e.target.value as "INTERIM" | "CDD" | "CDI",
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                  >
                    <option value="INTERIM">{t.admin.contractInterim}</option>
                    <option value="CDD">{t.admin.contractCDD}</option>
                    <option value="CDI">{t.admin.contractCDI}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobScope} *
                  </label>
                  <select
                    required
                    value={formData.scope}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scope: e.target.value as "NATIONAL" | "INTERNATIONAL",
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                  >
                    <option value="NATIONAL">{t.admin.scopeNational}</option>
                    <option value="INTERNATIONAL">{t.admin.scopeInternational}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobLocation}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="Ex: Casablanca, Tanger, Jorf Lasfar"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobDescriptionFr}
                  </label>
                  <textarea
                    data-testid="job-description-fr"
                    rows={4}
                    value={formData.descriptionFr}
                    onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="Description du poste..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobDescriptionAr}
                  </label>
                  <textarea
                    data-testid="job-description-ar"
                    rows={4}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="وصف الوظيفة..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobRequirementsFr}
                  </label>
                  <textarea
                    data-testid="job-requirements-fr"
                    rows={4}
                    value={formData.requirementsFr}
                    onChange={(e) => setFormData({ ...formData, requirementsFr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="Exigences et profil recherché..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {t.admin.jobRequirementsAr}
                  </label>
                  <textarea
                    data-testid="job-requirements-ar"
                    rows={4}
                    value={formData.requirementsAr}
                    onChange={(e) => setFormData({ ...formData, requirementsAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-[#FDCD1A] focus:outline-none"
                    placeholder="المتطلبات والملف المطلوب..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-700 bg-slate-950/60 text-[#FDCD1A] focus:ring-[#FDCD1A]"
                  />
                  <span className="text-sm font-bold text-slate-300">{t.admin.jobActive}</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#FDCD1A] px-6 py-3 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.admin.saving : t.common.save}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  {t.common.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
