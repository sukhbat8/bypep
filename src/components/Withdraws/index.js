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
import moment from "moment";
import { Link } from "react-router-dom";
import { formatAmount, getStateColor } from "../../utils/UtilService";

const { RangePicker } = DatePicker;

const Withdraws = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 80,
      render: (id) => {
        return <Link to={`/accountings/withdrawals/${id}/details`}>{id}</Link>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      fixed: "left",
      width: 250,
    },
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
      width: 150,
      fixed: "left",
    },
    {
      title: "TxID",
      dataIndex: "blockchain_txid",
      key: "blockchain_txid",
      width: 550,
    },
    {
      title: "Recipient Address",
      dataIndex: "rid",
      key: "rid",
      width: 350,
    },
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => {
        return type.toUpperCase();
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: 120,
      fixed: "right",
      render: (state) => {
        let color = getStateColor(state);
        return <Tag color={color}>{state.toUpperCase()}</Tag>;
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
  const getWithdrawals = useCallback(() => {
    PeatioApiService.getWithdrawals(currentPage, pageSize, filters).then(
      (res) => {
        setTotalRows(res.total);
        setDatasource(res.data);
      }
    );
  }, [currentPage, filters]);

  useEffect(() => {
    getWithdrawals();
  }, [getWithdrawals]);

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
            Export
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
            />
          </Badge>

          <Button
            type="primary"
            icon={<ReloadOutlined />}
            size="middle"
            onClick={() => {
              getWithdrawals();
            }}
          />
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
          <Form.Item label="ID" name="id">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="UID" name="uid">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="TxID" name="txid">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Recipient Address" name="rid">
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
  );
};
export default Withdraws;
