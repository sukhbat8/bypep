import {
  Button,
  Col,
  Divider,
  Empty,
  message,
  Row,
  Space,
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

const WithdrawDetails = () => {
  const params = useParams();
  const [data, setData] = useState(null);

  const getWithdrawDetail = useCallback((id) => {
    PeatioApiService.getWithdrawDetail(id).then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    getWithdrawDetail(params.id);
  }, [getWithdrawDetail, params.id]);

  const actionHandle = (action) => {
    console.log(action);
    PeatioApiService.setWithdrawAction({
      id: data.id,
      action,
    }).then((res) => {
      message.success("Success");
      getWithdrawDetail(data.id);
    });
  };

  const renderActionButtons = () => {
    if (data.state === "accepted") {
      return (
        <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
          <Space>
            <Button danger onClick={() => actionHandle("reject")}>
              Reject
            </Button>
            <Button type="primary" onClick={() => actionHandle("process")}>
              Process
            </Button>
          </Space>
        </Row>
      );
    }
    if (data.state === "processing") {
      return (
        <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
          <Space>
            <Button danger onClick={() => actionHandle("fail")}>
              Fail
            </Button>
            <Button type="primary" onClick={() => actionHandle("dispatch")}>
              Confirm
            </Button>
          </Space>
        </Row>
      );
    }
    if (data.state === "skipped") {
      return (
        <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
          <Space>
            <Button danger onClick={() => actionHandle("fail")}>
              Fail
            </Button>
            <Button type="primary" onClick={() => actionHandle("process")}>
              Process
            </Button>
          </Space>
        </Row>
      );
    }
    if (data.state === "processing") {
      return (
        <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
          <Space>
            <Button danger onClick={() => actionHandle("fail")}>
              Fail
            </Button>
            <Button type="primary" onClick={() => actionHandle("dispatch")}>
              Confirm
            </Button>
          </Space>
        </Row>
      );
    }
    if (data.state === "confirming") {
      return (
        <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
          <Space>
            <Button danger onClick={() => actionHandle("fail")}>
              Fail
            </Button>
            <Button type="primary" onClick={() => actionHandle("wait")}>
              Continue
            </Button>
          </Space>
        </Row>
      );
    }
    if (data.state === "waiting") {
      return (
        <Row style={{ paddingTop: 16, justifyContent: "flex-end" }}>
          <Space>
            <Button danger onClick={() => actionHandle("fail")}>
              Fail
            </Button>
          </Space>
        </Row>
      );
    }
    return null;
  };

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
            <Text>Created date</Text>
            <div>
              <b>{moment(data.created_at).format("YYYY-MM-DD HH:mm:ss")}</b>
            </div>
          </Col>

          <Col span={12}>
            <Text>Name</Text>
            <div>
              <b>{data.beneficiary?.name}</b>
            </div>
          </Col>
          <Col span={12}>
            <Text>Recipient Address</Text>
            <div>
              <b style={{ wordWrap: "break-word" }}>{data.rid}</b>
            </div>
          </Col>
        </Row>
        <Divider />
        {data.type === "fiat" ? (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Text>Fullname</Text>
              <div>
                <b>{data.beneficiary?.data?.full_name}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Bank name</Text>
              <div>
                <b>{data.beneficiary?.data?.bank_name}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Account Number</Text>
              <div>
                <b>{data.beneficiary?.data?.account_number}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Amount</Text>
              <div>
                <b>{formatAmount(data.amount)}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Currency</Text>
              <div>
                <b>{data.currency.toUpperCase()}</b>
              </div>
            </Col>

            <Col span={12}>
              <Text>Fee</Text>
              <div>
                <b>{formatAmount(data.amount * 0.01)}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Fee after</Text>
              <div>
                <b>{formatAmount(data.amount * 0.99)}</b>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text>Blockchain Transaction ID</Text>
              <div>
                <b style={{ wordWrap: "break-word" }}>{data.blockchain_txid}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Transfer ID</Text>
              <div>
                <b>{data.tid}</b>
              </div>
            </Col>

            <Col span={12}>
              <Text>Amount</Text>
              <div>
                <b>{formatAmount(data.amount)}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Currency</Text>
              <div>
                <b>{data.currency.toUpperCase()}</b>
              </div>
            </Col>

            <Col span={12}>
              <Text>Fee</Text>
              <div>
                <b>{formatAmount(data.fee)}</b>
              </div>
            </Col>
            <Col span={12}>
              <Text>Fee after</Text>
              <div>
                <b>{formatAmount(data.amount - data.fee)}</b>
              </div>
            </Col>
          </Row>
        )}
        {renderActionButtons()}
      </div>
    );
  }
  return <Empty />;
};

export default WithdrawDetails;
