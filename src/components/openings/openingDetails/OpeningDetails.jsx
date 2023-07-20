import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import "../../blogs/textEditor/texteditor.css";
import "./openingdetails.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobAndGetAllJobs,
  getApplications,
  getJobs,
} from "../../../redux/jobsSlice";
const { Column } = Table;

import { CgBriefcase } from "react-icons/cg";
import { RxClock } from "react-icons/rx";
import { TfiLocationPin } from "react-icons/tfi";
import Alert from "../../comman/alert/Alert";
import LoadingSkeleton from "../../comman/skeleton/LoadingSkeleton";

const OpeningDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getJobs());
    dispatch(
      getApplications({
        jobId: params.id,
      })
    );
  }, []);

  const jobsData = useSelector((state) => state.jobs.jobsData?.data?.allJobs);
  const currentJob = jobsData?.filter((data) => data.id == params.id)[0];
  // console.log(currentJob);

  const applicationsData = useSelector(
    (state) => state.jobs.applicationsData?.data?.allApplications
  );
  // console.log(applicationsData);
  // console.log(applicationsData.length);
  const loading = useSelector((state) => state.jobs.loader);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const hadleDeleteJob = () => {
    dispatch(deleteJobAndGetAllJobs(params.id));
    navigate("/admin/allopenings");
    setIsAlertOpen(false);
  };

  return (
    <>
      {loading === true ? (
        <LoadingSkeleton />
      ) : (
        <div className="blogs">
          <div className="job_options_btn">
            <button onClick={showModal} className="opening_btns view_btn">
              View Job Details
            </button>
            <Link
              to={`/admin/updateopenings/${currentJob?.id}`}
              className="opening_btns update_btn"
            >
              Update Job Details
            </Link>
            <button
              className="opening_btns delete_btn"
              onClick={() => setIsAlertOpen(true)}
            >
              Delete Job
            </button>
            <Modal
              open={isAlertOpen}
              onCancel={() => setIsAlertOpen(false)}
              footer={null}
            >
              <Alert
                onYes={hadleDeleteJob}
                onNo={() => setIsAlertOpen(false)}
              />
            </Modal>
          </div>
          <div>
            <h1 className="application_heading">
              Applications for {currentJob?.job_role}
            </h1>
            <Table className="applications_table" dataSource={applicationsData}>
              <Column
                align="center"
                className="table-column-style"
                title="Name"
                dataIndex={"firstName"}
                key={"firstName"}
                render={(text, record) => (
                  <span>{`${record.first_name} ${record.last_name}`}</span>
                )}
              />
              <Column
                align="center"
                className="table_column"
                title="E-mail"
                dataIndex="email"
                key="email"
              />
              <Column
                align="center"
                className="table_column"
                title="Contact No"
                dataIndex="contact_no"
                key="contact_no"
              />
              <Column
                align="center"
                className="table_column"
                title="Resume"
                dataIndex="resume"
                key="resume"
                render={(resume) => {
                  return (
                    <Link target={"_blank"} to={resume}>
                      Resume
                    </Link>
                  );
                }}
              />
            </Table>
          </div>

          <Modal
            width={1000}
            footer={null}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            className="job_modal"
          >
            <div className="job_details_page">
              <div>
                <div className="job_card">
                  <div className="job_category_date">
                    <b>{currentJob?.job_category}</b>
                    <p>{currentJob?.end_date}</p>
                  </div>
                  <h2>{currentJob?.job_role}</h2>
                  <p>
                    We are looking for an {currentJob?.job_role} to join our
                    team.
                  </p>
                  <div className="job_info_details">
                    <div className="job_info">
                      <span>
                        <CgBriefcase />
                        {currentJob?.experience}
                      </span>
                      <span>
                        <RxClock />
                        {currentJob?.job_type}
                      </span>
                      <span>
                        <TfiLocationPin />
                        {currentJob?.job_location}
                      </span>
                    </div>
                    <p className="job_view_details">Apply for this post</p>
                    {/* <Modal footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                </Modal> */}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentJob?.description,
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default OpeningDetails;
