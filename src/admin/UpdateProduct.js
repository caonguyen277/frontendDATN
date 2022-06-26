import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getProduct, updateProduct } from "./apiAdmin";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    descriptionProduct: "",
    userGuide: "",
    ingredients: "",
    price: "",
    countInStock: "",
    photo: "",
    loading: false,
    error: false,
    redirect: false,
    createdProduct: "",
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
    countInStock,
    loading,
    error,
    redirect,
    createdProduct,
    formData,
  } = values;

  const init = async (productId) => {
    const product = await getProduct(productId);
    if (product.error) return setValues({ ...values, error: product.error });
    setValues({
      ...values,
      name: product.name,
      description: product.description,
      descriptionProduct: product.descriptionProduct,
      userGuide: product.userGuide,
      ingredients: product.ingredients,
      price: product.price,
      countInStock: product.countInStock,
      formData: new FormData(),
    });
  };

  useEffect(() => {
    init(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    const click = await updateProduct(
      match.params.productId,
      user._id,
      token,
      formData
    );
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
      error: false,
      redirect: true,
      createdProduct: click.name,
    });
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
        <label className="text-muted">Ingredients</label>
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

      {/* <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange("shipping")} className="form-control">
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div> */}

      <div className="form-group">
        <label className="text-muted">Count In Stock</label>
        <input
          onChange={handleChange("countInStock")}
          type="number"
          className="form-control"
          value={countInStock}
        />
      </div>

      <button className="btn btn-outline-primary">Update Product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      Name is existed
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct}`} is updated!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirect) {
      if (!error) {
        return <Redirect to="/admin/products" />;
      }
    }
  };

  return (
    <Layout
      title="Add a new product"
      description={`G'day ${user.name}, ready to add a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
