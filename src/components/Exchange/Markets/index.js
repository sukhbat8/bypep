import { Table,  Tag , Row, Space, Button} from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import { getStateColor } from "../../../utils/UtilService";
import PeatioApiService from '../../../services/PeatioApiService';
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import {useNavigate} from 'react-router-dom';
import {
    PlusCircleOutlined,ReloadOutlined
  } from "@ant-design/icons";
    
const Markets = () => {
    const [martket, setMarket] = useState([]);
    const [page, setPage] = useState(1);
    let navigate = useNavigate();
    const limit = 50;
    const params = useParams();
    const getMarkets = useCallback((page, limit) => {
        PeatioApiService.getMarkets(page, limit).then((res) => {
            setMarket(res.data );
        });
    }, [params.market]);
    useEffect(() => {
        getMarkets(page, limit, params.market);
    }, [getMarkets, page, params.market]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "Market ID",
            dataIndex: "id",
            key: "id",
            render: (market) => {
                return <Link to={`/exchange/markets/${market}/info`}>{market.toUpperCase()}</Link>;
            },
        },
        {
            title: 'Engine',
            dataIndex: 'engine_id',
            key: 'engine_id',
        },
        {
            title: 'Price precision',
            dataIndex: 'price_precision',
            key: 'price_precision',
        },
        {
            title: "Amount precision",
            dataIndex: "amount_precision",
            key: "amount_precision",
        },
        {
            title: "Min price",
            dataIndex: "min_price",
            key: "min_price",
        },
        {
            title: "Max price",
            dataIndex: "max_price",
            key: "max_price",
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
            title: 'State',
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
                            navigate(`/exchange/markets/add`);
                        }}
                    >ADD MARKET</Button>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    size="middle"
                    onClick={() => {
                        getMarkets();
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table dataSource={martket} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns} />
    </>
};
export default Markets