import { Table , Tag, Space, Button, Row, Badge, Input, Drawer, Form } from 'antd';
import React, { useState, useEffect , useCallback} from "react";
import { Link } from "react-router-dom";
import { getStateColor } from "../../../utils/UtilService";
import moment from "moment";
import {
    FilterOutlined,ReloadOutlined, FileExcelOutlined
} from "@ant-design/icons";
import PeatioApiService from '../../../services/PeatioApiService';
const OpenOrders = () => {
    const [openOrdersData, setOpenOrdersData] = useState(null);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [filters, setFilters] = useState({});
    const [form] = Form.useForm();
    const limit = 50;
    const [ page, setPage] = useState(1);
    const getOpenOrder = useCallback(() => {
        PeatioApiService.getOpenOrderList(limit, page, filters).then((res) => {
            setTotalRows(Number(res.total));
            setOpenOrdersData(res.data);
          }
        );
      }, [page, filters]);
    
    useEffect(() => {
        getOpenOrder(limit, page);
    }, [getOpenOrder, page]);


    const onChange = (pagination, filters) => {
      setPage(pagination.current, filters);
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
                return <Link to={`/users/usersdirectory/${rowData.uid}/usersAbout/open-orders`}>{email}</Link>;
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

    ];
    
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
    return <>
        <Row justify="end" style={{ marginBottom: 16 }}>
            <Space>
            <Button type="primary" icon={<FileExcelOutlined />} size="middle">
                EXPORT
            </Button>
            <Badge
                size="small"
                count={Object.keys(filters).filter((key) => filters[key]).length}
            >
                <Button
                type="primary"
                icon={<FilterOutlined />}
                size="middle"
                onClick={openFilterForm}
                >FILTER</Button>
            </Badge>

            <Button
                type="primary"
                icon={<ReloadOutlined />}
                size="middle"
            >REFRESH</Button>
            </Space>
        </Row>
        <Table
        rowKey={"index"}
        dataSource={openOrdersData}
        columns={columns}
        onChange={onChange}
        scroll={{ x: 1500, y: 650 }}
        pagination={{ limit: limit, current: page, total: totalRows }}
      />
      <Drawer
        title="Filter"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visibleFilter}
        key={"right_filter"}
      >
        <Form layout="vertical" form={form} onFinish={onChangeFilter}>
          <Form.Item label="Market" name="market">
            <Input placeholder="Market" />
          </Form.Item>
          <Form.Item label="Order type" name="ord_type">
            <Input placeholder="Order type" />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input placeholder="Price" />
          </Form.Item>
          <Form.Item label="Amount" name="origin_volume">
            <Input placeholder="Amount" />
          </Form.Item>
          <Form.Item label="Side" name="type">
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
export default OpenOrders