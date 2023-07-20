import React from "react";
import {
  FcCalendar,
  FcContacts,
  FcGraduationCap,
  FcViewDetails,
} from "react-icons/fc";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <div className="dashborad_admin_data">
          <div className="dashboard_card">
            <h1>Contact Form</h1>
            <p>Total Number of Contact queries so far are</p>
            <div className="dashboard_card_flex">
              <h1>8</h1>
              <FcContacts />
            </div>
            <button>VIEW MORE</button>
          </div>
          <div className="dashboard_card">
            <h1>Courses</h1>
            <p>Total Number of Courses so far are</p>
            <div className="dashboard_card_flex">
              <h1>8</h1>
              <FcGraduationCap />
            </div>
            <button>VIEW MORE</button>
          </div>
          <div className="dashboard_card">
            <h1>Events</h1>
            <p>Total Number of Events so far are</p>
            <div className="dashboard_card_flex">
              <h1>8</h1>
              <FcCalendar />
            </div>
            <button>VIEW MORE</button>
          </div>
          <div className="dashboard_card">
            <h1>Blogs Posted</h1>
            <p>Total Number of Blogs posted so far are</p>
            <div className="dashboard_card_flex">
              <h1>8</h1>
              <FcViewDetails />
            </div>
            <button>VIEW MORE</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
