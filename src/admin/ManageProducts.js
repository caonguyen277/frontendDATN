import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";
import { list } from "../core/apiCore";
import moment from "moment";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, token } = isAuthenticated();
  const [data, setData] = useState({
    search: "",
    results: [],
    searched: false,
  });
  const { search, results, searched } = data;
  const searchData = async () => {
    if (search) {
      const results = await list({ search: search || undefined });
      if (results.error) return console.log(results.error);
      setData({ ...data, results: results, searched: true });
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `No products found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <>
        <h2 className="" style={{ paddingLeft: "20px" }}>
          {searchMessage(searched, results)}
        </h2>
        {results.map((p, i) => (
          <table
            className="table-sm  table-bordered table-striped table-hover table-borderless text-lg-center"
            style={{
              color: "#495057",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <tr key={i}>
              <td
                className="text-left"
                style={{ paddingLeft: "10px", width: "25%" }}
              >
                {p.name}
              </td>
              <td className="text-left" style={{ width: "25%" }}>
                ${p.price}
              </td>
              <td>
                <Link
                  to={`/admin/product/update/${p._id}`}
                  className="text-decoration-none text-muted"
                >
                  Update
                </Link>
              </td>
              <td>
                <button
                  className="text-muted"
                  onClick={() => deleteItem(p._id)}
                  style={{ border: "none", backgroundColor: "transparent" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          </table>
        ))}
      </>
    );
  };

  const searchForm = () => (
    <form class="form-inline" onSubmit={searchSubmit}>
      <input
        class="form-control mr-sm-2"
        onChange={handleChange("search")}
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
    </form>
  );

  const loadProducts = async () => {
    const product = await getProducts();
    if (product.error) return console.log(product.error);
    setProducts(product);
  };

  const adminLinks = () => {
    return (
      <Link
        className="text-secondary"
        to="/create/product"
        style={{ borderRadius: "5px" }}
      >
        Create a new product
      </Link>
    );
  };

  const deleteItem = async (productId) => {
    const product = await deleteProduct(productId, user._id, token);
    if (product.error) return console.log(product.error);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout className="container-fluid">
      <div>
        <div className="card" style={{ paddingBottom: "20px" }}>
          <h2 className="card-header text-warning text-center">
            Total {products.length} products
          </h2>

          <div class="row" style={{ padding: "8px 0 0 20px" }}>
            <div
              class="col-12 col-md-8"
              style={/*{ marginRight: "181px", */{paddingTop: "5px" }}
            >
              {adminLinks()}
            </div>
            <div class="col-3 col-md-2">{searchForm()}</div>
          </div>
          {searchedProducts(results)}
          <table
            className="table-sm  table-bordered table-striped table-hover table-borderless text-lg-center"
            style={{
              color: "#495057",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <tr>
              <th className=" text-left" style={{ paddingLeft: "10px" }}>
                Product name
              </th>
              <th className=" text-left">Product price</th>
              <th>Created on</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td className="text-left" style={{ paddingLeft: "10px" }}>
                    {p.name}
                  </td>
                  <td className="text-left">${p.price}</td>
                  <td>{moment(p.createdAt).fromNow()}</td>
                  <td>
                    <Link
                      to={`/admin/product/update/${p._id}`}
                      className="text-decoration-none text-muted"
                    >
                      Update
                    </Link>
                  </td>
                  <td>
                    <button
                      className="text-muted"
                      onClick={() => deleteItem(p._id)}
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
