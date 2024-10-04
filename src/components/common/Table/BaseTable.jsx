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
 * @property {ColumnsType[]} excludeSorts List name columns no sort
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
  excludeSorts = [],
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
  view_=true,
  edit_=true,
  delete_=true,
  children,
}) => {
  // -------------------- Add more columns --------------------
  const additionColums = [
    ...columns,
    {
      title: "Thời gian tạo",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 155,
    },
  ];

  columns = additionColums.map((ele, index) => {
    if (excludeSorts.includes(ele?.key)) {
      return ele;
    }
    return { ...ele, sorter: { multiple: index } };
  });

  // -------------------- attrs --------------------
  const [size, setSize] = useState("small");
  const [displayCol, setDisplayCol] = useState(columns);
  const [cols, setCols] = useState(columns.map((col) => col.title));

  // -------------------- Sort  --------------------
  const handleTableChange = (pagination, filters, sorter) => {
    let sortString = "";
    if (Array.isArray(sorter)) {
      let sortArrays = [];
      sorter
        .filter((ele) => ele.order)
        .forEach((ele) => {
          sortArrays.push(
            ele.order === "ascend" ? "+" + ele.columnKey : "-" + ele.columnKey
          );
        });
      sortString = sortArrays.join(",");
    }
    if (sorter?.order) {
      sortString =
        sorter.order === "ascend"
          ? "+" + sorter.columnKey
          : "-" + sorter.columnKey;
    }

    setQuery((prev) => ({
      ...prev,
      sort: sortString,
    }));

    console.log(sortString);
  };

  // -------------------- Action column--------------------
  const actionColumn = {
    title: "Hành động",
    key: "action_",
    width: 128,
    fixed: "right",
    render: (_, record) => (
      <Space size="small">
        {view_ && (
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => {
              onView(record);
            }}
          />
        )}
        {edit_ && (
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => {
              onEdit(record);
            }}
          />
        )}
        {delete_ && (
          <Popconfirm
            title={`Xóa ${label.toLowerCase()}?`}
            okText="Xóa"
            cancelText="Đóng"
            onConfirm={() => onDelete(record)}
          >
            <Button danger ghost icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
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

  const reloadTable = () => {
    setReload();
  };

  const handlePagination = (page, pageSize) => {
    setQuery((prev) => ({
      ...prev,
      page: page,
      size: pageSize,
    }));
  };

  return (
    <>
      <div className={styles.tableHeader}>
        <Title>{`Danh sách ${label.toLowerCase()}`}</Title>
        <Space wrap>
          {children}
          <Button type="text" icon={<ReloadOutlined />} onClick={reloadTable} />

          <Dropdown
            placement="bottom"
            menu={{ items, onClick: handleMenuClick }}
          >
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
          // x: true,
          x: 160 * displayCol.length,
        }}
        sticky={false}
        // tableLayout="fixed"
        tableLayout="auto"
        columns={[...displayCol, actionColumn]}
        rowKey={rowKey}
        dataSource={dataSource}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current: query.page,
          pageSize: query.size,
          total: total,
          onChange: handlePagination,
        }}
      />
    </>
  );
};

export { BaseTable };
