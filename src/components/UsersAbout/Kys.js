import { Table, Button, Modal, Card, Typography, Col, Row, DatePicker, Tag } from 'antd';
import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import moment from "moment";
import { AreaChartOutlined } from '@ant-design/icons';
import BarongApiService from "../../services/BarongApiService";
import { useParams } from 'react-router-dom';
import { getStateColor } from "../../utils/UtilService";
const { Text } = Typography;
const dateFormat = 'YYYY/MM/DD';


const Kyc = (props) => {
    const [userData, setUserData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [verify, setVerify] = useState(null);
    const [profileVerify, setProfileVerify] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [documentData1, setDocumentData1] = useState(null);
    const [documentData2, setDocumentData2] = useState(null);
    const params = useParams();
    // const host = window.location.host;
    const host = 'https://st.bydep.com';
    useEffect(() => {
        if (props.userData) {
            const docLabel = props.userData.labels.find(x => x.key === 'document');
            if (docLabel) {
                if (props.userData.documents && props.userData.documents.length > 0) {
                    const documentsData = props.userData.documents.map(x => {
                        return {
                            ...x,
                            verifyStatus: docLabel?.value || ""
                        }
                    });
                    setUserData(documentsData);
                }
                setVerify(docLabel.value === 'verified' || docLabel.value === 'reject');
                setProfileVerify(docLabel.value === 'pending');
            }
            const stateData = props.userData.profiles.find(x => x.state === "submitted");
            setDocumentData(stateData);
            const stateData1 = props.userData.profiles.find(x => x.state === "verified");
            setDocumentData1(stateData1);
            const stateData2 = props.userData.profiles.find(x => x.state === "rejected");
            setDocumentData2(stateData2);
            console.log("ssssssssssssssssssss");
        }
    }, [props.userData]);

    const columns = [
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
            title: 'Doc type',
            dataIndex: 'doc_type',
            key: 'doc_type',
        },
        {
            title: 'Doc number',
            dataIndex: 'doc_number',
            key: 'doc_number',
        },
        {
            title: 'Expire date',
            dataIndex: 'doc_expire',
            key: 'doc_expire',
        },
        {
            title: 'Status',
            dataIndex: 'verifyStatus',
            key: 'verifyStatus',
            render: (state) => {
                let color = getStateColor(state);
                return <Tag color={color}>{state.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Attachments',
            dataIndex: '',
            key: 'upload',
            render: (record) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onClick={() => {
                            setSelectedRow(record);
                            setShowImage(true);
                        }} icon={<AreaChartOutlined />} size="middle" />
                    </div>
                )
            }
        },
    ];
    const prof = () => {
        if (profileVerify) {
            return (
                <Button disabled={verify} type="primary" onClick={() => {
                    BarongApiService.postUserUpdate({
                        uid: props.userData?.uid,
                        value: 'verified',
                        key: 'document',
                        scope: 'private'
                    }).then((data) => {
                        console.log(params);
                        if (data === 200) {
                            console.log('dfg');
                            props.getUser(params.uid);
                        }
                    });
                }} style={{ marginLeft: 600 }}>Verify</Button>
            )
        }
        return null;
    }
    const reject = () => {
        if (profileVerify) {
            return (<Button disabled={verify} type="primary" onClick={() => {
                BarongApiService.postUserUpdate({
                    uid: props.userData?.uid,
                    value: 'rejected',
                    key: 'document',
                    scope: 'private'
                }).then((data) => {
                    console.log(params);
                    if (data === 200)
                        props.getUser(params.uid);
                });
            }} style={{ marginLeft: 10 }}  >Reject</Button>)
        }
    }
    const verdoc = () => {
        if (documentData) {
            return (
                <Button disabled={verify} type="primary" onClick={() => {
                    BarongApiService.putProfileUpdate({
                        uid: props.userData?.uid,
                        state: 'verified',
                    }).then((data) => {
                        props.getUser(params.uid);
                    });
                }} style={{ marginLeft: 500 }}>Verify</Button>
            )
        }
        return null;
    }
    const rejdoc = () => {
        if (documentData) {
            return (<Button disabled={verify} type="primary" onClick={() => {
                BarongApiService.putProfileUpdate({
                    uid: props.userData?.uid,
                    state: 'rejected',
                }).then((data) => {
                    props.getUser(params.uid);
                });
            }}  >Reject</Button>)
        }
        return null;
    }
    const profile = props.userData?.profiles && props.userData?.profiles.length ? props.userData?.profiles[0] : null;
    const phone = props.userData?.phones && props.userData?.phones.length ? props.userData?.phones[0] : null;
    const profile1 = props.userData?.profiles && props.userData?.profiles.length ? props.userData?.profiles.find(x => x.state === "submitted") : null;
    const profilerej = props.userData?.profiles && props.userData?.profiles.length ? props.userData?.profiles.find(x => x.state === "rejected") : null;
    const profilever = props.userData?.profiles && props.userData?.profiles.length ? props.userData?.profiles.find(x => x.state === "verified") : null;

    const verifyPro = () => {
        if (documentData) {
            return (
                <Card style={{ marginTop: 10 }}>
                    <div>
                        {verdoc()} {rejdoc()}
                        <Row style={{ marginTop: 16, textAlign: 'left' }}>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Updated by user</Text> <div><b>{moment(profile1?.created_at).format("YYYY-MM-DD HH:mm:ss")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>History version</Text>
                                <br />
                                <DatePicker created_at={moment(profile1?.created_at)} format={dateFormat} />
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>UID</Text> <div><b>{props.userData?.uid}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Email</Text>
                                <br />
                                <div><b>{props.userData?.email}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Created</Text>
                                <div><b>{moment(profile1?.created_at).format("YYYY-MM-DD HH:mm")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Updated</Text>
                                <br />
                                <div><b>{moment(profile1?.updated_at).format("YYYY-MM-DD HH:mm")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>First name</Text>
                                <div><b>{profile1?.first_name}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Last name</Text>
                                <br />
                                <div><b>{profile1?.last_name}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Phone number</Text>
                                <div><b>{phone?.number}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Day of Birth</Text>
                                <br />
                                <div><b>{profile1?.dob}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Country</Text>
                                <div><b>{profile1?.country}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>City</Text>
                                <br />
                                <div><b>{profile1?.city}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Address</Text>
                                <div><b>{profile1?.address}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Postcode</Text>
                                <br />
                                <div><b>{profile1?.postcode}</b></div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            )
        }
    }
    const profileS = () => {
        if (documentData1) {
            return (
                <Card style={{ marginTop: 10 }}>
                    <div>
                        <Row style={{ marginTop: 16, textAlign: 'left' }}>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Verified version</Text> <div><b>{moment(profilever?.created_at).format("YYYY-MM-DD HH:mm:ss")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>History version</Text>
                                <br />
                                <DatePicker created_at={moment(profilever?.created_at)} format={dateFormat} />
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>UID</Text> <div><b>{props.userData?.uid}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Email</Text>
                                <br />
                                <div><b>{props.userData?.email}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Created</Text>
                                <div><b>{moment(profilever?.created_at).format("YYYY-MM-DD HH:mm")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Updated</Text>
                                <br />
                                <div><b>{moment(profilever?.updated_at).format("YYYY-MM-DD HH:mm")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>First name</Text>
                                <div><b>{profilever?.first_name}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Last name</Text>
                                <br />
                                <div><b>{profilever?.last_name}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Phone number</Text>
                                <div><b>{phone?.number}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Day of Birth</Text>
                                <br />
                                <div><b>{profilever?.dob}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Country</Text>
                                <div><b>{profilever?.country}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>City</Text>
                                <br />
                                <div><b>{profilever?.city}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Address</Text>
                                <div><b>{profilever?.address}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Postcode</Text>
                                <br />
                                <div><b>{profilever?.postcode}</b></div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            )
        }
        else if (documentData2) {
            return (
                <Card style={{ marginTop: 10 }}>
                    <div>
                        <Row style={{ marginTop: 16, textAlign: 'left' }}>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Rejected version</Text> <div><b>{moment(profilerej?.created_at).format("YYYY-MM-DD HH:mm:ss")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>History version</Text>
                                <br />
                                <DatePicker created_at={moment(profilerej?.created_at)} format={dateFormat} />
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>UID</Text> <div><b>{props.userData?.uid}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Email</Text>
                                <br />
                                <div><b>{props.userData?.email}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Created</Text>
                                <div><b>{moment(profilerej.created_at).format("YYYY-MM-DD HH:mm")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Updated</Text>
                                <br />
                                <div><b>{moment(profilerej?.updated_at).format("YYYY-MM-DD HH:mm")}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>First name</Text>
                                <div><b>{profilerej?.first_name}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Last name</Text>
                                <br />
                                <div><b>{profilerej?.last_name}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Phone number</Text>
                                <div><b>{phone?.number}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Day of Birth</Text>
                                <br />
                                <div><b>{profilerej?.dob}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Country</Text>
                                <div><b>{profilerej?.country}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>City</Text>
                                <br />
                                <div><b>{profilerej?.city}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={6}>
                                <Text>Address</Text>
                                <div><b>{profilerej?.address}</b></div>
                            </Col>
                            <Col style={{ fontSize: 14 }} span={18}>
                                <Text>Postcode</Text>
                                <br />
                                <div><b>{profilerej?.postcode}</b></div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            )
        }
        return null;
    }
    return <>
        <Card>
            <div>
                {prof()} {reject()}
                <h2 style={{ textAlign: 'left' }}>Documents</h2>
            </div>
            <Table dataSource={userData} columns={columns} />
            <Modal
                title="Document"
                width={500}
                visible={showImage}
                footer={null}
                onCancel={() => setShowImage(false)}
            >
                <img alt="hello" src={`${host}${selectedRow?.upload?.url}`} style={{ objectFit: "contain", width: "100%" }} />
            </Modal>
        </Card>
        <h2 style={{ textAlign: 'left', paddingTop: 20, marginLeft: 20 }}>Profiles</h2>
        <Row style={{ textAlign: "left" }} gutter={[16, 16]}>

            <Col span={12}>
                {profileS()}
            </Col>
            <Col span={12}>
                {verifyPro()}

            </Col>
        </Row>
    </>

};
export default Kyc