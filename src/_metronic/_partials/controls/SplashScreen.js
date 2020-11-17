import React from "react";
import {CircularProgress} from "@material-ui/core";
import {toAbsoluteUrl} from "../../_helpers";
import Logo from "./berelax.png"

export function SplashScreen() {
  return (
    <>
      <div className="splash-screen">
        <img
          src={toAbsoluteUrl("/media/logos/logo-mini-md.png")}
          alt="Metronic logo"asdsa
        />
        
        <CircularProgress className="splash-screen-spinner" />
      </div>
    </>
  );
}
