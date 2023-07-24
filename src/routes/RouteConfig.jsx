import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Project from '../pages/project';
import ErrorPage from '../pages/error';
import AppLayout from '../components/layout';
import SubProject from '../pages/ProjectDetail';
import Contact from '../pages/contact';

// Custom ProtectedRoute component
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
					<Route
						path="/contacts"
						element={<ProtectedRoute element={<Contact />} />}
					/>
					{/* Use ProtectedRoute for routes that require the layout */}
					<Route
						path="/projects/*"
						element={<ProtectedRoute element={<Project />} />}
					/>
					<Route
						path="/projects/projectDetails/:id"
						element={<ProtectedRoute element={<SubProject />} />}
					/>
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default RouteConfig;
