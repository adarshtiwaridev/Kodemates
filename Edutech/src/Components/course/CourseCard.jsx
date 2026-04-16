import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Edit3, Trash2 } from "lucide-react";

const CourseCard = ({
  course,
  isTeacherView = false,
  onDelete,
  onEdit,
  detailPath,
  actionSlot,
}) => {
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-black text-blue-600 dark:text-blue-400">${course.price}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {course.level || "Beginner"}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Link
            to={detailPath}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <BookOpen size={16} />
            View
          </Link>

          {isTeacherView && (
            <>
              <button
                onClick={() => onEdit(course)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit3 size={16} />
                Edit
              </button>

              <button
                onClick={() => onDelete(course)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}

          {actionSlot}
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
