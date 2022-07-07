import { Table , Row, Space, Button, Modal, Form, Badge, Input, Drawer, Select } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import moment from "moment";
import {
    PlusCircleOutlined,ReloadOutlined, FilterOutlined, DeleteOutlined,EditOutlined
} from "@ant-design/icons";
import BarongApiService from '../../../services/BarongApiService';
import { useParams } from 'react-router-dom';
const { Option } = Select;
const WithrawalLimits = () => {
    const [withdrawalLimit, setWithdrawalLimit] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 50;
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    
  
    const [form] = Form.useForm();
    const params = useParams();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleNew, setIsModalVisibleNew] = useState(false);
    const [row , setRow] = useState(null);
    const [groups, setGroups] = useState([]); 
    const [levels, setLevels] = useState([]);


    const getWithrawalLimits = useCallback((page, limit) => {
        PeatioApiService.getWithrawalLimits(page, limit, filters).then((res) => {
            setWithdrawalLimit(res.data);
        });
    }, [page, filters]);


    const getWithrawalGroups = useCallback(() => {
        PeatioApiService.getWithrawalGroups().then((res) => {
            setGroups(res);
        });
    }, []);
    const getWithrawalLevels = useCallback(() => {
        BarongApiService.getWithrawalLevels().then((res) => {
            setLevels(res);
        });
    }, []);

    useEffect(() => {
        getWithrawalLimits(page, limit, params.id);
        getWithrawalGroups();
        getWithrawalLevels();
    }, [getWithrawalLimits, getWithrawalGroups,getWithrawalLevels, page]);

    const onChange = (pagination) => {
        setPage(pagination.current);
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
        },
        {
            title: 'KYC Level',
            dataIndex: 'kyc_level',
            key: 'kyc_level',
        },
        {
            title: '24h Limit',
            dataIndex: 'limit_24_hour',
            key: 'limit_24_hour',
        },
        {
            title: '1m Limit',
            dataIndex: 'limit_1_month',
            key: 'limit_1_month',
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
            dataIndex: "update",
            key: "update",
            render: (record, rowData) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button 
                            onClick={() => {showModal(rowData)}}
                            icon={<EditOutlined />} size="middle" />
                            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                <Form.Item label="KYC Level" name="kyc_level" valuePropName='kyc_level'>
                                    <Select
                                        placeholder={row?.kyc_level}
                                        value={levels.id}
                                        onChange={(e) => onNameChange(e, "kyc_level")}
                                        allowClear
                                    >
                                    {
                                        levels.map((x, index) => (
                                        <Option key={`basecur_${index}`} value={x.id}>Level{x.id}</Option>
                                        ))
                                    }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Group" name="group" valuePropName='group'>
                                    <Select
                                        placeholder={row?.group}
                                        value={row?.group}
                                        onChange={(e) => onNameChange(e, "group")}
                                        allowClear
                                    >
                                    {
                                        groups.map((x, index) => (
                                        <Option key={`basecur_${index}`} value={x}>{x}</Option>
                                        ))
                                    }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="24h Withdraw Limit in USD" name="limit_1_month">
                                    <Input placeholder={row?.limit_1_month} value={row?.limit_1_month} onChange={(e) => onNameChange(e.target.value, "limit_1_month")} />
                                </Form.Item>
                                <Form.Item label="1m Withdraw Limit in USD" name="limit_24_hour">
                                    <Input placeholder={row?.limit_24_hour} value={row?.limit_24_hour} onChange={(e) => onNameChange(e.target.value, "limit_24_hour")}/>
                                </Form.Item>
                            </Modal>
                    </div>  
                )
            }
        },
        {
            dataIndex: "delete",
            key: "delete",
            render: (record, id) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button 
                            onClick={() => {widthDelete(id)}}
                            icon={<DeleteOutlined />} size="middle" />
                    </div>  
                )
            }
        }
    ];
    const showModal = (rowData) => {
        setRow(rowData);
        setIsModalVisible(true);
    };
    const showModalNew = () => {
        setIsModalVisibleNew(true);
    };
    const handleOk = () => {  
        PeatioApiService.putWithrawalUpdate({
            ...row,
        }).then((res) => {
            getWithrawalLimits(page, limit);
        });
        setIsModalVisible(false);
    };
    const handleOkey = () => {  
        PeatioApiService.postWithrawalNews({
            ...row,
        }).then((res) => {
            getWithrawalLimits(page, limit);
        });
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleCancelNew = () => {
        setIsModalVisibleNew(false);
    };
    const onNameChange = (value, name) => {
        setRow({
            ...row,
            [name]: value
        });
    };
    const widthDelete = (widthDelete) => {
        PeatioApiService.deleteWithrawalDelete(widthDelete.id, widthDelete
            ).then((res) => {
            getWithrawalLimits(page, limit);
        });
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
        console.log({ ..._filters })
        setVisibleFilter(false);
    };
    const onClose = () => {
        form.submit();
        setVisibleFilter(false);
    };
    const resetForm = () => {
        form.resetFields();
    };
        
    return <>
        <Row justify="end" style={{ marginBottom: 16 }}>
            <Space>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    size="middle"
                    onClick={() => {showModalNew()}}
                >ADD WITHDRAWAL LIMIT</Button>
                <Modal title="WITHDRAWAL LIMIT" visible={isModalVisibleNew} onOk={handleOkey} onCancel={handleCancelNew}>
                    <Form.Item label="KYC Level" name="kyc_level" valuePropName='kyc_level'>
                        <Select
                            placeholder={row?.kyc_level}
                            value={levels.id}
                            onChange={(e) => onNameChange(e, "kyc_level")}
                            allowClear
                        >
                        {
                            levels.map((x, index) => (
                            <Option key={`basecur_${index}`} value={x.id}>Level{x.id}</Option>
                            ))
                        }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Group" name="group" valuePropName='group'>
                        <Select
                            placeholder="group"
                            value={row?.group}
                            onChange={(e) => onNameChange(e, "group")}
                            allowClear
                        >
                        {
                            groups.map((x, index) => (
                            <Option key={`basecur_${index}`} value={x}>{x}</Option>
                            ))
                        }
                        </Select>
                    </Form.Item>
                    <Form.Item label="24h Withdraw Limit in USD" name="maker">
                        <Input placeholder="24h Withdraw Limit in USD" value={row?.limit_24_hour} onChange={(e) => onNameChange(e.target.value, "limit_24_hour")} />
                    </Form.Item>
                    <Form.Item label="1m Withdraw Limit in USD" name="limit_1_month">
                        <Input placeholder="1m Withdraw Limit in USD" value={row?.limit_1_month} onChange={(e) => onNameChange(e.target.value, "limit_1_month")}/>
                    </Form.Item>
                </Modal>
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
                <Drawer
                    title="Search"
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visibleFilter}
                    key={"right_filter"}
                >
                    <Form layout="vertical" form={form} onFinish={onChangeFilter}>
                        <Form.Item label="KYC Level" name="kyc_level">
                            <Input placeholder="KYC Level" />
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
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    size="middle"
                    onClick={() => {
                        getWithrawalLimits(page, limit);
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={"id"} dataSource={withdrawalLimit} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns}  />
    </>
};
export default WithrawalLimits