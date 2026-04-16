import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import {
  createCourse,
  fetchCategories,
  fetchCourseById,
  updateCourse,
} from "../../../slices/courseSlice";

const blankLecture = { title: "", videoUrl: "", notes: "" };
const blankSection = { title: "", lectures: [{ ...blankLecture }] };

const TeacherCourseFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const editingCourse = location.state?.course;
  const isEdit = Boolean(id);

  const { categories, singleCourse, loading } = useSelector((state) => state.course);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "Beginner",
    thumbnailFile: null,
    sections: [{ ...blankSection }],
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEdit && !editingCourse) {
      dispatch(fetchCourseById(id));
    }
  }, [dispatch, id, isEdit, editingCourse]);

  useEffect(() => {
    const source = editingCourse || singleCourse;
    if (!isEdit || !source) return;

    setForm((prev) => ({
      ...prev,
      title: source.title || "",
      description: source.description || "",
      price: source.price || "",
      category:
        source?.category?._id ||
        source?.category ||
        source?.categories?._id ||
        source?.categories ||
        "",
      level: source.level || "Beginner",
      sections: source.sections || [{ ...blankSection }],
    }));
  }, [isEdit, editingCourse, singleCourse]);

  const canSubmit = useMemo(() => {
    return form.title && form.description && form.price && form.category;
  }, [form]);

  const updateSection = (index, key, value) => {
    setForm((prev) => {
      const nextSections = [...prev.sections];
      nextSections[index] = { ...nextSections[index], [key]: value };
      return { ...prev, sections: nextSections };
    });
  };

  const updateLecture = (sectionIndex, lectureIndex, key, value) => {
    setForm((prev) => {
      const nextSections = [...prev.sections];
      const nextLectures = [...nextSections[sectionIndex].lectures];
      nextLectures[lectureIndex] = { ...nextLectures[lectureIndex], [key]: value };
      nextSections[sectionIndex] = { ...nextSections[sectionIndex], lectures: nextLectures };
      return { ...prev, sections: nextSections };
    });
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...blankSection }],
    }));
  };

  const addLecture = (sectionIndex) => {
    setForm((prev) => {
      const nextSections = [...prev.sections];
      nextSections[sectionIndex] = {
        ...nextSections[sectionIndex],
        lectures: [...nextSections[sectionIndex].lectures, { ...blankLecture }],
      };
      return { ...prev, sections: nextSections };
    });
  };

  const removeSection = (sectionIndex) => {
    setForm((prev) => {
      const nextSections = prev.sections.filter((_, index) => index !== sectionIndex);
      return { ...prev, sections: nextSections.length ? nextSections : [{ ...blankSection }] };
    });
  };

  const removeLecture = (sectionIndex, lectureIndex) => {
    setForm((prev) => {
      const nextSections = [...prev.sections];
      const nextLectures = nextSections[sectionIndex].lectures.filter((_, index) => index !== lectureIndex);
      nextSections[sectionIndex] = {
        ...nextSections[sectionIndex],
        lectures: nextLectures.length ? nextLectures : [{ ...blankLecture }],
      };
      return { ...prev, sections: nextSections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
    };

    let result;
    if (isEdit) {
      result = await dispatch(updateCourse({ courseId: id, payload }));
    } else {
      result = await dispatch(createCourse(payload));
    }

    if (!result.error) {
      toast.success(isEdit ? "Course updated" : "Course created");
      navigate("/dashboard/teacher/courses");
    } else {
      toast.error(result.payload || "Unable to save course");
    }
  };

  return (
    <DashboardLayout title={isEdit ? "Update Course" : "Create Course"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Title</span>
            <input className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Price</span>
            <input type="number" min="0" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold">Description</span>
            <textarea rows={4} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Category</span>
            <select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.categoryName || category.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Level</span>
            <select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" value={form.level} onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold">Thumbnail Upload</span>
            <input type="file" accept="image/*" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" onChange={(e) => setForm((prev) => ({ ...prev, thumbnailFile: e.target.files?.[0] || null }))} />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Sections and Lectures</h2>
            <button type="button" onClick={addSection} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700">Add Section</button>
          </div>

          {form.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
                />
                <button type="button" onClick={() => removeSection(sectionIndex)} className="px-3 py-2 rounded-xl bg-rose-600 text-white">Remove</button>
              </div>

              <div className="space-y-3">
                {section.lectures.map((lecture, lectureIndex) => (
                  <div key={lectureIndex} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                    <input placeholder="Lecture title" value={lecture.title} onChange={(e) => updateLecture(sectionIndex, lectureIndex, "title", e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" />
                    <input placeholder="Video URL" value={lecture.videoUrl} onChange={(e) => updateLecture(sectionIndex, lectureIndex, "videoUrl", e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" />
                    <textarea placeholder="Notes (optional)" rows={3} value={lecture.notes} onChange={(e) => updateLecture(sectionIndex, lectureIndex, "notes", e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" />
                    <button type="button" onClick={() => removeLecture(sectionIndex, lectureIndex)} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700">Remove Lecture</button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addLecture(sectionIndex)} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700">Add Lecture</button>
            </div>
          ))}
        </div>

        <button disabled={loading} className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default TeacherCourseFormPage;
