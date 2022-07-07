import { Tabs } from "antd";
import React, { useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import OrderBook from "./OrderBook";
import Conficuration from "./Configuration";
const { TabPane } = Tabs;
const OrderInfo = () => {
    const params = useParams();
    const [activeTabKey, setActiveTabKey] = useState('info');
    let navigate = useNavigate();
    useEffect(() => {
        setActiveTabKey(params.tabname);
        return () => {
        }
    }, [params.tabname]);

    return (
        <div className="user-container">
            <Tabs defaultActiveKey="info"
                activeKey={activeTabKey}
                onTabClick={( key, e) => {
                    navigate(`/exchange/markets/${params.market}/${key}`);
                }}>
                <TabPane tab="Orderbook"  key="info">
                  <OrderBook/>
                </TabPane>
                <TabPane tab="Configuration" key="configuration">
                  <Conficuration/>
                </TabPane>
            </Tabs>
        </div>
    )
};
export default OrderInfo
