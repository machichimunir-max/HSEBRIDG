"use client";

import { useEffect, useState } from "react";

type LocalVideoPlayerProps = {
  src: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  poster?: string | null;
  onMarkComplete?: () => void;
  lessonId?: string;
};

export function LocalVideoPlayer({
  src,
  title,
  description,
  thumbnail,
  poster,
  onMarkComplete,
  lessonId,
}: LocalVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>(src);
  const [loading, setLoading] = useState(!!lessonId);

  useEffect(() => {
    // If lessonId provided, generate secure token
    if (lessonId) {
      const generateToken = async () => {
        try {
          const response = await fetch("/api/video/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId }),
          });

          if (response.ok) {
            const data = await response.json();
            // For local provider, just use direct URL
            // In production with external providers, this would be encrypted
            setVideoUrl(src);
          }
        } catch (error) {
          console.error("Failed to get video token:", error);
          setVideoUrl(src);
        } finally {
          setLoading(false);
        }
      };

      generateToken();
    }
  }, [lessonId, src]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
        <div className="border-b border-slate-800 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Vidéo de la leçon</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-950 p-5">
          <p className="text-slate-400">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
      <div className="border-b border-slate-800 p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Vidéo de la leçon</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-300">{description}</p> : null}
      </div>

      <div className="p-5">
        <video
          key={videoUrl}
          controls
          playsInline
          className="aspect-video w-full rounded-2xl bg-slate-950"
          poster={poster || thumbnail || undefined}
          src={videoUrl}
        />

        {onMarkComplete ? (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onMarkComplete}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-600"
            >
              Marquer comme terminée
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
