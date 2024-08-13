import React from "react";
import { DatePicker as DatePickerAntd } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePickerAntd;

const convertDate = (value, format="YYYY-MM-DD") => {
  if (!!value && typeof value === 'string') {
    if (value === "") {
      return null;
    }
    return dayjs(value, format);
  }
  return null;
}

export const DatePicker = ({ value, onChange, format="YYYY-MM-DD", ...props }) => {
  return (
    <DatePickerAntd
      value={convertDate(value, format)}
      onChange={(date, dateString) => {
        onChange(dateString);
      }}
      // format={{
      //   format: format,
      //   type: "mask" // breaks mobiles -> not use
      // }}
      format={format}
      {...props}
    />
  );
};


export const RangePickerx = ({value, onChange, ...props}) => {
  
  const setValue = (value) => {
    if (!value) {
      return [null, null];
    }
    return value.map(date => convertDate(date))
  }

  return (
    <RangePicker 
      value={setValue(value)}
      onChange={(dates, dateStrings) => {
        onChange(dateStrings);
      }}
      {...props}
    />
  )
}

