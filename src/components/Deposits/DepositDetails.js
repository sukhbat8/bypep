import {
  Col,
  Empty,
  Row,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import PeatioApiService from "../../services/PeatioApiService";
import { formatAmount, getStateColor } from "../../utils/UtilService";

const { Text } = Typography;

const DepositDetails = () => {
  const params = useParams();
  const [data, setData] = useState(null);

  const getDepositDetail = useCallback((tid) => {
    PeatioApiService.getDepositDetail(tid).then((data) => {
      setData(data[0]);
    });
  }, []);

  useEffect(() => {
    getDepositDetail(params.tid);
  }, [getDepositDetail, params.tid]);

  if (data) {
    let color = getStateColor(data.state);

    return (
      <div style={{ textAlign: "left" }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text>ID</Text>
            <div>
              <b>{data.id}</b>
            </div>
          </Col>
          <Col span={12}>
            <Text>State</Text>
            <div>
              <Tag color={color}>{data.state.toUpperCase()}</Tag>
            </div>
          </Col>

          <Col span={12}>
            <Text>UID</Text>
            <div>
              <b>{data.uid}</b>
            </div>
          </Col>
          <Col span={12}>
            <Text>Member email</Text>
            <div>
              <b>{data.email}</b>
            </div>
          </Col>
          <Col span={12}>
            <Text>Amount</Text>
            <div>
              <b>{formatAmount(data.amount)}</b>
            </div>
          </Col>
          {
            data.type === 'coin' ? (
              <Col span={12}>
                <Text>TxID</Text>
                <div>
                  <b style={{ wordWrap: "break-word" }}>{data.txid}</b>
                </div>
              </Col>
            ) : null
          }
          <Col span={12}>
            <Text>Currency</Text>
            <div>
              <b>{data.currency.toUpperCase()}</b>
            </div>
          </Col>
          {
            data.type === 'coin' ? (
              <Col span={12}>
                <Text>Address</Text>
                <div>
                  <b style={{ wordWrap: "break-word" }}>{data.address}</b>
                </div>
              </Col>
            ) : null
          }
          <Col span={12}>
            <Text>Created date</Text>
            <div>
              <b>{moment(data.created_at).format("YYYY-MM-DD HH:mm:ss")}</b>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  return <Empty />;
};

export default DepositDetails;
