// Functionality imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// UI imports
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
	Switch,
} from 'antd';
import { firestore, storage } from '../firebase/firebase';
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
// Destructure specific components from Ant Design
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
	const [paginationEnabled, setPaginationEnabled] = useState(true);
	const projectTypes = ['Interior', 'Landscape', 'Architecture'];
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 4,
	});

	useEffect(() => {
		fetchData();
	}, []);

	/**
	 * Fetches data from the Firestore collection 'project'.
	 * Updates the 'dataArr' state with the fetched data.
	 */
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

	/**
	 * Shows the modal to create a new project.
	 * Sets 'isModalVisible' state to true.
	 */
	const showModal = () => {
		setIsModalVisible(true);
	};

	/**
	 * Handles the "OK" button click event of the modal.
	 * Submits the form in the modal.
	 */
	const handleOk = () => {
		form.submit();
	};

	/**
	 * Handles the "Cancel" button click event of the modal.
	 * Closes the modal and resets the form fields.
	 */
	const handleCancel = () => {
		setIsModalVisible(false);
		setPrimaryImageUploaded(false);
		form.resetFields();
	};

	/**
	 * Handles the change event for the primary image file in the form.
	 * Sets the 'primaryImageUploaded' state based on the uploaded primary image.
	 * @param {Object} info - The information about the primary image file.
	 */
	const handleFileChange = (info) => {
		const fileList = info.fileList;
		const filteredFileList = fileList.slice(-1);
		if (info.file.type.startsWith('image/') && filteredFileList.length > 0) {
			setPrimaryImageUploaded(true);
		}
	};

	/**
	 * Handles the form submission when the user clicks the "Submit" button in the modal.
	 * Creates a new project in Firestore with the form data.
	 * @param {Object} values - The form values submitted by the user.
	 */
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
			setModalButtonLoading(false);
		} catch (error) {
			console.error('Error creating project:', error);
			message.error('Failed to create project. Please try again later.');
		}
	};

	/**
	 * Renders the form inside the modal for creating a new project.
	 * @returns {JSX.Element} - JSX Element representing the modal form.
	 */
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

	/**
	 * Handles the "Edit" button click event for a project record.
	 * Navigates the user to the project details page for editing.
	 * @param {Object} record - The project record to be edited.
	 */
	const handleEdit = (record) => {
		navigate(`/projects/projectDetails/${record?.id}`, {
			state: { project: record },
		});
	};

	/**
	 * Handles the "Delete" button click event for a project record.
	 * Shows a confirmation modal before deleting the project from Firestore.
	 * @param {Object} record - The project record to be deleted.
	 */
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

	/**
	 * Handles the change event of the table pagination.
	 * Updates the 'pagination' state with the current pagination settings.
	 * @param {Object} pagination - The current pagination settings.
	 * @param {Object} filters - The table filters.
	 * @param {Object} sorter - The table sorter.
	 */
	const handleTableChange = (pagination, filters, sorter) => {
		setPagination(pagination);
	};

	/**
	 * Toggles the pagination feature of the table.
	 * Updates the 'paginationEnabled' state based on the checkbox toggle.
	 * @param {boolean} checked - The checked status of the pagination toggle checkbox.
	 */
	const togglePagination = (checked) => {
		setPaginationEnabled(checked);
	};

	const columns = [
		{
			title: 'Project Name',
			dataIndex: 'title',
			key: 'title',
			sorter: (a, b) => {
				return a.title.localeCompare(b.title);
			},
		},
		{
			title: 'Project Type',
			dataIndex: 'projectType',
			key: 'projectType',
			sorter: (a, b) => {
				return a.projectType.localeCompare(b.projectType);
			},
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
						className={`${Styles.projectImage}`}
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
				<div className={`${Styles.contactsHeadingText}`}>
					<h2>List of all projects</h2>
				</div>
				<div className={`${Styles.projectsPagination}`}>
					<span className={`${Styles.projectsPaginationText}`}>
						Pagination:
					</span>
					<Switch checked={paginationEnabled} onChange={togglePagination} />
				</div>
				<Table
					className={`${Styles.projectsTableData}`}
					dataSource={dataArr}
					columns={columns}
					rowKey="id"
					onChange={handleTableChange}
					pagination={paginationEnabled ? pagination : false}
				/>
			</div>
			{renderModalForm}
		</div>
	);
}

export default Projects;
