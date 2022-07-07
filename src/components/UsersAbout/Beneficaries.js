import { Table,  Tag } from 'antd';
import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { getStateColor } from "../../utils/UtilService";

const Beneficiaries = (props) => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    useEffect(() => {
        if (props.memberData) {
            setBeneficiaries(props.memberData.beneficiaries);
        }
    }, [props.memberData]);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Beneficiary Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, row) => {
                return row.name;
            },
        },
        {
            title: 'Acount number',
            dataIndex: 'balance',
            key: 'balance',
            render: (name, row) => {
                return row.data.account_number;
            },
        },
        {
            title: 'Status',
            dataIndex: 'state',
            key: 'state',
            render: (state, row) => {
                const beneficiaries = props.memberData.beneficiaries.find(x => x.state === 'active' || x.state ==='');
                if (beneficiaries) {
                    let color = getStateColor(beneficiaries.state);
                    return <Tag color={color}>{beneficiaries.state.toUpperCase()}</Tag>;
                }
                return row.state; 
                
            },
        },
    ];
    return <>
        <Table dataSource={beneficiaries} columns={columns} />
    </>
};
export default Beneficiaries