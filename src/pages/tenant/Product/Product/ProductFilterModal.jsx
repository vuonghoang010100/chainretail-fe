import React from "react";
import { Form, Input, Row, Col, InputNumber } from "antd";
import {
  BaseFilterModal,
  rowProps,
  colProps,
} from "@/components/common/FilterModal";
import { RadioGroup } from "@/components/common/Input/Radio";
import { DebounceSelect } from "@/components/common/Input/Select/DebounceSelect";
import { VALUE_ALL } from "@/components/common/FilterModal/BaseFilterModal";
import { CategoryService } from "@/apis/CategoryService";

const ProductFilterModal = ({ open, setOpen, setQuery }) => {
  // -------------------- Filter attr --------------------
  const [form] = Form.useForm();

  // -------------------- Filter function --------------------
  const handleFilter = () => {
    setOpen(false);
    let data = form.getFieldsValue();

    // convert data
    if (data.category) {
      const category = data.category;
      delete data.category;
      data.categoryId = category.value;
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
    >
      <Form
        name="filterProduct"
        layout="vertical"
        form={form}
        // style={{ maxWidth: 600}}
      >
        <Row {...rowProps}>
          {/*  form item here */}
          <Col {...colProps}>
            <Form.Item name="id" label="Mã sản phẩm">
              <Input placeholder="Tìm theo mã sản phẩm" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="sku" label="Mã vạch">
              <Input placeholder="Tìm theo mã vạch" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="name" label="Tên sản phẩm">
              <Input placeholder="Tìm theo tên sản phẩm" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="brand" label="Thương hiệu">
              <Input placeholder="Tìm theo thương hiệu" allowClear />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <Form.Item name="status" label="Trạng thái">
              <RadioGroup values={[VALUE_ALL, "Đang bán", "Dừng bán"]} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
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
          </Col>

          <Col {...colProps}>
            <Form.Item name="gtePrice" label="Giá bán từ">
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
            <Form.Item name="ltePrice" label="Giá bán đến">
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
            <Form.Item name="description" label="Mô tả">
              <Input placeholder="Tìm theo mô tả" allowClear />
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

export default ProductFilterModal;
