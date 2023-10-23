import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useState } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import ConfigTab from "./tabs/ConfigTab";
import EditProfileTab from "./tabs/EditProfileTab";
import ProfileTab from "./tabs/ProfileTab";
import useThemeMediaQuery from "../../../../@fuse/hooks/useThemeMediaQuery";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    "& > .container": {
      maxWidth: "100%",
    },
  },
}));

function ProfileApp() {
  const user = useSelector(selectUser);

  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }
  async function handleSubmit(profileData) {
    try {
      // eslint-disable-next-line no-undef
      const profil = await axios.post(
        `http://localhost:5000/partners/update/${user._id}`,
        profileData
      );
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
        console.error("Unexpected error:", error);
      }
    }
  }
  return (
    <Root
      header={
        <div className="flex flex-col">
          <img
            className="h-160 lg:h-320 object-cover object-none w-full"
            src="assets/images/apps/singIn/backgroundImageSingIn.jpg"
            alt="Profile Cover"
          />

          <div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
            <div className="-mt-96 lg:-mt-88 rounded-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.1 } }}
              >
                <Avatar
                  sx={{ borderColor: "background.paper" }}
                  className="w-128 h-128 border-4"
                  src={`http://localhost:5000/partners/${user.photoURL}`}
                  alt="User avatar"
                />
              </motion.div>
            </div>

            <div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
              <Typography className="text-lg font-bold leading-none">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="text.secondary"> {user.email}</Typography>
            </div>

            <div className="hidden lg:flex h-32 mx-32 border-l-2" />

            <div className="flex flex-1 justify-end my-16 lg:my-0">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{
                  indicator: "flex justify-center bg-transparent w-full h-full",
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: "text.disabled" }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Profil"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Configuration"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Edit"
                />
              </Tabs>
            </div>
          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full max-w-5xl mx-auto p-24 sm:p-32">
          {selectedTab === 0 && <ProfileTab />}
          {selectedTab === 1 && <ConfigTab />}
          {selectedTab === 2 && <EditProfileTab handleSubmit={handleSubmit} />}
        </div>
      }
      scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default ProfileApp;
