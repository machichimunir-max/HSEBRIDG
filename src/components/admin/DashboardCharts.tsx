"use client";

import { useMemo } from "react";

interface EnrollmentData {
  date: string;
  count: number;
}

interface ChartProps {
  enrollments: Array<{ enrolledAt: Date }>;
  totalLessons: number;
  completedLessons: number;
}

// Déterministe - toujours les mêmes jours en français
const WEEKDAYS: Record<number, string> = {
  0: "Dim",
  1: "Lun",
  2: "Mar",
  3: "Mer",
  4: "Jeu",
  5: "Ven",
  6: "Sam",
};

function getWeekdayAbbr(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 (dimanche) à 6 (samedi)
  return WEEKDAYS[day] || "---";
}

export function EnrollmentsChart({ enrollments }: { enrollments: Array<{ enrolledAt: Date }> }) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const enrollmentsByDay = enrollments.reduce((acc, enrollment) => {
      const dateKey = new Date(enrollment.enrolledAt).toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return last7Days.map((date) => ({
      date,
      count: enrollmentsByDay[date] || 0,
    }));
  }, [enrollments]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
        {chartData.map((data, index) => {
          const height = (data.count / maxCount) * 100;
          return (
            <div key={data.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#073022] to-[#FDCD1A] transition-all hover:opacity-80"
                  style={{ height: `${height}%`, minHeight: data.count > 0 ? "8px" : "0" }}
                  title={`${data.count} enrollments`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-white">{data.count}</p>
                <p className="text-xs text-slate-500">
                  {getWeekdayAbbr(data.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CompletionDonutChart({ totalLessons, completedLessons }: { totalLessons: number; completedLessons: number }) {
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const incomplete = totalLessons - completedLessons;

  // Simple SVG donut chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const completedLength = (percentage / 100) * circumference;
  const incompleteLength = circumference - completedLength;

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="20"
          />
          {/* Incomplete circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="20"
            strokeDasharray={`${incompleteLength} ${completedLength}`}
            strokeDashoffset="0"
            transform="rotate(-90 100 100)"
          />
          {/* Completed circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#FDCD1A"
            strokeWidth="20"
            strokeDasharray={`${completedLength} ${incompleteLength}`}
            strokeDashoffset="0"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-white">{percentage.toFixed(0)}%</p>
          <p className="text-xs text-slate-400">Terminé</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#FDCD1A]" />
          <div>
            <p className="text-sm font-medium text-white">Terminées</p>
            <p className="text-xs text-slate-400">{completedLessons} leçons</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div>
            <p className="text-sm font-medium text-white">En cours</p>
            <p className="text-xs text-slate-400">{incomplete} leçons</p>
          </div>
        </div>
      </div>
    </div>
  );
}
