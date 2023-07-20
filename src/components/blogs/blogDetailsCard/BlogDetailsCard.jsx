import React from "react";
import { AiFillLike } from "react-icons/ai";
import "../textEditor/texteditor.css";
import tempImg from "../../../assets/1.jpg";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const BlogDetailsCard = () => {

  const dispatch = useDispatch()
  const params = useParams()
  // console.log(params);

  const blogData = useSelector(state => state.blogs.blogsData?.data?.allBlogs);

  let currentBlog = blogData?.filter((data)=> data.id == params.id)[0]
  // console.log(currentBlog);

  return (
    <div className='blogs'>
      <Link to={`/admin/texteditor/${params.id}`} className="create_blogs">Update Blog</Link>
      <div className="preview_templet">
        <img className="preview_image" src={currentBlog.blog_thumbnail} alt="thumbnail" />
        <h2 className="preview_title">{currentBlog.blog_title}</h2>
        <div className="preview_date_name">
          <p>{currentBlog.blog_date}</p>
          <p>{currentBlog.author_name}</p>
        </div>
        <p className="preview_likes">
          <AiFillLike />
          10 Likes
        </p>
        <div dangerouslySetInnerHTML={{ __html: currentBlog.description }} />
      </div>
    </div>
  );
};

export default BlogDetailsCard;
