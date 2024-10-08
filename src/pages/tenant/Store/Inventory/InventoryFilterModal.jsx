import React from "react";
import { Form, Input, Row, Col } from "antd";
import {
  BaseFilterModal,
  rowProps,
  singleColProps,
} from "@/components/common/FilterModal";
import { VALUE_ALL } from "@/components/common/FilterModal/BaseFilterModal";

const InventoryFilterModal = ({ open, setOpen, setQuery }) => {
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
            <Form.Item name="storeId" label="Cửa hàng">
              <Input placeholder="Tìm theo mã cửa hàng" allowClear />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="employeeId" label="Nhân viên">
              <Input placeholder="Tìm theo mã nhân viên" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseFilterModal>
  );
};

export default InventoryFilterModal;
