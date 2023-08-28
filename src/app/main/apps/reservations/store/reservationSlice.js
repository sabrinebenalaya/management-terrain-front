import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "@history";
import { toast } from "react-toastify";
import ReservationModel from "../model/ReservationModel";




export const getReservation = createAsyncThunk(
  "reservationsApp/task/getReservation",
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/reservations/getReservation/${id}`
      );

      const data = await response.data;

      return data;
    } catch (error) {
      history.push({ pathname: `apps/reservation` });

      return null;
    }
  }
);

export const addReservation = createAsyncThunk(
  "reservationsApp/reservations/addReservation",
  async (reservation, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/reservations/add",
        reservation
      );

      if (response && response.status === 200) {
        toast.success("Reservation added successfully ✅");
      }

      const data = await response.data.reservation;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Reservation already exists, you should add another one 😜");
      } else {
        toast.error("An error occurred while adding the reservation");
      }
      throw error;
    }
  }
);

export const updateReservation = createAsyncThunk(
  "reservationsApp/reservations/updateReservation",
  async (reservation, { dispatch, getState }) => {
    console.log("reservation", reservation);
    const response = await axios.put(
      `http://localhost:5000/users/update/${reservation._id}`,
      reservation
    );

    const data = await response.data;
    
    return data;
  }
);

export const removeReservation = createAsyncThunk(
  "reservationsApp/reservation/removeReservation",
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(
      `http://localhost:5000/reservations/delete/${id}`
    );

    await response.data;

    return id;
  }
);

export const selectReservation = ({ reservationsApp }) => reservationsApp.reservation;

const reservationSlice = createSlice({
  name: "reservationsApp/reservation",
  initialState: null,
  reducers: {
    newReservation: (state, action) => ReservationModel(),
    resetReservation: () => null,
  },
  extraReducers: {
    [getReservation.pending]: (state, action) => null,
    [getReservation.fulfilled]: (state, action) => action.payload,
    [updateReservation.fulfilled]: (state, action) => action.payload,
    [removeReservation.fulfilled]: (state, action) => null,
  },
});

export const { resetReservation, newReservation } = reservationSlice.actions;

export default reservationSlice.reducer;
