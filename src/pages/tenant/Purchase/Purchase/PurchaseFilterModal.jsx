import React from "react";
import { Form, Input, Row, Col, InputNumber } from "antd";
import {
  BaseFilterModal,
  rowProps,
  colProps,
} from "@/components/common/FilterModal";
import { RangePickerx } from "@/components/common/Input/DatePicker";
import { RadioGroup } from "@/components/common/Input/Radio";
import { VALUE_ALL } from "@/components/common/FilterModal/BaseFilterModal";

const PurchaseFilterModal = ({ open, setOpen, setQuery }) => {
  // -------------------- Filter attr --------------------
  const [form] = Form.useForm();

  // -------------------- Filter function --------------------
  const handleFilter = () => {
    setOpen(false);
    let data = form.getFieldsValue();

    // convert data
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!data.receivedDate) {
      const [start_date, end_date] = data.receivedDate;
      data.gteReceivedDate = start_date ? start_date : null;
      data.lteReceivedDate = end_date ? end_date : null;
    }
    delete data.receivedDate;

    // Trim
    const queryData = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(data).filter(([_, value]) => value && value !== VALUE_ALL)
    );

    // preprocess
    if (queryData?.useContract === "Có")
      queryData.useContract = true;
    else if (queryData?.useContract === "Không")
      queryData.useContract = false;

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
      <Form name="filterStore" layout="vertical" form={form}>
        {/* form item here */}
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item name="id" label="Mã đơn nhập hàng">
              <Input placeholder="Tìm theo mã đơn nhập hàng" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="useContract" label="Sử dụng hợp đồng">
              <RadioGroup values={[VALUE_ALL, "Có", "Không"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="receivedDate" label="Ngày nhận hàng">
              <RangePickerx />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="status" label="Trạng thái">
              <RadioGroup values={[VALUE_ALL, "Chưa xác nhận", "Chờ nhận hàng", "Hoàn thành"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="receiveStatus" label="Trạng thái nhận hàng">
              <RadioGroup values={[VALUE_ALL, "Chưa nhận", "Đã nhận một phần", "Đã nhận"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="paymentStatus" label="Trạng thái thanh toán">
              <RadioGroup values={[VALUE_ALL, "Chưa thanh toán", "Đã thanh toán"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
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

          <Col {...colProps}>
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
          
          {/* vendor, contract, store, employee, product */}

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

export default PurchaseFilterModal;
