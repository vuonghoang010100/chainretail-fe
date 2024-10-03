import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, Radio, InputNumber } from "antd";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { StoreService } from "@/apis/StoreService";
import { ProductService } from "@/apis/ProductService";
import { DatePicker } from "@/components/common/Input/DatePicker";
import useAuth from "@/hooks/useAuth";
import { uniqueValidator } from "@/utils";

const PromoteForm = ({
  useForCreate,
  onFinish,
  initRecord: initRecord = {},
}) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isAllStore, setIsAllStore] = useState(true);
  const [stores, setStores] = useState([]);
  const [type, setType] = useState(undefined);

  console.log(type);

  // -------------------- Update fields --------------------
  useEffect(() => {
    if (!useForCreate) {
      if (initRecord?.allStore !== null) {
        setIsAllStore(initRecord?.allStore);
      } 
  
      if (initRecord?.type) setType(initRecord?.type);
    }

    // set form values
    form.setFieldsValue(initRecord);

    if (useForCreate) {
      setIsAllStore(true);
      form.setFieldValue("allStore", true);
      form.setFieldValue("status", "Còn hiệu lực");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        message.error("Mã khuyến mãi đã được sử dụng!");
        setUsedName((prev) => [...prev, postPutData.name]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới khuyến mãi!")
      : message.error("Không thể cập nhật khuyến mãi!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    // convert data
    data.productId = null;
    if (data.product) {
      data.productId = data.product.value;
    }
    delete data.product;

    data.storeIds = data.stores
      ? (data.stores = data.stores.map((ele) => ele.value))
      : [];
    delete data.stores;

    if (useForCreate) data.employeeId = auth.userId;

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
        message.success("Thêm mới khuyến mãi thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật khuyến mãi thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="promoteForm"
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
      <Form.Item
        name="name"
        label="Mã khuyến mãi"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên hiển thị!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedName, "Tên hiển thị"),
          },
        ]}
      >
        <Input
          placeholder="Mã khuyến mãi"
          count={{
            show: true,
            max: 50,
            exceedFormatter: (txt, { max }) => txt.slice(0, max).join(""),
          }}
        />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea placeholder="Mô tả" showCount maxLength={256} />
      </Form.Item>

      <Form.Item
        name="type"
        label="Loại khuyến mãi"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn loại khuyến mãi!",
          },
        ]}
      >
        <RadioGroup
          values={["Phần trăm Hóa đơn", "Số tiền Hóa đơn", "Giảm giá sản phẩm"]}
          onChange={(e) => setType(e.target.value)}
          value={type}
        />
      </Form.Item>

      {type === "Phần trăm Hóa đơn" && (
        <Form.Item
          name="percentage"
          label="% hóa đơn"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn loại khuyến mãi!",
            },
          ]}
        >
          <InputNumber placeholder="" step="100" min="1" addonAfter="%" />
        </Form.Item>
      )}

      {type === "Phần trăm Hóa đơn" && (
        <Form.Item name="maxDiscount" label="Giá giảm tối đa">
          <InputNumber
            placeholder=""
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            step="1000"
            min="1"
            addonAfter="VND"
          />
        </Form.Item>
      )}

      {type === "Số tiền Hóa đơn" && (
        <Form.Item
          name="amount"
          label="Số tiền giảm giá hóa đơn"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn loại khuyến mãi!",
            },
          ]}
        >
          <InputNumber
            placeholder=""
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            step="1000"
            min="1"
            addonAfter="VND"
          />
        </Form.Item>
      )}

      {type === "Giảm giá sản phẩm" && (
        <Form.Item
          name="product"
          label="Sản phẩm"
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
                label: `${option.id} - ${option.name} - Giá bán: ${option.price}`,
                key: option.id,
                value: option.id,
              }))
            }
            placeholder="Tìm và sản phẩm"
          />
        </Form.Item>
      )}

      {type === "Giảm giá sản phẩm" && (
        <Form.Item
          name="discountPrice"
          label="Giá Khuyến mãi sản phẩm"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn loại khuyến mãi!",
            },
          ]}
        >
          <InputNumber
            placeholder=""
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            step="1000"
            min="1"
            addonAfter="VND"
          />
        </Form.Item>
      )}

      <Form.Item
        name="startDate"
        label="Ngày bắt đầu"
        rules={[
          {
            required: true,
            message: "Vui chọn ngày bắt đầu hợp đồng!",
          },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="endDate"
        label="Ngày kết thúc"
        rules={[
          {
            required: true,
            message: "Vui chọn ngày kết thúc hợp đồng!",
          },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Số lượng"
        tooltip="Để trống nếu không giới hạn số lượng"
      >
        <InputNumber placeholder="" step="100" min="0" addonAfter="" />
      </Form.Item>

      <Form.Item name="status" label="Trạng thái">
        <RadioGroup values={["Còn hiệu lực", "Hết hiệu lực"]} />
      </Form.Item>

      {type !== "Giảm giá sản phẩm" && (
        <Form.Item
          name="minQuantityRequired"
          label="Số lượng sản phẩm >="
          tooltip="Để trống nếu không thiết lập điều kiện"
        >
          <InputNumber placeholder="" step="100" min="1" addonAfter="" />
        </Form.Item>
      )}

      {type !== "Giảm giá sản phẩm" && (
        <Form.Item
          name="minAmountRequired"
          label="Tổng số tiền hóa đơn >="
          tooltip="Để trống nếu không thiết lập điều kiện"
        >
          <InputNumber
            placeholder=""
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            step="1000"
            min="1"
            addonAfter="VND"
          />
        </Form.Item>
      )}

      <Form.Item
        name="allStore"
        label="Cửa hàng"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn cửa hàng cho nhân viên!",
          },
        ]}
      >
        <Radio.Group
          value={isAllStore}
          onChange={(e) => setIsAllStore(e.target.value)}
        >
          <Radio value={true}>Tất cả cửa hàng</Radio>
          <Radio value={false}>Chọn cửa hàng</Radio>
        </Radio.Group>
      </Form.Item>

      {!isAllStore && (
        <Form.Item
          name="stores"
          label="Chọn cửa hàng"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn cửa hàng!",
            },
          ]}
        >
          <DebounceSelect
            mode="multiple"
            fetchOptions={StoreService.search}
            formatResponeData={(data) =>
              data.map((option) => ({
                label: `${option.name}`,
                key: option.id,
                value: option.id,
              }))
            }
            values={stores}
            onChange={setStores}
            placeholder="Tìm và chọn cửa hàng"
          />
        </Form.Item>
      )}

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

export default PromoteForm;
