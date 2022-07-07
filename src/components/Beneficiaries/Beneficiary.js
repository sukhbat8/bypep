import { Card, Col , Typography, Row} from 'antd';
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from 'react-router-dom';
import PeatioApiService from '../../services/PeatioApiService';

const Beneficiary = () => {
    const { Text } = Typography;
    const params = useParams();
    const [beneficiary, setBeneficiary] = useState(null);
    const getBeneficary = useCallback((id) => {
        PeatioApiService.getBeneficiary(id).then((res) => {
            console.log(res);
            setBeneficiary(res.data && res.data.length ? res.data[0] : null);
        });
    }, []);
    useEffect(() => {
        getBeneficary(params.id);
    }, [getBeneficary , params.id]);

    const bene = () => {
        if (beneficiary?.currency === 'mnt') {
            return (
                <Row style={{textAlign: 'left', margin: 10}}>
                    <Col span={12}>
                        <div>
                            <b><Text> ID:</Text></b>
                            <div>{beneficiary?.id}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> UID:</Text></b>
                            <div>{beneficiary?.uid}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> Currency:</Text></b>
                            <div>{beneficiary?.currency}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> State:</Text></b>
                            <div>{beneficiary?.state}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> Name</Text></b>
                            <div>{beneficiary?.name}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> Account number</Text></b>
                            <div>{beneficiary?.data?.account_number}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> Full name</Text></b>
                            <div>{beneficiary?.data.full_name}</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <b><Text> Bank name</Text></b>
                            <div>{beneficiary?.data?.bank_name}</div>
                        </div>
                    </Col>
                </Row>
            )
        }else if(beneficiary?.currency === 'admc'){
            return (
                <Row style={{textAlign: 'left'}}>
                        <Col span={12}>
                            <div>
                                <b><Text> ID:</Text></b>
                                <div>{beneficiary?.id}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <b><Text> UID:</Text></b>
                                <div>{beneficiary?.uid}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <b><Text> Currency:</Text></b>
                                <div>{beneficiary?.currency}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <b><Text> State:</Text></b>
                                <div>{beneficiary?.state}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <b><Text> Name</Text></b>
                                <div>{beneficiary?.name}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <b><Text> Description</Text></b>
                                <div>{beneficiary?.description}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <b><Text> Address</Text></b>
                                <div>{beneficiary?.data.address}</div>
                            </div>
                        </Col>
                </Row>
            )
        }
    }
    return <>
        <Card>
            <h2 style={{textAlign: 'left'}}>Beneficiary details</h2>
            {bene()}
        </Card>
    </>
};
export default Beneficiary