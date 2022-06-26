import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories, getBranches } from "./apiAdmin";
import { Redirect } from "react-router-dom";

const AddProduct = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    descriptionProduct: "",
    userGuide: "",
    ingredients: "",
    categories: [],
    category: "",
    branches: [],
    branch: "",
    countInStock: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirect: false,
    formData: "",
  });

  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    descriptionProduct,
    userGuide,
    ingredients,
    price,
    categories,
    branches,
    countInStock,
    loading,
    error,
    createdProduct,
    redirect,
    formData,
  } = values;

  let init = async () => {
    const categoryData = await getCategories();
    if (categoryData.error)
      return setValues({ ...values, error: categoryData.error });
    const branchData = await getBranches();
    if (branchData.error)
      return setValues({ ...values, error: branchData.error });
    setValues({
      ...values,
      branches: branchData,
      categories: categoryData,
      formData: new FormData(),
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    const click = await createProduct(user._id, token, formData);
    if (click.error) return setValues({ ...values, error: click.error });
    setValues({
      ...values,
      name: "",
      description: "",
      descriptionProduct: "",
      userGuide: "",
      ingredients: "",
      photo: "",
      price: "",
      countInStock: "",
      loading: false,
      redirect: true,
    });
    console.log(values);
    console.log("Click");
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          className="form-control"
          value={description}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description Product</label>
        <textarea
          onChange={handleChange("descriptionProduct")}
          className="form-control"
          value={descriptionProduct}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">User Guide</label>
        <textarea
          onChange={handleChange("userGuide")}
          className="form-control"
          value={userGuide}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">ingredients</label>
        <textarea
          onChange={handleChange("ingredients")}
          className="form-control"
          value={ingredients}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          value={price}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Branch</label>
        <select onChange={handleChange("branch")} className="form-control">
          <option>Please select</option>
          {branches &&
            branches.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Count In Stock</label>
        <input
          onChange={handleChange("countInStock")}
          type="number"
          className="form-control"
          value={countInStock}
        />
      </div>

      <button className="btn btn-outline-primary">Create Product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      Name is already existed
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct}`} is created!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  const redirectToDashboard = () => {
    if (redirect) {
      if (!error) {
        return <Redirect to="/admin/products" />;
      }
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {redirectToDashboard()}
          {showError()}
          {newPostForm()}
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
