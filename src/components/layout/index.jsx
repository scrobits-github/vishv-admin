// Functionality imports
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// UI imports
import { icons } from '../../../public/assets/icons';
import { Layout, Menu, Button, theme } from 'antd';
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	LogoutOutlined,
	ContactsOutlined,
} from '@ant-design/icons';
// CSS imports
import Styles from '../../styles/login.module.css';
// Destructure specific components from Ant Design
const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate(); // Initialize the useNavigate hook

	/**
	 * Handles the logout action for the user.
	 * Clears any user-related data from localStorage and navigates the user to the login page.
	 */
	const handleLogout = () => {
		localStorage.clear(); // Clear any user-related data from localStorage
		navigate('/login'); // Navigate the user to the login page
	};

	/**
	 * Extracts the active tab from the current URL pathname.
	 * @returns {string} The active tab name extracted from the URL pathname.
	 */
	const getActiveTabFromPathname = () => {
		const currentPage = decodeURIComponent(window.location.pathname);
		const pathSegments = currentPage.split('/');
		return pathSegments[1];
	};

	const menuItems = [
		{
			icon: <UserOutlined />,
			label: 'Projects',
			key: 'projects',
			link: '/projects',
		},
		{
			icon: <ContactsOutlined />,
			label: 'Contacts',
			key: 'contacts',
			link: '/contacts',
		},
		{
			icon: <LogoutOutlined />,
			label: 'Logout',
			onClick: handleLogout, // Call handleLogout when this item is clicked
		},
	];

	return (
		<Layout>
			<Sider
				className={`${Styles.layoutSider}`}
				trigger={null}
				collapsible
				collapsed={collapsed}
			>
				<div className="demo-logo-vertical" />
				<Menu
					className={`${Styles.layoutMenu}`}
					theme="dark"
					mode="inline"
					activeKey={getActiveTabFromPathname()}
					defaultSelectedKeys={[getActiveTabFromPathname()]}
				>
					<div className={`${Styles.layoutSidebarLogo}`}>{icons?.parentIcon}</div>
					{menuItems.map((item) => (
						<Menu.Item
							onClick={item.link ? undefined : handleLogout}
							key={item.key}
							icon={item.icon}
						>
							{item.link ? (
								<Link to={item.link}>{item.label}</Link>
							) : (
								<span onClick={item.onClick}>{item.label}</span>
							)}
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<Header className={`${Styles.layoutHeader}`}>
					<Button
						type="text"
						icon={
							collapsed ? (
								<MenuUnfoldOutlined className={`${Styles.layoutMenuIcon}`} />
							) : (
								<MenuFoldOutlined className={`${Styles.layoutMenuIcon}`} />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
					/>
				</Header>
				<Content className={`${Styles.layoutContentWrapper}`}>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
}

export default AppLayout;
