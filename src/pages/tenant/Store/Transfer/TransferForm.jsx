import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Space, message, InputNumber, Row, Col, Input } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { StoreService } from "@/apis/StoreService";
import useAuth from "@/hooks/useAuth";
import { ProductService } from "@/apis/ProductService";
import { BatchService } from "@/apis/BatchService";
import { RadioGroup } from "@/components/common/Input/Radio";

const TransferForm = ({
  useForCreate,
  onFinish,
  initRecord: initRecord = {},
}) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // layout
  const rowProps = {
    gutter: 24,
  };

  const colProps = {
    sm: 7,
    xs: 24,
  };

  const colProps2 = {
    sm: 1,
    xs: 1,
  };

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pid, setPid] = useState({});

  const [fromStoreId, setFromStoreId] = useState(-1);
  const [toStoreId, setToStoreId] = useState(-2);

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
      ? message.error("Không thể thêm mới Đơn vận chuyển!")
      : message.error("Không thể cập nhật Đơn vận chuyển!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    // from
    data.fromStoreId = fromStoreId;
    delete data.fromStore;

    // to
    data.toStoreId = toStoreId;
    delete data.toStore;

    data.employeeId = auth.userId;

    data.details = data.details.map((ele) => ({
      batchId: ele.batch.value,
      quantity: ele.quantity,
    }));

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
        message.success("Thêm mới Đơn vận chuyển thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật Đơn vận chuyển thành công!")
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
      {!useForCreate && (
        <Form.Item name="id" label="Mã vận chuyển" style={{marginLeft:20}}>
          <Input disabled />
        </Form.Item>
      )}


      <Form.Item
        name="fromStore"
        label="Từ cửa hàng"
        tooltip="Trường bắt buộc!"
        rules={[
          {
            required: true,
            message: "Vui chọn cửa hàng!",
          },
          {
            validator: async () => {
              if (fromStoreId === toStoreId)
                return Promise.reject(new Error("Không được trùng cửa hàng!"));
            }
          }
        ]}
        style={{marginLeft:10}}
      >
        <DebounceSelect
          allowClear
          showSearch
          disabled={!useForCreate}
          fetchOptions={StoreService.search}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.name}`,
              key: option.id,
              value: option.id,
            }))
          }
          onSelect={(option) => {
            setFromStoreId(option?.value);
            form.resetFields(["details"]);
          }}
          placeholder="Tìm và chọn cửa hàng"
        />
      </Form.Item>

      <Form.Item
        name="toStore"
        label="Đến cửa hàng"
        tooltip="Trường bắt buộc!"
        rules={[
          {
            required: true,
            message: "Vui chọn cửa hàng!",
          },
          {
            validator: async () => {
              if (fromStoreId === toStoreId)
                return Promise.reject(new Error("Không được trùng cửa hàng!"));
            }
          }
        ]}
      >
        <DebounceSelect
          allowClear
          showSearch
          disabled={!useForCreate}
          fetchOptions={StoreService.search}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.name}`,
              key: option.id,
              value: option.id,
            }))
          }
          onSelect={(option) => setToStoreId(option?.value)}
          placeholder="Tìm và chọn cửa hàng"
        />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái" style={{marginLeft:52}} >
          <RadioGroup values={["Đang vận chuyển", "Hoàn thành", "Đã hủy"]} />
        </Form.Item>
      )}

      <Form.Item name="note" label="Ghi chú" style={{marginLeft:69}}>
        <Input.TextArea placeholder="Ghi chú" showCount maxLength={256} />
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
                message.error("Vui lòng thêm sản phẩm vào đơn vận chuyển!");
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
              <Row {...rowProps} key={key}>
                <Col {...colProps}>
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
                      form.resetFields([["details", name, "batch"]]);
                    }}
                    placeholder="Tìm và sản phẩm"
                  />
                </Form.Item>
                </Col>
                <Col {...colProps}>
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
                      return BatchService.search(value, productId, fromStoreId);
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
                </Col>

                <Col {...colProps}>
                <Form.Item
                  {...restField}
                  label="SL cần chuyển"
                  name={[name, "quantity"]}
                  rules={[
                    {
                      required: true,
                      message: "Thiếu số lượng",
                    },
                  ]}
                >
                  <InputNumber
                    disabled={!useForCreate}
                    placeholder="Số lượng"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                </Col>

                <Col {...colProps2}>
                  {useForCreate && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
                </Col>
              </Row>
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

export default TransferForm;
