import React from "react";
import { Form, Input, Row, Col, InputNumber } from "antd";
import {
  BaseFilterModal,
  rowProps,
  singleColProps,
} from "@/components/common/FilterModal";
import { RadioGroup } from "@/components/common/Input/Radio";
import { VALUE_ALL } from "@/components/common/FilterModal/BaseFilterModal";

const BillFilterModal = ({ open, setOpen, setQuery }) => {
  // -------------------- Filter attr --------------------
  const [form] = Form.useForm();

  // -------------------- Filter function --------------------
  const handleFilter = () => {
    setOpen(false);
    let data = form.getFieldsValue();

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
      singleCol
      open={open}
      setOpen={setOpen}
      onOk={handleFilter}
      onClear={handleClearFilter}
    >
      <Form name="filterStore" layout="vertical" form={form}>
        {/* form item here */}
        <Row {...rowProps}>
          <Col {...singleColProps}>
            <Form.Item name="id" label="Mã đơn vận chuyển">
              <Input placeholder="Tìm theo mã đơn vận chuyển" allowClear />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="status" label="Trạng thái">
              <RadioGroup
                values={[VALUE_ALL, "Đã thanh toán", "Chưa thanh toán"]}
              />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="vendorId" label="Nhà cung cấp">
              <Input placeholder="Tìm theo mã nhà cung cấp" allowClear />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="employeeId" label="Nhân viên">
              <Input placeholder="Tìm theo mã nhân viên" allowClear />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="gteTotal" label="Tổng số tiền từ">
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                step="1000"
                min="0"
                addonAfter="VND"
              />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="lteTotal" label="Tổng số tiền đến">
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                step="1000"
                min="0"
                addonAfter="VND"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseFilterModal>
  );
};

export default BillFilterModal;
