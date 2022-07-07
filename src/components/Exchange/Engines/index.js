import { Table,  Tag , Row, Space, Button} from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import {useNavigate} from 'react-router-dom';
import { getStateColor } from "../../../utils/UtilService";
import PeatioApiService from '../../../services/PeatioApiService';
import { Link } from "react-router-dom";
import {
    PlusCircleOutlined,ReloadOutlined
} from "@ant-design/icons";
  
const Engines = () => {
    const [engines, setEngines] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 50;
    let navigate = useNavigate();
    const getEngines = useCallback((page, limit) => {
        PeatioApiService.getEngines(page, limit).then((res) => {
            setEngines(res.data);
        });
    }, []);
    useEffect(() => {
        getEngines(page, limit);
    }, [getEngines, page]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (id) => {
                return <Link to={`/exchange/engines/${id}/edit`}>{id}</Link>;
              },
        },
        {
            title: 'Account engine name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Engine type',
            dataIndex: 'driver',
            key: 'driver',
        },
        {
            title: 'Status',
            dataIndex: 'state',
            key: 'state',
            render: (state) => {
                let color = getStateColor(state);
                return <Tag color={color}>{state.toUpperCase()}</Tag>;
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
                            navigate(`/exchange/engines/add`);
                        }}
                    >ADD ENGINE</Button>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    size="middle"
                    onClick={() => {
                        getEngines();
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table dataSource={engines} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns} />
    </>
};
export default Engines