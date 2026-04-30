import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';

export default configureStore({
  reducer: { auth: authReducer, events: eventsReducer },
});
