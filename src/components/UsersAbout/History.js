import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Table, Tag, Typography } from "antd";
import { formatAmount, getStateColor } from "../../utils/UtilService";
import moment from "moment";
import { useParams } from "react-router-dom";
import PeatioApiService from "../../services/PeatioApiService";
import { EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;

const History = () => {
  const HODL_EMAIL = 'admchodl@admc.mn';
  const ADMIN_EMAIL = 'admin@bydep.com';
  const CORPORATE_EMAILS = [
    'corporate_convention_center@bydep.com',
    'shambala@bydep.com',
    'corporate_nukht@bydep.com',
    'corporate_center@bydep.com'
  ];
  const pageSize = 50;
  const params = useParams();
  const [tradesDatasource, setTradesDatasource] = useState([]);
  const [ordersDatasource, setOrdersDatasource] = useState([]);
  const [depositsDatasource, setDepositsDatasource] = useState([]);
  const [withdrawsDatasource, setWithdrawsDatasource] = useState([]);
  const [internalTransfersDatasource, setInternalTransfersDatasource] =
    useState([]);

  const [currentTradesPage, setCurrentTradesPage] = useState(1);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [currentDepositsPage, setCurrentDepositsPage] = useState(1);
  const [currentWithdrawsPage, setCurrentWithdrawsPage] = useState(1);
  const [currentInternalTransfersPage, setCurrentInternalTransfersPage] =
    useState(1);

  const [totalRows, setTotalRows] = useState({
    trades: 0,
    orders: 0,
    deposits: 0,
    withdraws: 0,
    internalTransfers: 0,
  });

  const tradeColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Maker order email",
      dataIndex: "maker_order_email",
      key: "maker_order_email",
      width: 250,
    },
    {
      title: "Taker order email",
      dataIndex: "taker_order_email",
      key: "taker_order_email",
      width: 250,
    },
    {
      title: "Maker UID",
      dataIndex: "maker_uid",
      key: "maker_uid",
      width: 150,
    },
    {
      title: "Maker Fee",
      dataIndex: "maker_fee_amount",
      key: "maker_fee_amount",
      width: 130,
      render: (value, rowData) => {
        return `${formatAmount(
          value
        )} ${rowData.maker_fee_currency?.toUpperCase()}`;
      },
    },
    {
      title: "Taker UID",
      dataIndex: "taker_uid",
      key: "taker_uid",
      width: 150,
    },
    {
      title: "Taker Fee",
      dataIndex: "taker_fee_amount",
      key: "taker_fee_amount",
      width: 130,
      render: (value, rowData) => {
        return `${formatAmount(
          value
        )} ${rowData.taker_fee_currency?.toUpperCase()}`;
      },
    },
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
      width: 110,
      render: (value) => {
        return value?.toUpperCase();
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 80,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 200,
      render: (value) => {
        return formatAmount(value);
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 200,
      render: (value) => {
        return formatAmount(value);
      },
    },
    {
      title: "Taker Type",
      dataIndex: "taker_type",
      key: "taker_type",
      width: 110,
      render: (value) => {
        let color = getStateColor(value);
        return <Tag color={color}>{value?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (value) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
  ];

  const orderColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
      width: 110,
      render: (value) => {
        return value?.toUpperCase();
      },
    },
    {
      title: "Type",
      dataIndex: "ord_type",
      key: "ord_type",
      width: 110,
      render: (value) => {
        return value?.toUpperCase();
      },
    },
    {
      title: "Amount",
      dataIndex: "origin_volume",
      key: "origin_volume",
      width: 200,
      render: (value) => {
        return formatAmount(value);
      },
    },
    {
      title: "Executed",
      dataIndex: "executed_volume",
      key: "executed_volume",
      width: 200,
      render: (value) => {
        return formatAmount(value);
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 80,
    },
    {
      title: "Average",
      dataIndex: "avg_price",
      key: "avg_price",
      width: 80,
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
      width: 110,
      render: (value) => {
        let color = getStateColor(value);
        return <Tag color={color}>{value?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (value) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Updated Date",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 180,
      render: (value) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Status",
      dataIndex: "state",
      key: "state",
      width: 110,
      render: (value, rowData) => {
        let color = getStateColor(value);
        if(value === 'cancel' && rowData.executed_volume > 0 && rowData.executed_volume < rowData.origin_volume) {
          color = 'orange';
        }
        return <Tag color={color}>{value?.toUpperCase()}</Tag>;
      },
      fixed: 'right'
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (text, record) => (
    //     <Button shape="circle" icon={<EyeOutlined />} />
    //   ),
    //   width: 80,
    //   fixed: 'right'
    // },
  ];

  const depositColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      width: 100,
      render: (value) => {
        return value?.toUpperCase();
      },
    },
    {
      title: "TxID",
      dataIndex: "txid",
      key: "txid",
      width: 250,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (value) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (value) => {
        return formatAmount(value);
      },
      fixed: 'right'
    },
    {
      title: "Status",
      dataIndex: "state",
      key: "state",
      width: 110,
      render: (value, rowData) => {
        let color = getStateColor(value);
        return <Tag color={color}>{value?.toUpperCase()}</Tag>;
      },
      fixed: 'right'
    },
  ];

  const withdrawColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      width: 100,
      render: (value) => {
        return value?.toUpperCase();
      },
    },
    {
      title: "TxID",
      dataIndex: "txid",
      key: "txid",
    },
    {
      title: "Recipient Address",
      dataIndex: "rid",
      key: "rid",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (value) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 200,
      render: (value) => {
        return formatAmount(value);
      },
      fixed: 'right'
    },
    {
      title: "Status",
      dataIndex: "state",
      key: "state",
      width: 110,
      render: (value, rowData) => {
        let color = getStateColor(value);
        return <Tag color={color}>{value?.toUpperCase()}</Tag>;
      },
      fixed: 'right'
    },
  ];

  const internalTransferColumns = [
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
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 130,
      render: (value, rowData) => {
        if(rowData.receiver_email === HODL_EMAIL || rowData.sender_email === HODL_EMAIL) {
          return <Tag color="gold">{'HODL'}</Tag>;
        }
        if(rowData.sender_email === ADMIN_EMAIL) {
          return <Tag color="geekblue">{'AIRDROP'}</Tag>;
        }
        if(rowData.receiver_email === ADMIN_EMAIL) {
          return <Tag color="error">{'REFUND'}</Tag>;
        }
        if(CORPORATE_EMAILS.includes(rowData.receiver_email)) {
          return <Tag color="green">{'PAYMENT'}</Tag>;
        }
        if(CORPORATE_EMAILS.includes(rowData.sender_email)) {
          return <Tag color="error">{'WRONG PAYMENT'}</Tag>;
        }
        return <Tag color="processing">{'TRANSFER'}</Tag>;
      },
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

  const getTrades = useCallback(
    (uid) => {
      PeatioApiService.getTrades(currentTradesPage, pageSize, uid).then(
        (res) => {
          setTotalRows({
            ...totalRows,
            trades: res.total,
          });
          setTradesDatasource(res.data);
        }
      );
    },
    [currentTradesPage]
  );

  const getOrders = useCallback(
    (uid) => {
      PeatioApiService.getOrders(currentOrdersPage, pageSize, uid).then(
        (res) => {
          setTotalRows({
            ...totalRows,
            orders: res.total,
          });
          setOrdersDatasource(res.data);
        }
      );
    },
    [currentOrdersPage]
  );

  const getDeposits = useCallback(
    (uid) => {
      PeatioApiService.getDeposits(currentDepositsPage, pageSize, uid).then(
        (res) => {
          setTotalRows({
            ...totalRows,
            deposits: res.total,
          });
          setDepositsDatasource(res.data);
        }
      );
    },
    [currentDepositsPage]
  );

  const getWithdraws = useCallback(
    (uid) => {
      PeatioApiService.getWithdraws(currentWithdrawsPage, pageSize, uid).then(
        (res) => {
          setTotalRows({
            ...totalRows,
            withdraws: res.total,
          });
          setWithdrawsDatasource(res.data);
        }
      );
    },
    [currentWithdrawsPage]
  );

  const getInternalTransfers = useCallback(
    (uid) => {
      PeatioApiService.getUserInternalTransfers(currentInternalTransfersPage, pageSize, uid).then(
        (res) => {
          setTotalRows({
            ...totalRows,
            internalTransfers: res.total,
          });
          setInternalTransfersDatasource(res.data);
        }
      );
    },
    [currentInternalTransfersPage]
  );

  useEffect(() => {
    getTrades(params.uid);
    getOrders(params.uid);
    getDeposits(params.uid);
    getWithdraws(params.uid);
    getInternalTransfers(params.uid);
  }, [getTrades, getOrders, getDeposits, getWithdraws, getInternalTransfers, params.uid]);


  const onChange = (pagination, filters, sorter, extra, tableName) => {
    switch (tableName) {
      case "trades":
        setCurrentTradesPage(pagination.current);
        break;
      case "orders":
        setCurrentOrdersPage(pagination.current);
        break;
      case "deposits":
        setCurrentDepositsPage(pagination.current);
        break;
      case "withdraws":
        setCurrentWithdrawsPage(pagination.current);
        break;
      case "internalTransfers":
        setCurrentInternalTransfersPage(pagination.current);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ textAlign: "left" }}>
          Trades
        </Title>
        <Card>
          <Table
            rowKey={"id"}
            key={"tradesTable"}
            dataSource={tradesDatasource}
            scroll={{ x: 1500, y: 650 }}
            columns={tradeColumns}
            onChange={(pagination, filters, sorter, extra) =>
              onChange(pagination, filters, sorter, extra, "trades")
            }
            pagination={{
              pageSize: pageSize,
              current: currentTradesPage,
              total: totalRows.trades,
            }}
          />
        </Card>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ textAlign: "left" }}>
          Orders
        </Title>
        <Card>
          <Table
            rowKey={"id"}
            key={"ordersTable"}
            dataSource={ordersDatasource}
            scroll={{ x: 1500, y: 650 }}
            columns={orderColumns}
            onChange={(pagination, filters, sorter, extra) =>
              onChange(pagination, filters, sorter, extra, "orders")
            }
            pagination={{
              pageSize: pageSize,
              current: currentOrdersPage,
              total: totalRows.orders,
            }}
          />
        </Card>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ textAlign: "left" }}>
          Deposits
        </Title>
        <Card>
          <Table
            rowKey={"id"}
            key={"depositsTable"}
            dataSource={depositsDatasource}
            scroll={{ x: 1500, y: 650 }}
            columns={depositColumns}
            onChange={(pagination, filters, sorter, extra) =>
              onChange(pagination, filters, sorter, extra, "deposits")
            }
            pagination={{
              pageSize: pageSize,
              current: currentDepositsPage,
              total: totalRows.deposits,
            }}
          />
        </Card>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ textAlign: "left" }}>
          Withdraws
        </Title>
        <Card>
          <Table
            rowKey={"id"}
            key={"withdrawsTable"}
            dataSource={withdrawsDatasource}
            scroll={{ x: 1500, y: 650 }}
            columns={withdrawColumns}
            onChange={(pagination, filters, sorter, extra) =>
              onChange(pagination, filters, sorter, extra, "withdraws")
            }
            pagination={{
              pageSize: pageSize,
              current: currentWithdrawsPage,
              total: totalRows.withdraws,
            }}
          />
        </Card>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ textAlign: "left" }}>
          Internal Transfers
        </Title>
        <Card>
          <Table
            rowKey={"id"}
            key={"internalTransfersTable"}
            dataSource={internalTransfersDatasource}
            scroll={{ x: 1500, y: 650 }}
            columns={internalTransferColumns}
            onChange={(pagination, filters, sorter, extra) =>
              onChange(pagination, filters, sorter, extra, "internalTransfers")
            }
            pagination={{
              pageSize: pageSize,
              current: currentInternalTransfersPage,
              total: totalRows.internalTransfers,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default History;
