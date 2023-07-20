import React, { useEffect } from "react";
import "./blogs.css";
import { Link } from "react-router-dom";
import Card from "../card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../../../redux/blogsSlice";
import LoadingSkeleton from "../../comman/skeleton/LoadingSkeleton";

const Blogs = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.blogs.loader);
  // console.log(loading);
  const blogData = useSelector(
    (state) => state.blogs.blogsData?.data?.allBlogs
  );
  // console.log(blogData);

  useEffect(() => {
    dispatch(getBlogs());
  }, []);

  return (
    <>
      {loading === true ? (
        <LoadingSkeleton/>
      ) : (
        <div className="blogs">
          <Link to={"/admin/texteditor"} className="create_blogs">
            Create Blog
          </Link>
          <h1 className="blogs_heading">Blogs</h1>
          <div className="recent_blogs">
            {blogData?.map((item, index) => {
              return <Card item={item} index={index} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
