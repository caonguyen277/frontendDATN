import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Checkout from "./Checkout";
import { Row, Col } from "react-bootstrap";
import CardProduct from "./Card";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);
  // const [count, setCount] = useState(product.count);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  // const handleChange = (productId) => (event) => {
  //   setRun(run);
  //   setCount(event.target.value < 1 ? 1 : event.target.value);
  //   if (event.target.value >= 1) {
  //     updateItem(productId, event.target.value);
  //   }
  // };

  // const Quantity = (quantity) => {
  //   return (
  //     quantity && (
  //       <div className="col-3">
  //         <div className="input-group mb-3">
  //           <input
  //             type="number"
  //             className="form-control"
  //             value={count}
  //             onChange={handleChange(product._id)}
  //           />
  //         </div>
  //       </div>
  //     )
  //   );
  // };

  const showProducts = (items) => {
    // return (
    //   <div>
    //     <h2>Your cart has {`${items.length}`} items</h2>
    //     <hr />
    //     {items.map((product, i) => (
    //       <div key={i}>
    //         <Card className="mb-3" style={{ border: "none" }}>
    //           <Row>
    //             <Col xs={2}>
    //               <ShowImage item={product} url="product" />
    //             </Col>
    //             <Col
    //               style={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //               }}
    //               xs={2}
    //             >
    //               {product.name}
    //             </Col>
    //             <Col
    //               style={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //               }}
    //               xs={1}
    //             >
    //               ${product.price}
    //             </Col>
    //             {Quantity(product.quantity)}
    //           </Row>
    //         </Card>
    //       </div>
    //     ))}
    //   </div>
    // );
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <CardProduct
            key={i}
            product={product}
            quantity={true}
            countInStock={false}
            seeDetail={false}
            RemoveButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItem = () => (
    <h2>
      Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
    </h2>
  );

  return (
    <Layout className="container-fluid">
      <Row>
        <Col lg={8} className="text-xs-center text-lg-center">
          {items.length > 0 ? showProducts(items) : noItem()}
        </Col>
        <Col lg={4}>
          <h2>Your cart summary</h2>
          <hr />
          <Checkout products={items} setRun={setRun} run={run} />
        </Col>
      </Row>
    </Layout>
  );
};

export default Cart;
