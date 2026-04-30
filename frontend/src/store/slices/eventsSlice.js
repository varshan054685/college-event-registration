import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchEvents = createAsyncThunk('events/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/events', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchEvent = createAsyncThunk('events/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchFeatured = createAsyncThunk('events/featured', async () => {
  const res = await api.get('/events/featured');
  return res.data;
});

export const createEvent = createAsyncThunk('events/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/events', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteEvent = createAsyncThunk('events/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/events/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [], featured: [], current: null,
    loading: false, error: null,
    page: 1, pages: 1, total: 0,
  },
  reducers: { clearCurrent(state) { state.current = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchEvents.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.loading = false; s.items = a.payload.events;
        s.page = a.payload.page; s.pages = a.payload.pages; s.total = a.payload.total;
      })
      .addCase(fetchEvents.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchEvent.pending, (s) => { s.loading = true; })
      .addCase(fetchEvent.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchEvent.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchFeatured.fulfilled, (s, a) => { s.featured = a.payload; })
      .addCase(deleteEvent.fulfilled, (s, a) => { s.items = s.items.filter((e) => e._id !== a.payload); })
      .addCase(updateEvent.fulfilled, (s, a) => {
        const idx = s.items.findIndex((e) => e._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
        if (s.current?._id === a.payload._id) s.current = a.payload;
      });
  },
});

export const { clearCurrent } = eventsSlice.actions;
export default eventsSlice.reducer;
