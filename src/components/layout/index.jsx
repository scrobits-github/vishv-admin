// Functionality imports
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
	const location = useLocation();
	console.log(location);
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const navigate = useNavigate(); // Initialize the useNavigate hook

	// Handle logout
	const handleLogout = () => {
		localStorage.clear(); // Clear any user-related data from localStorage
		navigate('/login'); // Navigate the user to the login page
	};
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
				style={{
					background: '#202020',
				}}
				trigger={null}
				collapsible
				collapsed={collapsed}
			>
				<div className="demo-logo-vertical" />
				<Menu
					style={{
						background: '#202020',
					}}
					theme="dark"
					mode="inline"
					activeKey={getActiveTabFromPathname()}
					defaultSelectedKeys={[getActiveTabFromPathname()]}
				>
					<div className="sidebarLogo">{icons?.parentIcon}</div>
					{menuItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
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
				<Header
					style={{
						padding: 0,
						background: '#202020',
					}}
				>
					<Button
						type="text"
						icon={
							collapsed ? (
								<MenuUnfoldOutlined style={{ color: '#FFFFFF' }} />
							) : (
								<MenuFoldOutlined style={{ color: '#FFFFFF' }} />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: '16px',
							width: 64,
							height: 64,
						}}
					/>
				</Header>
				<Content
					style={{
						height: '100%',
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
}

export default AppLayout;
