import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { getBranch, updateBranch } from "./apiAdmin";

const UpdateBranch = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    redirectToDashboard: false,
    formData: "",
  });
  const [error, setError] = useState(false);
  const { user, token } = isAuthenticated();

  const { name, redirectToDashboard } = values;

  const init = async (branchId) => {
    const branches = await getBranch(branchId, token);
    if (branches.error) return setValues({ ...values, error: branches.error });
    setValues({ ...branches, name: branches.name });
  };

  useEffect(() => {
    init(match.params.branchId);
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
    setError("");
  };

  const submitBranchForm = async (e) => {
    e.preventDefault();
    const branch = {
      name: name,
    };
    setError("");
    const submit = await updateBranch(
      match.params.branchId,
      user._id,
      token,
      branch
    );
    if (submit.error)
      return [
        setError(submit.error),
        setValues({ ...values, error: submit.error }),
        console.log("fail"),
      ];
    setError("");
    setValues({ ...values, name: submit.name, redirectToDashboard: true });
    console.log("ok");
  };

  const updateBranchForm = () => (
    <form className="mb-5" onSubmit={submitBranchForm}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          className="form-control"
          type="text"
          required
          name="name"
        />
      </div>

      <button type="submit" className="btn btn-outline-primary">
        Save Changes
      </button>
    </form>
  );

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Branch is already exists</h3>;
    }
  };

  const redirectUser = () => {
    if (redirectToDashboard) {
      if (!error) {
        return <Redirect to="/admin/branches" />;
      }
    }
  };

  const backToDashboard = () => {
    return (
      <div className="mt-5">
        <Link to="/admin/branches" className="text-info">
          Back To Manage Branches
        </Link>
      </div>
    );
  };

  return (
    <Layout className="container-fluid">
      <div className="row">
        <div className="col-md-8 offset-md-2 m-b-250 mb-5">
          {showError()}
          {updateBranchForm()}
          {backToDashboard()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateBranch;
