import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, Checkbox } from "antd";
import { uniqueValidator } from "@/utils";

const RoleForm = ({ useForCreate, onFinish, initRecord: initRecord = {} }) => {
  const navigate = useNavigate();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initRecord);
  }, [form, initRecord]);

  // -------------------- Handle Unique fields --------------------
  const [usedName, setUsedName] = useState([]);

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    if (error?.response?.status === 400) {
      const errorCode = error.response.data.code;

      // handle unique
      if (errorCode === -302) {
        message.error("Tên phân quyền đã được sử dụng!");
        setUsedName((prev) => [...prev, postPutData.name]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới!")
      : message.error("Không thể cập nhật!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    const ret = {
      name: data.name,
      description: data.description,
    }
    delete data.name;
    delete data.description;

    ret.permissions = Object.keys(data).filter(key => data[key])


    return ret;
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
        message.success("Thêm mới thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  const wrapCol = {
    offset: 8,
    span: 16,
  }

  return (
    <Form
      name="transferForm"
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
        <Form.Item name="id" label="Mã cửa hàng">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="name"
        label="Tên phân quyền"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Tên phân quyền!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedName, "Tên phân quyền"),
          },
        ]}
      >
        <Input
          placeholder="Tên phân quyền"
          count={{
            show: true,
            max: 50,
            exceedFormatter: (txt, { max }) => (txt).slice(0, max).join(''),
          }}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
      >
        <Input placeholder="Mô tả" />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea placeholder="Ghi chú" showCount maxLength={256} />
      </Form.Item>

      <Form.Item
        name="DASHBOARD"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Xem Dashboard</Checkbox>
      </Form.Item>

      <Form.Item
        name="PRODUCT"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý sản phẩm</Checkbox>
      </Form.Item>

      <Form.Item
        name="CATEGORY"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý nhóm sản phẩm</Checkbox>
      </Form.Item>

      <Form.Item
        name="SALES"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Bán hàng</Checkbox>
      </Form.Item>

      <Form.Item
        name="PURCHASE"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý nhập hàng</Checkbox>
      </Form.Item>

      <Form.Item
        name="CUSTOMER"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý khách hàng</Checkbox>
      </Form.Item>

      <Form.Item
        name="VENDOR"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý nhà cung cấp</Checkbox>
      </Form.Item>

      <Form.Item
        name="CONTRACT"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý hợp đồng</Checkbox>
      </Form.Item>

      <Form.Item
        name="STORE"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý cửa hàng</Checkbox>
      </Form.Item>

      <Form.Item
        name="TRANSFER"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý đơn vận chuyển</Checkbox>
      </Form.Item>

      <Form.Item
        name="INVENTORY_CHECK"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý kiểm kho</Checkbox>
      </Form.Item>

      <Form.Item
        name="EMPLOYEE"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý nhân viên</Checkbox>
      </Form.Item>

      <Form.Item
        name="ROLE"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý phân quyền</Checkbox>
      </Form.Item>

      <Form.Item
        name="PROMOTE"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Quản lý khuyến mãi</Checkbox>
      </Form.Item>

      <Form.Item
        name="REPORT"
        valuePropName="checked"
        wrapperCol={wrapCol}
      >
        <Checkbox>Xem báo cáo</Checkbox>
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

export default RoleForm;
