import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import _ from "@lodash";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import MenuItem from "@mui/material/MenuItem";
import * as yup from "yup";
import FuseUtils from "@fuse/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { selectUser, updateUserData } from "app/store/userSlice";
import { useSelector } from "react-redux";
import { Autocomplete } from "@mui/material";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";

const schema = yup.object().shape({
  firstName: yup.string().required("You must enter your first name"),
  lastName: yup.string().required("You must enter your last name"),
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  gender: yup
    .string()
    .oneOf(["Male", "Female"], "Please select a valid gender")
    .required("You must select a gender"),
  address: yup.object().shape({
    city: yup.string().required("City is required"),
    governorate: yup.string().required("Governorate is required"),
    country: yup.string().required("Country is required"),
    postalCode: yup
      .number()
      .typeError("Postal Code must be a number")
      .integer("Postal Code must be an integer")
      .required("Postal Code is required"),
  }),
  socialMedia: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^(?:(?:http|https):\/\/)?(?:www\.)?([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)(\/[a-zA-Z0-9_-]+)*$/,
          "Please enter a valid URL"
        )
    )
    .required("You must enter at least one social media link"),
  phone: yup
    .string()
    .matches(
      /^[2-57943]\d{7}$/,
      "Phone number must start with 2, 5, 9, 4, 7, or 3 and must contain exactly 8 digits."
    )
    .required("You must enter a phone number"),
});
function ProfileTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      resolver: yupResolver(schema),
    }
  );
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  useEffect(() => {
    reset({ ...user, password: "" });
  }, [user, reset]);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const handleSiteWeb = (event, newValue) => {
    console.log("new val", newValue);
  };
  const [urlPhoto, setUrlPhot] = useState([]);
  const handelChangePhotos = (newImages) => {
    console.log("dataq", form);
    form.photoURL = newImages;
  };
  !user && <FuseLoading />;
  const p = () => {
    console.log("data", form);
    dispatch(updateUserData(form));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full "
      style={{ width: "100%" }}
    >
      <Card
        className="relative flex flex-col flex-auto items-center px-24 sm:px-48 pt-72"
        component={motion.div}
        variants={item}
      >
        <div className="w-full">
          <div className="flex flex-auto items-end -mt-64">
            <Controller
              control={control}
              name="avatar"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "background.paper",
                  }}
                  className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                >
                  
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label
                        htmlFor="button-avatar"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0]; // Sélectionnez seulement le premier fichier

                            function readFileAsync(file) {
                              return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  resolve({
                                    id: FuseUtils.generateGUID(),
                                    url: `data:${file.type};base64,${btoa(
                                      reader.result
                                    )}`,
                                    type: "image",
                                  });
                                };
                                reader.onerror = reject;
                                reader.readAsBinaryString(file);
                              });
                            }

                            if (selectedFile) {
                              const newImage = await readFileAsync(
                                selectedFile
                              );
                              console.log("dd", newImage);
                              handelChangePhotos(newImage.url);
                            }
                          }}
                        />

                        <FuseSvgIcon className="text-white">
                          heroicons-outline:camera
                        </FuseSvgIcon>
                      </label>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange("");
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: "background.paper",
                      color: "text.secondary",
                    }}
                    className="avatar text-32 font-bold w-96 h-96"
                    src={`http://localhost:5000/partners/${user.photoURL}`}
                    alt={user.firstName}
                  >
                    {user.firstName.charAt(0)}
                  </Avatar>
                </Box>
              )}
            />
          </div>
        </div>

        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="FirstName"
              placeholder="FirstName"
              id="firstName"
              error={!!errors.firstName}
              helperText={errors?.firstName?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="LastName"
              placeholder="LastName"
              id="lastName"
              error={!!errors.lastName}
              helperText={errors?.lastName?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              placeholder="Email"
              variant="outlined"
              className="mt-32"
              fullWidth
              error={!!errors.email}
              helperText={errors?.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="Password"
              type="password"
              placeholder="Password"
              error={!!errors.password}
              helperText={errors?.password?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="Password (Confirm)"
              type="password"
              error={!!errors.passwordConfirm}
              helperText={errors?.passwordConfirm?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="Phone Number"
              placeholder="Phone Number"
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors?.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-outline:phone</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="birthday"
          render={({ field: { value, onChange } }) => (
            <DateTimePicker
              value={new Date(value)}
              onChange={onChange}
              className="mt-32 mb-16 w-full"
              clearable
              slotProps={{
                textField: {
                  id: "birthday",
                  label: "Birthday",
                  InputLabelProps: {
                    shrink: true,
                  },
                  fullWidth: true,
                  variant: "outlined",
                },
                actionBar: {
                  actions: ["clear", "today"],
                },
              }}
              slots={{
                openPickerIcon: () => (
                  <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <TextField
              id="outlined-gender-input"
              className="mt-32 mb-16 w-full"
              select
              label="Gender"
              {...field}
              error={!!errors.gender}
              helperText={errors?.gender?.message}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="socialMedia"
          render={({ field }) => (
            <Autocomplete
              multiple
              id="website-chips"
              className="mt-32 mb-16 w-full"
              freeSolo
              options={
                user.socialMedia && user.socialMedia.length > 0
                  ? user.socialMedia
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...field} // Assurez-vous de passer les propriétés du champ (field) ici
                  label="Social Media"
                  variant="outlined"
                />
              )}
              filterSelectedOptions
              onChange={(event, newValue) => {
                // Mettez à jour la valeur du champ à l'aide de la fonction onChange fournie par react-hook-form
                field.onChange(newValue);
                // Ajoutez votre logique supplémentaire ici si nécessaire
                handleSiteWeb(event, newValue);
              }}
            />
          )}
        />

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "19ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <Controller
              control={control}
              name="address.city"
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-city-input"
                  label="City"
                  type="text"
                  placeholder="City"
                  InputLabelProps={{ shrink: !!field.value }}
                  variant="outlined"
                  fullWidth
                  style={{ marginRight: "8px" }}
                />
              )}
            />

            <Controller
              control={control}
              name="address.governorate"
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-governorate-input"
                  label="Governorate"
                  type="text"
                  placeholder="Governorate"
                  InputLabelProps={{ shrink: !!field.value }}
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            <Controller
              control={control}
              name="address.country"
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-country-input"
                  label="Country"
                  type="text"
                  placeholder="Country"
                  InputLabelProps={{ shrink: !!field.value }}
                  variant="outlined"
                  fullWidth
                  style={{ marginRight: "8px" }}
                />
              )}
            />

            <Controller
              control={control}
              name="address.postalCode"
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-postalCode-input"
                  label="Postal Code"
                  type="number"
                  placeholder="Postal Code"
                  InputLabelProps={{ shrink: !!field.value }}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </Box>

        <Box className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t">
          <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
            Cancel
          </Button>
          <Button
            className="ml-8"
            variant="contained"
            color="secondary"
            onClick={p}
          >
            Save
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}

export default ProfileTab;
