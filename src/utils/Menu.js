import UsersList from "../components/UsersList";
import {
  UserOutlined,
  BellFilled,UserSwitchOutlined,ProfileOutlined,BarChartOutlined,BoxPlotFilled,DollarCircleOutlined,FundOutlined,DatabaseOutlined,BuildFilled,UsergroupAddOutlined,ProfileFilled,DownSquareOutlined,
  UpSquareOutlined,CreditCardOutlined,AlignCenterOutlined,ShrinkOutlined,SettingFilled,BoldOutlined,WalletOutlined,ScheduleOutlined, SwitcherOutlined,
  SketchOutlined,
  SketchCircleFilled
} from "@ant-design/icons";
import Deposits from "../components/Deposits";
import Withdraws from "../components/Withdraws";
import UsersAbout from "../components/UsersAbout";
import WithdrawDetails from "../components/Withdraws/WithdrawDetails";
import DepositDetails from "../components/Deposits/DepositDetails";
import InternalTransfer from "../components/InternalTransfer/InternalTransfer";
import PendingUserList from "../components/PendingUsersList";
import Beneficiaries from "../components/Beneficiaries";
import Beneficiary from "../components/Beneficiaries/Beneficiary";
import Engines from "../components/Exchange/Engines/index";
import Edit from "../components/Exchange/Engines/edit";
import Add from "../components/Exchange/Engines/add";
import AddC from "../components/Exchange/Currencies/add";
import Currencies from "../components/Exchange/Currencies/index";
import Markets from "../components/Exchange/Markets/index";
import OrderList from "../components/Exchange/Orders/index";
import OrderInfo from "../components/Exchange/Markets/info";
import Conficuration from "../components/Exchange/Markets/Configuration";
import Blockchain from "../components/Settings/Blockchains";
import BlockchainsDetails from "../components/Settings/Blockchains/BlockchainsDetails";
import Wallet from "../components/Settings/Wallets";
import WalletDetails from "../components/Settings/Wallets/WalletDetail";
import FeesSchedule from "../components/Settings/FeesSchedule";
import WithrawalLimits from "../components/Settings/WithrawalLimits";
import WithdrawalPending from "../components/Accountings/WithdrawalsPending";
import Details from "../components/Accountings/WithdrawalsPending/Details";
import Operations from "../components/Accountings/Operations";
const MENU_DATA = [
  {
    id: 1,
    name: "Users",
    isSub: true,
    showSideMenu: true,
    icon: <UserOutlined />,
    sub:[
      {
        id: 2,
        name: "Users directory",
        path:"/users/usersdirectory",
        showSideMenu: true,
        icon: <UserSwitchOutlined />,
        component: <UsersList />,
      },
      {
        id: 37,
        path: "/users/usersdirectory/:uid/usersAbout/:tabname",
        showSideMenu: false,
        component: <UsersAbout />,
      },
      {
        id: 3,
        name: "Pending applications",
        path:"/users/pending",
        showSideMenu: true,
        icon: <BellFilled />,
        component: <PendingUserList />,
      },
      {
        id: 38,
        name: "Pending applications",
        path:"/users/pending/:tabname",
        showSideMenu: false,
        component: <PendingUserList />,
      },
      {
        id: 4,
        name: "Beneficiaries",
        path:"/users/beneficiaries",
        showSideMenu: true,
        icon: <ProfileOutlined />,
        component: <Beneficiaries />,
      },
      {
        id: 39,
        path: "/users/beneficiaries/:id/details",
        showSideMenu: false,
        component: <Beneficiary />,
      },
    ]
  },
  {
    id: 5,
    name: "Exchange",
    isSub: true,
    showSideMenu: true,
    icon: <BarChartOutlined />,
    sub:[
      {
        id: 6,
        name: "Engines",
        path:"/exchange/engines",
        showSideMenu: true,
        icon: <BoxPlotFilled />,
        component: <Engines />,
      },
      {
        id: 40,
        path: "/exchange/engines/:id/edit",
        showSideMenu: false,
        component: <Edit />,
      },
      {
        id: 44,
        path: "/exchange/engines/add",
        showSideMenu: false,
        component: <Add />,
      },
      {
        id: 7,
        name: "Currencies",
        path:"/exchange/currencies",
        showSideMenu: true,
        icon: <DollarCircleOutlined />,
        component: <Currencies />,
      },
      {
        id: 43,
        path: "/exchange/currencies/:code/edit-currency",
        showSideMenu: false,
        component: <AddC />,
      },
      {
        id: 45,
        path: "/exchange/currencies/add",
        showSideMenu: false,
        component: <AddC />,
      },
      {
        id: 8,
        name: "Markets",
        path:"/exchange/markets",
        showSideMenu: true,
        icon: <FundOutlined />,
        component: <Markets />,
      },
      {
        id: 42,
        name: "Orders",
        path:"/exchange/markets/:market/:tabname",
        showSideMenu: false,
        component: <OrderInfo />,
      },
      {
        id: 46,
        name: "Market",
        path:"/exchange/markets/add",
        showSideMenu: false,
        component: <Conficuration />,
      },
      {
        id: 9,
        name: "Orders",
        path:"/exchange/orders",
        showSideMenu: true,
        icon: <DatabaseOutlined />,
        component: <OrderList />,
      },
      {
        id: 41,
        name: "Orders",
        path:"/exchange/orders/:tabname",
        showSideMenu: false,
        component: <OrderList />,
      },
      {
        id: 10,
        name: "Trades",
        path:"/accountings/trades",
        showSideMenu: true,
        icon: <BuildFilled />,
        component: <Deposits />,
      },
      {
        id: 11,
        name: "Internal transfers",
        path:"/exchange/internal-transfers",
        showSideMenu: true,
        icon: <UsergroupAddOutlined />,
        component: <InternalTransfer />,
      },
    ]
  },
  {
    id: 12,
    name: "Accountings",
    isSub: true,
    showSideMenu: true,
    icon: <ProfileFilled />,
    sub:[
      {
        id: 13,
        name: "Deposits",
        path:"/accountings/deposits",
        showSideMenu: true,
        icon: <DownSquareOutlined />,
        component: <Deposits />,
      },
      {
        id: 14,
        name: "Withdrawals",
        path:"/accountings/withdrawals",
        showSideMenu: true,
        icon: <UpSquareOutlined />,
        component: <Withdraws />,
      },
      {
        id: 15,
        name: "withdrawals-pending",
        path:"/accountings/withdrawals-pending",
        showSideMenu: true,
        icon: <CreditCardOutlined />,
        component: <WithdrawalPending />,
      },
      {
        id: 51,
        name: "withdrawals-pending",
        path:"/accountings/withdrawals-pending/:tabname",
        showSideMenu: false,
        component: <WithdrawalPending />,
      },
      {
        id: 52,
        name: "withdrawals-pending",
        path:"/accountings/withdrawals-pending/:id/details",
        showSideMenu: false,
        component: <Details />,
      },
      {
        id: 16,
        name: "Adjustments",
        path:"/accountings/adjustments",
        showSideMenu: true,
        icon: <AlignCenterOutlined />,
        component: <Deposits />,
      },
      {
        id: 17,
        name: "Operations",
        path:"/accountings/operations",
        showSideMenu: true,
        icon: <ShrinkOutlined />,
        component: <Operations />,
      },
      {
        id: 51,
        name: "Operations",
        path:"/accountings/operations/:tabname",
        showSideMenu: false,
        component: <Operations />,
      },
      {
        id: 36,
        path: "/accountings/withdrawals/:tid/details",
        showSideMenu: false,
        component: <WithdrawDetails />,
      },
      {
        id: 37,
        path: "/accountings/deposits/:tid/details",
        showSideMenu: false,
        component: <DepositDetails />,
      },
    ]
  },
  {
    id: 18,
    name: "Settings",
    isSub: true,
    showSideMenu: true,
    icon: <SettingFilled />,
    sub:[
      {
        id: 19,
        name: "Blockchains",
        path:"/settings/blockchains",
        showSideMenu: true,
        icon: <BoldOutlined />,
        component: <Blockchain />,
      },
      {
        id: 47,
        path: "/settings/blockchains/:id/edit",
        showSideMenu: false,
        component: <BlockchainsDetails />,
      },
      {
        id: 48,
        path: "/settings/blockchains/add",
        showSideMenu: false,
        component: <BlockchainsDetails />,
      },
      {
        id: 20,
        name: "Wallets",
        path:"/Settings/Wallets",
        showSideMenu: true,
        icon: <WalletOutlined />,
        component: <Wallet />,
      },
      {
        id: 49,
        path: "/settings/wallets/:id/edit",
        showSideMenu: false,
        component: <WalletDetails />,
      },
      {
        id: 50,
        path: "/settings/wallets/add",
        showSideMenu: false,
        component: <WalletDetails />,
      },
      {
        id: 21,
        name: "Fees Schedule",
        path:"/settings/fees-schedules",
        showSideMenu: true,
        icon: <ScheduleOutlined />,
        component: <FeesSchedule />,
      },
      {
        id: 22,
        name: "Withdrawal Limits",
        path:"/settings/withdrawal-Limits",
        showSideMenu: true,
        icon: <SwitcherOutlined />,
        component: <WithrawalLimits />,
      },
    ]
  },
  {
    id: 25,
    name: "Promo",
    isSub: true,
    showSideMenu: true,
    icon: <SketchOutlined />,
    sub: [
      {
        id: 26,
        name: "Airdrops",
        path: "/Airdrops/Airdrops",
        showSideMenu: true,
        icon: <SketchCircleFilled />,
        component: <Deposits />,
      }
    ],
  },
];
export default MENU_DATA;
