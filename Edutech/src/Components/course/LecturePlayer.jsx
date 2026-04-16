import React, { useMemo, useState } from "react";

const LecturePlayer = ({ course }) => {
  const lectures = useMemo(() => {
    const sections = course?.courseContent || course?.sections || [];
    return sections.flatMap((section) => {
      const sectionTitle = section.sectionName || section.title || "Section";
      const items = section.subsections || section.lectures || [];
      return items.map((lecture) => ({
        id: lecture._id || lecture.id,
        title: lecture.title,
        notes: lecture.description || lecture.notes || "",
        videoUrl: lecture.videourl || lecture.videoUrl || "",
        sectionTitle,
      }));
    });
  }, [course]);

  const [activeLecture, setActiveLecture] = useState(lectures[0] || null);

  if (!activeLecture) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">No lecture content available in this course yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
        <h2 className="text-lg font-bold">{activeLecture.title}</h2>
        <video
          controls
          src={activeLecture.videoUrl}
          className="w-full rounded-xl bg-black"
        />
        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{activeLecture.notes || "No notes provided"}</p>
      </div>

      <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-h-[520px] overflow-auto">
        <h3 className="font-bold mb-3">Lectures</h3>
        <div className="space-y-2">
          {lectures.map((lecture) => (
            <button
              key={lecture.id || lecture.title}
              onClick={() => setActiveLecture(lecture)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                activeLecture.id === lecture.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <p className="font-semibold">{lecture.title}</p>
              <p className="text-xs opacity-80">{lecture.sectionTitle}</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default LecturePlayer;
