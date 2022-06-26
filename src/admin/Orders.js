import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";
import Table from "react-bootstrap/Table";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log("fail ");
      } else {
        setOrders(data);
        console.log("ok");
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return <h4 className=" display-2">Total orders: {orders.length}</h4>;
    } else {
      return <h4 className="text-danger">No orders</h4>;
    }
  };

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">{o.status}</h3>
      <select
        className="form-control"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Update Status</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout className="container-fluid">
      <div className="row">
        <div className="col-12">
          {showOrdersLength()}
          {orders.map((o, oIndex) => {
            return (
              <Table
                hover
                className="shadow"
                size="sm"
                key={oIndex}
                style={{ backgroundColor: "#ffffff" }}
              >
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Ordered on</th>
                    <th>Delivery address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{o._id}</td>
                    <td>{showStatus(o)}</td>
                    <td>${o.amount}</td>
                    <td>{moment(o.createdAt).fromNow()}</td>
                    <td>{o.address}</td>
                  </tr>
                  <tr>
                    <td colSpan="7">
                      <h5>Total products in the order: {o.products.length}</h5>
                    </td>
                  </tr>
                  <tr>
                    <th colSpan="2">Product ID</th>
                    <th colSpan="2">Product Name</th>
                    <th colSpan="2">Product Price</th>
                    <th>Product Total</th>
                  </tr>
                  {o.products.map((p, pIndex) => (
                    <tr key={pIndex}>
                      <td colSpan="2">{p._id}</td>
                      <td colSpan="2">{p.name}</td>
                      <td colSpan="2">{p.price}</td>
                      <td>{p.count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
