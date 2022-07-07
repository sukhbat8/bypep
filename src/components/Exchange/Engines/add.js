import {Typography, Input, Form, Button, Card, Row, Col, Switch, Select} from 'antd';
import React, { useState, useEffect, useCallback} from "react";
import PeatioApiService from '../../../services/PeatioApiService';
import { UserOutlined, KeyOutlined, UnlockOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
const { Option } = Select;
const {Text} = Typography;
const Add = () => {
    const params = useParams();
    const [vis, setVis] = useState(null); 
    const getAdd = useCallback((body) => {
        PeatioApiService.getAbility(body).then((res) => {
            const visible = res.find(x => x.state === 'online')
            setVis(visible);
        });
    }, []);
    useEffect(() => {
        getAdd();
    }, [getAdd]);
    const onGenderChange = (value) => {
        console.log(value);
    };
    const visstate = () =>{
      if(vis){
        return <Text name="online" >Online</Text>
      }
      return <Text name="offline" >Offline</Text>
    }

    const handleVisible = (e) => {
      setVis(e);
    }
    const sendFormData = (e) => {
         PeatioApiService.postEnginesNew({
             driver: e.driver,
             id: params.id,
             key: e.key,
             name: e.name,
             secret: e.secret,
              state: vis ? 'online' : 'offline',
              uid: e.uid
         }).then((res) => {
             if (res === 200) {
                 console.log('dfg');
                 getAdd(params.id);
            }
       }); 
    }
    return <>
         <Form
            name="basic"
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={sendFormData}
          >
            <Row style={{textAlign: 'left'}}>
              <Card>
                <Row>
                  <Col span={12}>
                  <Form.Item label="Name" name="name">
                    <Input placeholder='' />
                  </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Visible" name="state" >
                      <Switch  checked={vis} onChange={(e) => handleVisible(e)}/>
                      <br/>
                      {visstate()}
                    </Form.Item>
                  </Col>
                  <Row>
                  <Col span={18}>
                    <Form.Item label="Price source" name="driver" rules={[{ required: true }]}>
                      <Select
                        placeholder="Select a option and change input text above"
                        onChange={onGenderChange()}
                        allowClear
                      >
                        <Option value="finex-spot" name="finex-spot">finex-spot</Option>
                        <Option value="opendax" name="opendax" >opendax</Option>
                        <Option value="peatio" name="peatio" >peatio</Option>
                        <Option value="binance" name="binance" >binance</Option>
                        <Option value="cryptocom" name="cryptocom" >cryptocom</Option>
                        <Option value="aggregated" name="aggregated">aggregated</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  </Row>
                </Row>
              </Card>
              <Card>
                  <Form.Item label="UID" name="uid">
                    <Input placeholder="UID" prefix={<UserOutlined />}/>
                  </Form.Item>
                  <Form.Item label="Key" name="key" >
                    <Input placeholder="Key" prefix={<KeyOutlined />}/>
                  </Form.Item>
                  <Form.Item label="Secret" name="secret">
                    <Input placeholder="Secret" prefix={<UnlockOutlined />}/>
                  </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit" >
                    Submit
                  </Button>
                </Form.Item>
              </Card>
            </Row>
        </Form>
    </>
};
export default Add