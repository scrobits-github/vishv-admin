import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useRef, useState } from "react";
import "./texteditor.css";
import { AiFillDelete, AiFillLike } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GoCloudUpload } from "react-icons/go";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlogPost,
  createBlogAndGetAllBlogs,
  getBlogs,
  updateBlogAndGetAllBlogs,
  updateBlogPost,
} from "../../../redux/blogsSlice";
import moment from "moment";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { Modal, notification, Upload } from "antd";
import { deleteImage, uploadImage } from "../../../services/imageUpload";
import Alert from "../../comman/alert/Alert";

const TextEditor = () => {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [thumbnailImg, setThumbnailImg] = useState("");
  const [displayThumnailImgInput, setDisplayThumnailImgInput] = useState(true);
  const [inputImageLink, setInputImageLink] = useState([]);
  const [thumbnailImgUploadSuccessfull, setThumbnailImgUploadSuccessfull] =
    useState(false);

  const blogData = useSelector(
    (state) => state.blogs.blogsData?.data?.allBlogs
  );
  const currentBlogData = blogData?.filter((data) => data.id == params.id)[0];
  // console.log(currentBlogData);

  useEffect(() => {
    dispatch(getBlogs());
  }, []);

  useEffect(() => {
    setBlogDetails({
      blogTitle: "" || currentBlogData?.blog_title,
      blogAuthorName: "" || currentBlogData?.author_name,
      blogThumbnail: "" || currentBlogData?.blog_thumbnail,
      blogOverview: "" || currentBlogData?.blog_overview,
      blogKeywords: "" || currentBlogData?.keywords,
      blogDate: moment().format("YYYY/MM/DD"),
      blogDescription: "" || currentBlogData?.description,
    });
  }, [currentBlogData]);

  const [blogDetails, setBlogDetails] = useState({
    blogTitle: "" || currentBlogData?.blog_title,
    blogAuthorName: "" || currentBlogData?.author_name,
    blogThumbnail: "" || currentBlogData?.blog_thumbnail,
    blogOverview: "" || currentBlogData?.blog_overview,
    blogKeywords: "" || currentBlogData?.keywords,
    blogDate: moment().format("YYYY/MM/DD"),
    blogDescription: "" || currentBlogData?.description,
  });
  console.log(blogDetails);

  useEffect(() => {
    if (params.id) {
      setDisplayThumnailImgInput(false);
      if (currentBlogData?.blog_thumbnail === "") {
        setDisplayThumnailImgInput(true);
      }
    }
  }, []);

  const inputBlogData = async (e) => {
    if (e.target.name === "blogThumbnail") {
      const imageLink = await uploadImage(
        e.target.files[0],
        `blogs/${blogDetails.blogTitle}/thumbnail`
      );

      // setLoader(false);
      // setShowUploadedImage(true);
      setBlogDetails((prev) => {
        return {
          ...prev,
          [e.target.name]: imageLink,
        };
      });
    } else {
      setBlogDetails((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  // const handleThumbnailImg = (e) => {
  //   setThumbnailImg(e.target.files[0]);
  // };

  const handleEditorChange = (e) => {
    setBlogDetails((prev) => {
      return {
        ...prev,
        blogDescription: editorRef.current.getContent(),
      };
    });
  };

  // const handleUploadThimnailImage = (e) => {
  //   e.preventDefault();

  //   const thumbnailImgRef = ref(storage, thumbnailImg.name);
  //   const uploadThumnailImg = uploadBytesResumable(
  //     thumbnailImgRef,
  //     thumbnailImg
  //   );

  //   uploadThumnailImg.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("upload is " + progress + "% done");
  //     },
  //     (error) => {
  //       console.log(error.message);
  //     },
  //     () => {
  //       getDownloadURL(uploadThumnailImg.snapshot.ref).then((downloadURL) => {
  //         setBlogDetails((prev) => {
  //           return {
  //             ...prev,
  //             blogThumbnail: downloadURL,
  //           };
  //         });
  //         // console.log("file available at", downloadURL);
  //         alert("file upladed successfully");
  //         setThumbnailImgUploadSuccessfull(true);
  //       });
  //     }
  //   );
  // };

  const handleDeleteThumbnailImg = (fileName, link) => {
    const imageRef = ref(storage, link);

    deleteObject(imageRef)
      .then(() => {
        console.log("File deleted successfully!");
        setBlogDetails((prev) => {
          return {
            ...prev,
            [fileName]: undefined,
          };
        });
      })
      .catch((error) => {
        console.error("Error deleting file: ", error);
      });

    // deleteObject(imageRef)
    //   .then(() => {
    //     console.log("File deleted successfully!");
    //     setDisplayThumnailImgInput(true);
    //   })
    //   .catch((error) => {
    //     console.error("Error deleting file: ", error);
    //   });
  };

  const handleEditorImages = async (e) => {
    const imageLink = await uploadImage(
      e.target.files[0],
      `blogs/${blogDetails.blogTitle}`
    );
    console.log(imageLink);
    setInputImageLink((prevState) => {
      let newData = [...prevState];
      newData.push(imageLink);
      return newData;
    });
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    notification.success({ message: "link coppied" });
  };

  const handleDeleteImgLink = (link) => {
    const imageRef = ref(storage, `${link}`);

    deleteObject(imageRef)
      .then(() => {
        console.log("File deleted from firebase!");

        setInputImageLink((prevArray) => {
          const index = prevArray.indexOf(link);
          if (index !== -1) {
            const newArray = [...prevArray];
            newArray.splice(index, 1);
            return newArray;
          } else {
            return prevArray;
          }
        });
        notification.success({ message: "File deleted successfully...!" });
        console.log("Image deleted from array!");
        console.log(inputImageLink);
      })
      .catch((error) => {
        console.error("Error deleting file: ", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (params.id) {
      dispatch(
        updateBlogAndGetAllBlogs({
          data: {
            blogTitle: blogDetails.blogTitle,
            authorName: blogDetails.blogAuthorName,
            blogThumbnail: blogDetails.blogThumbnail,
            blogOverview: blogDetails.blogOverview,
            keywords: blogDetails.blogKeywords,
            description: blogDetails.blogDescription,
            blogDate: blogDetails.blogDate,
          },
          id: params.id,
        })
      );
    } else {
      dispatch(
        createBlogAndGetAllBlogs({
          blogTitle: blogDetails.blogTitle,
          authorName: blogDetails.blogAuthorName,
          blogThumbnail: blogDetails.blogThumbnail,
          blogOverview: blogDetails.blogOverview,
          keywords: blogDetails.blogKeywords,
          description: blogDetails.blogDescription,
          blogDate: blogDetails.blogDate,
        })
      );
    }
    navigate("/admin/blogs");
    // dispatch(getBlogs());
  };

  return (
    <>
      <div className="text_editor">
        <h1 className="editor_heading">
          {params.id ? "Update Blog" : "Create Blog"}
        </h1>
        <form className="blog_form" onSubmit={(e) => handleSubmit(e)}>
          <label className="blog_labels">Enter Blog Title</label>
          <input
            value={blogDetails.blogTitle}
            name="blogTitle"
            onChange={inputBlogData}
            className="blog_inputs"
            type="text"
            placeholder="Blog Title"
            required={true}
          />
          <label className="blog_labels">Enter Author Name</label>
          <input
            value={blogDetails.blogAuthorName}
            name="blogAuthorName"
            onChange={inputBlogData}
            className="blog_inputs"
            type="text"
            placeholder="Author Name"
            required={true}
          />
          <label className="blog_labels">Upload Thumbnail Image</label>
          <div className="blog_thumbnail_img_box">

            {blogDetails?.blogThumbnail === undefined ? (
              <input
                name="blogThumbnail"
                onChange={(e) => {
                  // setLoader(true);
                  inputBlogData(e);
                }}
                className="blog_inputs_file"
                type="file"
                accept="image/*"
                required={true}
              />
            ) : (
              <div className="thumbnail-image-container">
                <img
                  src={blogDetails?.blogThumbnail}
                  alt="blogThumbnail"
                  className="thumbnail-image-style"
                />
                <MdDelete
                  onClick={() =>
                    handleDeleteThumbnailImg(
                      "blogThumbnail",
                      blogDetails?.blogThumbnail
                    )
                  }
                />
              </div>
            )}
          </div>

          <label className="blog_labels">Blog Overview</label>
          <input
            value={blogDetails.blogOverview}
            name="blogOverview"
            onChange={inputBlogData}
            className="blog_inputs"
            type="text"
            placeholder="Overview"
            required={true}
          />
          <label className="blog_labels">Keywords</label>
          <input
            value={blogDetails.blogKeywords}
            name="blogKeywords"
            onChange={inputBlogData}
            className="blog_inputs"
            type="text"
            placeholder="Keywords"
            required={true}
          />
          <label className="blog_labels">Text Editor Images</label>
          <div>
            <input
              name="blogEditorImages"
              onChange={handleEditorImages}
              className="editor-image-field"
              type="file"
              accept="image/*"
            />
            <div className="selected-images-container">
              {inputImageLink?.map((link) => {
                console.log(link);
                return (
                  <div className="editor-selected-images">
                    <img src={link} alt="images" className="input-image-link" />
                    <AiFillDelete
                      className="input-image-delete"
                      onClick={() => handleDeleteImgLink(link)}
                    />
                    <FiCopy
                      className="input-image-copy"
                      onClick={() => handleCopyLink(link)}
                    />
                    {/* <Modal
                      open={isAlertOpen}
                      onCancel={() => setIsAlertOpen(false)}
                      footer={null}
                    >
                      <Alert
                        onYes={() => handleDeleteImgLink(link)}
                        onNo={() => setIsAlertOpen(false)}
                      />
                    </Modal> */}
                  </div>
                );
              })}
            </div>
          </div>
          <Editor
            apiKey="0admgbzr85ez3s894urkrud61apxtfi7trszikrbisl2sl22"
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              height: 500,
              menubar: "insert",
              plugins: [
                "a11ychecker",
                "advlist",
                "advcode",
                "advtable",
                "autolink",
                "checklist",
                "export",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "powerpaste",
                "fullscreen",
                "formatpainter",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
                "image",
              ],
              toolbar: [
                "undo redo | casechange blocks | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                "image",
              ],
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={handleEditorChange}
            value={blogDetails.blogDescription}
          />
          <button className="blog_submit_btn" type="submit">
            {params.id ? "Update Blog" : "Create Blog"}
          </button>
        </form>

        <h1 className="preview_heading">Preview</h1>
        <div className="preview_templet">
          <img
            className="preview_image"
            src={blogDetails?.blogThumbnail}
            alt="thumbnail"
          />
          <h2 className="preview_title">{blogDetails?.blogTitle}</h2>
          <div className="preview_date_name">
            <p>{blogDetails?.blogDate}</p>
            <p>{blogDetails?.blogAuthorName}</p>
          </div>
          <p className="preview_likes">
            <AiFillLike />
            10 Likes
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: blogDetails?.blogDescription }}
          />
        </div>
      </div>
    </>
  );
};

export default TextEditor;
