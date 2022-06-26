import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { createCategory } from "./apiAdmin";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);
    setRedirect(false);
    const clickCate = await createCategory(user._id, token, { name });
    if (clickCate.error) return setError(clickCate.error);
    setError("");
    setSuccess(true);
    setRedirect(true);
  };

  const newCategoryFom = () => (
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
      <button className="btn btn-outline-primary">Create Category</button>
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is created</h3>;
    }
  };

  const redirectToDashboard = () => {
    if (redirect) {
      if (!error) {
        return <Redirect to="/admin/categories" />;
      }
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category should be unique</h3>;
    }
  };

  const goBack = () => (
    <div className="mt-5">
      <Link to="/admin/dashboard" className="text-warning">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCategoryFom()}
          {goBack()}
          {redirectToDashboard()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
