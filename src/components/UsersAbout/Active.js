import { Table, Tag } from 'antd';
import React, { useCallback, useState, useEffect } from "react";
import { getStateColor } from "../../utils/UtilService";
import moment from "moment";
import BarongApiService from '../../services/BarongApiService';
import { useParams } from 'react-router-dom';

const Active = () => {
    const [activeData, setActiveData] = useState(null);
    const [totalRows, setTotalRow] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 50;
    const params = useParams();
    const getActive = useCallback((page, limit, uid) => {
        BarongApiService.getActivities(page, limit, uid).then((data) => {
            setTotalRow(Number(data.total));
            setActiveData(data.map((x, index) => {
                return {
                    ...x,
                    index
                }
            }));
        });
    }, []);
    useEffect(() => {
        getActive(page, limit, params.uid);
    }, [getActive, params, page, limit]);
    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at) => {
                return moment(created_at).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            render: (state) => {
                let color = getStateColor(state);
                return <Tag color={color}>{state.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'IP',
            dataIndex: 'user_ip',
            key: 'user_ip',
        },
        {
            title: 'Browser',
            dataIndex: 'user_agent',
            key: 'user_agent',
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            render: (state) => {
                let color = getStateColor(state);
                return <Tag color={color}>{state.toUpperCase()}</Tag>;
            },
        },

    ];
    return <>
        <Table rowKey={'index'} dataSource={activeData} onChange={onChange} pagination={{ limit: limit, current: page, total: totalRows }} columns={columns} />
    </>
};
export default Active