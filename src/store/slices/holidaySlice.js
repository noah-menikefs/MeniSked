import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  rHolidayList: [],
  nrHolidayList: [],
  loading: false,
  error: null,
};

// Async thunk for fetching holiday data
export const fetchHolidayData = createAsyncThunk(
  "holidays/fetchAll",
  async () => {
    const [rHolidaysRes, nrHolidaysRes] = await Promise.all([
      fetch("https://secure-earth-82827.herokuapp.com/holiday/r"),
      fetch("https://secure-earth-82827.herokuapp.com/holiday/nr"),
    ]);

    const [rHolidays, nrHolidays] = await Promise.all([
      rHolidaysRes.json(),
      nrHolidaysRes.json(),
    ]);

    return {
      rHolidays: rHolidays.filter((holiday) => holiday.isactive === true),
      nrHolidays,
    };
  }
);

const holidaySlice = createSlice({
  name: "holidays",
  initialState,
  reducers: {
    clearHolidayData: (state) => {
      state.rHolidayList = [];
      state.nrHolidayList = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayData.fulfilled, (state, action) => {
        state.loading = false;
        state.rHolidayList = action.payload.rHolidays;
        state.nrHolidayList = action.payload.nrHolidays;
        state.error = null;
      })
      .addCase(fetchHolidayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch holiday data";
      });
  },
});

export const { clearHolidayData } = holidaySlice.actions;

// Base selectors
export const selectRHolidayList = (state) => state.holidays.rHolidayList;
export const selectNrHolidayList = (state) => state.holidays.nrHolidayList;
export const selectHolidayLoading = (state) => state.holidays.loading;
export const selectHolidayError = (state) => state.holidays.error;

export default holidaySlice.reducer;
