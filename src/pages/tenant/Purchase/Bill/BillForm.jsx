import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message } from "antd";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import useAuth from "@/hooks/useAuth";
import { VendorService } from "@/apis/VendorService";
import { PurchaseService } from "@/apis/PurchaseService";

const BillForm = ({ useForCreate, onFinish, initRecord: initRecord = {} }) => {
  const navigate = useNavigate();

  const { auth } = useAuth();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState(-1);

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initRecord);
  }, [form, initRecord]);

  // -------------------- Handle Unique fields --------------------

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    if (error?.response?.status === 400) {
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới hóa đơn nhập hàng!")
      : message.error("Không thể cập nhật hóa đơn nhập hàng!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    // convert data
    data.vendorId = null;
    if (data.vendor) {
      data.vendorId = data.vendor.value;
    }
    delete data.vendor;

    data.employeeId = auth.userId;

    data.purchaseIds = data.purchases.map((ele) => ele.value);
    delete data.purchases;

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
        message.success("Thêm mới Hóa đơn nhập hàng thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật Hóa đơn nhập hàng thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="billForm"
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
        <Form.Item name="id" label="Mã hóa đơn nhập hàng">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="vendor"
        label="Nhà cung cấp"
        tooltip="Trường bắt buộc!"
        rules={[
          {
            required: true,
            message: "Vui chọn nhà cung cấp!",
          },
        ]}
      >
        <DebounceSelect
          disabled={!useForCreate}
          allowClear
          showSearch
          fetchOptions={VendorService.search}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.fullName}`,
              key: option.id,
              value: option.id,
            }))
          }
          onSelect={(option) => {
            setVendorId(option.value);
            form.resetFields(["purchases"]);
          }}
          placeholder="Tìm và chọn nhà cung cấp"
        />
      </Form.Item>

      <Form.Item
        name="purchases"
        label="Đơn nhập hàng"
        rules={[
          {
            required: true,
            message: "Vui chọn đơn nhập hàng!",
          },
        ]}
      >
        <DebounceSelect disabled={!useForCreate}
          mode="multiple"
          allowClear
          showSearch
          fetchOptions={(value) => PurchaseService.search(value, vendorId)}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.id}`,
              key: option.id,
              value: option.id,
            }))
          }
          placeholder="Tìm và chọn nhà cung cấp"
        />
      </Form.Item>

      <Form.Item
        name="paymentStatus"
        label="Trạng thái thanh toán"
        rules={[
          {
            required: true,
            message: "Vui chọn trạng thái thanh toán!",
          },
        ]}
      >
        <RadioGroup values={["Chưa thanh toán", "Đã thanh toán"]} />
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

export default BillForm;
