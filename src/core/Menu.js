import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#000000" };
  }
};
const Menu = ({ history }) => (
  <nav class="navbar navbar-expand-lg navbar-light ">
    <Link className="nav-link" style={isActive(history, "")} to="/">
      <img style={{width: "135px"}}
        src="https://www.milem.vn/fileserver/images/file/fixsize-135x90/upload/logo-milem-full.png?v=1.3"
        alt="logo"
      />
    </Link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            Home
          </Link>
        </li>
        <li class="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/shop")}
            to="/shop"
          >
            Shop
          </Link>
        </li>
        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/admin/dashboard")}
              to="/admin/dashboard"
            >
              Dashboard
            </Link>
          </li>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/user/dashboard")}
              to="/user/dashboard"
            >
              Dashboard
            </Link>
          </li>
        )}
      </ul>
      <ul className="form-inline my-2 my-lg-0">
      <li className="nav-item ">
          <Link
            className="nav-link"
            style={isActive(history, "/favourite")}
            to="/favourite"
          >
              <FontAwesomeIcon icon = {faHeart}/>  
          </Link>
        </li>
        <li className="nav-item ">
          <Link
            className="nav-link"
            style={isActive(history, "/cart")}
            to="/cart"
          >
            Cart{" "}
            <sup>
              <small style={{color:"white"}} className="cart-badge">{itemTotal()}</small>
            </sup>
          </Link>
        </li>
        {isAuthenticated() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#000000" }}
              onClick={() =>
                signout(() => {
                  history.push("/");
                })
              }
            >
              Signout
            </span>
          </li>
        )}
        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Signin
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Signup
              </Link>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  </nav>
);

export default withRouter(Menu);
