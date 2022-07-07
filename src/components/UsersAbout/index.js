import { Tabs } from "antd";
import React, { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import BarongApiService from "../../services/BarongApiService";
import PeatioApiService from "../../services/PeatioApiService";
import Kys from "./Kys";
import Maininfo from "./Maininfo";
import Balance from "./Balance";
import Active from "./Active";
import History from "./History";
import Beneficiaries from "./Beneficaries";
import Openorders from "./Openorders";

const { TabPane } = Tabs;
const UsersAbout = () => {
    const params = useParams();
    const [userData, setUserData] = useState(null);
    const [memberData, setMemberData] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState('main');

    const getUser = useCallback((uid) => {
        BarongApiService.getUser(uid).then((data) => {
            setUserData(data);
        });
    }, []);

    const getMember = useCallback((uid) => {
        PeatioApiService.getMember(uid).then((data) => {
            setMemberData(data);
        });
    }, []);

    

    let navigate = useNavigate();

    useEffect(() => {
        getUser(params.uid);
        getMember(params.uid);
    }, [getUser, getMember, params.uid]);

    useEffect(() => {
        setActiveTabKey(params.tabname);
        return () => {

        }
    }, [params.tabname]);

    return (
        <div className="user-container">
            <Tabs defaultActiveKey="main"
                activeKey={activeTabKey}
                onTabClick={(key, e) => {
                    navigate(`/users/usersdirectory/${params.uid}/usersAbout/${key}`);
                }}>
                <TabPane style={{fontWeight: 'bold'}} tab="Main info"  key="main">
                    <Maininfo userData={userData} memberData={memberData} getUser={getUser}/>
                </TabPane>
                <TabPane tab="KYC" key="kyc">
                   <Kys userData={userData} getUser={getUser}/>
                </TabPane>
                <TabPane tab="Open orders" key="open-orders">
                    <Openorders />
                </TabPane>
                <TabPane tab="Balance" key="balance">
                    <Balance memberData={memberData}/>
                </TabPane>
                <TabPane tab="History" key="history">
                    <History />
                </TabPane>
                <TabPane tab="Activities" key="activities">
                    <Active/>
                </TabPane>
                <TabPane tab="Beneficiaries" key="beneficiaries">
                    <Beneficiaries memberData={memberData} />
                </TabPane>
            </Tabs>
        </div>
    )
};
export default UsersAbout
