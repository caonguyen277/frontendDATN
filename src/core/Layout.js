import React from "react";
import Menu from "./Menu";
import { Container } from "react-bootstrap";
import "../styles.css";
import Footer from "./Footer"

const Layout = ({ className, children }) => (
  <div>
    <Menu />
    <Container>
      <div className={className}>{children}</div>
    </Container>
    <Footer/>
  </div>
);

export default Layout;
