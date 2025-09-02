import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

// Initial state
const initialState = {
  messages: [],
  loading: false,
  error: null,
  filteredMessages: [],
  counter: 10,
};

// Async thunks for API calls
export const fetchAdminMessages = createAsyncThunk(
  "messages/fetchAdminMessages",
  async () => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/amessages"
    );
    const data = await response.json();
    return data.filter((m) => m.deleted !== "A");
  }
);

export const fetchEmployeeMessages = createAsyncThunk(
  "messages/fetchEmployeeMessages",
  async (userId) => {
    const response = await fetch(
      `https://secure-earth-82827.herokuapp.com/emessages/${userId}`
    );
    const data = await response.json();
    return data.filter(
      (m) => (m.status !== "pending" || m.maybe) && m.deleted !== "E"
    );
  }
);

export const respondToMessage = createAsyncThunk(
  "messages/respondToMessage",
  async ({ reqId, status, msg, stamp }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/amessages",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reqId,
          status,
          msg,
          stamp,
        }),
      }
    );
    return await response.json();
  }
);

export const acceptRequest = createAsyncThunk(
  "messages/acceptRequest",
  async (reqId) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/arequest",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reqId }),
      }
    );
    return await response.json();
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async ({ id, deleted, user }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/messages",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          deleted,
          user,
        }),
      }
    );
    return await response.json();
  }
);

export const updateMessage = createAsyncThunk(
  "messages/updateMessage",
  async ({ id, msg2, stamp2 }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/messages",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          msg2,
          stamp2,
        }),
      }
    );
    return await response.json();
  }
);

// Message slice
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setFilteredMessages: (state, action) => {
      state.filteredMessages = action.payload;
    },
    incrementCounter: (state) => {
      state.counter += 10;
    },
    resetCounter: (state) => {
      state.counter = 10;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.filteredMessages = [];
      state.counter = 10;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin messages
      .addCase(fetchAdminMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.filteredMessages = action.payload;
      })
      .addCase(fetchAdminMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch employee messages
      .addCase(fetchEmployeeMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchEmployeeMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Respond to message
      .addCase(respondToMessage.fulfilled, (state, action) => {
        if (action.payload) {
          // Messages will be refetched by the component
        }
      })
      // Accept request
      .addCase(acceptRequest.fulfilled, (state, action) => {
        if (action.payload?.lastname) {
          // Messages will be refetched by the component
        }
      })
      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        if (action.payload) {
          // Messages will be refetched by the component
        }
      })
      // Update message
      .addCase(updateMessage.fulfilled, (state, action) => {
        if (action.payload) {
          // Messages will be refetched by the component
        }
      });
  },
});

// Selectors
export const selectMessages = (state) => state.messages.messages;
export const selectFilteredMessages = (state) =>
  state.messages.filteredMessages;
export const selectMessageLoading = (state) => state.messages.loading;
export const selectMessageError = (state) => state.messages.error;
export const selectMessageCounter = (state) => state.messages.counter;

// Memoized selectors for derived data
export const selectPendingMessages = createSelector(
  [selectMessages],
  (messages) => messages.filter((m) => m.status === "pending")
);

export const selectPastMessages = createSelector(
  [selectFilteredMessages],
  (filteredMessages) =>
    filteredMessages.filter((m) => m.status !== "pending" || m.maybe)
);

export const selectSortedPendingMessages = createSelector(
  [selectPendingMessages],
  (pendingMessages) => {
    // Import sortDates from utils - we'll need to handle this
    return pendingMessages; // Will be sorted in component for now
  }
);

export const selectSortedPastMessages = createSelector(
  [selectPastMessages],
  (pastMessages) => {
    // Import sortDates from utils - we'll need to handle this
    return pastMessages; // Will be sorted in component for now
  }
);

// Actions
export const {
  setFilteredMessages,
  incrementCounter,
  resetCounter,
  clearMessages,
  clearError,
} = messageSlice.actions;

export default messageSlice.reducer;
