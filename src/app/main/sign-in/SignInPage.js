import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import jwtService from "../../auth/services/jwtService";
import { toast } from "react-toastify";
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Password is too short - must be at least 8 chars."),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function SignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue("email", "", { shouldDirty: true, shouldValidate: true });
    setValue("password", "", { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  async function onSubmit({ email, password, remember }) {
    try {
      const user = await jwtService.signInWithEmailAndPassword(email, password);
      user && navigate("/dashboards/analytics");
      // No need to do anything, user data will be set at app/auth/AuthContext
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg);
      } else if (Array.isArray(error)) {
        error.forEach((errorItem) => {
          setError(errorItem.type, {
            type: "manual",
            message: errorItem.message,
          });
        });
      } else {
        // Si l'erreur n'est pas un tableau (erreur inattendue), vous pouvez la gérer ici
        console.error("Unexpected error:", error);
      }
    }
  }

  const ballContainerStyle = {
    position: "relative",
    width: "100px",
    height: "100px",
  };

  const ballStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    animation: "bounce 2s infinite",
  };

  const bounceKeyframes = {
    "0%, 100%": {
      transform: "translateY(0)",
    },
    "50%": {
      transform: "translateY(-20px)",
    },
  };
  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="flex flex-col md:w-3/5 md:ml-auto">
          <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
            <div style={ballContainerStyle}>
              <img
                style={ballStyle}
                src="assets/images/logo/ballon.png"
                alt="Ballon de football"
              />
            </div>

            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
              Sign in
            </Typography>
            <div className="flex items-baseline mt-2 font-medium">
              <Typography>Don't have an account?</Typography>
              <Link className="ml-4" to="/sign-up">
                Sign up
              </Link>
            </div>

            <form
              name="loginForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Email"
                    autoFocus
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Remember me"
                      control={<Checkbox size="small" {...field} />}
                    />
                  </FormControl>
                )}
              />

                <Link className="text-md font-medium" to="/forgotPassword">
                  Forgot password?
                </Link>
              </div>

              <Button
                variant="contained"
                color="secondary"
                className=" w-full mt-16"
                aria-label="Sign in"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
              >
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{
          backgroundImage: `url(assets/images/apps/singIn/backgroundImageSingIn.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: "primary.light" }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>
      </Box>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px); /* Ajustez la hauteur de rebondissement selon vos besoins */
            }
          }
        `}
      </style>
    </div>
  );
}

export default SignInPage;
