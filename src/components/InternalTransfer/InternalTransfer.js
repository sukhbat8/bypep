import {
  Button,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  Table,
  DatePicker,
  Badge,
  Tag,
} from "antd";
import React, { useCallback, useState, useEffect } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";

import PeatioApiService from "../../services/PeatioApiService";
import { formatAmount, getStateColor } from '../../utils/UtilService';
import moment from "moment";

const { RangePicker } = DatePicker;

const InternalTransfer = () => {

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80
    },
    {
      title: "Sender",
      dataIndex: "sender_email",
      key: "sender_email",
      width: 300
    },
    {
      title: "Reciever",
      dataIndex: "receiver_email",
      key: "receiver_email",
      width: 300,
    },
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   key: "type",
    //   width: 100,
    //   render: (type) => {
    //     return type.toUpperCase();
    //   },
    // },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 200,
      render: (amount) => {
        return formatAmount(amount);
      },
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      width: 100,
      render: (currency) => {
        return currency.toUpperCase();
      },
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
    
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = getStateColor(status);
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const [datasource, setDatasource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 50;
  const [form] = Form.useForm();

  const getInternalTransfer = useCallback(() => {
    PeatioApiService.getInternalTransfer(currentPage, pageSize, filters).then(
      (res) => {
        setTotalRows(res.total);
        setDatasource(res.data);
      }
    );
  }, [currentPage, filters]);

  useEffect(() => {
    getInternalTransfer();
  }, [getInternalTransfer]);

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
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

  return (
    <div>
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
            onClick={() => {
              getInternalTransfer();
            }}
          >REFRESH</Button>
        </Space>
      </Row>
      <Table
        rowKey={"id"}
        dataSource={datasource}
        columns={columns}
        onChange={onChange}
        scroll={{ x: 1500, y: 650 }}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: totalRows,
        }}
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
          <Form.Item label="Sender UID" name="sender">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Receiver UID" name="receiver">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Input placeholder="" />
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
    </div>
  )
}

export default InternalTransfer;