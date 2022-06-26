import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";
import Table from "react-bootstrap/Table";

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();
  const token = isAuthenticated().token;

  const init = async (userId, token) => {
    const purchaseHistory = await getPurchaseHistory(userId, token);
    if (purchaseHistory.error) return console.log(purchaseHistory.error);
    setHistory(purchaseHistory);
  };

  useEffect(() => {
    init(_id, token);
  }, []);

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              My Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={`/profile/${_id}`}>
              Update Profile
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
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">{role === 1 ? "Admin" : "User"}</li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = (history) => {
    return (
      <div>
        <h3 className="card-header">Purchase history</h3>
        <ul className="list-group">
          <li className="list-group-item">
            {history.map((h, i) => {
              return (
                <div>
                  <Table
                    hover
                    key={i}
                    size="sm"
                    className="text-xs-center text-lg-center"
                  >
                    <thead>
                      <tr>
                        <th className="text-left">Order ID</th>
                        <th>Product Name</th>
                        <th>Product Price</th>
                        <th>Quantity</th>
                        <th>Address</th>
                        <th>Purchased Date</th>
                      </tr>
                    </thead>
                    {h.products.map((p, pIndex) => (
                      <tr key={pIndex}>
                        <td className="text-left">{h._id}</td>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.count}</td>
                        <td>{h.address}</td>
                        <td>{moment(p.createdAt).fromNow()}</td>
                      </tr>
                    ))}
                    <br />
                  </Table>
                </div>
              );
            })}
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
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
