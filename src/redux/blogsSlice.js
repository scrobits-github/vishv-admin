import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import axios from "axios";

const host = "https://mpminfosoft-backend-development.up.railway.app";

const initialState = {
    loader: false,
    blogsData: []
}

export const getBlogs = createAsyncThunk("blogs/getBlogs", async () => {
    return await axios.get(`${host}/api/v1/blogs/get-all-blogs`)
})

export const addBlogPost = createAsyncThunk("blogs/addBlogPost", async (data) => {
    return await axios.post(`${host}/api/v1/blogs/create-blog-post`, data)
        .then(() => notification.success({ message: "Blog Created Successfully...!" }))
        .catch((err) => console.log("error: ", err));
})

export const updateBlogPost = createAsyncThunk("blogs/updateBlogPost", async ({ data, id }) => {
    return await axios.put(`${host}/api/v1/blogs/update-blog/${id}`, data)
        .then(() => notification.success({ message: "Blog Updated Successfully...!" }))
        .catch((err) => console.log("error: ", err));
})

export const deleteBlogPost = createAsyncThunk("blogs/deleteBlogPost", async (id) => {
    return await axios.delete(`${host}/api/v1/blogs/delete-blog/${id}`)
        .then(() => { notification.success({ message: "Blog Deleted Successfully...!" }) })
        .catch((err) => console.log("error: ", err));
})

export const deleteBlogAndGetAllBlogs = (id) => async (dispatch) => {
    await dispatch(deleteBlogPost(id));
    dispatch(getBlogs());
}

export const createBlogAndGetAllBlogs = (data) => async (dispatch) => {
    await dispatch(addBlogPost(data));
    dispatch(getBlogs());
}


export const updateBlogAndGetAllBlogs = ({ data, id }) => async (dispatch) => {
    await dispatch(updateBlogPost({ data, id }));
    dispatch(getBlogs());
}

const blogsSlice = createSlice({
    name: "blogs",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getBlogs.pending, (state) => {
            state.loader = true
        })
        builder.addCase(getBlogs.fulfilled, (state, action) => {
            state.loader = false,
                state.blogsData = action.payload
        })
        builder.addCase(getBlogs.rejected, (state, action) => {
            state.loader = false,
                console.log(action.error.message);
        })

        // ----------------------------------------------------------------------------------------

        builder.addCase(addBlogPost.pending, (state) => {
            state.loader = true
        })
        // eslint-disable-next-line
        builder.addCase(addBlogPost.fulfilled, (state, _action) => {
            state.loader = false
        })
        builder.addCase(addBlogPost.rejected, (state, action) => {
            state.loader = false,
                console.log(action.error.message);
        })
    }
})

export default blogsSlice.reducer