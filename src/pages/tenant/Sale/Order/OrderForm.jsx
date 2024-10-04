import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message } from "antd";
import { districts, uniqueValidator } from "@/utils";
import {
  SelectDistrict,
  SelectProvince,
} from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";

const OrderForm = ({ useForCreate, onFinish, initRecord: initRecord = {} }) => {
  const navigate = useNavigate();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initRecord);

    // fix districtOptions
    if (Object.prototype.hasOwnProperty.call(initRecord, "province")) {
      const province = initRecord.province;
      if (Object.prototype.hasOwnProperty.call(districts, province)) {
        setDistrictOptions(
          districts[province].map((district) => ({
            label: district,
            value: district,
          }))
        );
      }
    }
  }, [form, initRecord]);

  // -------------------- Handle Unique fields --------------------
  const [usedEmail, setUsedEmail] = useState([]);
  const [usedPhone, setUsedPhone] = useState([]);
  const [usedName, setUsedName] = useState([]);
  const [usedFullName, setUsedFullName] = useState([]);

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    if (error?.response?.status === 400) {
      const errorCode = error.response.data.code;

      // handle unique
      if (errorCode === -300) {
        message.error("Email đã được sử dụng!");
        setUsedEmail((prev) => [...prev, postPutData.email]);
      } else if (errorCode === -301) {
        message.error("Số điện thoại đã được sử dụng!");
        setUsedPhone((prev) => [...prev, postPutData.phone]);
      } else if (errorCode === -302) {
        message.error("Tên hiển thị đã được sử dụng!");
        setUsedName((prev) => [...prev, postPutData.name]);
      } else if (errorCode === -303) {
        message.error("Tên đơn nhập hàng đã được sử dụng!");
        setUsedFullName((prev) => [...prev, postPutData.fullName]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới đơn đặt hàng!")
      : message.error("Không thể cập nhật đơn đặt hàng!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    return data;
  };

  // -------------------- Submit Form --------------------
  const handleSubmit = async (formValues) => {
    setLoading(true);
    console.info("Form infos:", formValues);

    const data = formatFormValues(formValues);

    console.info(useForCreate ? "POST data" : "PUT data", data);

    try {
      const isFinish = await onFinish(data);
      if (useForCreate) {
        message.success("Thêm mới đơn đặt hàng thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật đơn đặt hàng thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="orderForm"
      form={form}
      onFinish={handleSubmit}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
    >
      {!useForCreate && (
        <Form.Item name="id" label="Mã đơn nhập hàng">
          <Input disabled />
        </Form.Item>
      )}


      
      <Form.Item name="status" label="Trạng thái">
        <RadioGroup values={["Chờ xác nhận", "Đang giao hàng", "Hoàn thành"]} />
      </Form.Item>

      <Form.Item name="paymentStatus" label="Trạng thái thanh toán">
        <RadioGroup values={["Đã thanh toán", "Chưa thanh toán"]} />
      </Form.Item>

      
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {useForCreate ? "Thêm mới" : "Cập nhật"}
          </Button>
          <Button onClick={() => navigate(-1)}>Đóng</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
