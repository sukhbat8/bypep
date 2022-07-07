import { Table,  Tag, Row, Space, Button, Form, Badge, Input, Drawer } from 'antd';
import React, { useState, useCallback, useEffect } from "react";
import { getStateColor } from "../../utils/UtilService";
import PeatioApiService from '../../services/PeatioApiService';
import { Link } from "react-router-dom";
import moment from "moment";
import {
    FilterOutlined,
    ReloadOutlined,
  } from "@ant-design/icons";
const Beneficar = () => {
    const [beneficiariesHome, setBeneficiariesHome] = useState([]);
    const [totalRows, setTotalRow] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 50;
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();
    const getBeneficaries = useCallback((page, limit) => {
        PeatioApiService.getBeneficiaries(page, limit, filters).then((data) => {
            setTotalRow(Number(data.total));
            setBeneficiariesHome(data.data.map((x, index) => {
                return {
                    ...x,
                    index,
                }
            }));
        });
    }, [page, filters]);
    useEffect(() => {
        getBeneficaries(page, limit);
    }, [getBeneficaries, page, limit]);
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
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (id) => {
                return <Link to={`/users/beneficiaries/${id}/details`}>{id}</Link>;
            },
        },
        {
            title: "UID",
            dataIndex: "uid",
            key: "uid",
            render: (uid) => {
                return <Link to={`/users/usersdirectory/${uid}/usersAbout/main`}>{uid}</Link>;
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
            render: (currency) => {
                return currency.toUpperCase();
            },
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (state, row) => {
                const bene = beneficiariesHome.find(x => x.state === 'active' || x.state ==='');
                if (bene) {
                    let color = getStateColor(bene.state);
                    return <Tag color={color}>{bene.state.toUpperCase()}</Tag>;
                }
                return row.state; 
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
                    getBeneficaries(page, limit);
                }}
            >REFRESH</Button>
            </Space>
        </Row>
        <Table dataSource={beneficiariesHome} onChange={onChange} pagination={{ limit: limit, current: page, total: totalRows }} columns={columns} />
        <Drawer
            title="Filter"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visibleFilter}
            key={"right_filter"}
        >
            <Form layout="vertical" form={form} onFinish={onChangeFilter}>
            <Form.Item label="ID" name="id">
                <Input placeholder="Id" />
            </Form.Item>
            <Form.Item label="UID" name="uid">
                <Input placeholder="Uid" />
            </Form.Item>
            <Form.Item label="Currency" name="currency">
                <Input placeholder="Currency" />
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
export default Beneficar