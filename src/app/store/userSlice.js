/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
import { setInitialSettings } from "app/store/fuse/settingsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";
import axios from "axios";
import jwtService from "../auth/services/jwtService";


export const setUser = createAsyncThunk(
  "user/setUser",
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example '/apps/academy'
    }

    return user;
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  "user/updateShortucts",
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: "/",
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = createAsyncThunk(
  "user",
  async (user, { dispatch, getState }) => {
  
console.log("user", user)
    try {
      const response = null
      if (user.role[0]=== "admin"){
         response = await axios.put(
          `http://localhost:5000/partners/update/${user._id}`,
          user
        );
      }else{
         response = await axios.put(
          `http://localhost:5000/users/update/${user._id}`,
          user
        );
      }
    
      console.log("aa", response);
      const data = await response.data;
      console.log("res", data);
      return data;
    } catch (error) {
      dispatch(showMessage({ message: error.message }));
    }
  }
);

export const updatePartnerPhoto =createAsyncThunk(
  'user/updatePartnerPhoto',
  async ({ urlPhoto, id }, { dispatch, getState }) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.put(`http://localhost:5000/partners/updatePhoto/${id}`, {
        image: urlPhoto,
      });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("error", error)
      throw error;
    }
  }
);
const initialState = {
  firstName: "John",
  lastName: "Doe",
  cin: 0,
  phone: 0,
  password: "123456789",
  photoURL: "assets/images/avatars/brian-hughes.jpg",
  email: "",
  shortcuts: ["apps.calendar"],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.shortcuts;

export default userSlice.reducer;
