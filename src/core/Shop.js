import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import CardProduct from "./Card";
import { getCategories, getFilteredProducts, getBranches } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";
import Search from "./Search";
import { Card, Container, Row, Col } from "react-bootstrap";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [], branch: [] },
  });
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [setError] = useState(false);
  const [limit] = useState(9);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const init = async () => {
    const categories = await getCategories();
    if (categories.error) return setError(categories.error);
    const branches = await getBranches();
    if (branches.error) return setError(branches.error);
    setCategories(categories);
    setBranches(branches);
  };

  const loadFilteredResults = async (newFilters) => {
    const filter = await getFilteredProducts(skip, limit, newFilters);
    if (filter.error) return setError(filter.error);
    setFilteredResults(filter.data);
    setSize(filter.count);
    setSkip(0);
  };

  const loadMore = async () => {
    const toSkip = skip + limit;
    const filterProduct = await getFilteredProducts(
      toSkip,
      limit,
      myFilters.filters
    );
    if (filterProduct.error) return setError(filterProduct.error);
    setFilteredResults([...filteredResults, ...filterProduct.data]);
    setSize(filterProduct.count);
    setSkip(toSkip);
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <div style={{textAlign: "center"}}>
        <button style={{borderRadius: "5px"}} onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
        </div>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <Layout>
      <Row>
        <Col lg={3}>
          <Card style={{ border: "none" }}>
            <Container className="mt-4 ml-2 mb-4">
              <h4>Filter by categories</h4>
              <ul>
                <Checkbox
                  categories={categories}
                  handleFilters={(filters) =>
                    handleFilters(filters, "category")
                  }
                />
              </ul>
              <h4>Filter by branches</h4>
              <ul>
                <Checkbox
                  categories={branches}
                  handleFilters={(filters) => handleFilters(filters, "branch")}
                />
              </ul>
              <h4>Filter by price range</h4>
              <div>
                <RadioBox
                  prices={prices}
                  handleFilters={(filters) => handleFilters(filters, "price")}
                />
              </div>
            </Container>
          </Card>
        </Col>

        <Col lg={9}>
          <Search />
          <h2 className="mb-3">Products</h2>
          <Row xs={1} md={2} lg={3}>
            {filteredResults.map((product, i) => (
              <Col key={i} className="mb-3">
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
          <hr />
          {loadMoreButton()}
        </Col>
      </Row>
    </Layout>
  );
};

export default Shop;
