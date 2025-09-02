import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

const initialState = {
  callList: [],
  entryList: [],
  peopleList: [],
  depts: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all reference data
export const fetchReferenceData = createAsyncThunk(
  "referenceData/fetchAll",
  async () => {
    const [entriesRes, peopleRes, callTypesRes, deptsRes] = await Promise.all([
      fetch("https://secure-earth-82827.herokuapp.com/sked/entries"),
      fetch("https://secure-earth-82827.herokuapp.com/people"),
      fetch("https://secure-earth-82827.herokuapp.com/callTypes"),
      fetch("https://secure-earth-82827.herokuapp.com/departments"),
    ]);

    const [entries, people, calls, departments] = await Promise.all([
      entriesRes.json(),
      peopleRes.json(),
      callTypesRes.json(),
      deptsRes.json(),
    ]);

    return {
      entries,
      people,
      calls: calls.sort((a, b) => a.priority - b.priority),
      departments,
    };
  }
);

// CRUD operations for CallTypes
export const addCallType = createAsyncThunk(
  "referenceData/addCallType",
  async ({ name, active, priority }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/callTypes",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          active,
          priority: parseInt(priority, 10),
        }),
      }
    );
    return await response.json();
  }
);

export const updateCallType = createAsyncThunk(
  "referenceData/updateCallType",
  async ({ id, name, active, priority }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/callTypes",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          active,
          priority: parseInt(priority, 10),
        }),
      }
    );
    return await response.json();
  }
);

export const deleteCallType = createAsyncThunk(
  "referenceData/deleteCallType",
  async (id) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/callTypes",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    return await response.json();
  }
);

const referenceDataSlice = createSlice({
  name: "referenceData",
  initialState,
  reducers: {
    clearReferenceData: (state) => {
      state.callList = [];
      state.entryList = [];
      state.peopleList = [];
      state.depts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferenceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.loading = false;
        state.callList = action.payload.calls;
        state.entryList = action.payload.entries;
        state.peopleList = action.payload.people;
        state.depts = action.payload.departments;
        state.error = null;
      })
      .addCase(fetchReferenceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reference data";
      });
  },
});

export const { clearReferenceData } = referenceDataSlice.actions;

// Base selectors
export const selectCallList = (state) => state.referenceData.callList;
export const selectEntryList = (state) => state.referenceData.entryList;
export const selectPeopleList = (state) => state.referenceData.peopleList;
export const selectDepts = (state) => state.referenceData.depts;
export const selectReferenceDataLoading = (state) =>
  state.referenceData.loading;
export const selectReferenceDataError = (state) => state.referenceData.error;

// Memoized derived selector to prevent unnecessary re-renders
export const selectFilteredEntries = createSelector(
  [selectEntryList],
  (entryList) => entryList.filter((entry) => entry.isactive === true)
);

export default referenceDataSlice.reducer;
