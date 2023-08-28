import i18next from "i18next";


import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import authRoles from "../auth/authRoles";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [
  {
    id: "Admin",
    title: "Dashboards",
    subtitle: " ",
    type: "group",
    icon: "heroicons-outline:home",
    translate: "DASHBOARDS",
    children: [
      {
        id: "dashboards.profile",
        title: "Profile",
        type: "item",
        icon: "heroicons-outline:user-circle",
        url: "/dashboards/profile",
       // auth: authRoles.onlyGuest,auth: authRoles.admin,auth: authRoles.user,auth: authRoles.staff,
      },
      
      {
        id: "dashboards.analytics",
        title: "Analytics",
        type: "item",
        icon: "heroicons-outline:chart-pie",
        url: "/dashboards/analytics",
      },
    ],
  },
  {
    id: "apps",
    title: "Applications",
    subtitle: " ",
    type: "group",
    icon: "heroicons-outline:cube",
    translate: "APPLICATIONS",
    children: [
  
      {
        id: "apps.user",
        title: "User",
        type: "item",
        icon: "heroicons-outline:user-group",
        url: "/apps/user",
        auth: authRoles.admin,
      },
      {
        id: "apps.terrain",
        title: "Terrain",
        type: "item",
        icon: "heroicons-outline:currency-dollar",
        url: "/apps/terrain",
      },
      {
        id: "apps.reservation",
        title: "Reservation",
        type: "item",
        icon: "heroicons-outline:cash",
        url: "/apps/reservation",
      },
     
  
      {
        id: "apps.calendar",
        title: "Calendar",
        subtitle: "3 upcoming events",
        type: "item",
        icon: "heroicons-outline:calendar",
        url: "/apps/calendar",
        translate: "CALENDAR",
      },
    ],
  },
];

export default navigationConfig;
