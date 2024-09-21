import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Space, message, InputNumber } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { StoreService } from "@/apis/StoreService";
import useAuth from "@/hooks/useAuth";
import { ProductService } from "@/apis/ProductService";
import { BatchService } from "@/apis/BatchService";

const InventoryForm = ({
  useForCreate,
  onFinish,
  initRecord: initRecord = {},
}) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pid, setPid] = useState({});
  const [storeId, setStoreId] = useState(-1);

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
      ? message.error("Không thể thêm mới Đơn kiểm kho!")
      : message.error("Không thể cập nhật Đơn kiểm kho!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    data.storeId = null;
    if (data.store) {
      data.storeId = data.store.value;
    }
    delete data.store;

    data.employeeId = auth.userId;

    data.details = data.details.map(ele => ({
      batchId: ele.batch.value,
      realQuantity: ele.realQuantity
    }))

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
        message.success("Thêm mới đơn kiểm kho thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật đơn kiểm kho thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="storeForm"
      form={form}
      onFinish={handleSubmit}
      // labelCol={{
      //   span: 4,
      // }}
      // wrapperCol={{
      //   span: 20,
      // }}
      // style={{
      //   maxWidth: 600,
      // }}
    >
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
          onSelect={(option) => setStoreId(option?.value)}
          placeholder="Tìm và chọn cửa hàng"
        />
      </Form.Item>

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
                    fetchOptions={(value) => ProductService.search(value)}
                    formatResponeData={(data) =>
                      data.map((option) => ({
                        label: `${option.id} - ${option.name}`,
                        key: option.id,
                        value: option.id,
                      }))
                    }
                    onSelect={(option) => {
                      setPid((prev) => {
                        prev[key] = option.value;
                        return prev;
                      });
                      form.resetFields([["details", name, "batch"]])
                    }}
                    placeholder="Tìm và sản phẩm"
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "batch"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn lô!",
                    },
                  ]}
                >
                  <DebounceSelect
                    disabled={!useForCreate}
                    allowClear
                    showSearch
                    fetchOptions={(value) => {
                      let productId = pid[key];
                      console.log(pid);

                      return BatchService.search(value, productId, storeId);
                    }}
                    formatResponeData={(data) =>
                      data.map((option) => ({
                        label: `Lô: ${option.id} - SL: ${option.quantity}`,
                        key: option.id,
                        value: option.id,
                      }))
                    }
                    placeholder="Tìm và chọn lô"
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="SL thực tế"
                  name={[name, "realQuantity"]}
                  rules={[
                    {
                      required: true,
                      message: "Thiếu số lượng",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="SL thực tế"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
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
          </>
        )}
      </Form.List>

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

export default InventoryForm;
