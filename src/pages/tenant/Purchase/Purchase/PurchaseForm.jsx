import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, InputNumber } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Title } from "@/components/common/Title";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { VendorService } from "@/apis/VendorService";
import { ContractService } from "@/apis/ContractService";
import { StoreService } from "@/apis/StoreService";

import useAuth from "@/hooks/useAuth";
import { ProductService } from "@/apis/ProductService";

const PurchaseForm = ({
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

    // add employee

    // convert data
    data.vendorId = null;
    if (data.vendor) {
      data.vendorId = data.vendor.value;
    }
    delete data.vendor;

    data.contractId = null;
    if (data.contract) {
      data.contractId = data.contract.value;
    }
    delete data.contract;
    data.useContract = data.contractId !== null;

    data.storeId = null;
    if (data.store) {
      data.storeId = data.store.value;
    }
    delete data.store;

    data.employeeId = auth.userId;

    // details
    if (useForCreate) {
      data.details = Object.values(data.details).map((ele) => ({
        productId: ele.product.value,
        purchaseAmount: ele.purchaseAmount,
        purchasePrice: ele.purchasePrice,
      }));
    } else {
      data.details = Object.values(data.details).map((ele) => ({
        id: ele.id,
        purchaseAmount: ele.purchaseAmount,
        purchasePrice: ele.purchasePrice,
      }));
    }

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
            form.resetFields(["contract"]);
          }}
          placeholder="Tìm và chọn nhà cung cấp"
        />
      </Form.Item>

      <Form.Item name="contract" label="Hợp đồng">
        <DebounceSelect
          allowClear
          showSearch
          fetchOptions={(value) => ContractService.search(value, vendorId)}
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
        name="store"
        label="Cửa hàng"
        tooltip="Trường bắt buộc!"
        rules={[
          {
            required: true,
            message: "Vui chọn cửa hàng!",
          },
        ]}
      >
        <DebounceSelect
          allowClear
          showSearch
          fetchOptions={StoreService.search}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.name}`,
              key: option.id,
              value: option.id,
            }))
          }
          placeholder="Tìm và chọn cửa hàng"
        />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái">
          <RadioGroup values={["Chưa xác nhận", "Chờ nhận hàng", "Đã hủy"]} />
        </Form.Item>
      )}

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea placeholder="Ghi chú" showCount maxLength={256} />
      </Form.Item>

      <Title marginBot>Chi tiết đơn nhập hàng</Title>
      <Form.Item label="&nbsp;" colon={false}>
        <Form.List
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
                <>
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
                        ProductService.search(value)
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
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "purchasePrice"]}
                      rules={[
                        {
                          required: true,
                          message: "Thiếu giá nhập!",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="Giá nhập"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                        step="1000"
                        min="1"
                        addonAfter="VND"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "purchaseAmount"]}
                      rules={[
                        {
                          required: true,
                          message: "Thiếu số lượng",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="Số lượng"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                        addonAfter="đơn vị"
                      />
                    </Form.Item>
                    {useForCreate && <MinusCircleOutlined onClick={() => remove(name) } />}
                  </Space>
                </>
              ))}

              {useForCreate && (
                <Form.Item>
                  <Button
                    label="_"
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm sản phẩm
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
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

export default PurchaseForm;
