import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import referenceDataReducer from "./slices/referenceDataSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    referenceData: referenceDataReducer,
  },
});
