import { Typography, Input, Form, Button, Card, Row, Col, Switch, Select, Modal, InputNumber } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import { useNavigate, useParams } from 'react-router-dom';
import {
    PlusCircleOutlined,
    MinusCircleOutlined
} from "@ant-design/icons";
const { Option } = Select;
const { Text } = Typography;
const defaultProperties = [
    {
        label: 'erc20_contract_address',
        value: ''
    }, {
        label: 'gas_limit',
        value: ''
    }, {
        label: 'gas_price',
        value: ''
    }
];

const AddC = () => {
    const [currencyEdit, setCurrencyEdit] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const params = useParams();

    const [isVisible, setIsVisible] = useState(false);
    const [enableDeposit, setEnableDeposit] = useState(false);
    const [enableWithdraw, setEnableWithdraw] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const [newProperty, setNewProperty] = useState(null);
    const [properties, setProperities] = useState(defaultProperties);

    const navigate = useNavigate();

    const getCurrency = useCallback((currency) => {
        PeatioApiService.getCurrency(currency).then((res) => {
            console.log(res);
            setCurrencyEdit(res);
            setIsVisible(res.visible);
            setEnableDeposit(res.deposit_enabled);
            setEnableWithdraw(res.withdraw_enabled)
            setProperities(convertObjectToProperties(res.options));
        });
    }, []);

    useEffect(() => {
        if (params.code) {
            setIsNew(false);
            getCurrency(params.code);
        } else {
            setIsNew(true);
        }
    }, [getCurrency, params.code]);

    const onChangeForm = (value, name) => {
        setCurrencyEdit({
            ...currencyEdit,
            [name]: value
        });
    };

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
    
    const visstate = () => {
        if (isVisible) {
            return <Text name="enabled" >Enabled</Text>
        }
        return <Text name="disabled" >Disabled</Text>
    }
    const depositstate = () => {
        if (enableDeposit) {
            return <Text name="enabled" >Enabled</Text>
        }
        return <Text name="disabled" >Disabled</Text>
    }
    const withdrawalstate = () => {
        if (enableWithdraw) {
            return <Text name="enabled" >Enabled</Text>
        }
        return <Text name="disabled" >Disabled</Text>
    }
    
    const handleVisible = (e) => {
        setIsVisible(e);
    }
    const handleDeposit = (e) => {
        setEnableDeposit(e);
    }
    const handleWithdraw = (e) => {
        setEnableWithdraw(e);
    }

    const sendFormData = (e) => {
        if(isNew) {
            PeatioApiService.postCurrenciesNew({
                ...currencyEdit,
                options: convertPropertiesToJSON()
            }).then((res) => {
                navigate(-1);
            });
        } else {
            PeatioApiService.postCurrencyUpdate({
                ...currencyEdit,
                options: convertPropertiesToJSON()
            }).then((res) => {
                navigate(-1);
            });
        }
    }

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
        console.log(foundIndex);
        if (foundIndex > -1) {
            properties.splice(foundIndex, 1);
            setProperities([
                ...properties
            ]);
        }
    }
    
    const onChangeProperties = (value, label) => {
        const foundIndex = properties.findIndex(x => x.label === label);
        if(foundIndex > -1) {
            properties[foundIndex] = {
                label,
                value
            }
            setProperities([
                ...properties
            ]);
        }
    }

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

    const convertObjectToProperties = (object) => {
        return Object.keys(object).map(key => {
            return {
                label: key,
                value: object[key]
            };
        });
    }

    const renderJSONProperties = () => {
        return (<pre>{JSON.stringify(convertPropertiesToJSON(), null, 2)}</pre>);
    }

    return <>
        <Form
            name="test"
            wrapperCol={{ span: 30 }}
            autoComplete="off"
            onFinish={sendFormData}
        >
            <Row style={{ textAlign: 'left' }}>
                <Card>
                    <Row>
                        <Col>
                            <Form.Item label="Visible" name="state" >
                                <Switch checked={isVisible} onChange={(e) => handleVisible(e)} />
                                <br />
                                {visstate()}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Name" name="name" valuePropName='name'>
                                <Input placeholder="Name" value={currencyEdit?.name} onChange={(e) => onChangeForm(e.target.value, "name")} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Code" name="code" valuePropName='code'>
                                <Input placeholder="Enter a code" value={currencyEdit?.code} onChange={(e) => onChangeForm(e.target.value, "code")} />
                            </Form.Item>
                            <Form.Item label="Type" name="type" valuePropName='type'>
                                <Select
                                    allowClear
                                    value={currencyEdit?.type}
                                    onChange={(e) => onChangeForm(e, "type")}
                                >
                                    <Option value="coin" name="coin" >coin</Option>
                                    <Option value="fiat" name="fiat">fiat</Option>
                                </Select>
                            </Form.Item>
                            {
                                isNew && currencyEdit?.type === 'coin' ? (
                                    <Form.Item label="Parent Currency(optional)" name="parent_id">
                                        <Select
                                            allowClear
                                            value={currencyEdit?.parent_id}
                                            onChange={(e) => onChangeForm(e, "parent_id")}
                                        >
                                            <Option value="ADMC" name="ADMC" >ADMC</Option>
                                            <Option value="BNB" name="BNB">BNB</Option>
                                            <Option value="ETH" name="ETH">ETH</Option>
                                            <Option value="USDT" name="USDT">USDT</Option>
                                        </Select>
                                    </Form.Item>
                                ) : null
                            }

                            <Form.Item label="Subunits" name="subunits" valuePropName='subunits'>
                                <Input placeholder="0" value={currencyEdit?.subunits} onChange={(e) => onChangeForm(e.target.value, "subunits")} />
                            </Form.Item>
                            <Form.Item label="Precision" name="precision" valuePropName='precision'>
                                <Input placeholder="0" value={currencyEdit?.precision} onChange={(e) => onChangeForm(e.target.value, "precision")} />
                            </Form.Item>
                            <Form.Item label="Price" name="price" valuePropName='price'>
                                <Input placeholder="Enter price in USD" value={currencyEdit?.price} onChange={(e) => {
                                    console.log(e);
                                    onChangeForm(e.target.value, "price")
                                }} />
                            </Form.Item>
                            {
                                currencyEdit?.type === 'coin' ? (
                                    <Form.Item label="Blockchain Key" name="blockchainkey" valuePropName='blockchain_key'>
                                        <Select
                                            allowClear
                                            value={currencyEdit?.blockchain_key}
                                            onChange={(e) => onChangeForm(e, "blockchain_key")}
                                        >
                                            <Option value="eth-ropsten" name="eth-ropsten" >eth-ropsten</Option>
                                            <Option value="bsc-testnet" name="bsc-testnet">bsc-testnet</Option>
                                        </Select>
                                    </Form.Item>
                                ) : null
                            }

                            <Form.Item label="Position" name="position" valuePropName='position'>
                                <Input placeholder="0" value={currencyEdit?.position} onChange={(e) => onChangeForm(e.target.value, "position")} />
                            </Form.Item>
                            <Form.Item label="Icon URL" name="icon_url" valuePropName='icon_url'>
                                <Input placeholder="Enter icon URL" value={currencyEdit?.icon_url} onChange={(e) => onChangeForm(e.target.value, "icon_url")} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ marginLeft: 20 }}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Deposit" name="deposit_enabled" >
                                <Switch checked={enableDeposit} onChange={(e) => handleDeposit(e)} />
                                <br />
                                {depositstate()}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Withdrawal" name="withdrawal_enabled" >
                                <Switch checked={enableWithdraw} onChange={(e) => handleWithdraw(e)} />
                                <br />
                                {withdrawalstate()}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Min Deposit Amount">
                                <InputNumber style={{ width: 250 }} value={currencyEdit?.min_deposit_amount || 0} onChange={(e) => onChangeForm(e, "min_deposit_amount")} />
                            </Form.Item>
                            <Form.Item label="Withdraw Fee">
                                <InputNumber style={{ width: 295 }} value={currencyEdit?.withdraw_fee || 0} onChange={(e) => onChangeForm(e, "withdraw_fee")} />
                            </Form.Item>
                            <Form.Item label="Min Withdraw Amount">
                                <InputNumber style={{ width: 240 }} value={currencyEdit?.min_withdraw_amount || 0} onChange={(e) => onChangeForm(e, "min_withdraw_amount")} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Row>
            {
                currencyEdit?.type === 'coin' ? (
                    <Row>
                        <Card style={{ marginTop: 20, width: 650 }}>
                            <Row>
                                <h2>Properties</h2>
                                <Col span={19} style={{ paddingLeft: 350 }}>
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
                                <Col span={18} style={{ padding: 20 }}>
                                    {
                                        properties.map((p, index) => {
                                            return (
                                                <Form.Item key={`property_${index}`} label={p.label} name={p.label} valuePropName={p.label}>
                                                    <Input placeholder='Enter a contract address' value={p.value} onChange={(e) => {
                                                        onChangeProperties(e.target.value, p.label);
                                                    }}/>
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
                        <Card style={{ marginLeft: 20, marginTop: 20, width: 695, textAlign: 'left', padding: 20 }}>
                            {renderJSONProperties()}
                        </Card>
                    </Row>
                ) : null
            }
            <Form.Item >
                <Button style={{ marginTop: 50, marginLeft: 350 }} type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </>
};
export default AddC