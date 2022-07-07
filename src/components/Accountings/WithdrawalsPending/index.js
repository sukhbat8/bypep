import { Tabs } from "antd";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import Coin from "./Coin";
import Fiat from "./Fiat";

const { TabPane } = Tabs;

const WithdrawalPending = () => {
    const params = useParams();
    const [activeTabKey, setActiveTabKey] = useState('coin');
    let navigate = useNavigate();

    useEffect(() => {
        setActiveTabKey(params.tabname);
        return () => {
        }
    }, [params.tabname]);

    return (
        <div className="user-container">
            <Tabs defaultActiveKey="coin"
                activeKey={activeTabKey}
                onTabClick={(key, e) => {
                    navigate(`/accountings/withdrawals-pending/${key}`);
                }}>
                <TabPane  tab="Coin"  key="coin">
                    <Coin />
                </TabPane>
                <TabPane tab="Fiat" key="fiat">
                    <Fiat/>
                </TabPane>
            </Tabs>
        </div>
    )
};
export default WithdrawalPending