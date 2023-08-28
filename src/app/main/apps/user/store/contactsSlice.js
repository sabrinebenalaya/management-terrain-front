import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { addContact, removeContact, updateContact } from './contactSlice';

export const getContacts = createAsyncThunk(
  'contactsApp/contacts/getContacts',
  async (id, { getState }) => {
    const response = await axios.get(`http://localhost:5000/users/getUsers/${id}`);

    const data = await response.data;

    return { data };
  }
);

const contactsAdapter = createEntityAdapter({
  selectId: (contact) => contact._id,
}); 

export const selectSearchText = ({ contactsApp }) => contactsApp.contacts.searchText;

export const { selectAll: selectContacts, selectById: selectContactsById } =
  contactsAdapter.getSelectors((state) => state.contactsApp.contacts);

export const selectFilteredContacts = createSelector(
  [selectContacts, selectSearchText],
  (contacts, searchText) => {
    if (searchText.length === 0) {
      return contacts;
    }
    return FuseUtils.filterArrayByString(contacts, searchText);
  }
);

export const selectGroupedFilteredContacts = createSelector(
  [selectFilteredContacts],
  (contacts) => {
    if (!contacts) {
      return {}; 
    }

    return contacts
      .sort((a, b) => {
        const firstNameA = a.firstName || ''; // Utilisation d'une chaîne vide comme valeur par défaut si firstName est undefined
        const firstNameB = b.firstName || ''; // Utilisation d'une chaîne vide comme valeur par défaut si firstName est undefined
        return firstNameA.localeCompare(firstNameB, 'es', { sensitivity: 'base' });
      })
      .reduce((r, e) => {
        const group = (e.firstName && e.firstName[0]) || ''; // Utilisation d'une chaîne vide comme valeur par défaut si firstName est undefined
        if (!r[group]) r[group] = { group, children: [e] };
        else r[group].children.push(e);
        return r;
      }, {});
  }
);



const contactsSlice = createSlice({
  name: 'contactsApp/contacts',
  initialState: contactsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateContact.fulfilled]: contactsAdapter.upsertOne,
    [addContact.fulfilled]: contactsAdapter.addOne,
    [removeContact.fulfilled]: (state, action) => contactsAdapter.removeOne(state, action.payload),
    [getContacts.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      contactsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setContactsSearchText } = contactsSlice.actions;

export default contactsSlice.reducer;
