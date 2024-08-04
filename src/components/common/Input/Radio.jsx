import React from "react";
import { Radio as RadioAntd } from "antd";


/**
 * @typedef RadioGroupProps
 * @property {String[]} values 
 * @property {Object} props
 */

/**
 * 
 * @param {...RadioGroupProps} param0 {@link RadioGroupProps}
 * @returns 
 */
export const RadioGroup = ({ values, ...props }) => {
  return (
    <RadioAntd.Group {...props}>
      {values.map((element, index) => (
        <RadioAntd name={`raido-option-${index}`} key={index} value={element}>
          {element}
        </RadioAntd>
      ))}
    </RadioAntd.Group>
  );
};
