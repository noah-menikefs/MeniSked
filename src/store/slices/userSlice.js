import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialUser = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  colour: "",
  department: "",
  isadmin: false,
  isactive: false,
  worksked: [],
};

const initialState = {
  user: initialUser,
  isSignedIn: false,
  route: "Login",
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/login",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const user = await response.json();
    if (!user.lastname) {
      throw new Error("Invalid credentials");
    }
    return user;
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }) => {
    const response = await fetch(
      "https://secure-earth-82827.herokuapp.com/forgot",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (data === "unable to get user") {
      throw new Error("Email not found");
    }
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...initialUser, ...action.payload };
    },
    setSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },
    setRoute: (state, action) => {
      state.route = action.payload;
    },
    onRouteChange: (state, action) => {
      const { route, signedIn = true } = action.payload;
      state.route = route;
      state.isSignedIn = signedIn;
    },
    logout: (state) => {
      state.user = initialUser;
      state.isSignedIn = false;
      state.route = "Login";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...initialUser, ...action.payload };
        state.isSignedIn = true;
        state.route = "Personal Schedule";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Password reset failed";
      });
  },
});

export const {
  setUser,
  setSignedIn,
  setRoute,
  onRouteChange,
  logout,
  clearError,
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsSignedIn = (state) => state.user.isSignedIn;
export const selectRoute = (state) => state.user.route;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectIsAdmin = (state) => state.user.user.isadmin;

export default userSlice.reducer;
