import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import formatISO from 'date-fns/formatISO';
import { selectSelectedLabels } from './labelsSlice';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ'; 

export const getEvents = createAsyncThunk('calendarApp/events/getEvents', async (idPartner) => {
  const response = await axios.get(
    `http://localhost:5000/reservations/getPartnerReservation/${idPartner}`
  );
  const data = await response.data;
 
  return data;
});

export const getAllRrservationInThisDate = createAsyncThunk('calendarApp/events/getAllRrservationInThisDate',
  async ({ start, end}, { dispatch, getState }) => {
    

    try {
      const response = await axios.get(
        'http://localhost:5000/reservations/getReservationWithDate',
        { params: { start, end } } // Utilisation de params pour envoyer start et end
      );
     

      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
});

export const addEvent = createAsyncThunk(
  'calendarApp/events/addEvent',
  async (newEvent, { dispatch }) => {
    const response = await axios.post('http://localhost:5000/reservations/add', newEvent);
    const data = await response.data;

    return data;
  }
);

export const updateEvent = createAsyncThunk(
  'calendarApp/events/updateEvent',
  async (event, { dispatch }) => {
    console.log("event",event)
    const response = await axios.put(`http://localhost:5000/reservations/update/${event._id}`, event);
    const data = await response.data;
    return data;
  }
);

export const removeEvent = createAsyncThunk(
  'calendarApp/events/removeEvent',
  async (eventId, { dispatch }) => {
    const response = await axios.delete(`http://localhost:5000/reservations/delete/${eventId}`);
    const data = await response.data;

   return data;
  }
);

const eventsAdapter = createEntityAdapter({  selectId: (event) => event._id});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = eventsAdapter.getSelectors((state) => state.calendarApp.events);

const eventsSlice = createSlice({
  name: 'calendarApp/events',
  initialState: eventsAdapter.getInitialState({
    eventDialog: {
      type: 'new',
      props: {
        open: false,
        anchorPosition: { top: 200, left: 400 },
      },
      data: null,
    },
    reservationsWithDate: [], 
  }),
  reducers: {
    openNewEventDialog: {
      prepare: (selectInfo) => {
        const { start, end, jsEvent } = selectInfo;
        const payload = {
          type: 'new',
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      prepare: (clickInfo) => {
        const { jsEvent, event } = clickInfo;
        const { id, title, allDay, start, end, extendedProps } = event;

        const payload = {
          type: 'edit',
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            id,
            title,
            allDay,
            extendedProps,
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    closeNewEventDialog: (state, action) => {
      state.eventDialog = {
        type: 'new',
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
    closeEditEventDialog: (state, action) => {
      state.eventDialog = {
        type: 'edit',
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: eventsAdapter.setAll,
    [addEvent.fulfilled]: eventsAdapter.addOne,
    [updateEvent.fulfilled]: eventsAdapter.upsertOne,
    [removeEvent.fulfilled]: eventsAdapter.removeOne,
    [getAllRrservationInThisDate.fulfilled]: (state, action) => {
      state.reservationsWithDate = action.payload; // Stockez les réservations par date
    },

  },
});

export const {
  openNewEventDialog,
  closeNewEventDialog,
  openEditEventDialog,
  closeEditEventDialog,
} = eventsSlice.actions;

export const selectFilteredEvents = createSelector(
  [selectSelectedLabels, selectEvents],
  (selectedLabels, events) => {
    return events
  }
);
// j'ai enlever .filter((item) => selectedLabels.includes(item.extendedProps.label));
export const selectReservationsWithDate = (state) => state.calendarApp.events.reservationsWithDate;

export const selectEventDialog = ({ calendarApp }) => calendarApp.events.eventDialog;

export default eventsSlice.reducer;
