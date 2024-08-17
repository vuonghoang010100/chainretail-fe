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
 * @property {boolean} singleCol is form use single col or two cols
 * @property {React.JSX.Element} children
 */

/**
 * BaseFilterModal
 * @param {filterModalParam} props {@link filterModalParam}
 * @returns React.JSX.Element
 */
const BaseFilterModal = ({
  open,
  setOpen,
  onOk,
  onClear,
  afterClose,
  singleCol = false,
  children,
}) => {
  // max width, modal width auto resize 24 + 400 + 24 + 400 + 24 = 872
  // min widtd  24 + 400 + 24 = 448
  const width = singleCol ? 448 : 872;

  return (
    <Modal
      open={open}
      title="Bộ lọc"
      width={width} // max width, modal width auto resize 24 + 400 + 24 + 400 + 24
      // style={{top: 60 }}
      centered
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

export const VALUE_ALL = "Tất cả";
