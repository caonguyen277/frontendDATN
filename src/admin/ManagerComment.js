import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import moment from "moment";
import { getBranches, deleteBranch } from "./apiAdmin";

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [success, setSuccess] = useState(false);
  const { user, token } = isAuthenticated();

  const loadBranches = async () => {
    const branches = await getBranches();
    if (branches.data) return console.log(branches.data);
    setBranches(branches);
  };

  const adminLinks = () => {
    return (
      <Link
        className="text-secondary"
        to="/create/branch"
        style={{ borderRadius: "5px" }}
      >
        Create a new branch
      </Link>
    );
  };

  const branchDelete = async (branchId) => {
    const branch = await deleteBranch(branchId, user._id, token);
    if (branch.error) return console.log(branch.error);
    loadBranches();
    setSuccess(true);
  };

  const showSuccess = () => {
    if (success) {
      return (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Branch delete successfully!!!
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
    loadBranches();
  }, []);

  return (
    <Layout className="container-fluid">
      {showSuccess()}
      <div className="card" style={{ paddingBottom: "20px" }}>
        <h2  className="mt-2 text-center text-warning">Total {branches.length} branches</h2>
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
            {branches.map((p, i) => (
              <tr key={i}>
                <td className="text-left">{p.name}</td>
                <td>{moment(p.createdAt).fromNow()}</td>
                <td>
                  <Link
                    to={`/admin/branch/update/${p._id}`}
                    className="text-decoration-none text-muted"
                  >
                    <span>Update</span>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => branchDelete(p._id)}
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

export default ManageBranches;
