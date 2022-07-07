import {Form, Card, Row, Col, Select, Typography, InputNumber, Button , Input, Switch, Space, Modal} from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import { useNavigate, useParams,  } from 'react-router-dom';
import {
    FilterOutlined,ReloadOutlined
  } from "@ant-design/icons";
const { Text } = Typography;
const { Option } = Select;
const BlockchainsDetails = () => {
    const params = useParams();
    const [block, setBlock] = useState(null);
    const [isNew, setIsNew] = useState(null);
    const [status, setStatus] = useState(false);
    const [client, setClient] = useState([]);
    const [latest, setLatest] = useState(null);
    const [blocknumber, setBlocknumber] = useState(null);


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const navigate = useNavigate();


    const getBlockchain = useCallback((id) => {
        PeatioApiService.getBlockchain(id).then((res) => {
            setBlock(res);
            setStatus(res.status);

        });
    }, []);

    const getBlockchainEdith = useCallback(() => {
        PeatioApiService.getBlockchainEdith().then((res) => {
            setClient(res.data);
        });
    }, []);

    const getBlock = useCallback((id) => {
        PeatioApiService.getBlock(id).then((res) => {
            setLatest(res.data);
        });
    }, []);

    useEffect(() => {
        if(params.id){
        setIsNew(false);
        }else{
        setIsNew(true);
        }
        getBlockchain(params.id);
        getBlockchainEdith();
        getBlock(params.id);

    }, [getBlockchain, getBlockchainEdith, getBlock, params.id]);

    const handleVisible = (e) => {
        setStatus(e);
    }
    const visstatus = () => {
    if (status) {
        return <Text name="enabled" >Enabled</Text>
    }
    return <Text name="disabled" >Disabled</Text>
    }

    const onNumberChange = (value, name) => {
        setBlock({
          ...block,
          [name]: value
        });
    };
    const onBlocknumberChange = (e) => {
        setBlocknumber(e);
        console.log(e);
    };
    const onNameChange = (value, name) => {
        setBlock({
        ...block,
        [name]: value
        })
    };

    const sendFormData = (e) => {
        if(isNew) {
            PeatioApiService.postBlockchainNew({
                ...block,
            }).then((res) => {
                navigate(-1);
            });
        } else {
            PeatioApiService.postBlockchainUpdate({
                ...block,
            }).then((res) => {
                navigate(-1);
            });
        }
    }


  return <>
    <Form
      name="basic"
      wrapperCol={{ span: 30 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={sendFormData}
    >
        <Row justify="end" style={{ marginBottom: 16 }}>
            <Space>
                <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        size="middle"
                        onClick={showModal}
                    >SCAN BLOCKS</Button>
                    <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <h2>Block scanning</h2>
                        <Form.Item label="Current Height" name="height" valuePropName='height'>
                            <Input placeholder={block?.height} value={block?.height} onChange={(e) => onNameChange(e.target.value, "height")} />
                        </Form.Item>
                        <Row>
                            <Form.Item label="Latest block" name="latest" valuePropName='latest'>   
                                <Input placeholder={latest} value={latest} onChange={(e) => onNameChange(e.target.value, "latest")} />
                            </Form.Item>
                            <Col span={6}>
                                <Button style={{marginLeft: 120}} type="primary" onClick={(e) => {
                                    PeatioApiService.getBlock({
                                        ...latest,
                                    }).then((res) => {
                                        navigate(-1);
                                    });
                                }}>Request</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Item label="Scan a specific block" name="block_number"  valuePropName='block_number'>
                                <InputNumber value={blocknumber} onChange={(e) => onBlocknumberChange(e)} />
                            </Form.Item>
                            <Col span={6}>
                                <Button style={{marginLeft: 180}} type="primary" onClick={(e) => {
                                        PeatioApiService.postProcess_block({
                                            id: block?.id,
                                            block_number:blocknumber
                                        }).then((res) => {
                                            navigate(-1);
                                        });
                                    }}>Scan</Button>
                            </Col>
                        </Row>
                    </Modal>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    size="middle"
                    onClick={() => {
                        getBlockchain();
                    }}
                >REFRESH</Button>
            </Space>
        </Row>
        <Row>
            <Card>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Name" name="name" valuePropName='name'>
                            <Input placeholder="Name" value={block?.name} onChange={(e) => onNameChange(e.target.value, "name")} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Status" name="status" >
                            <Switch checked={status} onChange={(e) => handleVisible(e)} />
                            <br />
                            {visstatus()}
                        </Form.Item>
                    </Col>
                </Row>
                <Col span={24}>
                    <Form.Item style={{ paddingTop: 40 }} label="Client" name="client" valuePropName='client'>
                        <Select
                            placeholder={block?.client || "client"}
                            value={block?.client}
                            onChange={(e) => onNameChange(e, "client")}
                            allowClear
                        >
                        {
                            client.map((x, index) => (
                            <Option key={`basecur_${index}`} value={x}>{x}</Option>
                            ))
                        }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Server" name="server" valuePropName='server'>
                        <Input placeholder="http://geth:8545" value={block?.server} onChange={(e) => onNameChange(e.target.value, "server")} />
                    </Form.Item>
                    <Form.Item label="Min Confirmations" name="min_confirmations"  valuePropName='min_confirmations'>
                        <InputNumber value={block?.min_confirmations || 0} onChange={(e) => onNumberChange(e, "min_confirmations")} />
                    </Form.Item>
                </Col>
            </Card>
            <Card>
                <Row>
                    <Col span={12} style={{textAlign: 'left'}}>
                        <Form.Item label="Height" name="height"  valuePropName='height'>
                            <InputNumber value={block?.height || 0} onChange={(e) => onNumberChange(e, "height")} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {
                            block?.id? (
                                <Button type="primary" onClick={() => {
                                    PeatioApiService.postBlockchainUpdate({
                                        ...block,
                                    }).then((res) => {
                                        navigate(-1);
                                    });
                                }}>Reset</Button>
                            ):null
                        }
                    </Col>
                    <Col span={24} style={{textAlign: 'left'}}>
                        <Form.Item label="Key" name="key" valuePropName='key'>
                            <Input placeholder={block?.key || "eth-rinkeby"} value={block?.key} onChange={(e) => onNameChange(e.target.value, "key")} />
                        </Form.Item>
                        <Form.Item label="Explorer Address" name="explorer_address" valuePropName='explorer_address'>
                            <Input placeholder={block?.explorer_address || "http://rinkeby.etherscan.io/address/#{address}"} value={block?.explorer_address} onChange={(e) => onNameChange(e.target.value, "explorer_address")} />
                        </Form.Item>
                        <Form.Item label="Explorer Transaction" name="explorer_transaction" valuePropName='explorer_transaction'>
                            <Input placeholder={block?.explorer_transaction || "http://rinkeby.etherscan.io/tx/#{txid}"} value={block?.explorer_transaction} onChange={(e) => onNameChange(e.target.value, "explorer_transaction")} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{justifyContent: 'flex-end'}}>
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Row>
            </Card>
        </Row>
    </Form>
  </>
};
export default BlockchainsDetails