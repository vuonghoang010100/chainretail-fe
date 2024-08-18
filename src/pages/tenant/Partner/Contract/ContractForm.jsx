import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, InputNumber, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DatePicker } from "@/components/common/Input/DatePicker";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { RadioGroup } from "@/components/common/Input/Radio";
import { VendorService } from "@/apis/VendorService";
import { FileService } from "@/apis/FileService";

const ContractForm = ({
  useForCreate,
  onFinish,
  initRecord: initRecord = {},
}) => {
  const navigate = useNavigate();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // -------------------- File upload attrs --------------------
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    console.info("new File list:", newFileList);
    setFileList(
      newFileList.map((item) => {
        if (item.response) {
          item.url = item.response;
        }
        return item;
      })
    );
    if (newFileList.length === 0) {
      form.setFieldValue("file", undefined);
    }
  };

  const uploadFile = async ({ file, onSuccess }) => {
    try {
      const url = await FileService.upload(file);
      onSuccess(url);
    } catch (e) {
      console.log(e);
    }
  };

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initRecord);

    if (!useForCreate) {
      if (initRecord.pdfUrl) {
        const file = {
          uuid: "default",
          name: "Hợp đồng.pdf",
          status: "done",
          url: initRecord.pdfUrl,
        };
        setFileList([file]);
        form.setFieldValue("file", file);
      }
    }
  }, [form, initRecord, useForCreate]);

  // -------------------- Handle Unique fields --------------------
  // not handle unique

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới hợp đồng!")
      : message.error("Không thể cập nhật hợp đồng!");
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

    //convert file
    let pdfUrl = null;
    if (fileList.length > 0 && fileList[0].url) pdfUrl = fileList[0].url;
    delete data.file;
    data.pdfUrl = pdfUrl;
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
        message.success("Thêm mới hợp đồng thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật hợp đồng thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="contractForm"
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
        <Form.Item name="id" label="Mã hợp đồng">
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
          placeholder="Tìm và chọn nhà cung cấp"
        />
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Ngày bắt đầu"
        tooltip="Trường bắt buộc!"
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
        tooltip="Trường bắt buộc!"
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
        label="Tệp tin hợp đồng"
        name="file"
        tooltip="Trường bắt buộc! Chỉ nhận file pdf"
        rules={[
          {
            required: true,
            message: "Vui lòng tải lên hợp đồng!",
          },
        ]}
      >
        <Upload
          maxCount={1}
          accept="application/pdf"
          fileList={fileList}
          value={fileList}
          onChange={handleChange}
          customRequest={uploadFile}
          beforeUpload={(file) => {
            const isPDF = file.type === "application/pdf";
            if (!isPDF) {
              message.error("Chỉ có thể tải lên file PDF!");
              return Promise.reject(false);
            } else {
              if (file.size >= 10000000) {
                message.error("Kích thước tệp phải bé hơn 10MB!");
                return Promise.reject(false);
              }
              return Promise.resolve(true);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Tải lên tệp tin</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="period"
        label="Chu kỳ"
        tooltip="Trường bắt buộc!"
        rules={[
          {
            required: true,
            message: "Vui chọn chu kỳ nhập hàng!",
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
          addonAfter="Ngày"
        />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái">
          <RadioGroup values={["Còn hiệu lực", "Hết hiệu lực"]} />
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
          <Button onClick={() => navigate(-1)}>Đóng</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ContractForm;
