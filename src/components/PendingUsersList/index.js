import { Tabs } from "antd";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import Profile from "./Profile";
import Documents from "./Documents";

const { TabPane } = Tabs;

const PendingUserList = () => {
    const params = useParams();
    const [activeTabKey, setActiveTabKey] = useState('document');
    let navigate = useNavigate();

    useEffect(() => {
        setActiveTabKey(params.tabname);
        return () => {
        }
    }, [params.tabname]);

    return (
        <div className="user-container">
            <Tabs defaultActiveKey="document"
                activeKey={activeTabKey}
                onTabClick={(key, e) => {
                    navigate(`/users/pending/${key}`);
                }}>
                <TabPane style={{fontWeight: 'bold'}} tab="Documents"  key="document">
                  <Documents />
                </TabPane>
                <TabPane tab="Profile" key="profile">
                  <Profile/>
                </TabPane>
            </Tabs>
        </div>
    )
};
export default PendingUserList