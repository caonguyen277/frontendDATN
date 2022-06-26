import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { isAuthenticated } from "../auth";
import { apiListFavourite } from "./apiCore";
import CardProduct from "./Card";
import Layout from "./Layout";

const Favourite = () => {
  const [products, setProducts] = useState([]);
  const name = isAuthenticated() && isAuthenticated().user.name;
  const _id = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  const loadFavouriteProduct = async (userId) => {
    const data = await apiListFavourite(userId);
    if (!data.error) {
      setProducts(data.products);
    }
  };
  useEffect(() => {
    loadFavouriteProduct(_id);
  }, []);
  return (
    <Layout>
      <Row>
        <Col sm={3}>
          <div className="css-divIcon" style={{display: "flex",justifyContent:"center",alignItems:"center"}}>
            <FontAwesomeIcon style={{ height:"1.5rem",color: "#ff9900" }} icon={faHeart} />
            <FontAwesomeIcon style={{ height:"1.5rem",color:"#ff9900" }} icon={faHeart} />
            <FontAwesomeIcon style={{ height:"1.5rem",color: "#ff9900" }} icon={faHeart} />
          </div>
          <h6 style={{textAlign:"center"}}>Danh Mục sản phẩm yêu thích</h6>

          
        </Col>
        <Col sm={9}>
          <Row>
            {products.map((product, i) => (
              <Col md={4} key={i} className="mb-3">
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export default Favourite;
