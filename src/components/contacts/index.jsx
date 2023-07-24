// Functionality imports
import React, { useEffect, useState } from 'react';
// UI imports
import { firestore } from '../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // CSS imports
import { Button, Switch, Table, Modal, message } from 'antd';
import moment from 'moment'; // Import Moment.js
// CSS imports
import Styles from '../../styles/projects.module.css';
// Destructure specific components from Ant Design
const { confirm } = Modal;

function Contacts() {
	const [dataArr, setDataArr] = useState([]);
	const [paginationEnabled, setPaginationEnabled] = useState(true);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 6,
	});

	useEffect(() => {
		fetchData();
	}, []);

	/**
	 * Fetches data from the 'contact' collection in Firestore and updates the state with the retrieved data.
	 */
	const fetchData = async () => {
		try {
			const collectionRef = collection(firestore, 'contact');
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
	 * Handles the delete action for a contact record.
	 * Shows a confirmation dialog and deletes the contact if the user confirms.
	 * If the deletion is successful, a success message is displayed, and the data is fetched again to update the table.
	 * @param {Object} record - The record to be deleted
	 */
	const handleDelete = async (record) => {
		confirm({
			title: 'Confirm Delete',
			content: `Are you sure you want to delete the contact "${record.name}"?`,
			onOk: async () => {
				try {
					const contactRef = doc(firestore, 'contact', record.id);
					await deleteDoc(contactRef);
					message.success('contact deleted successfully!');
					fetchData();
				} catch (error) {
					console.error('Error deleting contact:', error);
					message.error('Failed to delete contact. Please try again later.');
				}
			},
			onCancel() {
				// Do nothing if the user cancels the delete action
			},
		});
	};

	/**
	 * Handles changes to the table pagination settings and updates the state with the new pagination configuration.
	 * @param {Number} pagination - The new pagination settings
	 */
	const handleTableChange = (pagination) => {
		setPagination(pagination);
	};

	/**
	 * Toggles the pagination feature of the table.
	 * @param {boolean} checked - The new status of the pagination toggle
	 */
	const togglePagination = (checked) => {
		setPaginationEnabled(checked);
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => {
				return a.name.localeCompare(b.name);
			},
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Phone',
			dataIndex: 'phoneNo',
			key: 'phoneNo',
		},
		{
			title: 'Message',
			dataIndex: 'message',
			key: 'message',
		},
		{
			title: 'Date',
			dataIndex: 'dateTime',
			key: 'dateTime',
			render: (dateTime) => {
				const timestamp =
					dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
				return moment(timestamp).format('MM/DD/YYYY');
			},
			sorter: (a, b) => a.dateTime - b.dateTime,
			sortDirections: ['ascend', 'descend'],
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			render: (text, record) => (
				<Button type="link" onClick={() => handleDelete(record)}>
					Delete
				</Button>
			),
		},
	];

	return (
		<div className={`${Styles.projectsContainer} projectsContainer`}>
			<div className={`${Styles.contactsHeadingText}`}>
				<h2>List of all contacts</h2>
			</div>
			<div className={`${Styles.projectsTable} projectsTable`}>
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
		</div>
	);
}

export default Contacts;
