import { useEffect } from 'react';
import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/system/Box";

import "react-slideshow-image/dist/styles.css";
import _ from "@lodash";

import { Slide } from "react-slideshow-image";
import { selectTerrain, getTerrain } from "../store/terrainSlice";

function TerrainView() {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const terrain = useSelector(selectTerrain);
  console.log("routeParams.id", routeParams.id);
  useEffect(() => {
    dispatch(getTerrain(routeParams.id));
  }, [dispatch, routeParams]);
  if (!terrain) {
    return <FuseLoading />;
  }
  const spanStyle = {
    padding: "20px",
    background: "#efefef",
    color: "#000000",
  };

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "400px",
  };
  return (
    <>
      <Box
        className="relative w-full "
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <div className="slide-container">
          <Slide>
            {terrain.photo && terrain.photo.length > 0 ? (
              terrain.photo.map((slideImage, index) => (
                <div key={index}>
                  <div
                    style={{
                      ...divStyle,
                      backgroundImage: `url(${slideImage})`,
                    }}
                   />
                </div>
              ))
            ) : (
              <div
                style={{
                  ...divStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
              >
                No photo for this terrain yet
              </div>
            )}
          </Slide>
        </div>
      </Box>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl" style={{ marginTop: "100px" }}>
          <div className="flex flex-auto items-end -mt-64" />

          {terrain.name && (
            <div className="flex items-center">
              <div className="ml-24 text-xl font-bold leading-6 mb-2">
                {terrain.name}
              </div>
            </div>
          )}

          {terrain.description && (
            <div className="flex ml-32 mt-4">
              <div className="leading-7 text-secondary">
                {terrain.description}
              </div>
            </div>
          )}

          <Divider className="mt-16 mb-24" />

          {terrain && terrain.address && (
            <div className="flex items-center mt-10">
              <FuseSvgIcon className="text-48 mr-8" size={40} color="action">
                heroicons-solid:location-marker
              </FuseSvgIcon>
              <div className="leading-7">
                <p className="text-xl font-semibold mb-1">
                  {terrain.address.city}, {terrain.address.governorate},
                  {terrain.address.country}, {terrain.address.postalCode}
                </p>
              </div>
            </div>
          )}

          {terrain.surface && (
            <div className="flex items-center mt-10">
              <FuseSvgIcon className="text-48 mr-8" size={40} color="action">
                heroicons-solid:bookmark
              </FuseSvgIcon>
              <div className="leading-7">
                <p className="text-xl font-semibold mb-1">
                  {terrain.surface} mètre
                </p>
              </div>
            </div>
          )}

          {terrain.price && (
            <div className="flex items-center mt-10">
              <FuseSvgIcon className="text-48 mr-8" size={40} color="action">
                heroicons-solid:currency-dollar
              </FuseSvgIcon>
              <div className="leading-7">
                <p className="text-xl font-semibold mb-1">
                  {terrain.price} DNT
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end mt-8 mr-4">
            <Button
              variant="contained"
              color="secondary"
              component={NavLinkAdapter}
              to="edit"
            >
              <FuseSvgIcon size={20} className="mr-2">
                heroicons-outline:pencil-alt
              </FuseSvgIcon>
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TerrainView;
