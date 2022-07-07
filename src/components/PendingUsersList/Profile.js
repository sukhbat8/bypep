import { Table} from 'antd';
import React, { useCallback, useState, useEffect } from "react";
import BarongApiService from '../../services/BarongApiService';
import { Link } from "react-router-dom";
const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [totalRows, setTotalRow] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 50;
    const key = 'profile';
    const value = 'submitted';
    const getProfile = useCallback((key, value, page, limit) => {
        BarongApiService.getProfiles(key, value, page, limit).then((data) => {
            console.log(data);
            setTotalRow(Number(data.total));
            setProfileData(data.map((x, index) => {
                return {
                    ...x,
                    index,
                }
            }));
        });
    }, []);
    useEffect(() => {
        getProfile(key, value, page, limit);
    }, [getProfile, key, value, page, limit]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email , rowData) => {
                return <Link to={`/users/usersdirectory/${rowData.uid}/usersAbout/main`}>{email}</Link>;
            },
        },
        {
            title: 'UID',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];
    return <>
        <Table rowKey={'index'} dataSource={profileData} onChange={onChange} pagination={{ key: key,  value: value, limit: limit, current: page, total: totalRows }} columns={columns} />
    </>
};
export default Profile