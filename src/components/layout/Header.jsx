import { Flex, Layout, Space, Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import logo from "@/assets/logo_blue.svg";
import { ROUTE } from "@/constants/AppConstant";

const items = [
  {
    key: 1,
    label: (<Link to={ROUTE.LOGOUT.path}>Đăng xuất</Link>),
  }
]
const Header = () => {
  const {auth} = useAuth();

  return (
    <Layout.Header
      style={{
        padding: "0px 32px"
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        style={{
          height: "100%"
        }}
      >
        <Space align="center" size="middle">
          <div
            style={{
              paddingTop: "16px",
              color: "#0A60FF",
            }}
          >
            <img src={logo} alt=""/>
          </div>
          <span style={{
            color: "#29CDFF",
            // backgroundImage: "linear-gradient(45deg, #29CDFF, #FFFFFF)",
            margin: "0",
            fontSize: "18px",
            fontWeight: "bold"
          }}
          >
            Chainretail
          </span>
        </Space>
        <Dropdown menu={{items}} >
          <Space size="small">
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#99d3ff',
              }}
            />
            <span style={{color: "#FFFFFF"}}>{auth.user}</span>
          </Space>
        </Dropdown>
      </Flex>
    </Layout.Header>
  );
};

export default Header;
