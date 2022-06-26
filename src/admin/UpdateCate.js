import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { getCategory, updateCategory } from "./apiAdmin";

const UpdateCategory = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    error: "",
    redirect: false,
    formData: "",
  });

  // destructure user and token from localStorage
  const { user, token } = isAuthenticated();
  const { name, error, redirect } = values;

  const init = async (categoryId) => {
    const category = await getCategory(categoryId, token);
    if (category.error) return setValues({ ...values, error: category.error });
    setValues({ ...values, name: category.name });
  };

  useEffect(() => {
    init(match.params.categoryId);
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const submitCategoryForm = async (e) => {
    e.preventDefault();
    const category = {
      name: name,
    };
    const categoryUpdate = await updateCategory(
      match.params.categoryId,
      user._id,
      token,
      category
    );
    if (categoryUpdate.error)
      return setValues({ ...values, error: categoryUpdate.error });
    setValues({
      ...values,
      name: categoryUpdate.name,
      error: false,
      redirect: true,
    });
  };

  const updateCategoryForm = () => (
    <form className="mb-5" onSubmit={submitCategoryForm}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          className="form-control"
          type="text"
          required
          name="name"
        />
      </div>

      <button type="submit" className="btn btn-outline-primary">
        Save Changes
      </button>
    </form>
  );

  const showError = () => (
    <div
      className={"alert alert-danger"}
      role="alert"
      style={{ display: error ? "" : "none" }}
    >
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      Name is already exists
    </div>
  );

  const redirectToDashboard = () => {
    if (redirect) {
      if (!error) {
        return <Redirect to="/admin/categories" />;
      }
    }
  };

  const goBackBTN = () => {
    return (
      <div className="mt-5">
        <Link to="/admin/categories" className="text-info">
          Back To Admin Home
        </Link>
      </div>
    );
  };

  return (
    <Layout className="container-fluid">
      <div className="row">
        <div className="col-md-8 offset-md-2 m-b-250 mb-5">
          {showError()}
          {updateCategoryForm()}
          {goBackBTN()}
          {redirectToDashboard()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateCategory;
