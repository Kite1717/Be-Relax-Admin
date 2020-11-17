/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation, Route } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import BlurOnIcon from '@material-ui/icons/BlurOn';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import LocalHotelIcon from '@material-ui/icons/LocalHotel';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { ContentRoute } from "../../content/ContentRoute";
import Theme from "../../../../_partials/dashboards/Theme"

export function AsideMenuList({ layoutProps }) {
  console.log(layoutProps)
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url)
      ? " menu-item-active menu-item-open "
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/meditation")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/meditation">
            <span className="svg-icon menu-icon">
              <BlurOnIcon />
            </span>
            <span className="menu-text">Meditation</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/theme")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/theme">
            <span className="svg-icon menu-icon">
              <CropOriginalIcon />
            </span>
            <span className="menu-text">Theme</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/sleep")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/sleep">
            <span className="svg-icon menu-icon">
              <LocalHotelIcon />
            </span>
            <span className="menu-text">Sleep</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/music")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/music">
            <span className="svg-icon menu-icon">
              <MusicNoteIcon />
            </span>
            <span className="menu-text">Music</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/logout")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/logout">
            <span className="svg-icon menu-icon">
              <PowerSettingsNewIcon />
            </span>
            <span className="menu-text">Çıkış Yap</span>
          </NavLink>
        </li>

        {/*end::1 Level*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
