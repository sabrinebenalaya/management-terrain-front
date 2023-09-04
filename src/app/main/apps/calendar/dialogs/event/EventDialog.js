import { useState, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import FuseUtils from '@fuse/utils/FuseUtils';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import _ from '@lodash';
import { Popover } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import RadioGroup from '@mui/material/RadioGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import { selectUser } from 'app/store/userSlice';
import classnames from 'classnames';

import {
  addEvent,
  closeEditEventDialog,
  closeNewEventDialog,
  getAllRrservationInThisDate,
  removeEvent,
  selectEventDialog,
  selectReservationsWithDate,
  updateEvent,
} from '../../store/eventsSlice';

import EventModel from '../../model/EventModel';
import { selectFirstLabelId } from '../../store/labelsSlice';
import { getTerrains, selectALLTerrains } from '../../../terrains/store/terrainsSlice';



const defaultValues = EventModel();
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(
      /^[2-57943]\d{7}$/,
      'Phone number must start with 2, 5, 9, 4, 7, or 3 and must contain exactly 8 digits.'
    )
    .required('You must enter a phone number'),
});

function EventDialog(props) {
  const dispatch = useDispatch();
  const eventDialog = useSelector(selectEventDialog);
  const firstLabelId = useSelector(selectFirstLabelId);
  const user = useSelector(selectUser);
  const ListOfTerrain = useSelector(selectALLTerrains) || [];

  const ReservationsWithDate = useSelector(selectReservationsWithDate);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();
  const start = watch("start");
  const end = watch("end");
  const id = watch("_id");
  const phone = watch("phone");

  useEffect(() => {
    // Appeler l'action pour récupérer la liste des terrains
    dispatch(getTerrains(user._id));
    dispatch(getAllRrservationInThisDate(start, end))
    
  }, [dispatch, start, end]);

  console.log("ReservationsWithDate", ReservationsWithDate)
  // Object literal with properties

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (eventDialog.type === 'edit' && eventDialog.data) {
      reset({ ...eventDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (eventDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...eventDialog.data,
        extendedProps: {
          ...defaultValues.extendedProps,
          label: firstLabelId,
        },
        id: FuseUtils.generateGUID(),
      });
    }
  }, [eventDialog.data, eventDialog.type, firstLabelId, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (eventDialog.props.open) {
      initDialog();
    }
  }, [eventDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return eventDialog.type === 'edit'
      ? dispatch(closeEditEventDialog())
      : dispatch(closeNewEventDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(ev) {
    ev.preventDefault();
    const data = getValues();
    console.log(data);
    if (eventDialog.type === 'new') {
      dispatch(addEvent(data));
    } else {
      dispatch(updateEvent({ ...eventDialog.data, ...data }));
    }
    closeComposeDialog();
  }

  // State to manage the visibility of the "Hello World" message
  const [showHelloWorld, setShowHelloWorld] = useState(false);

  // Function to handle the button click and toggle the visibility of the message
  const handleButtonClick = () => {
    setShowHelloWorld(!showHelloWorld);
  };

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeEvent(id));
    closeComposeDialog();
  }
  const timeFormat = 'HH:mm';
  const [selectedPhone, setSelectedPhone] = useState('');
  
  const [selectedTerrainId, setSelectedTerrainId] = useState(''); 
  return (
    <Popover
      {...eventDialog.props}
      anchorReference="anchorPosition"
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      onClose={closeComposeDialog}
      component="form"
    >
      <div className="flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-640">
        <Grid container spacing={1}>
        <Grid item xs={4}>
        {/* Liste des terrains */}
        {ListOfTerrain.map((terrain) => {
          // Vérifiez si le terrain est réservé dans ReservationsWithDate
          const isReserved = ReservationsWithDate.some((reservation) => reservation.terrain === terrain._id);

          return (
            <div
              className={classnames('flex sm:space-x-0 mb-16', {
                'text-red-500': isReserved, // Appliquez la classe de couleur rouge si le terrain est réservé
              })}
              key={terrain._id}
            >
              <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
                heroicons-outline:radio
              </FuseSvgIcon>
              <Controller
                name="terrain"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={(event) => {
                      const idTerrain = event.target.value;
                      const selectedReservation = ReservationsWithDate.find(
                        (reservation) => reservation.terrain === idTerrain
                      );
                      const phoneReservation = selectedReservation
                        ? selectedReservation.phone
                        : '';
                          setSelectedTerrainId(idTerrain);
                          setSelectedPhone(phoneReservation);
              
                      field.onChange(phoneReservation);
                    }}

                  >
                    <FormControlLabel
                      key={terrain._id}
                      value={terrain._id}
                      control={<Radio />}
                      label={terrain.name}
                      checked={terrain._id === selectedTerrainId} 
                    />
                  </RadioGroup>
                )}
              />
            </div>
          );
          
        })}
      </Grid>
          <Grid item xs={8}>
            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
                heroicons-outline:calendar
              </FuseSvgIcon>
              <div className="w-full">
                <div className="flex flex-column sm:flex-row w-full items-center space-x-16">
                  <Controller
                    name="start"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        className="mt-8 mb-16 w-full"
                        value={new Date(value)}
                        onChange={onChange}
                        slotProps={{
                          textField: {
                            label: 'Start',
                            variant: 'outlined',
                          },
                        }}
                        maxDate={end}
                        format={timeFormat}
                      />
                    )}
                  />

                  <Controller
                    name="end"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        className="mt-8 mb-16 w-full"
                        value={new Date(value)}
                        onChange={onChange}
                        slotProps={{
                          textField: {
                            label: 'End',
                            variant: 'outlined',
                          },
                        }}
                        minDate={start}
                        format={timeFormat} 
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
                heroicons-outline:phone
              </FuseSvgIcon>
              <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="phone"
                      type='number'
                      label="Phone"
                      className="flex-auto"
                      error={!!errors.phone}
                      helperText={errors?.phone?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      autoFocus
                      required
                      fullWidth
                      value={selectedPhone} 
                    />
                  )}
                />
              <IconButton
                aria-label="Search"
                onClick={handleButtonClick}
                style={{ marginTop: '8px' }}
              >
                <SearchIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>

        {eventDialog.type === 'new' ? (
          <div className="flex items-center space-x-8">
            <div className="flex flex-1" />
            <Button
              className="ml-8"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={onSubmit}
            >
              Delete
            </Button>
            <Button className="ml-8" variant="contained" color="error" onClick={onSubmit}>
              Cancel
            </Button>
            <Button className="ml-8" variant="contained" color="secondary" onClick={onSubmit}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-8">
            <div className="flex flex-1" />
            <IconButton onClick={handleRemove} size="large">
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </IconButton>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Save
            </Button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          {/* Display the "Hello World" message based on the state */}
          <div style={{ minHeight: '150px' }}>{showHelloWorld && <div>Hello World</div>}</div>
        </div>
      </div>
    </Popover>
  );
}

export default EventDialog;
