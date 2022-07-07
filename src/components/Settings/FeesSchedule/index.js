import { Table , Row, Space, Button, Modal, Form, Badge, Input, Drawer, Select } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import moment from "moment";
import {
    PlusCircleOutlined,ReloadOutlined, FilterOutlined, DeleteOutlined,EditOutlined
} from "@ant-design/icons";
const { Option } = Select;
const FeesSchedule = () => {
    const [fees, setFees] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 50;
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    
  
    const [form] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleNew, setIsModalVisibleNew] = useState(false);
    const [row , setRow] = useState(null);


    const getFeesSchedule = useCallback((page, limit) => {
        PeatioApiService.getFeesSchedule(page, limit, filters).then((res) => {
            setFees(res.data);
        });
    }, [page, filters]);

    useEffect(() => {
        getFeesSchedule(page, limit);
    }, [getFeesSchedule, page]);

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
            title: 'Market',
            dataIndex: 'market_id',
            key: 'market_id',
            render: (market_id) => {
                return market_id.toUpperCase();
            },
        },
        {
            title: 'Maker fee',
            dataIndex: 'maker',
            key: 'maker',
            render: (maker, rowData) => {
                const c = fees.find(x => x.code === rowData.code);
                return `${Number(rowData.maker) * 100} %` ;
            },
        },
        {
            title: 'Taker fee',
            dataIndex: 'taker',
            key: 'taker',
            render: (taker, rowData) => {
                const c = fees.find(x => x.code === rowData.code);
                return `${Number(rowData.taker) * 100} %` ;
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
                                <Form.Item label="Group" name="group">
                                    <Input placeholder={row?.group} value={row?.group} onChange={(e) => onNameChange(e.target.value, "group")}/>
                                </Form.Item>
                                <Form.Item label="Market ID" name="market_id">
                                    <Input placeholder={row?.market_id} value={row?.market_id} onChange={(e) => onNameChange(e.target.value, "market_id")}/>
                                </Form.Item>
                                <Form.Item label="Maker fee" name="maker">
                                    <Input placeholder={row?.maker} value={row?.maker} onChange={(e) => onNameChange(e.target.value, "maker")} />
                                </Form.Item>
                                <Form.Item label="Taker fee" name="taker">
                                    <Input placeholder={row?.taker} value={row?.taker} onChange={(e) => onNameChange(e.target.value, "taker")}/>
                                </Form.Item>
                            </Modal>
                    </div>  
                )
            }
        },
        {
            dataIndex: "delete",
            key: "delete",
            render: (record, rowData) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button 
                            onClick={() => {feesDelete(rowData)}}
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
        PeatioApiService.postFeesUpdate({
            ...row,
        }).then((res) => {
            setFees();
        });
        setIsModalVisible(false);
    };
    const handleOkey = () => {  
        console.log(row);
        PeatioApiService.postFeesNew({
            ...row,
        }).then((res) => {
            getFeesSchedule(page, limit);
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
    const feesDelete = (rowData) => {
        console.log(rowData);
        PeatioApiService.postFeesDelete({
            id: rowData.id
        }).then((res) => {
            getFeesSchedule(page, limit);
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
                >ADD FEES SCHEDULE</Button>
                <Modal title="Basic Modal" visible={isModalVisibleNew} onOk={handleOkey} onCancel={handleCancelNew}>
                    <Form.Item label="Group" name="group">
                        <Input placeholder="Group" value={fees?.group} onChange={(e) => onNameChange(e.target.value, "group")}/>
                    </Form.Item>
                    <Form.Item label="Market ID" name="market_id" valuePropName='market_id'>
                        <Select
                            allowClear
                            value={fees?.market_id}
                            onChange={(e) => onNameChange(e, "market_id")}
                        >
                            <Option value="admcmnt" name="admcmnt" >admcmnt</Option>
                            <Option value="ethmnt" name="ethmnt">ethmnt</Option>
                            <Option value="usdtmnt" name="usdtmnt">usdtmnt</Option>
                            <Option value="bnbmnt" name="bnbmnt">bnbmnt</Option>
                            <Option value="any" name="any">any</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Maker fee" name="maker">
                        <Input placeholder="Maker fee" value={row?.maker} onChange={(e) => onNameChange(e.target.value, "maker")} />
                    </Form.Item>
                    <Form.Item label="Taker fee" name="taker">
                        <Input placeholder="Taker fee" value={row?.taker} onChange={(e) => onNameChange(e.target.value, "taker")}/>
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
                        <Form.Item label="Group" name="group">
                            <Input placeholder="Group" />
                        </Form.Item>
                        <Form.Item label="Market" name="market">
                            <Input placeholder="Market" />
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
                        getFeesSchedule(page, limit);
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={"id"} dataSource={fees} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns}  />
    </>
};
export default FeesSchedule