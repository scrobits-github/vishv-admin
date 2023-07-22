// Functionality imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// UI imports
import { firestore, storage } from '../firebase/firebase';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Table,
	Modal,
	Form,
	Input,
	Select,
	Upload,
	message,
} from 'antd';
import {
	collection,
	getDocs,
	addDoc,
	doc,
	serverTimestamp,
	deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// CSS imports
import Styles from '../../styles/projects.module.css';
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;
const { confirm } = Modal;

function Projects() {
	const navigate = useNavigate();
	const [primaryImageUploaded, setPrimaryImageUploaded] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [dataArr, setDataArr] = useState([]);
	const [isModalButtonLoading, setModalButtonLoading] = useState(false);
	const projectTypes = ['Interior', 'Landscape', 'Architecture'];

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const collectionRef = collection(firestore, 'project');
			const querySnapshot = await getDocs(collectionRef);
			const dataArr = querySnapshot?.docs?.map((doc) => ({
				id: doc?.id,
				...doc?.data(),
			}));
			setDataArr(dataArr);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.submit();
	};
	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleFileChange = (info) => {
		const fileList = info.fileList;
		const filteredFileList = fileList.slice(-1);
		if (info.file.type.startsWith('image/') && filteredFileList.length > 0) {
			setPrimaryImageUploaded(true);
		}
	};

	const onFinish = async (values) => {
		try {
			setModalButtonLoading(true); // Set the modal OK button to loading state
			const primaryImageFile = values.primaryImage.file; // Access the primary image file
			const primaryImageRef = ref(storage, `projects/${primaryImageFile.name}`);
			await uploadBytes(primaryImageRef, primaryImageFile);
			const primaryImageURL = await getDownloadURL(primaryImageRef);
			const multipleImageFiles = Array.isArray(values.multipleImages.fileList)
				? values.multipleImages.fileList.map((file) => file.originFileObj)
				: [];
			const multipleImageURLs = [];
			for (const file of multipleImageFiles) {
				if (file && file.name) {
					const multipleImageRef = ref(storage, `projects/${file.name}`);
					await uploadBytes(multipleImageRef, file);
					const multipleImageURL = await getDownloadURL(multipleImageRef);
					multipleImageURLs.push(multipleImageURL);
				}
			}
			const newProject = {
				title: values.projectName,
				projectType: values.projectType,
				description: values.description,
				primaryImage: primaryImageURL,
				subImages: multipleImageURLs,
				datetime: serverTimestamp(),
			};
			const projectsRef = collection(firestore, 'project');
			await addDoc(projectsRef, newProject);
			message.success('Project created successfully!');
			setIsModalVisible(false);
			setPrimaryImageUploaded(false);
			form.resetFields();
			fetchData();
			setModalButtonLoading(false); // Set the modal OK button to loading state
		} catch (error) {
			console.error('Error creating project:', error);
			message.error('Failed to create project. Please try again later.');
		}
	};

	const renderModalForm = (
		<Modal
			title="Create New Project"
			open={isModalVisible}
			onOk={handleOk}
			onCancel={handleCancel}
			confirmLoading={isModalButtonLoading} // Use the confirmLoading prop to display the loader
		>
			<Form
				form={form}
				layout="vertical"
				name="createProjectForm"
				onFinish={onFinish}
			>
				<Form.Item
					label="Project Name"
					name="projectName"
					rules={[
						{
							required: true,
							message: 'Please input the project name!',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Project Type"
					name="projectType"
					rules={[
						{
							required: true,
							message: 'Please select the project type!',
						},
					]}
				>
					<Select placeholder="Select a project type">
						{projectTypes.map((type) => (
							<Option key={type} value={type}>
								{type}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label="Description"
					name="description"
					rules={[
						{
							required: true,
							message: 'Please input the description!',
						},
					]}
				>
					<TextArea rows={4} />
				</Form.Item>
				<Form.Item
					label="Primary Image"
					name="primaryImage"
					rules={[
						{
							required: true,
							message: 'Please upload the primary image!',
						},
					]}
				>
					<Dragger
						name="primaryImage"
						accept=".jpg,.jpeg,.png"
						multiple={false}
						beforeUpload={() => false}
						onChange={handleFileChange}
						disabled={primaryImageUploaded}
					>
						<p className="ant-upload-drag-icon">
							<PlusOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag file to this area to upload
						</p>
						<p className="ant-upload-hint">
							Support for a single image only (JPG, JPEG, PNG).
						</p>
					</Dragger>
				</Form.Item>
				<Form.Item
					label="Multiple Images"
					name="multipleImages"
					rules={[
						{
							required: true,
							message: 'Please upload multiple images!',
						},
					]}
				>
					<Dragger
						name="multipleImages"
						accept=".jpg,.jpeg,.png"
						multiple={true}
						beforeUpload={() => false}
						onChange={handleFileChange}
					>
						<p className="ant-upload-drag-icon">
							<PlusOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag files to this area to upload
						</p>
						<p className="ant-upload-hint">
							Support for multiple images (JPG, JPEG, PNG).
						</p>
					</Dragger>
				</Form.Item>
			</Form>
		</Modal>
	);

	const handleEdit = (record) => {
		navigate(`/projects/projectDetails/${record?.id}`, {
			state: { project: record },
		});
	};

	const handleDelete = (record) => {
		confirm({
			title: 'Confirm Delete',
			content: `Are you sure you want to delete the project "${record.title}"?`,
			onOk: async () => {
				try {
					const projectRef = doc(firestore, 'project', record.id);
					await deleteDoc(projectRef);
					message.success('Project deleted successfully!');
					fetchData();
				} catch (error) {
					console.error('Error deleting project:', error);
					message.error('Failed to delete project. Please try again later.');
				}
			},
			onCancel() {
				// Do nothing if the user cancels the delete action
			},
		});
	};

	const columns = [
		{
			title: 'Project Name',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Project Type',
			dataIndex: 'projectType',
			key: 'projectType',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Image',
			dataIndex: 'primaryImage',
			key: 'primaryImage',
			render: (text, record) => {
				return (
					<img
						src={record.primaryImage}
						alt={record.title}
						className='projectImage'
					/>
				);
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (text, record) => (
				<>
					<Button type="link" onClick={() => handleEdit(record)}>
						Edit
					</Button>
					<Button type="link" danger onClick={() => handleDelete(record)}>
						Delete
					</Button>
				</>
			),
		},
	];

	return (
		<div className={`${Styles.projectsContainer} projectsContainer`}>
			<div className={`${Styles.projectsCreateButton}`}>
				<Button
					type="primary"
					htmlType="submit"
					className={`${Styles.projectsButtonStyle}`}
					onClick={showModal}
				>
					Create New
				</Button>
			</div>
			<div className={`${Styles.projectsTable} projectsTable`}>
				<Table
					style={{
						height: '30rem',
						overflow: 'auto',
					}}
					dataSource={dataArr}
					columns={columns}
					rowKey="id"
					pagination={false}
				/>
			</div>
			{renderModalForm}
		</div>
	);
}

export default Projects;
