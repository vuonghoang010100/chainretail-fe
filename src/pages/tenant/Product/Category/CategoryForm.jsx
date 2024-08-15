import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message } from "antd";
import { uniqueValidator } from "@/utils";

const CategoryForm = ({ useForCreate, onFinish, initRecord: initRecord = {}, }) => {
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
        message.error("Tên nhóm sản phẩm đã được sử dụng!");
        setUsedName((prev) => [...prev, postPutData.name]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới nhóm sản phẩm!")
      : message.error("Không thể cập nhật nhóm sản phẩm!");
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
        message.success("Thêm mới nhóm sản phẩm thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật nhóm sản phẩm thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="categoryForm"
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
        <Form.Item name="id" label="Mã nhóm sản phẩm">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="name"
        label="Tên nhóm sản phẩm"
        tooltip="Trường bắt buộc, duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên nhóm sản phẩm!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedName, "Tên nhóm sản phẩm"),
          },
        ]}
      >
        <Input placeholder="Tên nhóm sản phẩm" />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea placeholder="Mô tả" showCount maxLength={256} />
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

export default CategoryForm;
