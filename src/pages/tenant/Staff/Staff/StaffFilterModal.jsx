import React, { useState } from "react";
import { Form, Input, Row, Col } from "antd";
import {
  BaseFilterModal,
  rowProps,
  colProps,
} from "@/components/common/FilterModal";
import {
  SelectDistrict,
  SelectProvince,
} from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";
import { RangePickerx } from "@/components/common/Input/DatePicker";
import { VALUE_ALL } from "@/components/common/FilterModal/BaseFilterModal";

// eslint-disable-next-line no-unused-vars
const StaffFilterModal = ({ open, setOpen, query, setQuery }) => {
  // -------------------- Filter attr --------------------
  const [form] = Form.useForm();
  const [districtOptions, setDistrictOptions] = useState([]);

  // -------------------- Filter function --------------------
  const handleFilter = () => {
    setOpen(false);
    let data = form.getFieldsValue();

    // convert data
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!data.dob) {
      const [start_date, end_date] = data.dob;
      data.fromDob = start_date ? start_date : null;
      data.toDob = end_date ? end_date : null;
    }
    delete data.dob;

    // Trim
    const queryData = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(data).filter(([_, value]) => value && value !== VALUE_ALL)
    );

    setQuery((prev) => ({
      page: 1,
      size: prev.size,
      search: prev.search,
      sort: prev.sort,
      ...queryData,
    }));

    console.info("query filter", queryData);
  };

  const handleClearFilter = () => {
    form.resetFields();
    setQuery((prev) => ({
      page: 1,
      size: prev.size,
      search: prev.search,
      sort: prev.sort,
    }));
  };

  return (
    <BaseFilterModal
      open={open}
      setOpen={setOpen}
      onOk={handleFilter}
      onClear={handleClearFilter}
    >
      <Form
        name="filterStaff"
        layout="vertical"
        form={form}
        // style={{ maxWidth: 600}}
      >
        {/*  form item here */}
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item name="id" label="Mã nhân viên">
              <Input placeholder="Tìm theo mã nhân viên" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="fullName" label="Họ và tên">
              <Input placeholder="Tìm theo họ và tên" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="dob" label="Ngày sinh">
              <RangePickerx />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="gender" label="Giới tính">
              <RadioGroup values={[VALUE_ALL, "Nam", "Nữ"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="email" label="Email">
              <Input placeholder="Tìm theo email" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Tìm theo số điện thoại" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="role" label="Chức vụ">
              {/* <RadioGroup values={staffRoles} /> */}
              <p>-----</p>
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="status" label="Trạng thái">
              <RadioGroup values={[VALUE_ALL, "Hoạt động", "Dừng hoạt động"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="province" label="Tỉnh/Thành phố">
              <SelectProvince
                setDistrictOptions={setDistrictOptions}
                resetDistrict={() => form.resetFields(["district"])}
              />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="district" label="Quận/Huyện">
              <SelectDistrict options={districtOptions} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Tìm theo địa chỉ" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="note" label="Ghi chú">
              <Input placeholder="Tìm theo ghi chú" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseFilterModal>
  );
};

export default StaffFilterModal;
