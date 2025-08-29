import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import referenceDataReducer from "./slices/referenceDataSlice";
import holidayReducer from "./slices/holidaySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    referenceData: referenceDataReducer,
    holidays: holidayReducer,
  },
});
