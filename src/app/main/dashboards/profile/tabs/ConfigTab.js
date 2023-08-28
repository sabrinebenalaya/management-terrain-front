import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem"; // N'oubliez pas cette importation également
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Controller, useForm } from "react-hook-form";

function ConfigTab() {
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(0);


  const handleStartDayChange = (event) => {
    setStartDay(event.target.value);
  };

  const handleEndDayChange = (event) => {
    setEndDay(event.target.value);
  };

  const handleStartHourChange = (event) => {
    setStartHour(event.target.value);
  };

  const handleEndHourChange = (event) => {
    setEndHour(event.target.value);
  };

  const dirtyFields = {
   startDay,
    endDay,
   startHour,
    endHour,
  };

  const areAllFieldsFilled = Object.values(dirtyFields).every((value) => value);

  const handleSubmit =()=>{
      console.log("dirtyFields", dirtyFields)
  

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
    >
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="px-32 pt-24">
              <Typography className="text-2xl font-semibold leading-tight">
                Planning
              </Typography>
            </div>
            <div className="md:flex justify-center"> {/* Changed flex class to justify-center */}
        <div className="md:flex">
          <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
            <CardContent className="px-32 py-24">
              <form   >
                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">
                    We are available From :{" "}
                  </Typography>
                </div>

                <div className="mb-24">
                  <Typography className="text-2xl font-semibold leading-tight">
                    Days :
                  </Typography>
                  <Typography className="text-2xl font-semibold leading-tight">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        From
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="startDay"
                        value={startDay}
                        onChange={handleStartDayChange}
                      >
                        <MenuItem value="monday">Monday</MenuItem>
                        <MenuItem value="Tuesday">Tuesday</MenuItem>
                        <MenuItem value="Wednesday">Wednesday</MenuItem>
                        <MenuItem value="Thursday">Thursday</MenuItem>
                        <MenuItem value="Friday">Friday</MenuItem>
                        <MenuItem value="Saturday">Saturday</MenuItem>
                        <MenuItem value="Sunday">Sunday</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        To
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="endDay"
                        value={endDay}
                        onChange={handleEndDayChange}
                      >
                        <MenuItem value="monday">Monday</MenuItem>
                        <MenuItem value="Tuesday">Tuesday</MenuItem>
                        <MenuItem value="Wednesday">Wednesday</MenuItem>
                        <MenuItem value="Thursday">Thursday</MenuItem>
                        <MenuItem value="Friday">Friday</MenuItem>
                        <MenuItem value="Saturday">Saturday</MenuItem>
                        <MenuItem value="Sunday">Sunday</MenuItem>
                      </Select>
                    </FormControl>
                  </Typography>
                </div>

                <div className="mb-24">
                  <Typography className="text-2xl font-semibold leading-tight">
                    Hours:
                  </Typography>
                  <Typography className="text-2xl font-semibold leading-tight">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        From
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="startHour"
                        value={startHour}
                        onChange={handleStartHourChange}
                      >
                        {Array.from({ length: 24 }, (_, index) => (
                          <MenuItem key={index} value={index}>
                            {index}:00
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        To
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="endHour"
                        value={endHour}
                        onChange={handleEndHourChange}
                      >
                        {Array.from({ length: 24 }, (_, index) => (
                          <MenuItem key={index} value={index}>
                            {index}:00
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Typography>
                </div>

                <div className="mb-24"> 
                 <Button
                variant="contained"
                color="secondary"
                className="w-full mt-24"
                aria-label="Configuration"
                disabled={!areAllFieldsFilled}
                type="submit"
                size="large"
                onClick={handleSubmit}
              >
                Configuration
              </Button></div>
              </form>
            </CardContent>
            </div></div></div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default ConfigTab; 
