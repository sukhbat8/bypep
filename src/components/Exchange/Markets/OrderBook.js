import { Table , Button} from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import PeatioApiService from '../../../services/PeatioApiService';
import { useParams} from "react-router-dom";
const OrderBook = () => {
    const [orderData, setOrderData] = useState(null);
    const [sellOrderData, setSellOrderData] = useState(null);
    const params = useParams();
    const limit = 50;
    const [ page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const getOpenOrder = useCallback((page, limit, market) => {
        PeatioApiService.getMarketOrderBook(page, limit, market, "buy").then((res) => {
            setOrderData(res.data);
            setTotalRows(res.total);

        });
        PeatioApiService.getMarketOrderBook(page, limit, market, 'sell').then((res) => {
            setSellOrderData(res.data);
            setTotalRows(res.total);
        });
    }, []);
    
    useEffect(() => {
        getOpenOrder(page, limit, params.market);
    }, [getOpenOrder, page, params.market]);

    const onChange = (pagination) => {
      setPage(pagination.current);
  };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email, rowData) => {
                return <Link to={`/users/usersdirectory/${rowData.uid}/usersAbout/open-orders`}>{email}</Link>;
            },
        },
        {
            title: 'Type',
            dataIndex: 'ord_type',
            key: 'ord_type',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Amount',
            dataIndex: 'origin_volume',
            key: 'origin_volume',
        },
        {
            render: () => {
                return <Button onClick={() => {}} icon={<CloseCircleOutlined />} size="middle" />
            }
        },
    ];
    const cellcolumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email, rowData) => {
                return <Link to={`/users/usersdirectory/${rowData.uid}/usersAbout/open-orders`}>{email}</Link>;
            },
        },
        {
            title: 'Type',
            dataIndex: 'ord_type',
            key: 'ord_type',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Amount',
            dataIndex: 'origin_volume',
            key: 'origin_volume',
        },
        {
            render: () => {
                return <Button onClick={() => {}} icon={<CloseCircleOutlined />} size="middle" />
            }
        },
    ];
    return <>
    <h2 style={{textAlign: 'left'}} >Buy Orders</h2>
        <Table rowKey={'index'} dataSource={orderData} columns={columns} />
    <h2 style={{textAlign: 'left'}} >Sell Orders</h2>
        <Table rowKey={'index'} dataSource={sellOrderData} columns={cellcolumns} onChange={onChange} pagination={{ pageSize: limit, current: page, total: totalRows }}/>
    </>
};
export default OrderBook