import React, { useState, useEffect } from "react";
import {
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import "braintree-web";
import DropIn from "braintree-web-drop-in-react";
import { Button, Card, Container } from "react-bootstrap";

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });
  const [payOffice, setPayOffice] = useState(false);
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = async (userId, token) => {
    const getData = await getBraintreeClientToken(userId, token);
    if (getData.error) return setData({ ...getData, error: getData.error });
    setData({ clientToken: getData.clientToken });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);
  const handleClick = () => {};
  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <Button className="btn" variant="outline-warning">
          Đăng nhập để thanh toán
        </Button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    if (deliveryAddress === undefined) {
      return setData({ ...data, error: true });
    }
    setData({ loading: true });
    if (payOffice) {
      const createOrderData = {
        products: products,
        amount: getTotal(products),
        address: deliveryAddress,
      };
      createOrder(userId, token, createOrderData)
        .then((response) => {
          emptyCart(() => {
            console.log("payment success and empty cart");
            return setData({
              loading: false,
              success: true,
            });
          });
        })
        .catch((error) => {
          console.log(error);
          setData({ loading: false });
        });
    }
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            console.log(response);
            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress,
            };
            createOrder(userId, token, createOrderData)
              .then((response) => {
                emptyCart(() => {
                  console.log("payment success and empty cart");
                  setData({
                    loading: false,
                    success: true,
                  });
                });
              })
              .catch((error) => {
                console.log(error);
                setData({ loading: false });
              });
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        setData({ ...data, error: error.message });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>
          <div
            onClick={() => setPayOffice(!payOffice)}
            style={{
              padding: "10px",
              transition: "all .2s",
              border: payOffice ? "2px solid #219653" : "1px solid #b5b5b5",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cash on delivery

          </div>  
          <DropIn
          disabled
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button
            onClick={buy}
            style={{ borderRadius: "5px" }}
            className="btn btn-success btn-block"
          >
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      "Vui lòng nhập đủ thông tin trước khi thanh toán"
    </div>
  );

  const showSuccess = (success) => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Cảm ơn bạn! Thanh toán thành công
    </div>
  );

  const showLoading = (loading) =>
    loading && <h2 className="text-danger">Loading...</h2>;

  return (
    <Card style={{ border: "none" }}>
      <Container className="mt-3 mb-4">
        <h2>Total: ${getTotal()}</h2>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
      </Container>
    </Card>
  );
};

export default Checkout;
