import React from "react";
import { Form, Input, Row, Col } from "antd";
import {
  BaseFilterModal,
  rowProps,
  singleColProps,
} from "@/components/common/FilterModal";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { VALUE_ALL } from "@/components/common/FilterModal/BaseFilterModal";
import { VendorService } from "@/apis/VendorService";

const ContractFilterModal = ({ open, setOpen, setQuery }) => {
  // -------------------- Filter attr --------------------
  const [form] = Form.useForm();

  // -------------------- Filter function --------------------
  const handleFilter = () => {
    setOpen(false);
    let data = form.getFieldsValue();

    console.log(data.vendor);
    // convert data
    if (data.vendor) {
      const vendor = data.vendor;
      delete data.vendor;
      data.vendorId = vendor.value;
    }

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
      singleCol
    >
      <Form name="filterStore" layout="vertical" form={form}>
        {/* form item here */}
        <Row {...rowProps}>
          <Col {...singleColProps}>
            <Form.Item name="id" label="Mã hợp đồng">
              <Input placeholder="Tìm theo mã hợp đồng" allowClear />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="status" label="Trạng thái">
              <RadioGroup
                values={[VALUE_ALL, "Còn hiệu lực", "Hết hiệu lực"]}
              />
            </Form.Item>
          </Col>

          <Col {...singleColProps}>
            <Form.Item name="vendor" label="Ghi chú">
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
          </Col>
        </Row>
      </Form>
    </BaseFilterModal>
  );
};

export default ContractFilterModal;
