import React, { useState } from "react";
import { Form, Input, Typography, Button, Flex } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { onMainHost, VALIDATE_PATTERNS } from "@/utils";

const Title = Typography.Title;

const LoginDomain = () => {
  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // -------------------- Submit Form --------------------
  const handleSubmit = async (formValues) => {
    setLoading(true);
    const tenant = formValues.tenant;

    try {
      // TODO: export utils
      // case on main host
      if (onMainHost()){
        window.location = window.location.protocol + "//" + tenant + "." + window.location.host
      }
      // case www.[main host]
      window.location = window.location.protocol + "//" + tenant + "." + window.location.host.replace("www.", "")

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        height: "100%"
      }}
    >
      <Flex
        justify="center"
        align="center"
        style={{
          width: "100%",
          height: "100%"
        }}
      >

      
      <div>
        <Flex justify="center">
          <Title>Đăng nhập</Title>
        </Flex>
        <br />
        <Form
          name="login"
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
          style={{
            maxWidth: 600,
            minWidth: "500px"
          }}
        >
          <Form.Item
            name="tenant"
            label="Cửa hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên cửa hàng!",
              },
              {
                pattern: VALIDATE_PATTERNS.TENANT_NAME,
                message: "Tên cửa hàng không hợp lệ!"
              }
            ]}
          >
            <Input
              addonBefore={<GlobalOutlined />}
              placeholder="Tên cửa hàng của bạn"
              addonAfter=".chainretail.io.vn" // TODO: read
              onInput={(e) => e.target.value = e.target.value.toLowerCase()}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading} size="large">
              Vào cửa hàng
            </Button>
          </Form.Item>

          <Form.Item>
            <Flex justify="center">
              Chưa có tài khoản?&nbsp;
              <Link to="/signup">Tạo tài khoản mới</Link>
            </Flex>
          </Form.Item>

        </Form>
      </div>
      </Flex>
    </div>
  );
};

export default LoginDomain;
