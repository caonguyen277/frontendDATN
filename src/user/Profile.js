import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

const Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
  });
  const [showDis,setShowDis] = useState(true);
  const { token } = isAuthenticated();
  const {
    user: {role },
  } = isAuthenticated();
  const { name, email, password, success } = values;

  const init = async (userId) => {
    const data = await read(userId, token);
    if (data.error) return setValues({ ...values, error: true });
    setValues({ ...values, name: data.name, email: data.email });
  };

  useEffect(() => {
    init(match.params.userId);
  }, []);

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    update(match.params.userId, token, { name, email, password }).then(
      (data) => {
        if (data.error) {
          console.log("data.error");
        } else {
          updateUser(data, () => {
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true,
            });
          });
        }
      }
    );
  };

  const redirectUser = (success) => {
    if (success && role === 0) {
      return <Redirect to="/user/dashboard" />;
    }
    if(success && role ===1)
    return <Redirect to ="/admin/dashboard"/>;
  };

  const profileUpdate = (name, email, password) => (
    <form onSubmit={(e) => clickSubmit(e)}>
      <div style={{marginLeft: "25%",width: "50%"}} className="form-group">
        <label className="text-muted">Name</label>
        <input
        required
          type="text"
          onChange={handleChange("name")}
          className="form-control css-inputForm-Signup"
          value={name}
        />
      </div>
      <div style={{marginLeft: "25%",width: "50%"}} className="form-group">
        <label className="text-muted">Email</label>
        <input
        required
          type="email"
          onChange={handleChange("email")}
          className="form-control css-inputForm-Signup"
          value={email}
        />
      </div>
      <div style={{marginLeft: "25%",width: "50%"}} className="form-group">
        <label className="text-muted">Password</label>
        <input
          disabled = {showDis}
          type="password"
          onChange={handleChange("password")}
          className="form-control css-inputForm-Signup" 
          value={password}
        />
          
      </div>

      <button type="submit" style={{marginLeft: "68%"}}  className="btn btn-warning">
        Submit
      </button>
    </form>
    
  );

  return (
    <Layout
      title="Profile"
      description="Update your profile"
      className="container-fluid"
    >
      <h2 className="mb-4">Profile update</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
      <button onClick={() => setShowDis(!showDis)} className="mt-2 btn btn-warning">Update Password</button>
    </Layout>
  );
};

export default Profile;
