import { Table, Row, Space, Button, Form, Badge, Input, Drawer , DatePicker, Tag} from 'antd';
import React, { useCallback, useState, useEffect } from "react";
import moment from "moment";
import {
    FilterOutlined,
    ReloadOutlined,
  } from "@ant-design/icons";
import PeatioApiService from '../../../services/PeatioApiService';
const { RangePicker } = DatePicker;
const Revenue = () => {
    const [revenue, setRevenue] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const limit = 50;
    const [ page, setPage] = useState(1);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();

    const getOperationsRevenue = useCallback(() => {
        PeatioApiService.getOperationsRevenue(page, limit, filters).then((res) => {
            setTotalRows(res.total);
            setRevenue(res.data)
        });
    }, [page, filters]);
    
    useEffect(() => {
        getOperationsRevenue(limit, page);
    }, [getOperationsRevenue, page]);

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
            title: 'Liabilities ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: 'Currency ID',
            dataIndex: 'currency',
            key: 'currency',
            render: (currency) => {
                return currency.toUpperCase();
            },
        },
        {
            title: 'Ref ID',
            dataIndex: 'rid',
            key: 'rid',
        },
        {
            title: 'Ref type',
            dataIndex: 'reference_type',
            key: 'reference_type',
            render: (reference_type) => {
                return reference_type.toUpperCase();
            },
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 180,
            render: (created_at) => {
                return moment(created_at).format("YYYY-MM-DD HH:mm:ss");
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
                    getOperationsRevenue(page, limit);
                }}
            >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={'index'} dataSource={revenue} columns={columns} onChange={onChange} pagination={{ pageSize: limit, current: page, total: totalRows }}/>
        <Drawer title="Filter"  placement="right" closable={false} onClose={onClose} visible={visibleFilter} key={"right_filter"}>
            <Form layout="vertical" form={form} onFinish={onChangeFilter}>
                <Form.Item label="Reference type" name="reference_type">
                    <Input placeholder="Reference type" />
                </Form.Item>
                <Form.Item label="Ref ID" name="rid">
                    <Input placeholder="Ref ID" />
                </Form.Item>
                <Form.Item label="Code" name="code">
                    <Input placeholder="Code" />
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
export default Revenue