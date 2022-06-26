import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import { addItem, updateItem, removeItem } from "./cartHelpers";
import { Card, Row, Col, Button } from "react-bootstrap";
const CardProduct = ({
  product,
  quantity = false,
  RemoveButton = false,
  setRun = (f) => f,
  run = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const addToCart = () => {
    addItem(product, setRedirect(true));
  };
  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = (countInStock) => {
    return countInStock > 0 ? (
      <Button
        onClick={addToCart}
        style={{ borderRadius: "5px" }}
        variant="outline-warning"
      >
        Add to cart
      </Button>
    ) : (
      <></>
    );
  };

  const showStock = (countInStock) => {
    return countInStock > 0 ? (
      <h6 className="font-weight-bold text-warning">In Stock </h6>
    ) : (
      <h6 className="font-weight-bold text-danger">Out of Stock </h6>
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run);
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const Quantity = (quantity) => {
    return (
      quantity && (
        <div className="col-3">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };
  const showRemoveButton = (RemoveButton) => {
    return (
      RemoveButton && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };
  return (
    <Card
      className="shadow bg-white"
      style={{ border: "none", borderRadius: "10px" }}
    >
      <Card.Header
        style={{
          backgroundColor: "white",
          border: "1px solid #f6f6f6",
          borderRadius: "10px",
        }}
      >
        <ShowImage item={product} url="product" />
      </Card.Header>
      <Card.Body>
        {shouldRedirect(redirect)}
        <Card.Title>
          <Link
            className="d-inline-block text-truncate"
            style={{
              maxWidth: "100% ",
              color: "black",
              fontSize: "18px",
              textDecoration: "none",
            }}
            to={`/product/${product._id}`}
          >
            {product.name}
          </Link>
        </Card.Title>
        <Card.Text>
          <span
            className="d-inline-block text-truncate"
            style={{ maxWidth: "100% " }}
          >
            {product.description}
          </span>
          <Row>
            <Col xs={7}>{showStock(product.countInStock)}</Col>
            <Col xs={5} className="text-center">
              <h6 className="font-italic">${product.price}</h6>
            </Col>
            <Col xl={12}>{showAddToCart(product.countInStock)}</Col>
          </Row>
        </Card.Text>
        {showRemoveButton(RemoveButton)}
        {Quantity(quantity)}
      </Card.Body>
    </Card>
  );
};

export default CardProduct;
