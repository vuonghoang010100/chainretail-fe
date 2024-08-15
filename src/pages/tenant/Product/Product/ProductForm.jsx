import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Space,
  message,
  InputNumber,
  Upload,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { uniqueValidator } from "@/utils";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { CategoryService } from "@/apis/CategoryService";
import ImgCrop from "antd-img-crop";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const uploadButton = (
  <button
    style={{
      border: 0,
      background: "none",
    }}
    type="button"
  >
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </button>
);

const ProductForm = ({
  useForCreate,
  onFinish,
  initRecord: initRecord = {},
}) => {
  const navigate = useNavigate();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // -------------------- Image upload attrs --------------------
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const isJPG =
        newFileList[0].type === "image/jpeg" ||
        newFileList[0].type === "image/png";
      isJPG && setFileList(newFileList);
    } else {
      setFileList([]);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initRecord);

    if (!useForCreate) {
      initRecord.imageUrl &&
        setFileList([
          {
            uuid: "default",
            name: "image",
            status: "done",
            url: initRecord.imageUrl,
          },
        ]);
    }

    // case special select
  }, [form, initRecord, useForCreate]);

  // -------------------- Handle Unique fields --------------------
  const [usedName, setUsedName] = useState([]);
  const [usedSku, setUsedSku] = useState([]);

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    if (error?.response?.status === 400) {
      const errorCode = error.response.data.code;

      // handle unique
      if (errorCode === -302) {
        message.error("Tên sản phẩm đã được sử dụng!");
        setUsedName((prev) => [...prev, postPutData.name]);
      } else if (errorCode === -304) {
        message.error("Mã vạch đã được sử dụng!");
        setUsedSku((prev) => [...prev, postPutData.fullName]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới sản phẩm!")
      : message.error("Không thể cập nhật sản phẩm!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === undefined || value === "" ? [key, null] : [key, value]
      )
    );

    // convert data
    data.categoryId = null;
    if (data.category) {
      data.categoryId = data.category.value;
    }
    delete data.category;

    return data;
  };

  // -------------------- Submit Form --------------------
  const handleSubmit = async (formValues) => {
    setLoading(true);
    console.info("Form infos:", formValues);

    // process image
    let imageBase64 = "";
    if (fileList.length > 0) {
      const file = fileList[0];
      if (
        file.uuid != "default" ||
        file.type === "image/jpeg" ||
        file.type === "image/png"
      ) {
        try {
          imageBase64 = await getBase64(file.originFileObj);
        } catch (error) {
          console.log(error);
        }
      }
    }

    const data = formatFormValues(formValues);

    data.imageBase64 = imageBase64;

    console.info(useForCreate ? "POST data" : "PUT data", data);

    try {
      const isFinish = await onFinish(data);
      if (useForCreate) {
        message.success("Thêm mới sản phẩm thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật sản phẩm thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="productForm"
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
        <Form.Item name="id" label="Mã sản phẩm">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="sku"
        label="Mã vạch"
        tooltip="Trường bắt buộc, duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mã vạch!",
          },
          {
            validator: (_, value) => uniqueValidator(value, usedSku, "Mã vạch"),
          },
        ]}
      >
        <Input placeholder="Mã vạch của sản phẩm" />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên sản phẩm"
        tooltip="Trường bắt buộc, duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên sản phẩm!",
          },
          {
            validator: (_, value) =>
              uniqueValidator(value, usedName, "Tên sản phẩm"),
          },
        ]}
      >
        <Input placeholder="Tên sản phẩm" />
      </Form.Item>

      <Form.Item
        name="brand"
        label="Thương hiệu"
        tooltip="Trường duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập thương hiệu!",
          },
        ]}
      >
        <Input placeholder="Tên thương hiệu của sản phẩm" />
      </Form.Item>

      <Form.Item
        name="unit"
        label="Đơn vị"
        tooltip="Trường duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập đơn vị!",
          },
        ]}
      >
        <Input placeholder="Đơn vị của sản phẩm" />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá bán"
        tooltip="Trường duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập giá bán!",
          },
        ]}
      >
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          step="1000"
          min="1"
          addonAfter="VND"
        />
      </Form.Item>

      <Form.Item name="category" label="Nhóm sản phẩm">
        <DebounceSelect
          allowClear
          showSearch
          fetchOptions={CategoryService.search}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.name}`,
              key: option.id,
              value: option.id,
            }))
          }
          placeholder="Tìm và chọn nhóm sản phẩm"
        />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái">
          <RadioGroup values={["Đang bán", "Dừng bán"]} />
        </Form.Item>
      )}

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea
          placeholder="Mô tả của sản phẩm"
          showCount
          maxLength={256}
        />
      </Form.Item>

      <Form.Item label="Hình ảnh">
        <ImgCrop
          quality="0.2"
          modalTitle="Chỉnh sửa hình ảnh"
          modalCancel="Đóng"
        >
          <Upload
            customRequest={dummyRequest}
            accept="image/jpeg,image/png"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={(file) => {
              const isJPG =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJPG) {
                message.error("Chỉ có thể tải lên file JPG hoặc PNG!");
                return Promise.reject(false);
              } else {
                return Promise.resolve(true);
              }
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      </Form.Item>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
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

export default ProductForm;
