import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faHeart,
  faStar,
  faStarHalfStroke,
  faStarOfLife,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import {
  read,
  listCategoryRelated,
  listBranchRelated,
  apiListComment,
  createComment,
  apiListFavourite,
  apiAddFavourite,
  apiSubFavourite,
  apiDeleteComment,
} from "./apiCore";
import CardProduct from "./Card";
import moment from "moment";
import ShowImage from "./ShowImage";
import { addItem } from "./cartHelpers";
import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Tab,
  Nav,
  Form,
  Accordion,
} from "react-bootstrap";
import { isAuthenticated } from "../auth";
const Product = (props) => {
  const [productId, setProductId] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [product, setProduct] = useState({});
  const [des, setDes] = useState([]);
  const [userGuide, setUserGuide] = useState([]);
  const [relatedCategoryProduct, setRelatedCategoryProduct] = useState([]);
  const [relatedBranchProduct, setRelatedBranchProduct] = useState([]);
  const [redirect, setRedirect] = useState(false);
  // Comment
  const [listComment, setListComment] = useState([]);
  const [comment, setComment] = useState({
    user: "",
    product: "",
    title: "",
    content: "",
    likeCount: 5,
  });
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
  //Favourite
  const handleAddFavourite = async () => {
    setFavourite(true);
    const data = await apiAddFavourite(productId, _id);
    if (!data.message) {
      setFavourite(false);
    }
  };
  const handleSubFavourite = async () => {
    setFavourite(false);
    const data = await apiSubFavourite(productId, _id);
    if (!data.message) {
      setFavourite(true);
    }
  };
  const loadFavourite = async (userId, productId) => {
    const data = await apiListFavourite(userId);
    const array = data.products.filter((el, index) => {
      if (el._id === productId) return el;
    });
    if (array.length !== 0) {
      setFavourite(true);
    } else {
      setFavourite(false);
    }
  };
  const name = isAuthenticated() && isAuthenticated().user.name;
  const _id = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const changeContent = (name) => (e) => {
    // if(name = "likeCount") = parseInt(e.target.value);
    setComment({ ...comment, [name]: e.target.value });
    console.log(comment);
  };
  const submitComment = async (e) => {
    e.preventDefault();
    console.log(comment);
    const data = await createComment(comment, token);
    if (data.error) {
      return console.log(data.error);
    }
    setListComment(data.reverse());
  };
  const loadListComment = async (productId) => {
    const data = await apiListComment(productId);
    if (data.error) {
      return console.log(data.error);
    }
    setListComment(data.reverse());
    console.log(listComment);
  };
  const handleDeleteComment = async (comment) => {
    console.log(comment);
    const data = await apiDeleteComment(comment, token);
    if (data.error) {
      return console.log(data.error);
    }
    setListComment(data.reverse());
    console.log(listComment);
  };
  const loadSingleCategoryProduct = async (productId) => {
    const categoryProduct = await read(productId);
    if (categoryProduct.error) return console.log(categoryProduct.error);
    const des = categoryProduct.descriptionProduct.split("-");
    const gui = categoryProduct.userGuide.split("-");
    setProduct(categoryProduct);
    setDes(des);
    setUserGuide(gui);
    const category = await listCategoryRelated(categoryProduct._id);
    if (category.error) return console.log(category.error);
    setRelatedCategoryProduct(category);
  };

  const loadSingleBranchProduct = async (productId) => {
    const branchProduct = await read(productId);
    if (branchProduct.error) return console.log(branchProduct.error);
    const des = branchProduct.descriptionProduct.split("-");
    const gui = branchProduct.userGuide.split("-");
    setProduct(branchProduct);
    setDes(des);
    setUserGuide(gui);
    const branchRelate = await listBranchRelated(branchProduct._id);
    if (branchRelate.error) return console.log(branchRelate.error);
    setRelatedBranchProduct(branchRelate);
  };

  const showStock = (countInStock) => {
    return countInStock > 0 ? (
      <p className="font-weight-bold text-warning">In Stock </p>
    ) : (
      <p className="font-weight-bold text-danger">Out of Stock </p>
    );
  };

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
      <div></div>
    );
  };
  useEffect(() => {
    const productId = props.match.params.productId;
    setProductId(productId);
    loadSingleCategoryProduct(productId);
    loadSingleBranchProduct(productId);
    loadFavourite(_id, productId);
    loadListComment(productId);
    setComment({ ...comment, product: productId, user: _id });
  }, [props.match.params.productId]);

  return (
    <Layout>
      <Card style={{ marginBottom: "2rem", border: "none" }}>
        <Container
          className="row"
          style={{ paddingTop: 30, paddingBottom: 30, position: "relative" }}
        >
          <Row className="col-4">
            <ShowImage item={product} url="product" />
          </Row>
          <Row className="col-5 pr-20" style={{ paddingRight: 40 }}>
            <Card.Text>
              <h4 className="font-weight-bold">{product.name}</h4>
              <h5>Category: {product.category && product.category.name}</h5>
              <p>{product.description}</p>
              <span className="font-italic font-weight-light">
                Added on {moment(product.createdAt).fromNow()}
              </span>
            </Card.Text>
          </Row>
          <Row className="col-3" style={{ paddingRight: 40, marginBottom: 40 }}>
            <Card>
              <Card.Title
                className="text-center mt-3 font-weight-bold"
                style={{ paddingBottom: 15 }}
              >
                {product.name}
              </Card.Title>
              <Card.Text>
                <Row className="text-xs-center text-lg-center">
                  <Col xs={6}>Price:</Col>
                  <Col xs={6}>
                    <h5>${product.price} </h5>
                  </Col>
                </Row>
                <hr />
                <Row className="text-xs-center text-lg-center">
                  <Col xs={6}>Status: </Col>
                  <Col xs={6}>
                    <h5>{showStock(product.countInStock)}</h5>
                  </Col>
                </Row>
                {shouldRedirect(redirect)}
                <h1 className="text-center">
                  {showAddToCart(product.countInStock)}
                </h1>
              </Card.Text>
            </Card>
          </Row>
          {favourite ? (
            <div
              style={{ position: "absolute", width: "100px", right: "-23px" }}
            >
              <FontAwesomeIcon
                className="css-Icon"
                onClick={() => handleSubFavourite()}
                style={{ cursor: "pointer", color: "red" }}
                icon={faHeart}
              />
            </div>
          ) : (
            <div
              style={{ position: "absolute", width: "100px", right: "-23px" }}
            >
              <FontAwesomeIcon
                className="css-Icon"
                onClick={() => handleAddFavourite()}
                style={{ cursor: "pointer", color: "black" }}
                icon={faHeart}
              />
            </div>
          )}
        </Container>
      </Card>
      <Card style={{ border: "none", minHeight: "500px" }}>
        <Container>
          <h4 style={{ marginTop: 20, marginBottom: 20 }}>
            Viết đánh giá sản phẩm
          </h4>
          <>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link className="css-NavLink" eventKey="first">
                        Mổ tả sản phẩm
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="css-NavLink" eventKey="second">
                        Hướng dẫn sử dụng
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="css-NavLink" eventKey="third">
                        Thành phần
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="css-NavLink" eventKey="four">
                        Đánh giá và nhận xét
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <h4 style={{ color: "#9d691b" }}>Mô tả sản phẩm</h4>
                      <div
                        style={{
                          width: "200px",
                          height: "1px",
                          backgroundColor: "#9d691b",
                          marginBottom: "20px",
                        }}
                      ></div>

                      {des.map((el, index) => (
                        <div className="content">
                          <p>-{el}</p>
                        </div>
                      ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <h4 style={{ color: "#9d691b" }}>Hướng dẫn sử dụng</h4>
                      <div
                        style={{
                          width: "200px",
                          height: "1px",
                          backgroundColor: "#9d691b",
                          marginBottom: "20px",
                        }}
                      ></div>
                      {userGuide.map((el, index) => (
                        <div className="content">
                          <p>-{el}</p>
                        </div>
                      ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <h4 style={{ color: "#9d691b" }}>Thành Phần</h4>
                      <div
                        style={{
                          width: "200px",
                          height: "1px",
                          backgroundColor: "#9d691b",
                          marginBottom: "20px",
                        }}
                      ></div>
                      <div className="content">
                        <p>{product.ingredients}</p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="four">
                      <h4 style={{ color: "#9d691b" }}>Đánh giá</h4>
                      <div
                        style={{
                          width: "200px",
                          height: "1px",
                          backgroundColor: "#9d691b",
                          marginBottom: "20px",
                        }}
                      ></div>
                      {isAuthenticated() && (
                        <Row>
                          <Accordion>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>Viết đánh giá</Accordion.Header>
                              <Accordion.Body>
                                <Form onSubmit={(e) => submitComment(e)}>
                                  <Row>
                                    <Col xl={8}>
                                      <Form.Group className="mb-3">
                                        <Form.Label>
                                          Tiêu đề (có hoặc không)
                                        </Form.Label>
                                        <Form.Control
                                          onChange={changeContent("title")}
                                          type="text"
                                          placeholder="Nhập tiêu đề..."
                                        />
                                      </Form.Group>
                                    </Col>
                                    <Col xl={4}>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Đánh giá 5 Sao</Form.Label>
                                        <Form.Select
                                          onChange={changeContent("likeCount")}
                                          value={comment.likeCount}
                                        >
                                          <option value="1">1 Sao</option>
                                          <option value="2">2 Sao</option>
                                          <option value="3">3 Sao</option>
                                          <option value="4">4 Sao</option>
                                          <option value="5">5 Sao</option>
                                        </Form.Select>
                                        <div style={{ textAlign: "center" }}>
                                          {loadLikeCount(comment.likeCount)}
                                        </div>
                                      </Form.Group>
                                    </Col>
                                  </Row>

                                  <Form.Group>
                                    <Form.Label>Đánh giá</Form.Label>
                                    <Form.Control
                                      as="textArea"
                                      required
                                      onChange={changeContent("content")}
                                      type="text"
                                      placeholder="Nhập đánh giá..."
                                    />
                                  </Form.Group>
                                  <div style={{display :"flex",justifyContent: "flex-end",marginTop: "20px"}}>
                                  <Button
                                    type="submit"
                                    style={{ width: "70px",color: "black" }}
                                    variant="outline-warning"
                                  >
                                    
                                    Gửi
                                  </Button>
                                  </div>
                                  
                                </Form>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Row>
                      )}
                      {listComment &&
                        listComment.map((el, index) => (
                          <Row key={el._id}>
                            <div
                              style={{
                                witdh: "100%",
                                height: "80px",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{
                                  width: "20%",
                                  padding: "20px",
                                  border: "1px solid rgb(223 223 223)",

                                  backgroundColor: "beige",
                                }}
                              >
                                <h1>{el.user.name}</h1>
                                <p>
                                  {el.updatedAt
                                    ? el.updatedAt.slice(0, 10)
                                    : "0"}
                                </p>
                              </div>
                              <div
                                style={{
                                  width: "80%",
                                  border: "1px solid rgb(223 223 223)",
                                  padding: "20px",
                                  backgroundColor: "beige",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      maxHeight: "100%",
                                      display: "inline-block",
                                      width: "80%",
                                    }}
                                    className="div-Content-Commet"
                                  >
                                    <h6>Tiêu đề: {el.title}</h6>
                                    <p>Đánh giá: {el.content}</p>
                                  </div>
                                  <div
                                    style={{
                                      maxHeight: "100%",
                                      display: "inline-block",
                                      width: "20%",
                                      position: "relative",
                                    }}
                                    className="div-likeCount-Comment"
                                  >
                                    {isAuthenticated().user._id ===
                                    el.user._id ? (
                                      <div>
                                        <span
                                          onClick={() =>
                                            handleDeleteComment(el)
                                          }
                                          style={{
                                            cursor: "pointer",
                                            right: "0",
                                            top: "-37px",
                                            position: "absolute",
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            style={{ height: "0.7rem" }}
                                            icon={faX}
                                          ></FontAwesomeIcon>
                                        </span>
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {loadLikeCount(el.likeCount)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Row>
                        ))}
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </>
        </Container>
      </Card>

      <Card style={{ border: "none" }}>
        <Container>
          <h4 style={{ marginTop: 20, marginBottom: 20 }}>Related products</h4>
          <div className="row">
            {relatedCategoryProduct.map((p, i) => (
              <div key={i} className="col-3 mb-3">
                <CardProduct product={p} />
              </div>
            ))}
          </div>
        </Container>
      </Card>
      <br />
      <Card style={{ border: "none" }}>
        <Container>
          <h4 style={{ marginTop: 20, marginBottom: 20 }}>Related branches</h4>
          <div className="row">
            {relatedBranchProduct.map((c, a) => (
              <div key={a} className="col-3 mb-3">
                <CardProduct product={c} />
              </div>
            ))}
          </div>
        </Container>
      </Card>
    </Layout>
  );
};

export default Product;
