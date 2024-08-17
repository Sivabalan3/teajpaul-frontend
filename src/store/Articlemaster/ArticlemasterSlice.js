import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { Base_Url } from "../../Api";

export const ArticleMasterFileUpload = createAsyncThunk(
  "articlemaster/ArticleMasterFileUpload",
  async ({ file, articleType }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${Base_Url}/api/excel/article/${articleType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getArticleTypes = createAsyncThunk(
  "articlemaster/getArticleTypes",
  async ({ articleType }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/excel/article/${articleType}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const articleMaster = createSlice({
  name: "articlemaster",
  initialState: {
    ArticleMasterFileUpload: { data: null, loading: false, error: null },
    getArticleTypes: { data: [], loading: false, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ArticleMasterFileUpload.pending, (state) => {
        state.ArticleMasterFileUpload.loading = true;
        state.ArticleMasterFileUpload.error = null;
      })
      .addCase(ArticleMasterFileUpload.fulfilled, (state, action) => {
        state.ArticleMasterFileUpload.loading = false;
        state.ArticleMasterFileUpload.data = action.payload;
        state.ArticleMasterFileUpload.error = null;
        Swal.fire({
          title: "Success",
          text: action.payload.message || "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .addCase(ArticleMasterFileUpload.rejected, (state, action) => {
        state.ArticleMasterFileUpload.loading = false;
        state.ArticleMasterFileUpload.error = action.payload;
      })
      .addCase(getArticleTypes.pending, (state) => {
        state.getArticleTypes.loading = true;
        state.getArticleTypes.error = null;
      })
      .addCase(getArticleTypes.fulfilled, (state, action) => {
        state.getArticleTypes.data = action.payload;
        state.getArticleTypes.loading = false;
        state.getArticleTypes.error = null;
      })
      .addCase(getArticleTypes.rejected, (state, action) => {
        state.getArticleTypes.loading = false;
        state.getArticleTypes.error = action.payload;
      });
  },
});

export const articleMasterReducer = articleMaster.reducer;
