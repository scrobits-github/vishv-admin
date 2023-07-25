// Functionality imports
import React from "react";
// UI imports
import ProjectDetails from "../../components/projectDetails";
import { Helmet } from "react-helmet";

function Project() {
  return (
    <div>
      <Helmet>
				<title>Projects | Vishv architects</title>
			</Helmet>
      <ProjectDetails />
    </div>
  );
}

export default Project;
