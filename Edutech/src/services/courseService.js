import {
  deleteWithFallback,
  getWithFallback,
  postWithFallback,
  putWithFallback,
} from "./apiClient";

const normalizeCourse = (course) => ({
  ...course,
  id: course?._id || course?.id,
  title: course?.courseName || course?.title || "Untitled",
  description: course?.courseDescription || course?.description || "",
  price: Number(course?.price || 0),
  thumbnail:
    course?.thumbnail ||
    course?.Thumbnails ||
    course?.thumbnailUrl ||
    "/Images/background2.jpg",
  level: course?.level || "Beginner",
  category: course?.category || course?.categories || null,
  instructorName:
    course?.instructorName ||
    [course?.instructor?.firstName, course?.instructor?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Instructor",
});

export const fetchAllCoursesApi = async () => {
  const data = await getWithFallback([
    "/api/course/all",
    "/api/courses/getAllCourses",
  ]);
  const courses = data?.data || [];
  return courses.map(normalizeCourse);
};

export const fetchCourseDetailsApi = async (courseId) => {
  const data = await postWithFallback(
    ["/api/course/get/" + courseId, "/api/courses/getCourseDetails"],
    { courseId }
  );
  return normalizeCourse(data?.data || {});
};

export const fetchCategoriesApi = async () => {
  const data = await getWithFallback([
    "/api/category/all",
    "/api/courses/showAllCategories",
  ]);
  return data?.data || [];
};

export const createCourseApi = async (coursePayload) => {
  const formData = new FormData();
  formData.append("courseName", coursePayload.title);
  formData.append("courseDescription", coursePayload.description);
  formData.append("whatyouwillLearn", coursePayload.whatYouWillLearn || "Learn in depth");
  formData.append("price", String(coursePayload.price));
  formData.append("categories", coursePayload.category);
  if (coursePayload.thumbnailFile) {
    formData.append("thumbnailFile", coursePayload.thumbnailFile);
  }
  if (coursePayload.level) {
    formData.append("level", coursePayload.level);
  }

  const data = await postWithFallback(
    ["/api/course/create", "/api/courses/createCourse"],
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const created = data?.data || {};
  return normalizeCourse(created);
};

export const updateCourseApi = async (courseId, payload) => {
  const data = await putWithFallback(
    [
      `/api/course/update/${courseId}`,
      `/api/courses/updateCourse/${courseId}`,
    ],
    payload
  );
  return normalizeCourse(data?.data || payload);
};

export const deleteCourseApi = async (courseId) => {
  return deleteWithFallback([
    `/api/course/delete/${courseId}`,
    `/api/courses/deleteCourse/${courseId}`,
  ]);
};

export const createSectionApi = async (courseId, sectionName) => {
  const data = await postWithFallback(
    ["/api/course/section/create", "/api/courses/createSection"],
    { courseId, sectionName }
  );
  return data?.updatedCourse || data?.data || null;
};

export const createLectureApi = async ({ sectionId, title, videoUrl, notes }) => {
  const payload = {
    sectionId,
    title,
    videoUrl,
    notes,
    descptions: notes || "",
    timeDuration: 10,
  };

  const data = await postWithFallback(
    ["/api/course/lecture/create", "/api/courses/createSubSection"],
    payload
  );
  return data?.data || null;
};

export const fetchEnrolledCoursesApi = async () => {
  const data = await getWithFallback([
    "/api/enrolled-courses",
    "/api/profiles/getEnrolledCourses",
  ]);
  const courses = data?.data || [];
  return courses.map(normalizeCourse);
};

export const getRazorpayKeyApi = async () => {
  const data = await getWithFallback([
    "/api/payment/getRazorpayKey",
    "/api/payment/key",
  ]);
  return data?.key;
};

export const createOrderApi = async (courseId) => {
  return postWithFallback(
    ["/api/payment/create-order", "/api/payment/capturePayment"],
    { courseId }
  );
};

export const verifyRazorpayPaymentApi = async (payload) => {
  return postWithFallback(
    ["/api/payment/verify", "/api/payment/verifyPayment", "/api/payment/verifySignature"],
    payload
  );
};

export const filterTeacherCourses = (courses, userId) => {
  return courses.filter((course) => {
    const instructorId = course?.instructor?._id || course?.instructor || null;
    return instructorId && userId && String(instructorId) === String(userId);
  });
};
