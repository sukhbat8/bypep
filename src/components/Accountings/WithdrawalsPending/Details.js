import {Form, Card, Row, Col, Select, Typography, InputNumber, Button , Input, Switch, Space, Modal, Tag, Table, message} from 'antd';
import moment, { parseZone } from 'moment';
import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from 'react-router-dom';
import PeatioApiService from '../../../services/PeatioApiService';
import { getStateColor } from '../../../utils/UtilService';
const { Text } = Typography;
const { Option } = Select;
const Details = () => {
    const params = useParams();
    const [data, setData] = useState(null);
    const [members, setMembers] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 50;
    const [history, setHistory] = useState([]);
    const getWithrawalCoinDetails = useCallback((id) => {
        PeatioApiService.getWithrawalCoinDetails(id).then((res) => {
            setData(res.data);
        PeatioApiService.getWithrawalMembers(res.data.uid).then((res) => {
            setMembers(res[0]);
        });
        PeatioApiService.getWithrawalHistorys(page, limit, res.data.uid,).then((res) => {
            setHistory(res);
        });
    });
    }, []);
    const totalBalance = `${Number(members?.accounts[3]?.locked) + Number(members?.accounts[3]?.balance)} `;

    useEffect(() => {
        getWithrawalCoinDetails(params.id);
    }, [getWithrawalCoinDetails, params.id]);

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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email, members) => {
                return <Link to={`/users/usersdirectory/${members.uid}/usersAbout/main`}>{email}</Link>;
            },

        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'TxID',
            dataIndex: 'blockchain_txid',
            key: 'blockchain_txid',
        },
        {
            title: 'Recipient Address',
            dataIndex: 'rid',
            key: 'rid',
        },
        {
            title: "Date",
            dataIndex: "done_at",
            key: "done_at",
            width: 180,
            render: (done_at) => {
                return moment(done_at).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (state, rowData) => {
                let color = getStateColor(state);
                return<Tag color={color}>{state.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
    ];
    const actionHandle = (action) => {
        PeatioApiService.setWithdrawAction({
            id: data.id,
            action,
        }).then((res) => {
            message.success("Success");
            getWithrawalCoinDetails(data.id);
        });
    };
    const renderActionButtons = () => {
        if(!data) {
            return null;
        }
        if (data.state === "accepted") {
            return (
            <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
                <Space>
                <Button danger onClick={() => actionHandle("reject")}>
                    Reject
                </Button>
                <Button type="primary" onClick={() => actionHandle("process")}>
                    Process
                </Button>
                </Space>
            </Row>
            );
        }
        if (data.state === "processing") {
            return (
            <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
                <Space>
                <Button danger onClick={() => actionHandle("fail")}>
                    Fail
                </Button>
                <Button type="primary" onClick={() => actionHandle("dispatch")}>
                    Confirm
                </Button>
                </Space>
            </Row>
            );
        }
        if (data.state === "skipped") {
            return (
            <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
                <Space>
                <Button danger onClick={() => actionHandle("fail")}>
                    Fail
                </Button>
                <Button type="primary" onClick={() => actionHandle("process")}>
                    Process
                </Button>
                </Space>
            </Row>
            );
        }
        if (data.state === "processing") {
            return (
            <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
                <Space>
                <Button danger onClick={() => actionHandle("fail")}>
                    Fail
                </Button>
                <Button type="primary" onClick={() => actionHandle("dispatch")}>
                    Confirm
                </Button>
                </Space>
            </Row>
            );
        }
        if (data.state === "confirming") {
            return (
            <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
                <Space>
                <Button danger onClick={() => actionHandle("fail")}>
                    Fail
                </Button>
                <Button type="primary" onClick={() => actionHandle("wait")}>
                    Continue
                </Button>
                </Space>
            </Row>
            );
        }
        if (data.state === "waiting") {
            return (
            <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
                <Space>
                <Button danger onClick={() => actionHandle("fail")}>
                    Fail
                </Button>
                </Space>
            </Row>
            );
        }
        return null;
    };
  return <>
    <Form
      name="basic"
      wrapperCol={{ span: 30 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
        <Row style={{ marginBottom: 16 }}>
                <Card style={{textAlign: 'left', padding: 10, width: 800}}>
                    <h2>Member info</h2>
                    <Text>Email</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {data?.email}
                    </div>
                    <Text>UID</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {data?.uid}
                    </div>
                    <Text>Created</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {moment(data?.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <h2>Account info: {data?.currency.toUpperCase()}</h2>
                    <Text>Total balance</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {totalBalance}
                    </div>
                    <Text>Locked</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {members?.accounts[3]?.locked}
                    </div>
                    <Text>Available balance</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {members?.accounts[3]?.balance}
                    </div>
                </Card>
                <Card style={{textAlign: 'left', marginLeft: 20, padding: 10, width: 800}} >
                    <h2>Withdraw</h2> {renderActionButtons()}
                    <br/>
                    <Text>ID</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {data?.tid}
                    </div>
                    <Text>Date</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {moment(data?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <Text>Email</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {data?.email}
                    </div>
                    <Text>Recipient Address</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {data?.rid}
                    </div>
                    <Text>Amount</Text>
                    <div style={{ marginTop: 10, marginBottom: 20}}>
                        {data?.amount}
                    </div>
                </Card>
            </Row>
        <h2 style={{textAlign: 'left', padding: 10}}>Withdrawal history</h2>
        <Table rowKey={"id"}  dataSource={history} onChange={onChange} pagination={{ limit: limit, current: page}} columns={columns}  />
    </Form>
  </>
};
export default Details