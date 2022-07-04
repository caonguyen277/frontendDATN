import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { getPurchaseHistory } from './apiUser';
import queryString from "query-string";
import Pagination from "react-bootstrap-4-pagination";
import moment from "moment";
import { isAuthenticated } from '../auth';
import Layout from '../core/Layout';
const OrderByUser = () => {
    const [history, setHistory] = useState([]);
    const token = isAuthenticated().token;
    const {
        user: { _id, name, email, role },
      } = isAuthenticated();
    const init = async (obj) => {
        const paramString = queryString.stringify(obj);
        const purchaseHistory = await getPurchaseHistory(_id, token,paramString);
        if (purchaseHistory.error) return console.log(purchaseHistory.error);
        setHistory(purchaseHistory.data);
        setTotalRow(purchaseHistory.totalRow);
      };
      const [totalRow, setTotalRow] = useState(1);
      const [objPagi, setObjPagi] = useState({
        page: 1,
        perPage: 5,
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
        init({
          ...objPagi,
          page: pageChange,
        });
      };
      useEffect(() => {
        init(objPagi);
      }, []);
      const showOrdersLength = () => {
        if (history.length > 0) {
          return <h4 className=" display-2">Total orders: {history.length}</h4>;
        } else {
          return <h4 className="text-danger">No orders</h4>;
        }
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
                            <th>Status</th>
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
                            <td>{h.status}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.count}</td>
                            <td>{h.address}</td>
                            <td>{moment(h.createdAt).fromNow()}</td>
                          </tr>
                        ))}
                        <tr><td>Amount : {h.amount}</td></tr>
                        
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
    <Layout className="container-fluid">
      <div className="row">
        <div className="col-12">
          {showOrdersLength()}
          {purchaseHistory(history)};
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
  )
}

export default OrderByUser