import { Table, Row, Space, Button, Form, Badge, Input, Drawer , DatePicker} from 'antd';
import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import BarongApiService from '../../services/BarongApiService';
import {
    FilterOutlined,
    ReloadOutlined,
  } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const Documents = () => {
    const [documentData, setDocumentData] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const limit = 50;
    const [ page, setPage] = useState(1);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();

    const getPending = useCallback((limit, page) => {
        BarongApiService.getPending(limit, page, filters).then((res) => {
            const pendingData = res.data;
            setTotalRows(res.total);
            if (pendingData?.length) {
                const profile = pendingData[0].profiles.find(x => x.state === 'verified');
                setDocumentData(pendingData.map((x, index) => {
                    return {
                        ...x,
                        index,
                        fullname: `${profile?.first_name} ${profile?.last_name}`,
                        country: profile.country || ''
                    }
                }));
            }
        });
    }, [page, filters]);
    
    useEffect(() => {
        getPending(limit, page);
    }, [getPending, page]);

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
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email, rowData) => {
                return <Link to={`/users/usersdirectory/${rowData.uid}/usersAbout/main`}>{email}</Link>;
            },
        },
        {
            title: 'UID',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: 'Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
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
                    getPending(page, limit);
                }}
            >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={'index'} dataSource={documentData} columns={columns} onChange={onChange} pagination={{ pageSize: limit, current: page, total: totalRows }}/>
        <Drawer title="Filter"  placement="right" closable={false} onClose={onClose} visible={visibleFilter} key={"right_filter"}>
            <Form layout="vertical" form={form} onFinish={onChangeFilter}>
                <Form.Item label="Email" name="email">
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item label="UID" name="uid">
                    <Input placeholder="Uid" />
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
export default Documents