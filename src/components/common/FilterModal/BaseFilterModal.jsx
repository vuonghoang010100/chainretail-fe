import React from "react";
import { Modal, Button } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";

/**
 * @typedef filterModalParam
 * @property {boolean} open modal open or not
 * @property {function()} setOpen set open modal state
 * @property {function()} onOk handle click ok button
 * @property {function()} onClear handle click reset button
 * @property {function()} afterClose handle click reset button
 * @property {React.JSX.Element} children
 */

/**
 * BaseFilterModal
 * @param {filterModalParam} props {@link filterModalParam}
 * @returns React.JSX.Element
 */
const BaseFilterModal = ({ open, setOpen, onOk, onClear, afterClose, children }) => {
  return (
    <Modal
      open={open}
      title="Bộ lọc"
      width={872} // max width, modal width auto resize 24 + 400 + 24 + 400 + 24
      okText={
        <>
          <FilterOutlined />
          Lọc
        </>
      }
      cancelText="Đóng"
      onCancel={() => setOpen(false)}
      onOk={onOk}
      afterClose={afterClose}
      // destroyOnClose
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <Button onClick={onClear}>
            <ReloadOutlined />
            Đặt lại
          </Button>
          <OkBtn />
        </>
      )}
    >
      {children}
    </Modal>
  );
};

export { BaseFilterModal };
