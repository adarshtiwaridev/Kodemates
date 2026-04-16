import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCourseApi,
  createLectureApi,
  createOrderApi,
  createSectionApi,
  deleteCourseApi,
  fetchAllCoursesApi,
  fetchCategoriesApi,
  fetchCourseDetailsApi,
  fetchEnrolledCoursesApi,
  filterTeacherCourses,
  updateCourseApi,
} from "../services/courseService";

const initialState = {
  allCourses: [],
  teacherCourses: [],
  enrolledCourses: [],
  categories: [],
  singleCourse: null,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchAllCourses = createAsyncThunk(
  "course/fetchAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllCoursesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeacherCourses = createAsyncThunk(
  "course/fetchTeacherCourses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const courses = await fetchAllCoursesApi();
      const userId = getState()?.auth?.user?._id;
      return filterTeacherCourses(courses, userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      return await fetchCourseDetailsApi(courseId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "course/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (payload, { rejectWithValue }) => {
    try {
      const createdCourse = await createCourseApi(payload);

      if (Array.isArray(payload.sections) && payload.sections.length > 0) {
        for (const section of payload.sections) {
          const sectionResponse = await createSectionApi(createdCourse.id, section.title);
          const populatedSections = sectionResponse?.courseContent || [];
          const latestSection = populatedSections[populatedSections.length - 1];

          if (latestSection?._id && Array.isArray(section.lectures)) {
            for (const lecture of section.lectures) {
              await createLectureApi({
                sectionId: latestSection._id,
                title: lecture.title,
                videoUrl: lecture.videoUrl,
                notes: lecture.notes,
              });
            }
          }
        }
      }

      return createdCourse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ courseId, payload }, { rejectWithValue }) => {
    try {
      return await updateCourseApi(courseId, payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await deleteCourseApi(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "course/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEnrolledCoursesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const purchaseCourse = createAsyncThunk(
  "course/purchaseCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const order = await createOrderApi(courseId);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearCourseError(state) {
      state.error = null;
    },
    clearSingleCourse(state) {
      state.singleCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.allCourses = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherCourses = action.payload;
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.teacherCourses.unshift(action.payload);
        state.allCourses.unshift(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const nextCourse = action.payload;
        state.teacherCourses = state.teacherCourses.map((course) =>
          course.id === nextCourse.id ? { ...course, ...nextCourse } : course
        );
        state.allCourses = state.allCourses.map((course) =>
          course.id === nextCourse.id ? { ...course, ...nextCourse } : course
        );
        if (state.singleCourse?.id === nextCourse.id) {
          state.singleCourse = { ...state.singleCourse, ...nextCourse };
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.teacherCourses = state.teacherCourses.filter((course) => course.id !== removedId);
        state.allCourses = state.allCourses.filter((course) => course.id !== removedId);
      })
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourseError, clearSingleCourse } = courseSlice.actions;
export default courseSlice.reducer;
