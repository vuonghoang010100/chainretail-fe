import React from "react";
import { Select } from "antd";
import { filterOption } from ".";
import { districts, provinces } from "@/utils";

/**
 * @typedef SelectProvinceProps
 * @property {function()} resetDistrict reset district field in form
 * @property {function()} setDistrictOptions set district options for current province
 * @property {function()} onChange 
 * @property {Object} props ...
 */
/**
 * Select province input
 * @param {SelectProvinceProps} param0 {@link SelectProvinceProps}
 * @returns 
 */
export const SelectProvince = ({ resetDistrict, setDistrictOptions, onChange, ...props }) => {
  return (
    <Select
      // over ride props
      showSearch
      allowClear
      placeholder="Chọn tỉnh/thành phố"
      filterOption={filterOption}
      onClear={() => {
        setDistrictOptions([]);
        resetDistrict();
      }}
      options={provinces.map((province) => ({
        label: province,
        value: province,
      }))}
      onChange={(province, option) => {
        onChange(province, option); // Ensure form comunicate with Select throw SelectProvince
        // eslint-disable-next-line no-prototype-builtins
        if (districts.hasOwnProperty(province)) {
          const districtOptions = districts[province].map((district) => ({
            label: district,
            value: district,
          }));
          setDistrictOptions(districtOptions);
          resetDistrict();
        }
      }}
      {...props}
    />
  );
};

/**
 * @typedef SelectDistrictProps
 * @property {String[]} options Select options
 * @property {Object} props ...
 */
/**
 * Select province input
 * @param {SelectDistrictProps} param0 {@link SelectDistrictProps}
 * @returns 
 */
export const SelectDistrict = ({options, ...props}) => {
  return (
    <Select
      showSearch
      allowClear
      placeholder="Chọn Quận/Huyện phố"
      filterOption={filterOption}
      options={options}
      {...props}
    />
  )
}