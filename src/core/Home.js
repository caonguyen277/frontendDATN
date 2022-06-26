import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import CardProduct from "./Card";
import Search from "./Search";
import ControlledCarousel from "./Carousel";
import { Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [setError] = useState(false);

  const loadProductsBySell = async () => {
    const loadProduct = await getProducts("sold");
    if (loadProduct.error) return setError(loadProduct.error);
    setProductsBySell(loadProduct);
  };

  const loadProductsByArrival = async () => {
    const productArrival = await getProducts("createdAt");
    if (productArrival.error) return setError(productArrival.error);
    setProductsByArrival(productArrival);
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);
  //carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  return (
    <Layout>
      <ControlledCarousel /> <br />
      <Search />
      <h2 className="mb-4">Lasted Products</h2>
      <Row xs={2} md={2} lg={3} xl={5}>
        <Slider {...settings}>
          {productsByArrival.map((product, i) => (
            <Col key={i} className="mb-3">
              <CardProduct product={product} />
            </Col>
          ))}
        </Slider>
      </Row>
      <h2 className="mb-4">Best Sellers</h2>
      <Row xs={2} md={2} lg={3} xl={5}>
        <Slider {...settings}>
          {productsBySell.map((product, i) => (
            <Col key={i} className="mb-3">
              <CardProduct product={product} />
             </Col>
          ))}
        </Slider>
      </Row>
    </Layout>
  );
};

export default Home;
