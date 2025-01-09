import React from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  // Fetch post details and comments here
  return <div>Post Details for {id}</div>;
};

export default PostDetail;