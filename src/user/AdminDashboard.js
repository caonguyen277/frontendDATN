import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    user: {_id, name, email, role },
  } = isAuthenticated();
  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
        <li className="list-group-item">
            <Link className="nav-link style-link" to={`/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/Orders">
              View Orders
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/products">
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/categories">
              Manage Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/branches">
              Manage Branches
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/comments">
              Manage Comment
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/commentTitle">
              Manage Comment Hot
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link style-link" to="/admin/statistical">
              Statistical
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">
          {role === 1 ? "Admin Information" : "User Information"}
        </h3>
        <ul className="list-group">
          <li className="list-group-item">Username: {name}</li>
          <li className="list-group-item">Email: {email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
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
        <div className="col-3">{adminLinks()}</div>
        <div className="col-9">{adminInfo()}</div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
