import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, Space, message } from "antd";
import { districts, uniqueValidator } from "@/utils";
import { DatePicker } from "@/components/common/Input/DatePicker";
import { SelectDistrict, SelectProvince } from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";
import { staffGenders, staffRoles, staffStatuses } from "@/apis/StaffAPI";


const path = "/staff";

const StaffForm = ({ useForCreate, onFinish, initStaff = {} }) => {
  const navigate = useNavigate();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initStaff);

    // fix districtOptions
    if (initStaff.hasOwnProperty("province")) {
      const province = initStaff.province;
      if (districts.hasOwnProperty(province)) {
        setDistrictOptions(
          districts[province].map((district) => ({
            label: district,
            value: district,
          }))
        );
      }
    }
  }, [form, initStaff]);

  // -------------------- Handle Unique fields --------------------
  const [usedEmail, setUsedEmail] = useState([]);
  const [usedPhone, setUsedPhone] = useState([]);

  const handleError = (staffData, error) => {
    // Status 409: conflict
    if (
      error?.response?.status === 409 &&
      !!error.response.data?.detail?.message
    ) {
      const error_msg = error.response.data.detail.message;

      // handle unique
      if (error_msg === "BRANCH_EMAIL_EXIST") {
        message.error("Email đã được sử dụng!");
        setUsedEmail((prev) => [...prev, staffData.email]);
      } else if (error_msg === "PHONE_ALREADY_EXIST") {
        message.error("Số điện thoại đã được sử dụng!");
        setUsedPhone((prev) => [...prev, staffData.phone_number]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới nhân viên!")
      : message.error("Không thể cập nhật nhân viên!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => !!value)
    );
    return data;
  };

  // -------------------- Submit Form --------------------
  const handleSubmit = async (formValues) => {
    setLoading(true);
    console.info("Form infos:", formValues);

    const storeData = formatFormValues(formValues);
    console.info(useForCreate ? "POST data" : "PUT data", storeData);

    try {
      const isFinish = await onFinish(storeData);
      if (useForCreate) {
        message.success("Thêm mới nhân viên thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật nhân viên thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(storeData, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="staffForm"
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
        <Form.Item name="id" label="Mã nhân viên">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="full_name"
        label="Họ và tên"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập họ và tên!",
          },
        ]}
      >
        <Input placeholder="Họ và tên nhân viên" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập email của nhân viên!",
          },
          {
            type: "email",
            message: "Email không hợp lệ!",
          },
          {
            validator: (_, value) => uniqueValidator(value, usedEmail, "Email"),
          },
        ]}
      >
        <Input placeholder="Email của nhân viên" />
      </Form.Item>

      <Form.Item
        name="phone_number"
        label="Số điện thoại"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số điện thoại!",
          },
          {
            pattern: "^\\d*$", // FIXME: validate phone number in regex
            message: "Số điện thoại không hợp lệ!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedPhone, "Số điện thoại"),
          },
        ]}
      >
        <Input placeholder="Số điện thoại của nhân viên" />
      </Form.Item>

      <Form.Item
        name="role"
        label="Chức vụ"
        rules={[
          {
            required: true,
            message: "Vui chọn chức vụ!",
          },
        ]}
      >
        <RadioGroup values={staffRoles} />
      </Form.Item>

      <Form.Item
        name="branch_name"
        label="Cửa hàng"
        // TODO: add rules
      >
        <Select showSearch allowClear placeholder="Tìm và chọn cửa hàng" />
      </Form.Item>

      <Form.Item name="date_of_birth" label="Ngày sinh">
        <DatePicker />
      </Form.Item>

      <Form.Item name="gender" label="Giới tính">
        <RadioGroup values={staffGenders} />
      </Form.Item>

      <Form.Item name="province" label="Tỉnh/Thành phố">
        <SelectProvince
          setDistrictOptions={setDistrictOptions}
          resetDistrict={() => form.resetFields(["district"])}
        />
      </Form.Item>

      <Form.Item name="district" label="Quận/Huyện">
        <SelectDistrict options={districtOptions} />
      </Form.Item>

      <Form.Item name="address" label="Địa chỉ">
        <Input placeholder="Địa chỉ của nhân viên" />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái">
          <RadioGroup values={staffStatuses} />
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
          <Button onClick={(e) => navigate(path)}>Đóng</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default StaffForm;
