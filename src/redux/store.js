import { configureStore } from "@reduxjs/toolkit";
import blogsSlice from "./blogsSlice";
import jobsReducer from "./jobsSlice";

const store = configureStore({
    reducer:{
        jobs : jobsReducer,
        blogs : blogsSlice
    }
})

export default store