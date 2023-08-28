import React from "react";
import Hidden from '@mui/material/Hidden';

const ballContainerStyle = {
  width: "100px",
  height: "100px",
  display: "flex", // Utilisez display: flex pour aligner les éléments horizontalement
  alignItems: "center", // Centrez verticalement les éléments
};

const ballStyle = {
  animation: "spinBounce 2s infinite",
};

const appNameStyle = {
  backgroundColor: "#121212",
  color: "#61DAFB",
  fontSize: "12px",
  margin: "0 10px", // Ajoutez une marge de 10px autour du texte
  padding: "4px 8px",
  borderRadius: "4px",
};

function BallAnimation() {
  return (
    <>
      <div style={ballContainerStyle}>
        <img
          style={ballStyle}
          className="logo-icon w-32 h-32"
          src="assets/images/logo/ballon.png"
          alt="Ballon de football"
        />
      <Hidden lgDown><span style={appNameStyle}> Application</span></Hidden>  
      </div>

      <style>
        {`
          @keyframes spinBounce {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            100% {
              transform: translateY(0px) rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}

export default BallAnimation;
