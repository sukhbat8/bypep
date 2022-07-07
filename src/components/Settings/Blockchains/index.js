import { Table,  Tag , Row, Space, Button} from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import {useNavigate} from 'react-router-dom';
import { getStateColor } from "../../../utils/UtilService";
import PeatioApiService from '../../../services/PeatioApiService';
import { Link } from "react-router-dom";
import moment from "moment";
import {
    PlusCircleOutlined,ReloadOutlined
} from "@ant-design/icons";
  
const Blockchain = () => {
    const [blockchains, setBlockchains] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 50;
    let navigate = useNavigate();
    const getBlockchains = useCallback((page, limit) => {
        PeatioApiService.getBlockchains(page, limit).then((res) => {
            setBlockchains(res.data);
            console.log(res);
        });
    }, []);
    useEffect(() => {
        getBlockchains(page, limit);
    }, [getBlockchains, page]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (id) => {
                return <Link to={`/settings/blockchains/${id}/edit`}>{id}</Link>;
              },
        },
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
        },
        {
            title: 'Height',
            dataIndex: 'height',
            key: 'height',
        },
        {
            title: "Created",
            dataIndex: "created_at",
            key: "created_at",
            width: 180,
            render: (created_at) => {
                return moment(created_at).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = getStateColor(status);
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    return <>
        <Row justify="end" style={{ marginBottom: 16 }}>
            <Space>
                <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        size="middle"
                        onClick={() => {
                            navigate(`/settings/blockchains/add`);
                        }}
                    >ADD BLOCKCHAIN</Button>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    size="middle"
                    onClick={() => {
                        getBlockchains();
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table dataSource={blockchains} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns} />
    </>
};
export default Blockchain