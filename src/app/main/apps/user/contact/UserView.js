import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/system/Box";
import format from "date-fns/format";
import _ from "@lodash";
import { getContact, selectContact } from "../store/contactSlice";


const UserView = () => {
  const contact = useSelector(selectContact);

  const routeParams = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getContact(routeParams.id));
  }, [dispatch, routeParams]);

  if (!contact) {
    return <FuseLoading />;
  }
console.log("photo", contact.photoURL)
  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: "background.default",
        }}
      >
        
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src="/assets/images/apps/contacts/22-640x480.jpg"
            alt="user background"
          />
   
      </Box>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex flex-auto items-end -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: "background.paper",
                backgroundColor: "background.default",
                color: "text.secondary",
              }}
              className="w-128 h-128 text-64 font-bold"
              src={contact.photoURL}
              alt={contact.firstName}
            >
              {contact.firstName.charAt(0)}
            </Avatar>
            <div className="flex items-center ml-auto mb-4">
              <Button
                variant="contained"
                color="secondary"
                component={NavLinkAdapter}
                to="edit"
              >
                <FuseSvgIcon size={20}>
                  heroicons-outline:pencil-alt
                </FuseSvgIcon>
                <span className="mx-8">Edit</span>
              </Button>
            </div>
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">
            {contact.firstName}
          </Typography>

          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            {contact.firstName && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
                <div className="ml-24 leading-6">
                  {contact.firstName} {contact.lastName}
                </div>
              </div>
            )}

            <div className="flex items-center leading-6">
              <Box
                className="hidden sm:flex w-24 h-16 overflow-hidden"
                sx={{
                  background:
                    "url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
                  backgroundSize: "24px 3876px",
                }}
              />

              <div className="ml-10 font-mono">{contact.gender}</div>
            </div>

            <div className="flex items-center leading-6">
              <a
                className="hover:underline text-primary-500"
                href={`mailto: ${contact.email}`}
                target="_blank"
                rel="noreferrer"
              >
                {contact.email}
              </a>
            </div>

            <div className="flex items-center leading-6">
              <Box
                className="hidden sm:flex w-24 h-16 overflow-hidden"
                sx={{
                  background:
                    "url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
                  backgroundSize: "24px 3876px",
                }}
              />

              <div className="ml-10 font-mono">{contact.phone}</div>
            </div>

           

            {contact.birthday && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
                <div className="ml-24 leading-6">
                  {format(new Date(contact.birthday), "MMMM d, y")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserView;
