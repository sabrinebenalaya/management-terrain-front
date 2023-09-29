import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "@history";
import ContactModel from "../model/ContactModel";

import { toast } from "react-toastify";
export const getContact = createAsyncThunk(
  "contactsApp/task/getContact",
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/getuser/${id}`
      );

      const data = await response.data;

      return data;
    } catch (error) {
      history.push({ pathname: `apps/user` });

      return null;
    }
  }
);

export const addContact = createAsyncThunk(
  "contactsApp/contacts/addContact",
  async (contact, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/add",
        contact
      );

      if (response && response.status === 200) {
        toast.success("User added successfully ✅");
      }

      const data = await response.data.user;

      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("User already exists, you should add another one 😜");
      } else {
        toast.error("An error occurred while adding the user");
      }
      throw error;
    }
  }
);

export const updateContact = createAsyncThunk(
  "contactsApp/contacts/updateContact",
  async (contact, { dispatch, getState }) => {
    console.log("contact", contact);
    const response = await axios.put(
      `http://localhost:5000/users/update/${contact._id}`,
      contact
    );

    const data = await response.data;

    return data;
  }
);

export const removeContact = createAsyncThunk(
  "contactsApp/contacts/removeContact",
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(
      `http://localhost:5000/users/delete/${id}`
    );

    await response.data;

    return id;
  }
);

export const selectContact = ({ contactsApp }) => contactsApp.contact;

const contactSlice = createSlice({
  name: "contactsApp/contact",
  initialState: null,
  reducers: {
    newContact: (state, action) => ContactModel(),
    resetContact: () => null,
  },
  extraReducers: {
    [getContact.pending]: (state, action) => null,
    [getContact.fulfilled]: (state, action) => action.payload,
    [updateContact.fulfilled]: (state, action) => action.payload,
    [removeContact.fulfilled]: (state, action) => null,
  },
});

export const { resetContact, newContact } = contactSlice.actions;

export default contactSlice.reducer;
