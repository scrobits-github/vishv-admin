import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import axios from "axios";

const initialState = {
  loader: false,
  jobsData: [],
  categoryData: [],
  applicationsData:[]
};

const host = "https://mpminfosoft-backend-development.up.railway.app";

// jobs api ---------------------------------------------------------

export const getJobs = createAsyncThunk("jobs/getJobs", async () => {
  return await axios.get(`${host}/api/v1/jobs/get-all-jobs`);
});

export const addJobPost = createAsyncThunk("jobs/addJobPost", async (data) => {
  return await axios
    .post(`${host}/api/v1/jobs/create-job-post`, data)
    .then(() => notification.success({ message: "Job Opening Added Successfully...!" }))
    .catch((err) => console.log("error: ", err));
});

export const updateJobPost = createAsyncThunk("blogs/updateJobPost", async ({ data, id }) => {
  return await axios.put(`${host}/api/v1/jobs/update-job/${id}`, data)
    .then(() => notification.success({ message: "Blog Updated Successfully...!" }))
    .catch((err) => console.log("error: ", err));
})

export const deleteJobPost = createAsyncThunk("jobs/deleteJobPost", async (id) => {
  return axios
    .delete(`${host}/api/v1/jobs/delete-job/${id}`)
    .then(() => notification.success({ message: "Job Opening Deleted Successfully...!" }))
    .catch((err) => console.log("error: ", err));
});

export const createJobAndGetAllJobs = (data) => async (dispatch) => {
  await dispatch(addJobPost(data));
  dispatch(getJobs());
}

export const deleteJobAndGetAllJobs = (id) => async (dispatch) => {
  await dispatch(deleteJobPost(id));
  dispatch(getJobs());
}

export const updateJobAndGetAllJobs = ({ data, id }) => async (dispatch) => {
  await dispatch(updateJobPost({ data, id }));
  // eslint-disable-next-line
  dispatch(getBlogs());
}



// job category api ---------------------------------------------------------


export const getCategory = createAsyncThunk("jobs/getCategory", async () => {
  return axios.get(`${host}/api/v1/category/get-all-category`);
});

export const addCategoryPost = createAsyncThunk("jobs/addCategoryPost", async (data) => {
  return axios
    .post(`${host}/api/v1/category/create-category-post`, data)
    .then(() => notification.success({ message: "Job Category Added Successfully...!" }))
    .catch((err) => console.log("error: ", err));
});

export const updateCategoryPost = createAsyncThunk("blogs/updateCategoryPost", async ({ data, id }) => {
  return await axios.put(`${host}/api/v1/category/update-category/${id}`, data)
    .then(() => notification.success({ message: "Category Updated Successfully...!" }))
    .catch((err) => console.log("error: ", err));
})

export const deleteCategoryPost = createAsyncThunk("jobs/deleteCategoryPost", async (id) => {
  console.log(id);
  return axios.delete(`${host}/api/v1/category/delete-category/${id}`)
    .then(() => notification.success({ message: "Category Deleted Successfully...!" }))
    .catch((err) => console.log("error: ", err));
});

export const createCategoryAndGetAllCategory = (data) => async (dispatch) => {
  await dispatch(addCategoryPost(data));
  dispatch(getCategory());
}

export const deleteCategoryAndGetAllCategory = (id) => async (dispatch) => {
  console.log(id)
  await dispatch(deleteCategoryPost(id));
  dispatch(getCategory());
}



// job applications api ---------------------------------------------------------


export const getApplications = createAsyncThunk("jobs/getApplications", async ({jobId}) => {
  console.log(jobId);
  return axios.get(`${host}/api/v1/applications/get-all-applications/${jobId}`);
});


const jobsSlice = createSlice({
  name: "jobs",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {

    // job opening extra reducer ----------------------

    builder.addCase(getJobs.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getJobs.fulfilled, (state, action) => {
      state.loader = false;
      state.jobsData = action.payload;
    });
    builder.addCase(getJobs.rejected, (state, action) => {
      state.loader = false;
      console.log(action.error.message);
    });


    // job category extra reducer ----------------------

    builder.addCase(getCategory.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.loader = false;
      state.categoryData = action.payload;
    });
    builder.addCase(getCategory.rejected, (state, action) => {
      state.loader = false;
      console.log(action.error.message);
    });
    

    // job applications extra reducer ----------------------

    builder.addCase(getApplications.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getApplications.fulfilled, (state, action) => {
      state.loader = false;
      state.applicationsData = action.payload;
    });
    builder.addCase(getApplications.rejected, (state, action) => {
      state.loader = false;
      console.log(action.error.message);
    });

  },
});

export const { add, remove } = jobsSlice.actions;
export default jobsSlice.reducer;
