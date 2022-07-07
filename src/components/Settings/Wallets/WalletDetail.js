import { Form, Card, Row, Col, Select, Typography, InputNumber, Button, Input, Table, Modal } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import { useNavigate, useParams, } from 'react-router-dom';
import {
    PlusCircleOutlined, MinusCircleOutlined, DeleteOutlined
} from "@ant-design/icons";
const { Text } = Typography;
const { Option } = Select;
const defaultProperties = [
    {
        label: 'uri',
        value: ''
    }, {
        label: 'secret',
        value: ''
    }
];
const WalletDetails = () => {
    const params = useParams();
    const [wallet, setWallet] = useState(null);
    const [isNew, setIsNew] = useState(null);
    const [kind, setKind] = useState([]);
    const [block, setBlock] = useState(null);
    const [gateways, setGateways] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [linked, setLinked] = useState([]);
    const [existing, setExisting] = useState([]);
    const [newProperty, setNewProperty] = useState(null);
    const [properties, setProperities] = useState(defaultProperties);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        addProperty(newProperty);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const addProperty = (propertyLabel) => {
        properties.push({
            label: propertyLabel,
            value: ''
        });
        setProperities([
            ...properties
        ]);
    }
    const removeProperty = (propertyLabel) => {
        const foundIndex = properties.findIndex(x => x.label === propertyLabel);
        if (foundIndex > -1) {
            properties.splice(foundIndex, 1);
            setProperities([
                ...properties
            ]);
        }
    }

    const onChangeProperties = (value, label) => {
        const foundIndex = properties.findIndex(x => x.label === label);
        if (foundIndex > -1) {
            properties[foundIndex] = {
                label,
                value
            }
            setProperities([
                ...properties
            ]);
        }
    }


    const navigate = useNavigate();


    const getWallet = (id) => {
        if (isNew) {
            preTablesData({ blockchain_key: null, currencies: [] });
        } else {
            PeatioApiService.getWallet(id).then((res) => {
                setWallet(res);
            });
        }
    }

    const getCurrencies = () => {
        PeatioApiService.getLinkedCurrency().then((res2) => {
            setCurrencies(res2);
        });
    }

    const preTablesData = (data) => {
        if (data && data.currencies && currencies) {
            setLinked(currencies.filter(x => data.currencies.includes(x.code)));
            setExisting(currencies.filter(x => !data.currencies.includes(x.code)));
        }
    }

    useEffect(() => {
        if(typeof isNew === "boolean") {
            getWallet(params.id);
        }
    }, [isNew]);

    useEffect(() => {
        preTablesData(wallet);
    }, [wallet, currencies]);

    const getWalletKind = useCallback(() => {
        PeatioApiService.getWalletKind().then((res) => {
            setKind(res);
        });
    }, []);

    const getBlock = useCallback(() => {
        PeatioApiService.getBlock().then((res) => {
            setBlock(res);
        });
    }, []);

    const getWalletGate = useCallback(() => {
        PeatioApiService.getWalletGate().then((res) => {
            setGateways(res);
        });
    }, []);


    useEffect(() => {
        if (params.id) {
            setIsNew(false);
        } else {
            setIsNew(true);
        }
        getCurrencies();
        getWalletKind();
        getBlock();
        getWalletGate();
    }, [getWalletKind, getBlock, getWalletGate, params.id]);

    const onNameChange = (value, name) => {
        setWallet({
            ...properties,
            [name]: value
        });
    };
    const onNumberChange = (value, name) => {
        setProperities({
            ...properties,
            [name]: value
        });
    };
    const convertPropertiesToJSON = () => {
        let result = null;
        const objs = properties.map(x => {
            return { [x.label]: x.value }
        });
        objs.forEach(x => {
            result = { ...result, ...x };
        });
        return result;
    }
    const renderJSONProperties = () => {
        return (<pre>{JSON.stringify(convertPropertiesToJSON(), null, 2)}</pre>);
    }

    const sendFormData = (e) => {
        if (isNew) {
            PeatioApiService.postWalletNew({
                ...wallet,
            }).then((res) => {
                navigate(-1);
            });
        } else {
            PeatioApiService.postWalletUpdate({
                ...wallet,
            }).then((res) => {
                navigate(-1);
            });
        }
    }

    const walletdelete = (rowData) => {
        PeatioApiService.deleteWalletSelect({
            id: wallet.id,
            currencies: rowData.code,
        }).then((res) => {
            getWallet(params.id)
        });
    };

    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Attachments',
            dataIndex: '',
            key: 'upload',
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
    const column1 = [
        Table.SELECTION_COLUMN,
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    return <>
        <Form
            name="basic"
            wrapperCol={{ span: 30 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={sendFormData}
        >
            <Row>
                <Col span={12}>
                    <Card>
                        <Form.Item label="Name" name="name" valuePropName='name'>
                            <Input placeholder={wallet?.name} value={wallet?.name} onChange={(e) => onNameChange(e.target.value, "name")} />
                        </Form.Item>
                        <Form.Item label="Status" name="status" valuePropName='status'>
                            <Select
                                allowClear
                                value={wallet?.status}
                                onChange={(e) => onNameChange(e, "status")}
                            >
                                <Option value="active" name="active" >active</Option>
                                <Option value="disabled" name="disabled">disabled</Option>
                                <Option value="retired" name="retired">retired</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Blockchain Key" name="blockchain_key" valuePropName='blockchain_key'>
                            <Select
                                placeholder={wallet?.blockchain_key}
                                value={wallet?.blockchain_key}
                                onChange={(e) => onNameChange(e, "key")}
                                allowClear
                            >
                                {
                                    block?.map((x, index) => (
                                        <Option key={`basecur_${index}`} value={x.key}>{x.key}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Gateway Client" name="gateway" valuePropName='gateway'>
                            <Select
                                placeholder={wallet?.gateway}
                                value={wallet?.gateway}
                                onChange={(e) => onNameChange(e, "gateway")}
                                allowClear
                            >
                                {
                                    gateways?.map((x, index) => (
                                        <Option key={`basecur_${index}`} value={x}>{x}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card style={{ marginLeft: 20 }}>
                        <Form.Item label="Address" name="address" valuePropName='address'>
                            <Input placeholder={wallet?.address} value={wallet?.address} onChange={(e) => onNameChange(e.target.value, "address")} />
                        </Form.Item>
                        <Form.Item label="Gateway Client" name="kind" valuePropName='kind'>
                            <Select
                                placeholder={wallet?.kind}
                                value={wallet?.kind}
                                onChange={(e) => onNameChange(e, "gateway")}
                                allowClear
                            >
                                {
                                    kind?.map((x, index) => (
                                        <Option key={`basecur_${index}`} value={x}>{x}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'left' }} label="Maximum Balance" name="max_balance" valuePropName='max_balance'>
                            <InputNumber value={wallet?.max_balance || 0} onChange={(e) => onNumberChange(e, "max_balance")} />
                        </Form.Item>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Card style={{ marginTop: 20, width: 850 }}>
                    <Row>
                        <h2>Properties</h2>
                        <Col span={16} style={{ paddingLeft: 350 }}>
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                size="middle"
                                onClick={showModal}
                            >Add property</Button>
                            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                <Form.Item label="New property" name="property">
                                    <Input placeholder="Property name" value={newProperty} onChange={(e) => {
                                        setNewProperty(e.target.value);
                                    }} />
                                </Form.Item>
                            </Modal>
                        </Col>
                        <Col span={12} style={{ padding: 20 }}>
                            {
                                properties.map((p, index) => {
                                    return (
                                        <Form.Item key={`property_${index}`} label={p.label} name={p.label} valuePropName={p.label}>
                                            <Input placeholder='Enter URI AND PASSWORD' value={p.value} onChange={(e) => {
                                                onChangeProperties(e.target.value, p.label);
                                            }} />
                                        </Form.Item>
                                    )
                                })
                            }
                        </Col>
                        <Col span={6} style={{ padding: 20 }}>
                            {
                                properties.map((p) => {
                                    return (
                                        <Form.Item >
                                            <Button type="primary" icon={<MinusCircleOutlined />} onClick={() => {
                                                removeProperty(p.label);
                                            }} />
                                        </Form.Item>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                </Card>
                <Card style={{ marginLeft: 20, marginTop: 20, width: 830, textAlign: 'left', padding: 20 }}>
                    {renderJSONProperties()}
                    <Form.Item >
                        <Button style={{ marginTop: 50, marginLeft: 350 }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Card>
                <WalletsTable name="linked" title={"Linked Currencies"} columns={columns} data={linked} />
                <WalletsTable rowKey={"code"} title={"Existing Currencies"} columns={column1} data={existing} name="existing" wallet={wallet} getWallet={getWallet} />
            </Row>
        </Form>
    </>
};
export default WalletDetails

const WalletsTable = (props) => {
    const [searchedData, setSearchedData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        setSearchedData(props.data);
    }, [props.data]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selRowKeys, selectedRows) => {
            setSelectedRowKeys(selRowKeys);
        }
    };

    const searchSpace = (event) => {
        let keyword = event.target.value;
        let items = props.data;
        if (keyword) {
            items = props.data.filter((row) => row.name.toLowerCase().includes(keyword.toLowerCase()) || row.code.toLowerCase().includes(keyword.toLowerCase()));
        }
        setSearchedData([...items]);
    }

    const walletselected = () => {
        PeatioApiService.postWalletSelect({
            id: props.wallet.id,
            currencies: selectedRowKeys
        }).then((res) => {
            setSelectedRowKeys([]);
            props.getWallet(props.wallet.id);
        });
    };

    return (
        <>
            {
                props.name === "existing" ? (
                    <Card style={{ marginLeft: 20, marginTop: 20, width: 830, textAlign: 'left', padding: 20 }}>
                        <h2>{props.title}</h2>
                        <Row>
                            <Form.Item label="Search" name="search" valuePropName='search'>
                                <Input placeholder='search' onChange={(e) => searchSpace(e)} />
                            </Form.Item>
                            <Button
                                style={{ marginLeft: 300 }}
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                size="middle"
                                onClick={walletselected}
                            >Add selected</Button>
                        </Row>
                        <Table rowKey={props.rowKey} dataSource={searchedData} columns={props.columns} rowSelection={{ ...rowSelection }} />
                    </Card>
                ) : (
                    <Card style={{ marginLeft: 20, marginTop: 20, width: 830, textAlign: 'left', padding: 20 }}>
                        <h2>{props.title}</h2>
                        <Form.Item label="Search" name="search" valuePropName='search'>
                            <Input placeholder='search' onChange={(e) => searchSpace(e)} />
                        </Form.Item>
                        <Table dataSource={searchedData} columns={props.columns} />
                    </Card>
                )
            }

        </>
    )
}