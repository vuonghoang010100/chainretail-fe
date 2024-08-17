import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message } from "antd";
import { districts, uniqueValidator } from "@/utils";
import {
  SelectDistrict,
  SelectProvince,
} from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";

const VendorForm = ({ useForCreate, onFinish, initRecord: initRecord = {} }) => {
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
        message.error("Tên nhà cung cấp đã được sử dụng!");
        setUsedFullName((prev) => [...prev, postPutData.fullName]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới nhà cung cấp!")
      : message.error("Không thể cập nhật nhà cung cấp!");
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
        message.success("Thêm mới nhà cung cấp thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật nhà cung cấp thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="vendorForm"
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
        <Form.Item name="id" label="Mã nhà cung cấp">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="fullName"
        label="Tên nhà cung cấp"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên nhà cung cấp!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedFullName, "Tên nhà cung cấp"),
          },
        ]}
      >
        <Input placeholder="Tên của nhà cung cấp" />
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
        <Input placeholder="Email liên hệ của nhà cung cấp" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          {
            validator: (_, value) =>
              uniqueValidator(value, usedPhone, "Số điện thoại"),
          },
        ]}
      >
        <Input placeholder="Số điện thoại liên hệ của nhà cung cấp" />
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
        <Input placeholder="Địa chỉ của nhà cung cấp" />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái">
          <RadioGroup values={["Đang hợp tác", "Dừng hợp tác"]} />
        </Form.Item>
      )}

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

export default VendorForm;
