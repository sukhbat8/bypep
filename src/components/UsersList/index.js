import { Table, Tag, Row,Drawer, Input,
  Space,
  DatePicker,
  Badge, Form, Button } from "antd";
import React, { useEffect, useState ,useCallback} from "react";
import BarongApiService from "../../services/BarongApiService";
import moment from "moment";
import { getStateColor } from "../../utils/UtilService";
import { Link } from "react-router-dom";
import {
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const UsersList = () => {
  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 120,
      render: (uid) => {
        return <Link to={`/users/usersdirectory/${uid}/usersAbout/main`}>{uid}</Link>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
    },
    {
      title: 'KYC',
      dataIndex: 'level',
      key: 'level',
      width: 50,
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
      render: (created_at) => {
        return moment(created_at).format("YYYY-MM-DD HH:mm:ss");
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
    }
  ];
  const [datasource, setDatasource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const pageSize = 50;

  const [form] = Form.useForm();

  const getDeposits = useCallback(() => {
    BarongApiService.getUsers(currentPage, pageSize, filters).then((res) => {
      setDatasource(res.data);
      setTotalRows(res.total);
    });
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

  return <div>
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
              getDeposits();
            }}
          >REFRESH</Button>
        </Space>
      </Row>
    <Table 
      dataSource={datasource} 
      rowKey={"uid"}
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
          <Form.Item label="Email" name="email">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="UID" name="uid">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Level" name="level">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label="Status" name="state">
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
};
export default UsersList;
