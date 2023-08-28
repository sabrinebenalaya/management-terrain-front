
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { selectUser } from "app/store/userSlice";
import { useSelector } from "react-redux";

function ProfileTab() {
  const [data, setData] = useState(null);
  const user = useSelector(selectUser);
  useEffect(() => {
    setData(user);
  }, [data]);

  if (!data) {
    return null;
  }

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
      style={{ width: "100%" }}
    >
      <div className="md:flex">
        <div className="flex flex-col w-full">
          <CardContent className="p-0">
            <Card
              component={motion.div}
              variants={item}
              className="w-full mb-32"
            >
              <div className="px-32 pt-24">
                <Typography className="text-2xl font-semibold leading-tight">
                  General Information
                </Typography>
              </div>

              <CardContent className="px-32 py-24">
                {data && data.firstName && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      First Name
                    </Typography>
                    <Typography>{data.firstName}</Typography>
                  </div>
                )}

                {data && data.lastName && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Last Name
                    </Typography>
                    <Typography>{data.lastName}</Typography>
                  </div>
                )}

                {data && data.gender && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Gender
                    </Typography>
                    <Typography>{data.gender}</Typography>
                  </div>
                )}

                {data && data.birthday && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Birthday
                    </Typography>
                    <Typography>{data.birthday}</Typography>
                  </div>
                )}

                {data && data.cin && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      CIN
                    </Typography>
                    <Typography>{data.cin}</Typography>
                  </div>
                )}

                {data && data.email && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Email
                    </Typography>
                    <Typography>{data.email}</Typography>
                  </div>
                )}
                {data && data.phone && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Phone
                    </Typography>
                    <Typography>{data.phone}</Typography>
                  </div>
                )}

                {data && data.address && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Locations
                    </Typography>
                    <Typography>
                      {data.address.city}, {data.address.governorate},{" "}
                      {data.address.country}, {data.address.postalCode}
                    </Typography>
                  </div>
                )}

                {data && data.socialMedia && data.socialMedia.length > 0  && (
                  <div className="mb-24">
                    <Typography className="font-semibold mb-4 text-15">
                      Social Media
                    </Typography>
                    <Typography>
                      {data.socialMedia.map((website) => (
                        <div className="flex items-center" key={website}>
                          <Typography>{website}</Typography>
                        </div>
                      ))}
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileTab;
