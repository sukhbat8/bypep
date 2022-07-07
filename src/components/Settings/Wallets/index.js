import { Table,  Tag , Row, Space, Button, Switch, Form, Badge, Input, Drawer,  } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import {useNavigate} from 'react-router-dom';
import { getStateColor } from "../../../utils/UtilService";
import PeatioApiService from '../../../services/PeatioApiService';
import { Link } from "react-router-dom";
import moment from "moment";
import {
    PlusCircleOutlined,ReloadOutlined, FilterOutlined, DeleteOutlined
} from "@ant-design/icons";
  
const Wallet = () => {
    const [wallet, setWallet] = useState([]);
    const [page, setPage] = useState(1);
    const [currency, setCurrency] = useState();
    const limit = 50;
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();
    let navigate = useNavigate();



    const getWallets = useCallback((page, limit) => {
        PeatioApiService.getWallets(page, limit, filters).then((res) => {
            setWallet(res.data);
        });
    }, [page, filters]);

    const getLinkedCurrency = useCallback(() => {
        PeatioApiService.getLinkedCurrency().then((res) => {
            setCurrency(res);
        });
    }, []);

    useEffect(() => {
        getWallets(page, limit);
        getLinkedCurrency();
    }, [getWallets, getLinkedCurrency, page]);

    const onChange = (pagination, filters) => {
        setPage(pagination.current);
    };
    const changeStatus = (e, row) => {
        PeatioApiService.postWalletUpdate({
            ...row,
            status: e === true ? 'active' : 'disabled'
        }).then(data => {
            let index = wallet.findIndex(x => x.id === data.id);
            if(index > -1) {
                wallet[index] = data;
                setWallet([
                    ...wallet
                ]);
            }
        });
    }
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (id) => {
                return <Link to={`/settings/wallets/${id}/edit`}>{id}</Link>;
            },
        },
        {
            title: 'Kind',
            dataIndex: 'kind',
            key: 'kind',
            render: (kind) => {
                return kind.toUpperCase();
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, rowData) => {
                let color = getStateColor(status);
                return <><Tag color={color}>{status.toUpperCase()}</Tag> <Switch checked={status === 'active'} onChange={(e) => changeStatus(e, rowData)} /></>;
            }
        },
    ];
    const walletdelete = (rowData) => {
        PeatioApiService.deleteWalletSelect({
            id: rowData.walletId,
            currencies: rowData.code,
        }).then((res) => {
            getWallets(page, limit);
        });
    };
    const expandedRowRender = (rowKey) => {
        const data1 = Object.keys(rowKey.balance).map(key => {
            return {
                code: key,
                balance: rowKey.balance[key],
                walletId: rowKey.id
            }
        })
        const columns = [
            { 
                dataIndex: 'name', 
                key: 'name',
                render: (record, rowData) => {
                    const c = currency.find(x => x.code === rowData.code);
                    return `${c.name}` ;
                },
            },
            {
                dataIndex: 'balance', 
                key: 'balance',
                render: (record, rowData) => {
                    const c = currency.find(x => x.code === rowData.code);
                    return `${record} ${rowData.code.toUpperCase()}` ;
                },
            },
            {
                dataIndex: "price",
                key: "price",
                render: (record, rowData) => {
                    const c = currency.find(x => x.code === rowData.code);
                    return `${Number(rowData.balance) * Number(c.price)} $` ;
                },
            },
            {
                dataIndex: "delete",
                key: "delete",
                render: (record, rowData) => {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button onClick={() => {
                                walletdelete(rowData);
                            }} icon={<DeleteOutlined />} size="middle" />
                        </div>  
                    )
                }
            },
            
        ];
        return <Table rowKey={"id"} columns={columns} dataSource={data1} pagination={false} />;
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
                    onClick={() => {
                        navigate(`/settings/wallets/add`);
                    }}
                >ADD WALLET</Button>
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
                        <Form.Item label="Kind" name="kind">
                            <Input placeholder="Kind" />
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
                        getWallets();
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={"id"} expandable={{expandedRowRender}} dataSource={wallet} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns}  />
    </>
};
export default Wallet