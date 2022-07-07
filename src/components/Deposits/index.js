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
import React, { useCallback, useState } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useEffect } from "react/cjs/react.development";
import PeatioApiService from "../../services/PeatioApiService";
import moment from "moment";
import { formatAmount, getStateColor } from "../../utils/UtilService";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;

const Deposits = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 80,
      render: (id, record) => {
        return (
          <Link to={`/accountings/deposits/${record.tid}/details`}>{record.id}</Link>
        );
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
      dataIndex: "txid",
      key: "txid",
      width: 550,
    },
    {
      title: "Created date",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (created_at) => {
        return moment(created_at).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 200,
      render: (amount) => {
        return formatAmount(amount)
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
      title: "Confirmations",
      dataIndex: "confirmations",
      key: "confirmations",
      width: 125,
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
  const [totalRows, setTotalRows] = useState(0);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const pageSize = 50;

  const [form] = Form.useForm();

  const getDeposits = useCallback(() => {
    PeatioApiService.getDeposits(currentPage, pageSize, filters).then(
      (res) => {
        setTotalRows(Number(res.total));
        setDatasource(res.data);
      }
    );
  }, [currentPage, filters]);

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
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

  // const deposit = (e) => {
  //   console.log("deposit", e);
  //   setIsModalVisible(false);
  // };

  return (
    <div>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Space>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            Орлого хийх
          </Button> */}
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
              getDeposits();
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
        pagination={{ pageSize: pageSize, current: currentPage, total: totalRows }}
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
          <Form.Item label="Currency" name="currency">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Type" name="type">
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
      {/* <Modal
        title="Орлого хийх"
        visible={isModalVisible}
        footer={null}
        width={400}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form layout="vertical" onFinish={deposit}>
          <Form.Item label="Вальют" name="currency" rules={[{ required: true, message: "Вальют сонгоно уу!" }]}>
            <Select placeholder="" onChange={onCurrencyChange}>
              <Select.Option value="mnt">MNT</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Мөнгөн дүн" name="amount" rules={[{ required: true, message: "Мөнгөн дүн оруулна уу!" }]}>
            <Input placeholder="" type="number" />
          </Form.Item>
          <Form.Item label="UID" name="uid" rules={[{ required: true, message: "UID оруулна уу!" }]}>
            <Input placeholder="" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              htmlType="submit"
              size="middle"
              type="primary"
            >
              Цэнэглэх
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

export default Deposits;
