import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, InputNumber } from "antd";
import { Title } from "@/components/common/Title";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { DatePicker } from "@/components/common/Input/DatePicker";

import useAuth from "@/hooks/useAuth";
import { ProductService } from "@/apis/ProductService";

const PurchaseForm2 = ({
  useForCreate,
  onFinish,
  initRecord: initRecord = {},
}) => {
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
      // handle unique
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới đơn nhập hàng!")
      : message.error("Không thể cập nhật đơn nhập hàng!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    let result = {
      receiveStatus: "Đã nhận",
    }

    result.details = data.details.map(ele => {

      return {
        id: ele.id,
        receivedAmount: ele.receivedAmount,
        mfg: ele.mfg,
        exp: ele.exp,
      }
    })

    return result;
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
        message.success("Thêm mới đơn nhập hàng thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật đơn nhập hàng thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="purchaseForm"
      form={form}
      onFinish={handleSubmit}
      // labelCol={{
      //   span: 8,
      // }}
      // wrapperCol={{
      //   span: 16,
      // // }}
      // style={{
      //   maxWidth: 600,
      // }}
    >
      {!useForCreate && (
        <Form.Item name="id" label="Mã đơn nhập hàng">
          <Input disabled />
        </Form.Item>
      )}

      <Title marginBot>Chi tiết đơn nhập hàng</Title>
      {/* <Form.Item label="&nbsp;" colon={false}> */}
        <Form.List
          style={{
            maxWidth: 1200,
          }}
          name="details"
          rules={[
            {
              validator: async (_, details) => {
                console.log(details);

                if (details.length === 0) {
                  message.error("Vui lòng thêm sản phẩm vào đơn nhập hàng!");
                  return Promise.reject(new Error("Không có sản phẩm"));
                }

                let ids = details.map((ele) => ele?.product?.value);
                let idsSet = new Set(ids);

                console.log(ids);
                console.log(idsSet);

                if (ids.length !== idsSet.size) {
                  message.error("Sẩn phẩm không được trùng nhau!");
                  return Promise.reject(
                    new Error("Sẩn phẩm không được trùng nhau")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, "product"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn sản phẩm!",
                      },
                    ]}
                  >
                    <DebounceSelect
                      disabled={!useForCreate}
                      allowClear
                      showSearch
                      fetchOptions={(value) =>
                        ProductService.search(value, vendorId)
                      }
                      formatResponeData={(data) =>
                        data.map((option) => ({
                          label: `${option.id} - ${option.name}`,
                          key: option.id,
                          value: option.id,
                        }))
                      }
                      placeholder="Tìm và sản phẩm"
                    />
                  </Form.Item>

                  <Form.Item
                      {...restField}
                      label="SL đặt"
                      name={[name, "purchaseAmount"]}
                      rules={[
                        {
                          required: true,
                          message: "Thiếu số lượng",
                        },
                      ]}
                    >
                      <InputNumber
                        disabled
                        placeholder="Số lượng"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="SL nhận"
                      name={[name, "receivedAmount"]}
                      rules={[
                        {
                          required: true,
                          message: "Thiếu số lượng",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="Số lượng nhận nhận"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="NSX"
                      name={[name, "mfg"]}
                    >
                      <DatePicker />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="HSD"
                      name={[name, "exp"]}
                    >
                      <DatePicker />
                    </Form.Item>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      {/* </Form.Item> */}

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

export default PurchaseForm2;
