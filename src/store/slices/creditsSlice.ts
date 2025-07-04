import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreditsState } from "../../types";
import { creditsAPI } from "../../services/api";

const initialState: CreditsState = {
  remaining: 0,
  lastReset: new Date().toISOString(),
  loading: false,
};

export const fetchCredits = createAsyncThunk(
  "credits/fetchCredits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await creditsAPI.getCredits();
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch credits",
      );
    }
  },
);

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    decrementCredits: (state) => {
      state.remaining--;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.remaining = action.payload.remaining;
        state.lastReset = action.payload.lastReset;
      })
      .addCase(fetchCredits.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default creditsSlice.reducer;
export const { decrementCredits } = creditsSlice.actions;
