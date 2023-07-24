// Functionality imports
import React, { useEffect, useState } from 'react';
// UI imports
import { firestore } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
// CSS imports
import Styles from '../../styles/projects.module.css';
import { Button, Table } from 'antd';

function Contacts() {
	const [dataArr, setDataArr] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

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

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
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
			dataIndex: 'datetime',
			key: 'datetime',
		},
	];

	return (
		<div className={`${Styles.projectsContainer} projectsContainer`}>
			<div className={`${Styles.contactsHeadingText}`}>
				<h2>List of all contacts</h2>
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
		</div>
	);
}

export default Contacts;
