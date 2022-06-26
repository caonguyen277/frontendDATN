import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="text-center" style={{display: 'flex', justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <h1 style={{paddingRight: 20}}>
        Not Found!
      </h1> 
      
      <Link to="/">
        <h3>Back to home</h3>
        </Link>
    </div>
  );
};

export default PageNotFound;
