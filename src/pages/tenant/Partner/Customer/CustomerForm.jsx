import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, InputNumber } from "antd";
import { districts, uniqueValidator } from "@/utils";
import {
  SelectDistrict,
  SelectProvince,
} from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DatePicker } from "@/components/common/Input/DatePicker";

const CustomerForm = ({ useForCreate, onFinish, initRecord: initRecord = {} }) => {
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
      } else if (errorCode === -303) {
        message.error("Tên khách hàng đã được sử dụng!");
        setUsedFullName((prev) => [...prev, postPutData.fullName]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới khách hàng!")
      : message.error("Không thể cập nhật khách hàng!");
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
        message.success("Thêm mới khách hàng thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật khách hàng thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="customerForm"
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
        <Form.Item name="id" label="Mã khách hàng">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="fullName"
        label="Tên khách hàng"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên khách hàng!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedFullName, "Tên khách hàng"),
          },
        ]}
      >
        <Input placeholder="Tên của khách hàng" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: "email",
            message: "Email không hợp lệ!",
          },
          {
            validator: (_, value) => uniqueValidator(value, usedEmail, "Email"),
          },
        ]}
      >
        <Input placeholder="Email liên hệ của khách hàng" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số điện thoại!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedPhone, "Số điện thoại"),
          },
        ]}
      >
        <Input placeholder="Số điện thoại liên hệ của khách hàng" />
      </Form.Item>

      <Form.Item name="dob" label="Ngày sinh">
        <DatePicker />
      </Form.Item>

      <Form.Item name="gender" label="Giới tính">
        <RadioGroup values={["Nam", "Nữ"]} />
      </Form.Item>

      <Form.Item
        name="province"
        label="Tỉnh/Thành phố"
      >
        <SelectProvince
          setDistrictOptions={setDistrictOptions}
          resetDistrict={() => form.resetFields(["district"])}
        />
      </Form.Item>

      <Form.Item
        name="district"
        label="Quận/Huyện"
      >
        <SelectDistrict options={districtOptions} />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
      >
        <Input placeholder="Địa chỉ của khách hàng" />
      </Form.Item>

      <Form.Item
        name="rewardPoint"
        label="Điểm thưởng"
      >
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          step="1000"
          min="0"
          addonAfter="Điểm"
        />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea placeholder="Ghi chú" showCount maxLength={256} />
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

export default CustomerForm;
