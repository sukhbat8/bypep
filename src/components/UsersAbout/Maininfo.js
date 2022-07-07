import { Col, Row, Typography, Switch, Select, Card, Button } from 'antd';
import React, { useState, useEffect } from "react";
import { useParams , useNavigate} from 'react-router-dom';
const { Text } = Typography;
const { Option } = Select

const Maininfo = (props) => {
    const [valueData, setValueData] = useState(false);
    const [phoneData, setPhoneData] = useState(false);
    const [otpData, setOtpData] = useState(false);
    const [identyData, setIdentyData] = useState(false);
    const [verify, setVerify] = useState(null);
    const params = useParams();
    const [member, setMember] = useState([]);
    let navigate = useNavigate();
    useEffect(() => {
        if (props.userData) {
            const emailVerifiedData = props.userData.labels.find(it => it.key === 'email' && it.value === 'verified')
            setValueData(!!emailVerifiedData);
            const phoneVerifiedData = props.userData.labels.find(it => it.key === 'phone' && it.value === 'verified')
            setPhoneData(!!phoneVerifiedData);
            const OtpoData = props.userData.otp;
            setOtpData(!!OtpoData);
            const identyData = props.userData.labels.find(it => it.key === 'jk' && it.value === 'true')
            setIdentyData(!!identyData);
            const stateData = props.userData.profiles.find(x => x.state === 'submitted')
            setVerify(stateData);
            const docLabel = props.userData.labels.find(x => x.key === 'document');
            if (docLabel) {
                if (props.userData.documents && props.userData.documents.length > 0) {
                    const documentsData = props.userData.documents.map(x => {
                        return {
                            ...x,
                            verifyStatus: docLabel?.value || ""
                        }
                    });
                } 
            }
        }
        if(props.memberData){
            setMember(props.memberData);
        }
        
    }, [props.userData, params.uid]);
    console.log();

    const onChange = (value) => {
        console.log(value);
      };
    const ver = () =>{
        if (verify) {
            return(<Button onClick={(e)=>{
                navigate(`/users/usersdirectory/${params.uid}/usersAbout/kyc`);
            }}>Verify</Button>)
        }
    }
    const profile = props.userData?.profiles && props.userData?.profiles.length ? props.userData?.profiles[0] : null;
    const phone = props.userData?.phones && props.userData?.phones.length ? props.userData?.phones[0] : null;

    return <div>
        <Row style={{ textAlign: "left" }} gutter={[16, 16]}>
            <Col span={12}>
                <Card>
                    <div style={{fontSize: 28}}>
                        {props.userData?.email}
                        <br/>
                        {ver()}
                    </div>
                    <div style={{marginTop: 20}}>
                        <Text> UID: </Text>
                        <div>{props.userData?.uid}</div> 
                    </div>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={12}>
                            <Text>Created:</Text>
                            <div>
                                {props.userData?.created_at}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10 }} span={12}>
                            <Text>Updated:</Text>
                            <div>
                                {props.userData?.updated_at}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10 }} span={12}>
                            <Text>First name:</Text>
                            <div>
                                {profile?.first_name}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10}} span={12}>
                            <Text>Last name:</Text>
                            <div>
                                {profile?.last_name}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10}} span={12}>
                            <Text>Phone number:</Text>
                            <div>
                                +{phone?.number}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10 }} span={12}>
                            <Text>Day of Birth:</Text>
                            <div>
                                {profile?.dob}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10}} span={12}>
                            <Text>Country:</Text>
                            <div>
                                {profile?.country}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10 }} span={12}>
                            <Text>City:</Text>
                            <div>
                                {profile?.city}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10}} span={12}>
                            <Text>Address:</Text>
                            <div>
                                {profile?.address}
                            </div>
                        </Col>
                        <Col style={{ marginTop: 10 }} span={12}>
                            <Text>Postcode:</Text>
                            <div>
                                {profile?.postcode}
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span={12} style={{ margin: 0 }}>
                <Card style={{ marginBottom: 16 }}>
                    <Row>
                        <Col span={24}>
                            <Text>KYC verification</Text>
                            <Col className='col4' span={12} style={{marginTop: 15, marginBottom: 15}}>
                                <div>
                                    <Text>Level: </Text><b>{props.userData?.level}</b>
                                </div>
                            </Col>
                            <Row>
                                <Col className='col4' span={12}>
                                    <div>
                                        <Text>Email verified:</Text>
                                        <br />
                                        <Text>Completed at: </Text>{props.userData?.labels[0]?.updated_at}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Switch checked={valueData} disabled={true} />
                                </Col>
                                <Col className='col4' span={12}>
                                    <div>
                                        <Text>Phone verified:</Text>
                                        <br />
                                        <Text>Completed at: </Text>{props.userData?.labels[0]?.updated_at}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Switch checked={phoneData} disabled={true} />
                                </Col>
                                <Col className='col4' span={12}>
                                    <div>
                                        <Text >Identity verified:</Text>
                                        <br />
                                        <Text>Completed at: </Text>{props.userData?.labels[0]?.updated_at}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Switch checked={identyData} disabled={true} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col span={24}>
                            <Text>Settings</Text>
                            <Row style={{margin: 10}}>
                                <Col span={12}>
                                    <Text>Status</Text>
                                    <br />
                                    <Select
                                        placeholder={props.userData?.state}
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Option value="Pending" name="Pending">Pending</Option>
                                        <Option value="Active" name="Active">Active</Option>
                                        <Option value="Banned" name="Banned">Banned</Option>
                                    </Select>
                                </Col>
                                <Col span={12}>
                                    <Text>Fee Group</Text>
                                    <br />
                                    <Select 
                                        placeholder="Fee group"
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Option value="lhagvaa" name="lhagvaa">lhagvaa</Option>
                                        <Option value="test1"name="test1">test1</Option>
                                    </Select>
                                </Col>
                                <Row>
                                        <div style={{paddingTop: 10}}>
                                            <Text>Identity verified:</Text>
                                            <br />
                                            <Text>Completed at: </Text>{props.userData?.labels[0]?.updated_at}
                                        </div>
                                        <Switch checked={otpData} disabled={false} />
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>;
};
export default Maininfo