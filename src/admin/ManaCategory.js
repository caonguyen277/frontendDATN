import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "./apiAdmin";
import moment from "moment";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const { user, token } = isAuthenticated();

  const loadCategories = async () => {
    const categoryData = await getCategories();
    if (categoryData.error) return console.log(categoryData.error);
    setCategories(categoryData);
  };

  const adminLinks = () => {
    return (
      <Link
        className="text-secondary"
        to="/create/category"
        style={{ borderRadius: "5px" }}
      >
        Create a new category
      </Link>
    );
  };

  const deleteCate = async (categoryId) => {
    const category = await deleteCategory(categoryId, user._id, token);
    if (category.error) return console.log(category.error);
    loadCategories();
    setSuccess(true);
    console.log("deleted");
  };

  const showSuccess = () => {
    if (success) {
      return (
        <div
          class="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Category delete successfully!!!
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Layout className="container-fluid">
      {showSuccess()}
      <div className="card" style={{ paddingBottom: "20px" }}>
        <h2 className="mt-2 text-center text-warning">
          Total {categories.length} categories
        </h2>
        <div
          style={{
            paddingLeft: "20px",
            paddingBottom: "10px",
          }}
        >
          {adminLinks()}
        </div>
        <table
          className="table-sm  table-bordered table-striped table-hover table-borderless text-lg-center"
          style={{
            color: "#495057",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <thead>
            <tr>
              <th className="text-left">Product name</th>
              <th>Created on</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((p, i) => (
              <tr key={i}>
                <td className="text-left">{p.name}</td>
                <td>{moment(p.createdAt).fromNow()}</td>
                <td>
                  <Link
                    to={`/admin/category/update/${p._id}`}
                    className="text-decoration-none text-muted"
                  >
                    <span>Update</span>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => deleteCate(p._id)}
                    className="text-muted"
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
    </Layout>
  );
};

export default ManageCategories;
