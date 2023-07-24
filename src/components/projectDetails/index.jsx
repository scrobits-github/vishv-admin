// Functionality imports
import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// UI imports
import { Form, Input, Select, Upload, Button, message, Modal } from 'antd';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase/firebase';
import { PlusOutlined } from '@ant-design/icons';
// CSS imports
import Styles from '../../styles/projects.module.css';
// Destructure specific components from Ant Design
const { TextArea } = Input;
const { Dragger } = Upload;
const { confirm } = Modal;
const { Option } = Select;

function ProjectDetails() {
	const location = useLocation();
	const { id } = useParams();
	const { project } = location.state;
	const navigate = useNavigate();
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [form] = Form.useForm();
	const [newPrimaryImageFile, setNewPrimaryImageFile] = useState(null);
	const [fileListStatus, setFileListStatus] = useState(false);
	const [subImages, setSubImages] = useState([]);
	const [newSubImages, setNewSubImages] = useState([]);
	const [defaultFileList, setDefaultFileList] = useState([]);
	const [primaryImageSrc, setPrimaryImageSrc] = useState(project?.primaryImage);
	const [loading, setLoading] = useState(false);
	const projectTypes = ['Interior', 'Landscape', 'Architecture'];

	useEffect(() => {
		const defaultList = subImages
			? subImages.map((subImage, index) => ({
					uid: index,
					name: `image-${index}`,
					status: 'done',
					url: subImage,
					thumbUrl: subImage,
			  }))
			: [];

		setDefaultFileList(defaultList);
	}, [subImages]);

	useEffect(() => {
		const fetchProjectData = async () => {
			try {
				const projectRef = doc(firestore, 'project', id);
				const projectSnapshot = await getDoc(projectRef);
				if (projectSnapshot.exists()) {
					const projectData = projectSnapshot.data();
					setSubImages(projectData?.subImages);
				} else {
					console.error('Project not found.');
				}
			} catch (error) {
				console.error('Error fetching project data:', error);
			}
		};
		fetchProjectData();
	}, [id, form]);

	/**
	 * Handles the change event for the primary image file in the form.
	 * Updates state with the new primary image file and its source.
	 * @param {Object} info - The information about the primary image file.
	 */
	const handleFileChange = (info) => {
		if (!info.file) {
			setFileListStatus(true);
			return;
		}
		const fileList = info.fileList;
		const filteredFileList = fileList.slice(-1);
		setFileListStatus(fileList.length === 0 ? true : false);
		if (
			info.file.type &&
			info.file.type.startsWith('image/') &&
			filteredFileList.length > 0
		) {
			setNewPrimaryImageFile(filteredFileList[0].originFileObj);
			setPrimaryImageSrc(true);
		}
	};

	/**
	 * Handles the removal of the primary image file from the form.
	 * Resets the primary image related states and form field value.
	 */
	const handlePrimaryImageRemove = () => {
		form.setFieldsValue({ primaryImage: undefined });
		setNewPrimaryImageFile(null);
		setPrimaryImageSrc(false);
	};

	/**
	 * Handles the removal of a sub image from the form.
	 * Confirms the deletion with a modal before removing the image.
	 * @param {string} url - The URL of the sub image to be removed.
	 */
	const handleRemoveSubImage = (url) => {
		confirm({
			title: 'Confirm Delete',
			content: `Are you sure you want to delete the Image?`,
			onOk: async () => {
				try {
					const updatedSubImages = subImages.filter(
						(subImage) => subImage !== url
					);
					const updatedProject = {
						...project,
						subImages: updatedSubImages,
					};
					if (Array.isArray(updatedProject.subImages)) {
						const projectRef = doc(firestore, 'project', project?.id);
						await updateDoc(projectRef, updatedProject);
						setSubImages(updatedSubImages);
						message.success('Image removed successfully!');
					} else {
						console.error('Invalid subImages data:', updatedProject.subImages);
						message.error(
							'Failed to remove image. Invalid data. Please try again later.'
						);
					}
				} catch (error) {
					console.error('Error removing image:', error);
					message.error('Failed to remove image. Please try again later.');
				}
			},
			onCancel() {
				// Do nothing if the user cancels the delete action
			},
		});
	};

	/**
	 * Handles the change event for the sub images in the form.
	 * Updates the defaultFileList state with the new sub images.
	 * @param {Object} info - The information about the sub images files.
	 */
	const handleSubImagesChange = (info) => {
		if (info.fileList) {
			const filteredFileList = info.fileList.filter(
				(file) => file.type && file.type.startsWith('image/')
			);
			const newImages = filteredFileList.filter(
				(file) => file.status !== 'done' && file.status !== 'removed'
			);
			if (filteredFileList.some((file) => file.name)) {
				const updatedFileList = defaultFileList
					.filter((file) => file.status === 'done')
					.concat(newImages);
				setDefaultFileList(updatedFileList);
				if (updatedFileList.length > 0) {
					setNewSubImages(updatedFileList.map((file) => file.originFileObj));
				}
			}
		}
	};

	/**
	 * Handles the preview of an image.
	 * If the image is not available as a URL, create a preview URL using the FileReader API.
	 * @param {Object} file - The image file to be previewed.
	 */
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onloadend = () => {
					resolve(reader.result);
				};
			});
		}
		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
	};

	/**
	 * Handles the form submission when the user clicks the "Submit" button.
	 * Updates the project data in Firestore with the new information.
	 * @param {Object} values - The form values submitted by the user.
	 */
	const onFinish = async (values) => {
		try {
			setLoading(true);
			const primaryImageFile = newPrimaryImageFile || primaryImageSrc;
			let primaryImageRef;
			if (newPrimaryImageFile) {
				primaryImageRef = ref(storage, `projects/${primaryImageFile.name}`);
				await uploadBytes(primaryImageRef, primaryImageFile);
			}
			const newSubImageURLs = await Promise.all(
				newSubImages.map(async (subImage) => {
					if (!subImage) return null;
					const subImageRef = ref(storage, `projects/${subImage.name}`);
					await uploadBytes(subImageRef, subImage);
					return await getDownloadURL(subImageRef);
				})
			);
			const allSubImageURLs = subImages
				? subImages.concat(newSubImageURLs.filter((url) => url !== null))
				: newSubImageURLs.filter((url) => url !== null);
			const updatedProject = {
				title: values.projectName,
				projectType: values.projectType,
				description: values.description,
				primaryImage: newPrimaryImageFile
					? await getDownloadURL(primaryImageRef)
					: primaryImageSrc,
				subImages: allSubImageURLs,
			};
			const projectRef = doc(firestore, 'project', project?.id);
			await updateDoc(projectRef, updatedProject);
			message.success('Project updated successfully!');
			await navigate(`/projects`);
			setLoading(false);
		} catch (error) {
			console.error('Error updating project:', error);
			message.error('Failed to update project. Please try again later.');
		}
	};

	return (
		<div>
			<Form
				form={form}
				layout="vertical"
				name="editProjectForm"
				initialValues={{
					projectName: project.title,
					projectType: project.projectType,
					description: project.description,
					primaryImage: primaryImageSrc,
				}}
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
							required: !primaryImageSrc,
							message: 'Please select the Primary Image!',
						},
					]}
					getValueFromEvent={handleFileChange}
					shouldUpdate
				>
					<Dragger
						style={{
							pointerEvents: `${fileListStatus ? 'auto' : 'none'} `,
						}}
						name="primaryImage"
						accept=".jpg,.jpeg,.png"
						multiple={false}
						onPreview={handlePreview}
						beforeUpload={() => false}
						listType="picture-card"
						onChange={handleFileChange}
						onRemove={handlePrimaryImageRemove}
						defaultFileList={
							primaryImageSrc
								? [
										{
											uid: '-1',
											name: 'default_image.jpg',
											status: 'done',
											url: primaryImageSrc,
										},
								  ]
								: []
						}
					>
						{newPrimaryImageFile ? (
							<>
								<img
									className={`${Styles.projectDetailsDraggerImage}`}
									src={URL.createObjectURL(newPrimaryImageFile)}
									alt="New Upload"
								/>
								<p className="ant-upload-drag-icon">Uploaded</p>
							</>
						) : !fileListStatus ? (
							<>
								<img
									className={`${Styles.projectDetailsDraggerFileImage}`}
									src={primaryImageSrc}
									alt={project.title}
								/>
								<p className="ant-upload-drag-icon">Uploaded</p>
							</>
						) : (
							<>
								<p className="ant-upload-drag-icon">
									<PlusOutlined />
								</p>
								<p className="ant-upload-text">
									Click or drag file to this area to upload
								</p>
								<p className="ant-upload-hint">
									Support for a single image only (JPG, JPEG, PNG).
								</p>
							</>
						)}
					</Dragger>
				</Form.Item>
				<Form.Item label="Sub Images">
					<Dragger
						name="subImages"
						accept=".jpg,.jpeg,.png"
						multiple={true}
						beforeUpload={() => false}
						fileList={defaultFileList}
						onRemove={(file) => handleRemoveSubImage(file.url)}
						onChange={handleSubImagesChange}
						listType="picture-card"
						onPreview={handlePreview}
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
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						Save Changes
					</Button>
					<Button
						className={`${Styles.projectDetailsSaveButton}`}
						onClick={() => window.history.back()}
					>
						Cancel
					</Button>
				</Form.Item>
			</Form>
			<Modal
				open={previewVisible}
				title="Image Preview"
				footer={null}
				onCancel={() => setPreviewVisible(false)}
			>
				<img
					className={`${Styles.projectDetailsModalImage}`}
					alt="Preview"
					src={previewImage}
				/>
			</Modal>
		</div>
	);
}

export default ProjectDetails;
