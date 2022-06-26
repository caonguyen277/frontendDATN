import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { createBranch } from "./apiAdmin";

const AddBranch = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated();

  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const click = await createBranch(user._id, token, { name });
    if (click.error) return setError(click.error);
    setError("");
    setRedirect(true);
    console.log("clickBranch");
  };

  const newBranchFom = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
          required
        />
      </div>
      <button className="btn btn-outline-primary">Create Branch</button>
    </form>
  );

  // const showSuccess = () => {
  //     if (success) {
  //         return <h3 className="text-success">{name} is created</h3>;
  //     }
  // };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Branch is already exists</h3>;
    }
  };
  const redirectToDashboard = () => {
    if (redirect) {
      if (!error) {
        return (
          <>
            <Redirect to="/admin/branches" />
          </>
        );
      }
    }
  };

  return (
    <Layout
      title="Add a new branch"
      description={`G'day ${user.name}, ready to add a new branch?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {redirectToDashboard()}
          {showError()}
          {newBranchFom()}
        </div>
      </div>
    </Layout>
  );
};

export default AddBranch;
