import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col } from "antd";
import {
  BaseFilterModal,
  rowProps,
  colProps,
} from "@/components/common/FilterModal";
import { SelectDistrict, SelectProvince } from "@/components/common/Input/Select";
import { RadioGroup } from "@/components/common/Input/Radio";
import { RangePickerx } from "@/components/common/Input/DatePicker";
import { staffGenders, staffRoles, staffStatuses } from "@/apis/StaffAPI";

const StaffFilterModal = ({ open, setOpen, query, setQuery }) => {
  // -------------------- Filter attr --------------------
  const [form] = Form.useForm();
  const [isCreated, setIsCreated] = useState(false); // form is render or not
  const [districtOptions, setDistrictOptions] = useState([]);

  // -------------------- Filter function --------------------
  const handleFilter = () => {
    setOpen(false);
    let data = form.getFieldsValue();

    // convert data
    if (!!data.dob) {
      const [start_date, end_date] = data.dob;
      data.start_date = start_date ? start_date : null;
      data.end_date = end_date ? end_date : null;
    }
    delete data.dob;

    setQuery((prev) => ({
      page: 1,
      pageSize: prev.pageSize,
      ...data,
    }));

    console.info("query filter", data);
  };

  const handleClearFilter = () => {
    form.resetFields();
    setQuery((prev) => ({
      page: 1,
      pageSize: prev.pageSize,
    }));
  };

  // reset form when use search feature
  useEffect(() => {
    if (query.condition !== null && isCreated) {
      const resetFilelds = ["province", "district", "status"]; //TODO: add form field name here
      form.resetFields(resetFilelds);
    }
  }, [query.condition, form, isCreated]);

  // avoid using form when modal haven't rendered yet
  useEffect(() => {
    open && setIsCreated(true);
  }, [open]);

  return (
    <BaseFilterModal
      open={open}
      setOpen={setOpen}
      onOk={handleFilter}
      onClear={handleClearFilter}
    >
      <Form
        name="filterStore"
        layout="vertical"
        form={form}
        // style={{ maxWidth: 600}}
      >
        {/* // TODO: form item here */}
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item name="role" label="Chức vụ">
              <RadioGroup values={staffRoles} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="status" label="Trạng thái">
              <RadioGroup values={staffStatuses} />
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
            <Form.Item name="gender" label="Giới tính">
              <RadioGroup values={staffGenders} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="dob" label="Ngày sinh">
              <RangePickerx />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="id" label="Mã nhân viên">
              <Input
                placeholder="Tìm theo mã nhân viên"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="full_name" label="Họ và tên">
              <Input
                placeholder="Tìm theo họ và tên"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="email" label="Email">
              <Input
                placeholder="Tìm theo email"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="phone_number" label="Số điện thoại">
              <Input
                placeholder="Tìm theo số điện thoại"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="address" label="Địa chỉ">
              <Input
                placeholder="Tìm theo địa chỉ"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="note" label="Ghi chú">
              <Input
                placeholder="Tìm theo ghi chú"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseFilterModal>
  );
};

export default StaffFilterModal;
