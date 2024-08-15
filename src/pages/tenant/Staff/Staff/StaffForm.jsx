import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, message, Radio } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { districts, uniqueValidator } from "@/utils";
import { DatePicker } from "@/components/common/Input/DatePicker";
import {
  SelectDistrict,
  SelectProvince,
} from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { RoleSerivce } from "@/apis/RoleService";
import { StoreService } from "@/apis/StoreService";

const StaffForm = ({ useForCreate, onFinish, initRecord: initRecord = {} }) => {
  const navigate = useNavigate();

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);

  const [isAllStore, setIsAllStore] = useState(true); // allstore Radio
  const [roles, setRoles] = useState([]);
  const [stores, setStores] = useState([]);

  // -------------------- Update fields --------------------
  useEffect(() => {
    // set form values
    form.setFieldsValue(initRecord);

    // case special select
    initRecord.allStore !== undefined && setIsAllStore(initRecord.allStore);
    initRecord.roles && setRoles(initRecord.roles);
    initRecord.stores && setRoles(initRecord.stores);

    // fix districtOptions
    if (Object.prototype.hasOwnProperty.call(initRecord, "province")) {
      const province = initRecord.province;
      if (Object.prototype.hasOwnProperty.call(districts, province)) {
        setDistrictOptions(
          districts[province].map((district) => ({
            label: district,
            value: district,
          }))
        );
      }
    }
  }, [form, initRecord]);

  // -------------------- Handle Unique fields --------------------
  const [usedEmail, setUsedEmail] = useState([]);
  const [usedPhone, setUsedPhone] = useState([]);

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    if (error?.response?.status === 400) {
      const errorCode = error.response.data.code;

      // handle unique
      if (errorCode === -300) {
        message.error("Email đã được sử dụng!");
        setUsedEmail((prev) => [...prev, postPutData.email]);
      } else if (errorCode === -301) {
        message.error("Số điện thoại đã được sử dụng!");
        setUsedPhone((prev) => [...prev, postPutData.phone]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
    // Uncatch error
    useForCreate
      ? message.error("Không thể thêm mới nhân viên!")
      : message.error("Không thể cập nhật nhân viên!");
  };

  // -------------------- Utils fucntion --------------------
  const formatFormValues = (data) => {
    data = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        (value === undefined || value === "") ? [key, null] : [key, value]
      )
    );

    // Format data
    data.roles = data.roles ? data.roles.map(ele => ele.value) : [];
    data.stores = data.stores ? data.stores = data.stores.map(ele => ele.value) : [];
    data?.passwordagain && delete data.passwordagain;

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
        message.success("Thêm mới nhân viên thành công!");
      } else {
        isFinish
          ? message.success("Cập nhật nhân viên thành công!")
          : message.info("Không có dữ liệu thay đổi!");
      }
    } catch (error) {
      handleError(data, error);
    }

    setLoading(false);
  };

  return (
    <Form
      name="staffForm"
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
        <Form.Item name="id" label="Mã nhân viên">
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name="fullName"
        label="Họ và tên"
        tooltip="Trường bắt buộc!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập họ và tên!",
          },
        ]}
      >
        <Input placeholder="Họ và tên nhân viên" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        tooltip="Trường bắt buộc, duy nhất!"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập email của nhân viên!",
          },
          {
            type: "email",
            message: "Email không hợp lệ!",
          },
          {
            validator: (_, value) => uniqueValidator(value, usedEmail, "Email"),
          },
        ]}
      >
        <Input placeholder="Email của nhân viên" />
      </Form.Item>

      {useForCreate && (
        <>
          <Form.Item
            name="password"
            label="Mật khẩu"
            tooltip="Trường bắt buộc!"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="passwordagain"
            label="Nhập lại mật khẩu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu!",
              },
              {
                validator: (_, value) =>
                  value === form.getFieldValue("password") || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        "Mật khẩu phải trùng khớp với mật khẩu bên trên!"
                      ),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>
        </>
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
        <Form.Item name="stores" label="Chọn cửa hàng">
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

      <Form.Item name="roles" label="Phân quyền">
        <DebounceSelect
          mode="multiple"
          fetchOptions={RoleSerivce.search}
          formatResponeData={(data) =>
            data.map((option) => ({
              label: `${option.name}`,
              key: option.id,
              value: option.id,
            }))
          }
          values={roles}
          onChange={setRoles}
          placeholder="Tìm và chọn quyền"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        tooltip="Trường duy nhất!"
        rules={[
          {
            validator: (_, value) =>
              uniqueValidator(value, usedPhone, "Số điện thoại"),
          },
        ]}
      >
        <Input placeholder="Số điện thoại của nhân viên" />
      </Form.Item>

      <Form.Item name="dob" label="Ngày sinh">
        <DatePicker />
      </Form.Item>

      <Form.Item name="gender" label="Giới tính">
        <RadioGroup values={["Nam", "Nữ"]} />
      </Form.Item>

      <Form.Item name="province" label="Tỉnh/Thành phố">
        <SelectProvince
          setDistrictOptions={setDistrictOptions}
          resetDistrict={() => form.resetFields(["district"])}
        />
      </Form.Item>

      <Form.Item name="district" label="Quận/Huyện">
        <SelectDistrict options={districtOptions} />
      </Form.Item>

      <Form.Item name="address" label="Địa chỉ">
        <Input placeholder="Địa chỉ của nhân viên" />
      </Form.Item>

      {!useForCreate && (
        <Form.Item name="status" label="Trạng thái" required tooltip="Trường bắt buộc!">
          <RadioGroup values={["Hoạt động", "Dừng hoạt động"]} />
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

export default StaffForm;
