// Functionality imports
import React from "react";
// UI imports
import Projects from "../../components/projects";
import { Helmet } from "react-helmet";

function Project() {
  return (
    <div>
      <Helmet>
				<title>Projects | Vishv architects</title>
			</Helmet>
      <Projects />
    </div>
  );
}

export default Project;
