import { Tabs } from "antd";
import React, {useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import OpenOrders from "./OpenOrders";
import OrdersHistory from "./OrdersHistory";
const { TabPane } = Tabs;
const OrderList = () => {
    const params = useParams();
    const [activeTabKey, setActiveTabKey] = useState('open');
    
    let navigate = useNavigate();
    useEffect(() => {
        setActiveTabKey(params.tabname);
        return () => {
        }
    }, [params.tabname]);
    return (
        <div className="user-container">
            <Tabs defaultActiveKey="open"
                activeKey={activeTabKey}
                onTabClick={(key, e) => {
                    navigate(`/exchange/orders/${key}`);
                }}>
                <TabPane tab="Open Orders"  key="open">
                  <OpenOrders />
                </TabPane>
                <TabPane tab="Orders history" key="history">
                  <OrdersHistory/>
                </TabPane>
            </Tabs>
        </div>
    )
};
export default OrderList
