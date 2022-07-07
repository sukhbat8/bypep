import { Table,  Tag } from 'antd';
import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { getStateColor } from "../../utils/UtilService";

const Balance = (props) => {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        if (props.memberData) {
            setAccounts(props.memberData.accounts);
        }
    }, [props.memberData]);
    const columns = [
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            render: (wallet, row) => {
                const depositAddress = props.memberData.deposit_addresses.find(x => x.currencies.includes(row.currency));
                if (depositAddress) {
                    return depositAddress.address
                }
                return null;
            },
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (state, row) => {
                const depositAddress = props.memberData.deposit_addresses.find(x => x.currencies.includes(row.currency));
                if (depositAddress) {
                    let color = getStateColor(depositAddress.state);
                    return <Tag color={color}>{depositAddress.state.toUpperCase()}</Tag>;
                }
                return null;
            },
        },
        {
            title: 'Available balance',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: 'Locked balance',
            dataIndex: 'locked',
            key: 'locked',
        },
        {
            title: 'Total balance',
            dataIndex: 'balance',
            key: 'balance',
        },
    ];
    return <>
        <Table dataSource={accounts} columns={columns} />
    </>
};
export default Balance