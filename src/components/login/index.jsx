// Functionality imports
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// UI imports
import LoginImage from '../../../public/assets/images/login.jpg';
import { icons } from '../../../public/assets/icons';
import { Form, Input, Button } from 'antd';
// CSS imports
import Styles from '../../styles/login.module.css';

function LoginComponent() {
	const navigate = useNavigate();
	const [form] = Form.useForm();

	/**
	 * Handles the form submission when the user finishes filling in the form fields.
	 * @param {Object} values - The form values submitted by the user.
	 */
	const onFinish = (values) => {
		if (
			values.emailId === 'admin@gmail.com' &&
			values.password === '12345678'
		) {
			localStorage.setItem('loggedIn', 'true');
			navigate('/projects');
		} else {
			alert('Incorrect Username or Password');
		}
	};

	useEffect(() => {
		if (localStorage.getItem('loggedIn') === 'true') {
			navigate('/projects');
		}
	}, [navigate]);

	return (
		<div className={`${Styles.loginParentContainer} loginParentContainer`}>
			<div className={`${Styles.loginContainer}`}>
				<div className={`${Styles.loginForm}`}>
					<div className={`${Styles.loginFormLogo}`}>{icons?.parentIcon}</div>
					<div>
						<div className={`${Styles.loginFormText}`}>
							<h2 className={`${Styles.loginFormHeading}`}>Welcome Back</h2>
							<p className={`${Styles.loginFormSubHeading}`}>
								Please enter your details
							</p>
						</div>
						<Form
							form={form}
							className={`${Styles.loginFormContainer}`}
							onFinish={onFinish}
						>
							<label>Email*</label>
							<Form.Item
								name="emailId"
								rules={[
									{
										required: true,
										message: 'Please enter your email!',
									},
								]}
							>
								<Input />
							</Form.Item>
							<label>Password*</label>
							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!',
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Login
								</Button>
							</Form.Item>
						</Form>
					</div>
					<div className={`${Styles.loginFooter}`}>@Vishv Architects</div>
				</div>
				<div className={`${Styles.loginImage}`}>
					<div className={`${Styles.loginImageContainer}`}>
						<img src={LoginImage} alt="Login" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginComponent;
