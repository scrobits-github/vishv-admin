import React, { useEffect, useState } from "react";
import "../../blogs/blogs/blogs.css";
import { Link } from "react-router-dom";
import { Menu, Table, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, getJobs } from "../../../redux/jobsSlice";
import "./openings.css";

import { CgBriefcase } from "react-icons/cg";
import { RxClock } from "react-icons/rx";
import { TfiLocationPin } from "react-icons/tfi";
import LoadingSkeleton from "../../comman/skeleton/LoadingSkeleton";

const { Column } = Table;

const AllOpenings = () => { 
  const [activeCategory, setActiveCategory] = useState("All");
  const dispatch = useDispatch();
  const jobsData = useSelector((state) => state.jobs.jobsData?.data?.allJobs);
  console.log(jobsData);
  const categoryData = useSelector(
    (state) => state.jobs.categoryData?.data?.allCategory
  );
  // console.log(categoryData);
  const loading = useSelector((state) => state.jobs.loader);

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getJobs());
  }, []);

  const activeTabJobs = jobsData?.filter(
    (data) => data.job_category === activeCategory
  );
  // console.log(activeTabJobs);

  return (
    <>
      {loading === true ? (
        <LoadingSkeleton />
      ) : (
        <div className="blogs">
          <Link to={"/admin/createopenings"} className="create_blogs">
            Create Job Post
          </Link>
          <h1 className="blogs_heading">Job Openings</h1>
          <div className="category_list">
            <Menu mode="horizontal" defaultValue="All" defaultActiveFirst="All">
              <Menu.Item key="All" onClick={() => setActiveCategory("All")}>
                All
              </Menu.Item>
              {categoryData?.map((item) => (
                <Menu.Item
                  key={item.category_id}
                  onClick={() => setActiveCategory(item.category_name)}
                >
                  {item.category_name}
                </Menu.Item>
              ))}
            </Menu>
          </div>
          <div className="job_card_list">
            <Table
              className="applications_table"
              dataSource={activeCategory === "All" ? jobsData : activeTabJobs}
            >
              <Column
                align="center"
                title="Job Category"
                dataIndex={"job_category"}
                key={"job_category"}
              />
              <Column
                align="center"
                title="Job Role"
                dataIndex="job_role"
                key="job_role"
              />
              <Column
                align="center"
                title="Last Date"
                dataIndex="end_date"
                key="end_date"
              />
              <Column
                align="center"
                title="Job Type"
                dataIndex="job_type"
                key="job_type"
              />
              <Column
                align="center"
                title="Job Location"
                dataIndex="job_location"
                key="job_location"
              />
              <Column
                align="center"
                title="Total Applications"
                dataIndex="length"
                key="length"
              />
              <Column
                align="center"
                title="View Details"
                dataIndex="id"
                key="resume"
                render={(id) => {
                  return (
                    <Link to={`/admin/allopenings/${id}`}>View Details</Link>
                  );
                }}
              />
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default AllOpenings;

//  job card component --------------------------------

const JobCard = ({ item, index }) => {
  return (
    <div key={index} className="job_card">
      <div className="job_category_date">
        <b>{item?.job_category}</b>
        <p>{item?.end_date}</p>
      </div>
      <h2>{item?.job_role}</h2>
      <p>
        We are looking for an experienced Frontend Developer {item?.job_role} to
        join our team.
      </p>
      <div className="job_info_details">
        <div className="job_info">
          <span>
            <CgBriefcase />
            {item?.experience}
          </span>
          <span>
            <RxClock />
            {item?.job_type}
          </span>
          <span>
            <TfiLocationPin />
            {item?.job_location}
          </span>
        </div>
        <Link to={`/admin/allopenings/${item?.id}`}>
          <p className="job_view_details">View Details</p>
        </Link>
      </div>
    </div>
  );
};
