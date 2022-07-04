import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";
import Table from "react-bootstrap/Table";
import queryString from "query-string";
import Pagination from "react-bootstrap-4-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();

  const loadOrders = (obj) => {
    const paramString = queryString.stringify(obj);
    listOrders(user._id, token,paramString).then((data) => {
      if (data.error) {
        console.log("fail ");
      } else {
        setOrders(data.data);
        setTotalRow(data.totalRow);
        console.log("ok");
      }
    });
  };
  //Pagination
  const [totalRow, setTotalRow] = useState(1);
  const [objPagi, setObjPagi] = useState({
    page: 1,
    perPage: 8,
  });
  let paginationConfig = {
    totalPages: Math.ceil(totalRow / objPagi.perPage),
    currentPage: objPagi.page,
    showMax: 10,
    size: "sm",
    threeDots: true,
    prevNext: true,
    onClick: function (page) {
      handleChangePage(page);
    },
  };
  const handleChangePage = (pageChange) => {
    setObjPagi({
      ...objPagi,
      page: pageChange,
    });
    console.log(objPagi);
    loadOrders({
      ...objPagi,
      page: pageChange,
    });
  };
  //////////////////////////////
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
    loadOrders(objPagi);
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
        loadOrders(objPagi);
      }
    });
  };
  const showComplete = (status) => {
    if(status !== "Not processed") {
      return <div style={{color: "white",
        padding: "10px 15px",
        top: "107px",
        left: "-53px",
        backgroundColor: "#55bd55",
        position: "absolute",
        borderRadius: "50%"}}>
        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
      </div> 
    }
  }
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
                bordered 
                hover
                className="shadow"
                size="sm"
                key={oIndex}
                style={{ backgroundColor: "#ffffff",position:"relative" }}
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
                    <th >Product ID</th>
                    <th colSpan="2">Product Name</th>
                    <th>Product Price</th>
                    <th>Product Total</th>
                  </tr>
                  {o.products.map((p, pIndex) => (
                    <tr key={pIndex}>
                      <td>{p._id}</td>
                      <td  colSpan="2">{p.name}</td>
                      <td>{p.price}</td>
                      <td>{p.count}</td>
                    </tr>
                  ))}
                </tbody>
                {showComplete(o.status)}
              </Table>
            );
          })}
          <div
            className="pagination"
            style={{ display: "flex", justifyContent: "center",marginTop:"20px" }}
          >
            <div className="App">
              <Pagination {...paginationConfig} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
