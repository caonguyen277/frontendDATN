import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import CardProduct from "./Card";
import Search from "./Search";
import ControlledCarousel from "./Carousel";
import { Row, Col, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCommentTitle } from "../admin/apiAdmin";
import ShowImage from "./ShowImage";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [comments, setComments] = useState([]);
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
  const loadCommentTitle = async () => {
    const comments = await getCommentTitle();
    if (comments.error) return setError(comments.error);
    setComments(comments);
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
    loadCommentTitle();
  }, []);
  const loadLikeCount = (likeCount) => {
    let items = [];
    for (let i = 0; i < likeCount; i++) {
      items.push(
        <FontAwesomeIcon
          style={{ color: "#ffc107" }}
          icon={faStar}
        ></FontAwesomeIcon>
      );
    }
    return items;
  };
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
      <h2 className="mb-4">Good Review</h2>
      <Row xs={2} md={2} lg={3} xl={5}>
        {comments.map((comment, i) => (
          <Col key={i} className="mb-3">
            <Card 
              className="shadow bg-white"
              
              style= { i === 1 || i ===3 ? { border: "none", borderRadius: "10px",height:"350px", marginTop : "100px" } : { border: "none", borderRadius: "10px",height:"350px" }}
              
            >
              <Card.Header
                style={{
                  backgroundColor: "white",
                  border: "1px solid #f6f6f6",
                  borderRadius: "10px",
                }}
              >
                <Link
                    className="d-inline-block text-truncate"
                    style={{
                      maxWidth: "100% ",
                      color: "black",
                      fontSize: "18px",
                      textDecoration: "none",
                    }}
                    to={`/product/${comment.product._id}`}
                  >
                    <ShowImage item={comment.product} url="product" />
                  </Link>
                
              </Card.Header>
              <Card.Body>
                <Card.Title>
                <span
                    className="d-inline-block text-truncate"
                    style={{ maxWidth: "100% " }}
                  >
                    {comment.user.name}
                  </span>
                </Card.Title>
                <Card.Text>    
                  <Row>
                    <Col xs={12} className="text-center">
                      <h6 className="font-italic">{loadLikeCount(comment.likeCount)}</h6>
                    </Col>
                    <Col style = {{textAlign:"center"}} xl={12}>{comment.content}</Col>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Home;
