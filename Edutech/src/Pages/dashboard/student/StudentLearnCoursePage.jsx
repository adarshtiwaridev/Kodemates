import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import LecturePlayer from "../../../Components/course/LecturePlayer";
import { fetchCourseById } from "../../../slices/courseSlice";

const StudentLearnCoursePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleCourse, loading } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  return (
    <DashboardLayout title="Learn Course">
      {loading || !singleCourse ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading content...</p>
        </div>
      ) : (
        <LecturePlayer course={singleCourse} />
      )}
    </DashboardLayout>
  );
};

export default StudentLearnCoursePage;
