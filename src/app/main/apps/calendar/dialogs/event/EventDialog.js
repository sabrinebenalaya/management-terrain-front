import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import FuseUtils from "@fuse/utils/FuseUtils";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import _ from "@lodash";
import { Popover } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  getfields,
  addEvent,
  closeEditEventDialog,
  closeNewEventDialog,
  removeEvent,
  selectEventDialog,
  updateEvent,
} from "../../store/eventsSlice";
import EventLabelSelect from "../../EventLabelSelect";
import EventModel from "../../model/EventModel";
import { selectFirstLabelId } from "../../store/labelsSlice";

import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";

const defaultValues = EventModel();
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
// import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required("You must enter a title"),
});

function TerrainRadio({ FieldData,zontroller }) {
  // State to hold the selected radio value
  const [selectedRadioValue, setSelectedRadioValue] = useState(
    Object.values(FieldData)[0]
  );

  // Function to handle the change in the selected radio value
  const handleRadioChange = (event) => {
    setSelectedRadioValue(event.target.value);
    console.log("clicked! on  " + event.target.value);
    // this.setState({ phone: event.target.value });
    // set phone
  };

  return (
    <div className="flex sm:space-x-0 mb-16">
      <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
        heroicons-outline:radio
      </FuseSvgIcon>
      <Controller
        name="terrain"
        control={zontroller}
        defaultValue={Object.values(FieldData)[0]}
        render={({ field }) => (
          <RadioGroup
            {...field}
            name="terrain"
            // defaultValue={Object.values(FieldData)[0]}
            // value={selectedRadioValue}
            value={field.value === null ? Object.values(FieldData)[0] : field.value } // Use the field value from Controller to set the selected radio value
            // onChange={handleRadioChange}
          >
            {Object.keys(FieldData).map((key) => (
              <FormControlLabel
                key={key}
                value={FieldData[key]}
                control={<Radio />}
                label={FieldData[key] + key}
              />
            ))}
            {/* Add more radio options as needed */}
          </RadioGroup>
        )}
      />
    </div>
  );
}

function EventDialog(props) {
  const dispatch = useDispatch();
  const eventDialog = useSelector(selectEventDialog);
  const firstLabelId = useSelector(selectFirstLabelId);
  var Fielddict = {
    1: "value1",
    2: "value2",
    3: "value3",
    4: "value4",
    5: "value5",
    // etc.
  };
  const { reset, formState, watch, control, getValues } = useForm({
    defaultValues: {
      ...defaultValues,
      terrain: Object.values(Fielddict)[0], // Set the default value for the terrain field
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const start = watch("start");
  const end = watch("end");
  const id = watch("id");
  const phone = watch("phone");

  // Object literal with properties


  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (eventDialog.type === "edit" && eventDialog.data) {
      reset({ ...eventDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (eventDialog.type === "new") {
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
  }, [eventDialog.data, eventDialog.type, reset]);

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
    return eventDialog.type === "edit"
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
    if (eventDialog.type === "new") {
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
  const timeFormat = "HH:mm";
  return (
    <Popover
      {...eventDialog.props}
      anchorReference="anchorPosition"
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      onClose={closeComposeDialog}
      component="form"
    >
      <div className="flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-640">
        <Grid container spacing={1}>
          <Grid item xs={4}>
            {/* Add the RadioGroup and Radio components here */}
            {/* <TerrainRadio FieldData={dispatch(getfields())} /> */}
            <TerrainRadio FieldData={Fielddict} zontroller={control}/>
          </Grid>
          <Grid item xs={8}>
            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon
                className="hidden sm:inline-flex mt-16"
                color="action"
              >
                heroicons-outline:pencil-alt
              </FuseSvgIcon>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="title"
                    label="Title"
                    className="flex-auto"
                    error={!!errors.title}
                    helperText={errors?.title?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    autoFocus
                    required
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon
                className="hidden sm:inline-flex mt-16"
                color="action"
              >
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
                            label: "Start",
                            variant: "outlined",
                          },
                        }}
                        maxDate={end}
                        format={timeFormat} // Set the format prop to the desired time format.
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
                            label: "End",
                            variant: "outlined",
                          },
                        }}
                        minDate={start}
                        format={timeFormat} // Set the format prop to the desired time format.
                      />
                    )}
                  />
                </div>

                {/* <Controller
              name="allDay"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  className="mt-8"
                  label="All Day"
                  control={
                    <Switch
                      onChange={(ev) => {
                        onChange(ev.target.checked);
                      }}
                      checked={value}
                      name="allDay"
                    />
                  }
                />
              )}
            /> */}
              </div>
            </div>

            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon
                className="hidden sm:inline-flex mt-16"
                color="action"
              >
                heroicons-outline:tag
              </FuseSvgIcon>

              <Controller
                name="extendedProps.label"
                control={control}
                render={({ field }) => (
                  <EventLabelSelect className="mt-8 mb-16" {...field} />
                )}
              />
            </div>

            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon
                className="hidden sm:inline-flex mt-16"
                color="action"
              >
                heroicons-outline:phone
              </FuseSvgIcon>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="phone"
                    label="Phone"
                    className="flex-auto"
                    error={!!errors.title}
                    helperText={errors?.title?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    autoFocus
                    required
                    fullWidth
                  />
                )}
              />
              <IconButton
                aria-label="Search"
                onClick={handleButtonClick}
                style={{ marginTop: "8px" }}
              >
                <SearchIcon />
              </IconButton>
              {/* <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
            heroicons-outline:menu-alt-2
          </FuseSvgIcon> */}
              {/* <Controller
            name="extendedProps.desc"
            control={control}
            render={({ field }) => 
              <TextField
                {...field}
                className="mt-8 mb-16"
                id="desc"
                label="Description"
                type="text"
                multiline
                rows={5}
                variant="outlined"
                fullWidth
              />
            )}
          /> */}
            </div>
          </Grid>
        </Grid>
        {eventDialog.type === "new" ? (
          <div className="flex items-center space-x-8">
            <div className="flex flex-1" />
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={_.isEmpty(dirtyFields) || !isValid}
            >
              Add
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-8">
            <div className="flex flex-1" />
            <IconButton onClick={handleRemove} size="large">
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={_.isEmpty(dirtyFields) || !isValid}
            >
              Save
            </Button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          {/* Display the "Hello World" message based on the state */}
          <div style={{ minHeight: "150px" }}>
            {showHelloWorld && <div>Hello World</div>}
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default EventDialog;