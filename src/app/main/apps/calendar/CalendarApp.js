import { styled, useTheme } from "@mui/material/styles";
import withReducer from "app/store/withReducer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { selectUser } from "app/store/userSlice";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FusePageSimple from "@fuse/core/FusePageSimple";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import CalendarHeader from "./CalendarHeader";
import EventDialog from "./dialogs/event/EventDialog";
import reducer from "./store";
import {
  getEvents,
  openEditEventDialog,
  openNewEventDialog,
  selectFilteredEvents,
  updateEvent,
  removeEvent,
} from "./store/eventsSlice";
import { getLabels, selectLabels } from "./store/labelsSlice";
import LabelsDialog from "./dialogs/labels/LabelsDialog";
import CalendarAppSidebar from "./CalendarAppSidebar";
import CalendarAppEventContent from "./CalendarAppEventContent";
import { selectALLTerrains } from "../terrains/store/terrainsSlice";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& a": {
    color: `${theme.palette.text.primary}!important`,
    textDecoration: "none!important",
  },
  "&  .fc-media-screen": {
    minHeight: "100%",
    width: "100%",
  },
  "& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th": {
    borderColor: `${theme.palette.divider}!important`,
  },
  "&  .fc-scrollgrid-section > td": {
    border: 0,
  },
  "& .fc-daygrid-day": {
    "&:last-child": {
      borderRight: 0,
    },
  },
  "& .fc-col-header-cell": {
    borderWidth: "0 1px 0 1px",
    padding: "8px 0 0 0",
    "& .fc-col-header-cell-cushion": {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      textTransform: "uppercase",
    },
  },
  "& .fc-view ": {
    "& > .fc-scrollgrid": {
      border: 0,
    },
  },
  "& .fc-daygrid-day.fc-day-today": {
    backgroundColor: "transparent!important",
    "& .fc-daygrid-day-number": {
      borderRadius: "100%",
      backgroundColor: `${theme.palette.secondary.main}!important`,
      color: `${theme.palette.secondary.contrastText}!important`,
    },
  },
  "& .fc-daygrid-day-top": {
    justifyContent: "center",

    "& .fc-daygrid-day-number": {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 26,
      height: 26,
      margin: "4px 0",
      borderRadius: "50%",
      float: "none",
      lineHeight: 1,
    },
  },
  "& .fc-h-event": {
    background: "initial",
  },
  "& .fc-event": {
    border: 0,
    padding: "0 ",
    fontSize: 12,
    margin: "0 6px 4px 6px!important",
  },
  //this section for grid size
  ".fc .fc-timegrid-slot": {
    borderBottom: "0px",
    height: "3.5em",
    // width: '10em',
    // height: '7em',
  },
}));

function CalendarApp(props) {
  const [currentDate, setCurrentDate] = useState();
  const dispatch = useDispatch();
  const events = useSelector(selectFilteredEvents);

  const calendarRef = useRef();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const theme = useTheme();
  const labels = useSelector(selectLabels);
  const partner = useSelector(selectUser);
  useEffect(() => {
    dispatch(getEvents(partner._id));
    dispatch(getLabels());
  }, [dispatch]);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Correct calendar dimentions after sidebar toggles
    setTimeout(() => {
      calendarRef.current?.getApi()?.updateSize();
    }, 200);
  }, [leftSidebarOpen]);

  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;
    dispatch(openNewEventDialog(selectInfo));
  };

  const handleEventDrop = (eventDropInfo) => {
    const { id, title, start, end, extendedProps } = eventDropInfo.event;
    dispatch(
      updateEvent({
        id,
        title,
        // allDay,
        start,
        end,
        extendedProps,
      })
    );
  };
  const handleEventClick = (clickInfo) => {
    dispatch(openEditEventDialog(clickInfo));
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  const handleEventAdd = (addInfo) => {};

  const handleEventChange = (changeInfo) => {
    eventBackgroundColor = "yellow";
  };

  const handleEventRemove = (removeInfo) => {
    console.log("removed", removeInfo);
    const eventId = removeInfo.event.id;
    dispatch(removeEvent(eventId));
    console.log("eventId", eventId);
  };

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };


/*
 const ListOfTerrain = useSelector(selectALLTerrains) || [];
  const terrains = ListOfTerrain.length;

console.log("terrains", terrains)
const reservations = 5
console.log("reservations", reservations)*/

  return (
    <>
      <Root
        header={
          <CalendarHeader
            calendarRef={calendarRef}
            currentDate={currentDate}
            onToggleLeftSidebar={handleToggleLeftSidebar}
          />
        }
        content={
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="timeGridWeek"
            editable
            selectable
            // expandRows={true}
            aspectRatio={2}
            selectMirror
            dayMaxEvents
            weekends
            datesSet={handleDates}
            select={handleDateSelect}
            events={events}
            eventContent={(eventInfo) => (
              <CalendarAppEventContent eventInfo={eventInfo} />
            )}
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventRemove}
            eventDrop={handleEventDrop}
         //  eventBackgroundColor={terrains === reservations ? "red" : "bleu"}
            //eventColor ="green"
            initialDate={new Date()}
            ref={calendarRef}
            // Set the desired time slot interval and limits
            slotDuration="01:30:00" // One-hour slots
            slotMinTime="00:00:00" // Start time (adjust as needed)
            //slotMaxTime="24:00:00" // End time (adjust as needed)
            firstDay={1} // Set the first day of the week to Monday (1 represents Monday)
            slotLabelContent={(arg) => formatTime(arg.date)} // Set the custom function for formatting the time
            slotLabelFormat={{
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hourCycle: "h24",
              omitZeroMinute: false, // Set to true if you want to remove the ':00' from time slots like '15:00'
            }}
          />
        }
        // leftSidebarContent={<CalendarAppSidebar />} // add Calendar Bar
        // leftSidebarOpen={leftSidebarOpen} // add Calendar Bar
        // leftSidebarOnClose={() => setLeftSidebarOpen(false)} // add Calendar Bar
        // leftSidebarWidth={240} // add Calendar Bar
        scroll="content"
      />
      <EventDialog />
    </>
  );
}

export default withReducer("calendarApp", reducer)(CalendarApp);
