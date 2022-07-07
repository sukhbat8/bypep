import { Table, Row, Space, Button, Form, Badge, Input, Drawer , DatePicker, Tag} from 'antd';
import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
    FilterOutlined,
    ReloadOutlined,
  } from "@ant-design/icons";
import PeatioApiService from '../../../services/PeatioApiService';
import { getStateColor } from '../../../utils/UtilService';
const { RangePicker } = DatePicker;
const Coin = () => {
    const [coin, setCoin] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const limit = 50;
    const type = 'coin';
    const states = ['accepted', 'errored' , 'skipped', 'confirming'];
    const [ page, setPage] = useState(1);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();

    const getWithrawalCoin = useCallback(() => {
        PeatioApiService.getWithrawalCoin(page, limit, filters, type, states).then((res) => {
            setTotalRows(res.total);
            setCoin(res.data)
        });
    }, [page, filters]);
    
    useEffect(() => {
        getWithrawalCoin(limit, page);
    }, [getWithrawalCoin, page]);

    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const onClose = () => {
        form.submit();
        setVisibleFilter(false);
      };
    
    const onChangeFilter = (e) => {
    let from = null;
    let to = null;

    if (e.daterange) {
        from = e.daterange[0].toISOString();
        to = e.daterange[1].toISOString();
    }

    delete e.daterange;
    const _filters = {
        from,
        to,
        ...e,
    };

    Object.keys(_filters).forEach((key) => {
        if (!_filters[key]) {
        delete _filters[key];
        }
    });

    setFilters({ ..._filters });
    setVisibleFilter(false);
    };

    const openFilterForm = () => {
        setVisibleFilter(true);
        let from = filters.from;
        let to = filters.to;

        delete filters.from;
        delete filters.to;

        form.setFieldsValue({
            ...filters,
            daterange: from && to ? [moment(from), moment(to)] : undefined,
        });
    };
    const resetForm = () => {
        form.resetFields();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id, rowData) => {
                return <Link to={`/accountings/withdrawals-pending/${rowData.id}/details`}>{id}</Link>;
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email, rowData) => {
                return <Link to={`/users/usersdirectory/${rowData.uid}/usersAbout/history`}>{email}</Link>;
            },
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Recipient Address',
            dataIndex: 'rid',
            key: 'rid',
        },
        {
            title: 'TxID',
            dataIndex: 'blockchain_txid',
            key: 'blockchain_txid',
        },
        {
            title: "Date",
            dataIndex: "updated_at",
            key: "updated_at",
            width: 180,
            render: (created_at) => {
                return moment(created_at).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
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
            <Badge
                size="small"
                count={Object.keys(filters).filter((key) => filters[key]).length}
            >
                <Button
                type="primary"
                icon={<FilterOutlined />}
                size="middle"
                onClick={openFilterForm}
                >SEARCH</Button>
            </Badge>
            <Button
                type="primary"
                icon={<ReloadOutlined />}
                size="middle"
                onClick={() => {
                    getWithrawalCoin(page, limit);
                }}
            >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={'index'} dataSource={coin} columns={columns} onChange={onChange} pagination={{ pageSize: limit, current: page, total: totalRows }}/>
        <Drawer title="Filter"  placement="right" closable={false} onClose={onClose} visible={visibleFilter} key={"right_filter"}>
            <Form layout="vertical" form={form} onFinish={onChangeFilter}>
                <Form.Item label="ID" name="id">
                    <Input placeholder="ID" />
                </Form.Item>
                <Form.Item label="TxID" name="blockchain_txid">
                    <Input placeholder="TxID" />
                </Form.Item>
                <Form.Item label="UID" name="uid">
                    <Input placeholder="Uid" />
                </Form.Item>
                <Form.Item label="Recipient Address" name="rid">
                    <Input placeholder="Recipient Address" />
                </Form.Item>
                <Form.Item label="Currency" name="currency">
                    <Input placeholder="Currency" />
                </Form.Item>
                <Form.Item label="Date range" name="daterange">
                    <RangePicker showTime />
                </Form.Item>
                <Form.Item>
                    <Space>
                    <Button size="middle" type="button" onClick={resetForm}>
                        Clear
                    </Button>
                    <Button htmlType="submit" size="middle" type="primary">
                        Search
                    </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    </>
};
export default Coin