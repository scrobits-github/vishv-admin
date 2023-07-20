import { Drawer, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import App from '../../App'
import './dashboardlayout.css'
import { MdSpaceDashboard, MdBook, MdPermContactCalendar } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Login from '../auth/login/Login';

const DashboardLayout = () => {

    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [login, setLogin] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("loggedIn")) {
            setLogin(false);
            console.log("not logged in");
        }
    }, []);

    if (!login) {
        return (
            <div>
                <Login />
            </div>
        );
    }

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    return (
        <>
            <div className='main_header'>
                <FaBars onClick={showDrawer} />
                <p>MPM Infosoft Admin</p>
            </div>
            <div className='dashboard_layout'>
                <div className='left_dashboard_layout'>
                    <Drawer width={'250px'} title="Hello," placement="left" onClose={onClose} open={open} >
                        <Menu
                            defaultSelectedKeys={ ['/'] }
                            className='layout_navigation'
                            onClick={({ key }) => {
                                if (key === "signout") {
                                    e.preventDefault();
                                    localStorage.removeItem("loggedIn");
                                    localStorage.clear();
                                    window.location.reload();
                                } else {
                                    navigate(key)
                                }
                            }}
                            items={[
                                { label: "Dashboard", key: '/', icon: <MdSpaceDashboard /> },
                                { label: "Blogs", key: '/admin/blogs', icon: <MdBook /> },
                                // { label: "Text Editor", key: '/admin/texteditor', icon: <MdSpaceDashboard /> },
                                { label: "Contacts", key: '/admin/contacts', icon: <MdPermContactCalendar /> },
                                { label: "Openings", key: '/admin/allopenings', icon: <FaUserPlus /> },
                                { label: "Signout", key: 'signout', icon: <MdSpaceDashboard />, danger: true },
                            ]}
                        >
                        </Menu>
                    </Drawer>
                </div>
                <div className='right_dashboard_layout'>
                    <App />
                </div>
            </div>
        </>
    )
}

export default DashboardLayout