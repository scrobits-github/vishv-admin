// Functionality imports
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// UI imports
import Login from '../pages/login';
import Project from '../pages/project';
import ErrorPage from '../pages/error';
import AppLayout from '../components/layout';
import SubProject from '../pages/ProjectDetail';
import Contact from '../pages/contact';

/**
 * A protected route component that wraps around routes requiring authentication.
 * If the user is logged in, it renders the provided 'element' within the 'AppLayout'.
 * If the user is not logged in, it redirects them to the login page with the 'from' path as state.
 * @param {Object} param0 - The props passed to the ProtectedRoute component.
 * @param {ReactElement} param0.element - The React element to be rendered within the protected route.
 * @param {string} param0.path - The current path of the route.
 * @returns {ReactElement} - The ProtectedRoute component.
 */
const ProtectedRoute = ({ element, path }) => {
	const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
	return isLoggedIn ? (
		<AppLayout>{element}</AppLayout>
	) : (
		<Navigate to="/login" replace state={{ from: path }} />
	);
};

function RouteConfig() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="*" element={<ErrorPage />} />
					{/* Use ProtectedRoute for routes that require the layout */}
					<Route
						path="/contacts"
						element={<ProtectedRoute element={<Contact />} />}
					/>
					<Route
						path="/projects/*"
						element={<ProtectedRoute element={<Project />} />}
					/>
					<Route
						path="/projects/projectDetails/:id"
						element={<ProtectedRoute element={<SubProject />} />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default RouteConfig;
