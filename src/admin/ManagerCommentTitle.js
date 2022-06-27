import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import { deleteCommentTitle, getCommentTitle } from "./apiAdmin";

const ManagerComments = () => {
  const [comments, setComment] = useState([]);
  const [success, setSuccess] = useState(false);
  const { user, token } = isAuthenticated();

  const loadComments = async () => {
    const comments = await getCommentTitle();
    console.log(comments);
    setComment(comments);
  };
  const commentDelete = async (commentId) => {
    const comment = await deleteCommentTitle(commentId, user._id, token);
    if (comment.error) return console.log(comment.error);
    loadComments();
    setSuccess(true);
  };

  const showSuccess = () => {
    if (success) {
      return (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Comment delete successfully!!!
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <Layout className="container-fluid">
      {showSuccess()}
      <div className="card" style={{ paddingBottom: "20px" }}>
        <h2  className="mt-2 text-center text-warning">Total {comments.length} comments</h2>
        <div
          style={{
            paddingLeft: "20px",
            paddingBottom: "10px",
          }}
        >
        </div>
        <table
          className="table-sm  table-bordered table-striped table-hover text-lg-center"
          style={{
            color: "#495057",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <thead>
            <tr>
              <th className="text-left">Product id</th>
              <th className="text-left">User name</th>
              <th>Content</th>
              <th>Created on</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((p, i) => (
              <tr key={i}>
                <td className="text-left">{p.product._id}</td>
                <td className="text-left">{p.user.name}</td>
                <td className="text-left">
                  <h1>Title : {p.title}</h1>
                  <h1>Content : {p.content}</h1>
                </td>
                <td>{moment(p.createdAt).fromNow()}</td>
                <td>
                  <button
                    onClick={() => commentDelete(p._id)}
                    className="text-muted"
                    style={{ border: "none", backgroundColor: "transparent" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ManagerComments;
