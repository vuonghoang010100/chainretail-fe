import React, { useState } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Dropdown,
  Checkbox,
  Popover,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";
import styles from "./BaseTable.module.css";
import { Title } from "../Title";

/**
 * Base table props
 * @typedef tableParam
 * @property {string} label table label name
 * @property {ColumnsType[]} columns `Antd`'s Table Comlumns
 * @property {string} rowKey Key for earch row base on `columns`, usually `id`
 * @property {object[]} dataSource `Antd`'s Table dataSource
 * @property {boolean} loading Table loading state
 * @property {object} query { page, pageSize, ... }
 * @property {function()} setQuery change `query` data
 * @property {number} total total record of table base on `query` data
 * @property {function(record)} onView handle click view button
 * @property {function(record)} onEdit handle click edit button
 * @property {function(record)} onDelete handle click delete button
 * @property {function()} setReload trigger reload table
 * @property {React.JSX.Element} children
 */

/**
 * Base table for default pages
 * @param {tableParam} param0 {@link tableParam}
 * @returns
 */
const BaseTable = ({
  label,
  columns,
  rowKey,
  dataSource,
  loading,
  query,
  setQuery,
  total,
  onView,
  onEdit,
  onDelete,
  setReload,
  children,
}) => {
  // -------------------- attrs --------------------
  const [size, setSize] = useState("large");
  const [displayCol, setDisplayCol] = useState(columns);
  const [cols, setCols] = useState(columns.map((col) => col.title));

  // -------------------- Action column--------------------
  const actionColumn = {
    title: "Hành động",
    key: "action_",
    width: 144,
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={(e) => {
            onView(record);
          }}
        />
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={(e) => {
            onEdit(record);
          }}
        />
        <Popconfirm
          title={`Xóa ${label.toLowerCase()}?`}
          okText="Xóa"
          cancelText="Đóng"
          onConfirm={() => onDelete(record)}
        >
          <Button danger ghost icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

  // -------------------- Size menu item--------------------
  const items = [
    {
      label: "Lớn",
      key: "large",
    },
    {
      label: "Trung bình",
      key: "middle",
    },
    {
      label: "Nhỏ",
      key: "small",
    },
  ];

  // -------------------- Setting content --------------------
  const handleChangeCol = (checkedValue) => {
    console.log(checkedValue);
    setCols(checkedValue);
    setDisplayCol(columns.filter((col) => checkedValue.includes(col.title)));
  };

  const settingContent = (
    <Checkbox.Group value={cols} onChange={handleChangeCol}>
      <Space direction="vertical">
        {columns.map((obj, index) => (
          <Checkbox key={index} value={obj.title} defaultChecked={true}>
            {obj.title}
          </Checkbox>
        ))}
      </Space>
    </Checkbox.Group>
  );

  // -------------------- Page function --------------------
  const handleMenuClick = (e) => {
    setSize(e.key);
  };

  const reloadTable = (e) => {
    setReload();
  };

  const handlePagination = (page, pageSize) => {
    setQuery((prev) => ({
      ...prev,
      page: page,
      pageSize: pageSize,
    }));
  };

  return (
    <>
      <div className={styles.tableHeader}>
        <Title>{`Danh sách ${label.toLowerCase()}`}</Title>
        <Space wrap>
          {children}
          <Button type="text" icon={<ReloadOutlined />} onClick={reloadTable} />

          <Dropdown placement="bottom" menu={{ items, onClick: handleMenuClick }}>
            <Button type="text" icon={<ColumnHeightOutlined />} />
          </Dropdown>

          <Popover
            placement="bottomRight"
            title="Hiển thị cột"
            content={settingContent}
          >
            <Button type="text" icon={<SettingOutlined />} />
          </Popover>
        </Space>
      </div>
      <Table
        size={size}

        scroll={{
          x: true,
        }}
        sticky={false}
        tableLayout="fixed"

        columns={[...displayCol, actionColumn]}
        rowKey={rowKey}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current: query.page,
          pageSize: query.pageSize,
          total: total,
          onChange: handlePagination,
        }}
      />
    </>
  );
};

export { BaseTable };
