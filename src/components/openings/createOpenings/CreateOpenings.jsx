import { Editor } from "@tinymce/tinymce-react";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategoryPost, addJobPost, createCategoryAndGetAllCategory, createJobAndGetAllJobs, deleteCategoryAndGetAllCategory, deleteCategoryPost, getCategory, getJobs, updateJobAndGetAllJobs } from "../../../redux/jobsSlice";
import "../../blogs/textEditor/texteditor.css";
import "../openingDetails/openingdetails.css";
import "./createopening.css";


import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { CgBriefcase } from "react-icons/cg";
import { RxClock } from "react-icons/rx";
import { TfiLocationPin } from "react-icons/tfi";
import { Modal, Table } from "antd";
const { Column } = Table;
import { Link, useNavigate, useParams } from "react-router-dom";

const data = [
  {
    key: '1',
    categoryName: 'Technology',
  },
  {
    key: '2',
    categoryName: 'Marketing',
  },
  {
    key: '3',
    categoryName: 'Sales',
  },
];

const Openings = () => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const params = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobCategoryOpen, setIsJobCategoryOpen] = useState(false);
  // const [isAlertOpen, setIsAlertOpen] = useState(false);

  const jobsData = useSelector(state => state.jobs.jobsData?.data?.allJobs)
  const currentJobData = jobsData?.filter((data) => data.id == params.id)[0]
  console.log(currentJobData)

  const categoryData = useSelector(state => state.jobs.categoryData?.data?.allCategory)
  // console.log(categoryData);


  // console.log(params.id)

  useEffect(() => {
    dispatch(getJobs());
    dispatch(getCategory())
  }, []);

  const [addCategoryName, setAddCategoryName] = useState("")
  // console.log(addCategoryName);

  const inputCategoryName = (e) => {
    setAddCategoryName(e.target.value)
  };

  const handleAddCategory = () => {
    dispatch(createCategoryAndGetAllCategory({
      categoryName: addCategoryName
    }))
  }

  const handleDeleteCategoryName = (id) => {
    console.log(id);
    dispatch(deleteCategoryAndGetAllCategory(id))
  }

  // const hadleDeleteJob = () => {
  //   dispatch(deleteCategoryAndGetAllCategory(id))
  //   navigate('/admin/allopenings')
  //   setIsAlertOpen(false)
  // }

  


  useEffect(() => {
    setJobDetails({
      jobCategory: "" || currentJobData?.job_category,
      jobRole: "" || currentJobData?.job_role,
      experience: "" || currentJobData?.experience,
      jobLocation: "" || currentJobData?.job_location,
      jobType: "" || currentJobData?.job_type,
      // startDate: new Date("" || currentJobData?.start_date),
      // endDate: "" || currentJobData?.end_date.replace(/\//g, '-'),
      endDate: "" || currentJobData?.end_date.replace(/\//g, '-'),
      blogDate: new Date().toLocaleDateString(),
      description: "" || currentJobData?.description,
    });
  }, [currentJobData]);




  const [jobDetails, setJobDetails] = useState({
    jobCategory: "" || currentJobData?.job_category,
    jobRole: "" || currentJobData?.job_role,
    experience: "" || currentJobData?.experience,
    jobLocation: "" || currentJobData?.job_location,
    jobType: "" || currentJobData?.job_type,
    // startDate: "" || new Date(currentJobData?.start_date),
    endDate: "" || currentJobData?.end_date.replace(/\//g, '-'),
    blogDate: new Date().toLocaleDateString(),
    description: "" || currentJobData?.description,
  });
  console.log(jobDetails);

  const inputJobData = (e) => {
    setJobDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleEditorChange = (e) => {
    setJobDetails((prev) => {
      return {
        ...prev,
        description: editorRef.current.getContent(),
      };
    });
  };

  const handleSelectCategoryName = (name) => {
    console.log(name);
    setJobDetails((prev) => {
      return {
        ...prev,
        jobCategory: name,
      };
    });
    setIsJobCategoryOpen(false)
  }

  // console.log(moment(jobDetails.startDate).format("YYYY/MM/DD"));
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(jobDetails);

    if (params.id) {
      dispatch(updateJobAndGetAllJobs({
        data: {
          jobCategory: jobDetails.jobCategory,
          jobRole: jobDetails.jobRole,
          experience: jobDetails.experience,
          jobLocation: jobDetails.jobLocation,
          jobType: jobDetails.jobType,
          // startDate: moment(jobDetails.startDate).format("YYYY/MM/DD"),
          endDate: moment(jobDetails.endDate).format("DD/MM/YYYY"),
          description: jobDetails.description
        },
        id: params.id
      }))
    } else {
      dispatch(createJobAndGetAllJobs({
        jobCategory: jobDetails.jobCategory,
        jobRole: jobDetails.jobRole,
        experience: jobDetails.experience,
        jobLocation: jobDetails.jobLocation,
        jobType: jobDetails.jobType,
        // startDate: moment(jobDetails.startDate).format("YYYY/MM/DD"),
        endDate: moment(jobDetails.endDate).format("DD/MM/YYYY"),
        description: jobDetails.description,
      }))
    }
    navigate('/admin/allopenings')
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };




  return (
    <>
      <div className="text_editor">
        <h1 className="editor_heading">{params.id ? "Update Job Opening" : "Create Job Opening"}</h1>
        <form className="blog_form">
          <label className="blog_labels">Enter Job Category</label>
          <input className="blog_inputs" type='text' name="jobCategory" value={jobDetails.jobCategory} onClick={() => setIsJobCategoryOpen(true)} placeholder="Choose Category" />
          <Modal footer={false} open={isJobCategoryOpen} onCancel={() => setIsJobCategoryOpen(false)} >
            <div className="add-category-container">
              <div className="add-category-input">
                <input value={addCategoryName} name="categoryName" type="text" placeholder="Add category name" onChange={inputCategoryName} />
                <button onClick={handleAddCategory}>add category</button>
              </div>
              <Table className="applications_table" dataSource={categoryData}>
                <Column className="table-column-style" title="Category Name" dataIndex={"category_name"} key={"category_name"} />
                <Column className="table-column-styl" title="Delete" dataIndex={"category_id"} key="category_id" render={(id) => {
                  return (
                    <AiFillDelete className="category-icons-delete" onClick={() => handleDeleteCategoryName(id)} />
                  )
                }} />
                 {/* <Modal open={isAlertOpen} onCancel={()=> setIsAlertOpen(false)} footer={null} ><Alert onYes={hadleDeleteJob} onNo={()=> setIsAlertOpen(false)}/></Modal> */}
                <Column className="table-column-styl" title="Resume" dataIndex={"category_name"} key="category_name" render={(name) => {
                  return (
                    <button className="category-select" onClick={() => handleSelectCategoryName(name)}>Select</button>
                  )
                }} />
              </Table>
            </div>
          </Modal>
          <label className="blog_labels">Enter Job Role</label>
          <input
            value={jobDetails.jobRole}
            name="jobRole"
            onChange={inputJobData}
            className="blog_inputs"
            type="text"
            placeholder="Job Role"
          />
          <label className="blog_labels">
            Required Experience <span> (format : 0 - 2 years)</span>
          </label>
          <input
            value={jobDetails.experience}
            name="experience"
            onChange={inputJobData}
            className="blog_inputs"
            type="text"
            placeholder="Job Requried Experience"
          />
          <label className="blog_labels">Enter Job Location</label>
          <input
            value={jobDetails.jobLocation}
            name="jobLocation"
            onChange={inputJobData}
            className="blog_inputs"
            type="text"
            placeholder="Job Location"
          />
          <label className="blog_labels">Select Job Type</label>
          <select
            name="jobType"
            id="jobType"
            value={jobDetails.jobType}
            className="blog_inputs"
            onChange={inputJobData}
          >
            <option value="">Choose</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
            <option value="Other">Other</option>
          </select>
          <label className="blog_labels">Enter End Date</label>
          <input
            style={{ width: 200 }}
            value={jobDetails.endDate}
            name="endDate"
            onChange={inputJobData}
            className="blog_inputs"
            type="date"
          />
          <Editor
            apiKey="0admgbzr85ez3s894urkrud61apxtfi7trszikrbisl2sl22"
            onInit={(evt, editor) => (editorRef.current = editor)}
            // initialValue="<p>This is the initial content of the editor.</p>"
            init={{
              height: 500,
              menubar: false,
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
              ],
              toolbar: [
                "undo redo | casechange blocks | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
              ],
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={handleEditorChange}
            value={jobDetails.description}
          />
          <button
            className="blog_submit_btn"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            {params.id ? "Update Job" : "Create Job"}
          </button>
        </form>

        <h1 className="preview_heading">Preview</h1>

        <div className='job_details_page'>
          <div>
            <div className='job_card'>
              <div className='job_category_date'>
                <b>{jobDetails?.jobCategory}</b>
                <p>{jobDetails?.endDate}</p>
              </div>
              <h2>{jobDetails?.jobRole}</h2>
              <p>We are looking for an {jobDetails?.jobRole} to join our team.</p>
              <div className='job_info_details'>
                <div className='job_info'>
                  <span><CgBriefcase />{jobDetails?.experience}</span>
                  <span><RxClock />{jobDetails?.jobType}</span>
                  <span><TfiLocationPin />{jobDetails?.jobLocation}</span>
                </div>
                <p className='job_view_details' onClick={showModal}>Apply for this post</p>
                <Modal footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  <form className='application_form'>
                    <div className='name_input'>
                      <input type="text" placeholder='First Name' className='job_input' />
                      <input type="text" placeholder='Last Name' className='job_input' />
                    </div>
                    <input type="email" placeholder='E-mail id' className='job_input' />
                    <input type="number" placeholder='Contact No.' className='job_input' />
                    <div className='file_input'>
                      <input type="file" />
                      <button className='file_upload_btn'>Upload Resume</button>
                    </div>
                    <p className='file_upload_msg'>Resume uploaded successfully...!</p>
                    <input type="button" value="Submit" className='job_input_submit' />
                  </form>
                </Modal>
              </div>
              <div className="preview_container_box">
                <div
                  dangerouslySetInnerHTML={{ __html: jobDetails?.description }}
                />
              </div>
            </div>
          </div>
        </div>



      </div>
    </>
  );
};

export default Openings;
