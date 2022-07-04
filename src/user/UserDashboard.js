import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/cart">
              My Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/favourite">
              My Favourite
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to={`/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to={`/user/orders`}>
              Order
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">
          {role === 1 ? "Admin Information" : "User Information"}
        </h3>
        <ul className="list-group">
          <li className="list-group-item">Username: {name}</li>
          <li className="list-group-item">Email: {email}</li>
          <li className="list-group-item">{role === 1 ? "Admin" : "User"}</li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}!`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">{userInfo()}</div>
      </div>
    </Layout>
  );
};

export default Dashboard;
