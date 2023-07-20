import React, { useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import "./card.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteBlogAndGetAllBlogs } from "../../../redux/blogsSlice";
import { Modal } from "antd";
import Alert from "../../comman/alert/Alert";

const Card = ({ item, index }) => {

  const dispatch = useDispatch()
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDeleteBlog = (id) => {
    // console.log(id);
    dispatch(deleteBlogAndGetAllBlogs(id))
    setIsAlertOpen(false)
  }

  return (
    <div key={index} className="recent_blogs_card">
      <div className="recent_blogs_card_data">
        <Link to={`/admin/blogs/${item.id}`}><img className="blog_img" src={item.blog_thumbnail} alt="" /></Link>
        <h3>{item.blog_title}</h3>
        <p>10 Sep 2022</p>
        <p className="blog_text">{item.blog_overview}</p>
        <p className="blogs_read_more">Read more...</p>
      </div>
      <div className="blogs_option_icon">
        <Link to={`/admin/texteditor/${item.id}`}>
          <AiFillEdit color="rgb(76, 156, 76)" />
        </Link>
        <AiFillDelete color="rgb(224, 66, 66)" onClick={() => setIsAlertOpen(true)} />
        <Modal open={isAlertOpen} onCancel={()=> setIsAlertOpen(false)} footer={null} ><Alert onYes={()=>handleDeleteBlog(item.id)} onNo={()=> setIsAlertOpen(false)}/></Modal>
      </div>
    </div>
  );
};

export default Card;
