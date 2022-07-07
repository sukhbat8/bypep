import { Tabs } from "antd";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import Assets from "./Assets";
import Expenses from "./Expenses";
import Liabilities from "./Liabilities";
import Revenue from "./Revenue";
const { TabPane } = Tabs;

const Operations = () => {
    const params = useParams();
    const [activeTabKey, setActiveTabKey] = useState('assets');
    let navigate = useNavigate();

    useEffect(() => {
        setActiveTabKey(params.tabname);
        return () => {
        }
    }, [params.tabname]);

    return (
        <div className="user-container">
            <Tabs defaultActiveKey="assets"
                activeKey={activeTabKey}
                onTabClick={(key, e) => {
                    navigate(`/accountings/operations/${key}`);
                }}>
                <TabPane  tab="Assets"  key="assets">
                    <Assets/>
                </TabPane>
                <TabPane tab="Liabilities" key="liabilities">
                    <Liabilities/>
                </TabPane>
                <TabPane tab="Revenue" key="revenue">
                    <Revenue/>
                </TabPane>
                <TabPane tab="Expenses" key="expenses">
                    <Expenses/>
                </TabPane>
            </Tabs>
        </div>
    )
};
export default Operations