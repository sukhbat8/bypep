import { Table, Tag , Button } from 'antd';
import React, { useCallback, useState, useEffect } from "react";
import { getStateColor } from "../../utils/UtilService";
import moment from "moment";
import PeatioApiService from '../../services/PeatioApiService';
import { useParams } from 'react-router-dom';

const Openorders = () => {
    const [orderData, setOrderData] = useState(null);
    const [totalRows, setTotalRow] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 50;
    const params = useParams();
    const getOrder = useCallback((page, limit, uid) => {
        PeatioApiService.getOpenOrder(page, limit, uid).then((res) => {
            console.log(res);
            setOrderData(res.data.map((x, index) => {

                return {
                    ...x,
                    index,
                }
            }));
            setTotalRow(Number(res.total));
        });
    }, []);
    useEffect(() => {
        getOrder(page,limit, params.uid);
    }, [getOrder, params, page, limit]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "Order ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: 'Market',
            dataIndex: 'market',
            key: 'market',
            render: (state) => {
                return state.toUpperCase();
            },
        },
        {
            title: 'Type',
            dataIndex: 'ord_type',
            key: 'ord_type',
        },
        {
            title: 'Amount',
            dataIndex: 'origin_volume',
            key: 'origin_volume',
        },
        {
            title: 'Executed',
            dataIndex: 'executed_volume',
            key: 'executed_volume',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Average',
            dataIndex: 'avg_price',
            key: 'avg_price',
        },
        {
            title: 'Side',
            dataIndex: 'side',
            key: 'side',
            render: (side) => {
                let color = getStateColor(side);
                return <Tag color={color}>{side.toUpperCase()}</Tag>;
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
            title: "Updated",
            dataIndex: "updated_at",
            key: "updated_at",
            width: 180,
            render: (updated_at) => {
                return moment(updated_at).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (rowData) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button type="primary" onClick={() => {
                            PeatioApiService.postOrderCancel({
                                id: rowData?.id
                            }).then((data) => {
                                getOrder(page, limit, totalRows ,params.uid);
                            });
                        }} style={{ marginLeft: 10}} >Cancel</Button>
                    </div>
                )
            }
        },

    ];
    return <>
        <Table rowKey={'index'} dataSource={orderData} onChange={onChange} pagination={{ limit: limit, current: page, total: totalRows }} columns={columns} />
    </>
};
export default Openorders