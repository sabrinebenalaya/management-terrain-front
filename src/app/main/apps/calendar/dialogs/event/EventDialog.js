import { useState, useCallback, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import FuseUtils from "@fuse/utils/FuseUtils";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import _ from "@lodash";
import { Popover } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import RadioGroup from "@mui/material/RadioGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Radio from "@mui/material/Radio";
import Grid from "@mui/material/Grid";
import { selectUser } from "app/store/userSlice";
import classnames from "classnames";
import {
  addEvent,
  closeEditEventDialog,
  closeNewEventDialog,
  getAllRrservationInThisDate,
  removeEvent,
  selectEventDialog,
  selectReservationsWithDate,
  updateEvent,
} from "../../store/eventsSlice";
import EventModel from "../../model/EventModel";
import { selectFirstLabelId } from "../../store/labelsSlice";
import {
  getTerrains,
  selectALLTerrains,
} from "../../../terrains/store/terrainsSlice";
import { dayCalendarSkeletonClasses } from "@mui/x-date-pickers";

const defaultValues = EventModel();

const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(
      /^[2-57943]\d{7}$/,
      "Phone number must start with 2, 5, 9, 4, 7, or 3 and must contain exactly 8 digits."
    )
    .required("You must enter a phone number"),
});

function EventDialog(props) {
  const dispatch = useDispatch();

  const eventDialog = useSelector(selectEventDialog);
  const firstLabelId = useSelector(selectFirstLabelId);
  const user = useSelector(selectUser);
  const ListOfTerrain = useSelector(selectALLTerrains) || [];
  const ReservationsWithDate = useSelector(selectReservationsWithDate);
  const partner = useSelector(selectUser);

 
  const [isPhoneFilled, setIsPhoneFilled] = useState(false);
  const [selectedTerrainId, setSelectedTerrainId] = useState("");
  const [showHelloWorld, setShowHelloWorld] = useState(false);
  const [idReservation, setIdReservation] = useState("");
  const [btneditsave, setBtnEditSave] = useState("Save");
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      defaultValues: {
        ...defaultValues,
        terrain: Object.values(ListOfTerrain)[0],
      },
      mode: "onChange",
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const start = watch("start");
  const end = watch("end");
  let reservationOfIdTerrain = {};
  const timeFormat = "HH:mm";

  useEffect(() => {

    dispatch(getTerrains(user._id));
    dispatch(getAllRrservationInThisDate({ start, end }));
   

  }, [dispatch, start, end, user._id]);

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
    dispatch(getAllRrservationInThisDate({ start, end }));
  }, [eventDialog.data, eventDialog.type, firstLabelId, reset]);

  useEffect(() => {
    if (eventDialog.props.open) {
      initDialog();
    }
  }, [eventDialog.props.open, initDialog]);

  function closeComposeDialog() {
    return eventDialog.type === "edit"
      ? dispatch(closeEditEventDialog())
      : dispatch(closeNewEventDialog());
  }

  /**
   * Form Submit
   */
  async function eventSubmit(data) {
    data.terrain = selectedTerrainId;
    data.partner = partner._id;
    data.confirmation = true;

    if (btneditsave === "Save") {
      console.log("data",data)
      dispatch(addEvent(data));
    } else {
      data._id = data.extendedProps._id;

      dispatch(updateEvent({ ...eventDialog.data, ...data }));
    }

    setBtnEditSave("Edit");
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  async function handleRemove() {
    dispatch(removeEvent(idReservation));
    setBtnEditSave("Save");
    setSelectedPhone("");
    closeComposeDialog();
    
  }

  // Function to handle the button click and toggle the visibility of the message
  const handleButtonClick = () => {
    //
    setShowHelloWorld(!showHelloWorld);
  };

  const idTerrain = ListOfTerrain[0]?._id ?? "";


  const handleReservationChange = (selectedId) => {
    console.log("selectedId", selectedId);

    // determiner s'il ya une reservation pour id selected ou non
    reservationOfIdTerrain = ReservationsWithDate.find(
      (reservation) => reservation.terrain === selectedId
    );
   const ReservationId = reservationOfIdTerrain?._id ?? ""
 //  console.log("ReservationId", ReservationId, "trouver pour ",selectedId);

    // recuperer le numero de phone s 'il ya de reservation
    const phoneReservation = reservationOfIdTerrain
      ? reservationOfIdTerrain.phone
      : "";
   console.log("phoneReservation", phoneReservation, "trouver pour la reservation id ",ReservationId, "lie a terrain", selectedId);
    
   // mettre à jour le contenue de la bouton
    const btnName = phoneReservation ? "Edit" : "Save";

    return { phoneReservation, btnName, ReservationId };
  };

  const [selectedPhone, setSelectedPhone] = useState("");
 console.log("selectedPhone", selectedPhone) 

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
        <IconButton
          className="absolute top-0 right-0 my-6 mx-4 z-10"
          sx={{ color: "black" }}
          size="large"
          onClick={closeComposeDialog}
        >
          <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
        </IconButton>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <div className={classnames("flex sm:space-x-0 mb-16")}>
              <FuseSvgIcon
                className="hidden sm:inline-flex mt-16"
                color="action"
              >
                heroicons-outline:radio
              </FuseSvgIcon>

              <Controller
                name="selectedTerrain"
                control={control}
                defaultValue={idTerrain}
                render={({ field: { value, onChange } }) => {
                  const { phoneReservation, btnName, ReservationId } = handleReservationChange(value);
                  useEffect(() => {
       
                    setSelectedPhone(phoneReservation);
                    setBtnEditSave(btnName);
                    setIdReservation(ReservationId);
                  }, [value]);
                  return (
                    <RadioGroup
                      value={value} // La valeur actuelle est définie ici
                      onChange={(e) => {   onChange(e);
                      
                      }}
                    >
                      {ListOfTerrain.map((terrain) => {
                        const isReserved = ReservationsWithDate.some((reservation) => {
                          return (
                            reservation.terrain === terrain._id &&
                            ((reservation.start >= start && reservation.start < end) ||
                              (reservation.end > start && reservation.end <= end))
                          );
                        });

                        return (
                          <FormControlLabel
                            key={terrain._id}
                            value={terrain._id}
                            control={<Radio />}
                            label={terrain.name}
                            className={isReserved ? 'text-red-500' : ''}
                          />
                        );
                      })}
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </Grid>

          <Grid item xs={8}>
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
                            label: "End",
                            variant: "outlined",
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
                    type="number"
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
                    value={field.value || selectedPhone ||""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setIsPhoneFilled(!!e.target.value); // Met à jour l'état lorsque le champ change
                    }}
                  />
                )}
              />

              <IconButton
                aria-label="Search"
                onClick={handleButtonClick}
                style={{ marginTop: "8px" }}
                disabled={!isPhoneFilled || (!!errors.phone && selectedPhone)} // Désactive l'icône si le champ "phone" n'est pas rempli ou s'il y a des erreurs
              >
                <SearchIcon />
              </IconButton>
            </div>
            {showHelloWorld && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                Ce numéro a confirmé réservations et annulé reservations
              </div>
            )}
          </Grid>
        </Grid>

        <div className="flex items-center space-x-8">
          <div className="flex flex-1" />
          <Button
            className="ml-8"
            variant="contained"
            onClick={handleRemove}
            title="Supprimer"
            disabled={btneditsave === "Save"}
          >
            <DeleteIcon /> {/* Ajoutez votre icône ici */}
          </Button>

          <Button
            className="ml-8"
            variant="contained"
            color="secondary"
            onClick={handleSubmit(eventSubmit)}
          >
            {btneditsave}
          </Button>
        </div>
      </div>
    </Popover>
  );
}

export default EventDialog;
