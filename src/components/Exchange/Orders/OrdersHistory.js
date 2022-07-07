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
const OrdersHistory = () => {
    const [history, setHistory] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const limit = 50;
    const [ page, setPage] = useState(1);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();

    const getOrdersHistory = useCallback((limit, page) => {
        PeatioApiService.getOrdersHistory(limit, page, filters).then((res) => {
            setTotalRows(res.total);
            setHistory(res.data);
        });
    }, [page, filters]);
    
    useEffect(() => {
      getOrdersHistory(limit, page);
    }, [getOrdersHistory, limit, page]);

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
                  getOrdersHistory(limit, page);
                }}
            >REFRESH</Button>
            </Space>
        </Row>
        <Table rowKey={'index'} dataSource={history} columns={columns} onChange={onChange} pagination={{ pageSize: limit, current: page, total: totalRows }}/>
        <Drawer title="Filter"  placement="right" closable={false} onClose={onClose} visible={visibleFilter} key={"right_filter"}>
            <Form layout="vertical" form={form} onFinish={onChangeFilter}>
                <Form.Item label="Date range" name="daterange">
                    <RangePicker showTime />
                </Form.Item>
                <Form.Item label="ID" name="id">
                    <Input placeholder="Id" />
                </Form.Item>
                <Form.Item label="Market" name="market">
                    <Input placeholder="Market" />
                </Form.Item>
                <Form.Item label="Order type" name="ord_type">
                    <Input placeholder="Order type" />
                </Form.Item>
                <Form.Item label="Price" name="price">
                    <Input placeholder="Price" />
                </Form.Item>
                <Form.Item label="Amount" name="amount">
                    <Input placeholder="Amount" />
                </Form.Item>
                <Form.Item label="Side" name="side">
                    <Input placeholder="Side" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input placeholder="Email" />
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
export default OrdersHistory