import { Table,  Tag , Row, Space, Button, } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import { getStateColor } from "../../../utils/UtilService";
import PeatioApiService from '../../../services/PeatioApiService';
import { Link } from "react-router-dom";
import moment from "moment";
import {useNavigate} from 'react-router-dom';
import {
    PlusCircleOutlined,ReloadOutlined
  } from "@ant-design/icons";
  
const Currencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 50;
    let navigate = useNavigate();
    const getCurrencies = useCallback((page, limit) => {
        PeatioApiService.getCurrencies(page, limit).then((res) => {
            setCurrencies(res.data );
        });
    }, []);
    useEffect(() => {
        getCurrencies(page, limit);
    }, [getCurrencies, page]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
            render: (code) => {
                return <Link to={`/exchange/currencies/${code}/edit-currency`}>{code.toUpperCase()}</Link>;
              },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type, row) => {
                return type.toUpperCase()
            },
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
            title: 'Visible',
            dataIndex: 'visible',
            key: 'visible',
            render: (visible, row) => {
                let color = getStateColor((row.visible ? 'active' : 'inactive'));
                return <Tag color={color} >{(row.visible ? 'active' : 'inactive').toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Deposit',
            dataIndex: 'deposit_enabled',
            key: 'deposit_enabled',
            render: (deposit_enabled, row) => {
                let color = getStateColor((row.deposit_enabled ? 'enabled' : 'disabled'));
                return <Tag color={color} >{(row.deposit_enabled ? 'enabled' : 'disabled').toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Withdrawal',
            dataIndex: 'withdrawal_enabled',
            key: 'withdrawal_enabled',
            render: (withdrawal_enabled, row) => {
                let color = getStateColor((row.withdrawal_enabled ? 'enabled' : 'disabled'));
                return <Tag color={color} >{(row.withdrawal_enabled ? 'enabled' : 'disabled').toUpperCase()}</Tag>;
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
                            navigate(`/exchange/currencies/add`);
                        }}
                    >ADD CURRENCY</Button>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    size="middle"
                    onClick={() => {
                        getCurrencies();
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table dataSource={currencies} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns} />
    </>
};
export default Currencies