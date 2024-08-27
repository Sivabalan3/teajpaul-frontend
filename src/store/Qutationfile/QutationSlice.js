import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Base_Url } from "../../Api";
import Swal from "sweetalert2";

// Define the async thunk for uploading quotation
export const qutationupload = createAsyncThunk(
    'Qutation/qutationupload',
    async ({ file, QutationType }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axios.post(
                `${Base_Url}/api/excel/qutation/${QutationType}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Define the async thunk for fetching quotations
export const fetchQutationsByType = createAsyncThunk(
    'Qutation/fetchQutationsByType',
    async ({QutationType}, { rejectWithValue }) => {
      try {
        // Ensure QutationType is a string
        const response = await axios.get(`${Base_Url}/api/excel/qutation/${QutationType}`);

        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );
  

// Create the slice
const QutationSlices = createSlice({
    name: "Qutation",
    initialState: {
        qutationupload: {
            data: null,
            loading: false,
            error: null,
        },
        fetchedQutations: {  // Added state for fetched quotations
            data: [],
            loading: false,
            error: null,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle states for uploading quotations
            .addCase(qutationupload.pending, (state) => {
                state.qutationupload.loading = true;
                state.qutationupload.error = null;
            })
            .addCase(qutationupload.fulfilled, (state, action) => {
                state.qutationupload.loading = false;
                state.qutationupload.data = action.payload;
                Swal.fire({
                    title: "Success",
                    text: action.payload.message || "Order file uploaded successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            })
            .addCase(qutationupload.rejected, (state, action) => {
                state.qutationupload.loading = false;
                state.qutationupload.error = action.payload;
                Swal.fire({
                    title: "Error",
                    text: action.payload || "Error uploading file",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            })
            
            // Handle states for fetching quotations
            .addCase(fetchQutationsByType.pending, (state) => {
                state.fetchedQutations.loading = true;
                state.fetchedQutations.error = null;
            })
            .addCase(fetchQutationsByType.fulfilled, (state, action) => {
                state.fetchedQutations.loading = false;
                state.fetchedQutations.data = action.payload;
            })
            .addCase(fetchQutationsByType.rejected, (state, action) => {
                state.fetchedQutations.loading = false;
                state.fetchedQutations.error = action.payload;
                Swal.fire({
                    title: "Error",
                    text: action.payload || "Error fetching quotations",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
    },
});

// Export the reducer to be used in the store
export const QutationSlice = QutationSlices.reducer;
