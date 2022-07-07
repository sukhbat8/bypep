import {Form, Card, Row, Col, Select, InputNumber, Button } from 'antd';
import React, { useState, useEffect, useCallback } from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import { useNavigate, useParams,  } from 'react-router-dom';

const { Option } = Select;
const Conficuration = () => {
  const params = useParams();
  const [config, setConfig] = useState(null);
  const [engines, setEngines] = useState([]);
  const [isNew, setIsNew] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  

  const navigate = useNavigate();


  const onNumberChange = (value, name) => {
    setConfig({
      ...config,
      [name]: value
    });
  };

  const getCurrencyEdit = useCallback((market) => {
    PeatioApiService.getMarket(market).then((res) => {
      setConfig(res);
    });
  }, []);

  const getCurrencies = useCallback(() => {
    PeatioApiService.getCurrencies().then((res) => {
      setCurrencies(res.data);
      console.log(res.data)
    });
  }, []);

  const getEngines = useCallback(() => {
    PeatioApiService.getEngines().then((res) => {
      console.log()
      setEngines(res.data);
    });
  }, []);

  useEffect(() => {
    if(params.market){
      setIsNew(false);
    }else{
      setIsNew(true);
    }
    getCurrencyEdit(params.market);
    getCurrencies();
    getEngines();

  }, [getCurrencyEdit, getCurrencies, getEngines, params.market]);

  const sendFormData = (e) => {
    if(isNew) {
        PeatioApiService.postMarketNew({
            ...config,
        }).then((res) => {
            navigate(-1);
        });
    } else {
        PeatioApiService.postMarketUpdate({
            ...config,
        }).then((res) => {
            navigate(-1);
        });
    }
  }



  const onNameChange = (value, name) => {
    setConfig({
      ...config,
      [name]: value
    })
  };
  return <>
    <Form
      name="basic"
      wrapperCol={{ span: 30 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={sendFormData}
    >
      <Row style={{ textAlign: 'left' }}>
        <Card style={{ width: 550, height: 200, padding: 20 }}>
          <h2>Engine</h2>
          <Form.Item style={{ paddingTop: 40 }} label="Name" name="engine_id" valuePropName='engine_id'>
            <Select
              placeholder={"Name"}
              value={config?.engine_id}
              onChange={(e) => onNameChange(e, "engine_id")}
              allowClear
            >
              {
                engines.map((x, index) => (
                  <Option key={`engine_${index}`} value={x.id}>{x.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
        </Card>
        <Card style={{ width: 550, height: 200, padding: 20, marginLeft: 20 }}>
          <h2>Base currency</h2>
          <Form.Item style={{ paddingTop: 40 }} label="Currency" name="base_unit" valuePropName='base_unit'>
            <Select
              placeholder={"Currency"}
              value={config?.base_unit}
              onChange={(e) => onNameChange(e, "base_unit")}
              allowClear
            >
              {
                currencies.map((x, index) => (
                  <Option key={`basecur_${index}`} value={x.code}>{x.code.toUpperCase()}</Option>
                ))
              }
            </Select>
          </Form.Item>
        </Card>
        <Card style={{ width: 550, height: 200, padding: 20, marginLeft: 20 }}>
          <h2>Quote currency</h2>
          <Form.Item style={{ paddingTop: 40 }} label="Currency" name="quote_unit"  valuePropName='quote_unit'>
            <Select
              placeholder={"Currency"}
              value={config?.quote_unit}
              onChange={(e) => onNameChange(e, "quote_unit")}
              allowClear
            >
              {
                currencies.map((x, index) => (
                  <Option key={`basecur_${index}`} value={x.code}>{x.code.toUpperCase()}</Option>
                ))
              }
            </Select>
          </Form.Item>
        </Card>
        <Card style={{ width: 1690, padding: 20, marginTop: 20 }}>
          <h2>Settings</h2>
          <Row >
            <Col style={{ paddingRight: 50 }}>
              <Form.Item label="Min Price" name="min_price"  valuePropName='min_price'>
                <InputNumber value={config?.min_price || 0} onChange={(e) => onNumberChange(e, "min_price")} />
              </Form.Item>
            </Col>
            <Col style={{ paddingRight: 50 }}>
              <Form.Item label="Max Price" name="max_price"  valuePropName='max_price'>
                <InputNumber value={config?.max_price || 0} onChange={(e) => onNumberChange(e, "max_price")} />
              </Form.Item>
            </Col>
            <Col style={{ paddingRight: 50 }}>
              <Form.Item label="Price precision" name="price_precision"  valuePropName='price_precision'>
                <InputNumber value={config?.price_precision || 0} onChange={(e) => onNumberChange(e, "price_precision")} />
              </Form.Item>
            </Col>
            <Col style={{ paddingRight: 50 }}>
              <Form.Item label="Amount precision" name="amount_precision"  valuePropName='amount_precision'>
                <InputNumber value={config?.amount_precision || 0} onChange={(e) => onNumberChange(e, "amount_precision")} />
              </Form.Item>
            </Col>
            <Col style={{ paddingRight: 50 }}>
              <Form.Item label="Min Amount" name="min_amount"  valuePropName='min_amount'>
                <InputNumber value={config?.min_amount || 0} onChange={(e) => onNumberChange(e, "min_amount")} />
              </Form.Item>
            </Col>
            <Col style={{ paddingRight: 50 }}>
              <Form.Item label="Position" name="position"  valuePropName='position'>
                <InputNumber value={config?.position || 0} onChange={(e) => onNumberChange(e, "position")} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Name" name="state" valuePropName='state'>
                <Select
                  placeholder={'state ...'}
                  onChange={(e) => onNameChange(e, "state")}
                  allowClear
                >
                  <Option value="enabled" name="enabled">enabled</Option>
                  <Option value="disabled" name="disabled" >disabled</Option>
                  <Option value="hidden" name="hidden" >hidden</Option>
                </Select>
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
export default Conficuration