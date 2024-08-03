/**
 * formatData
 * @param {object} data respone data object
 * @returns formatted Object
 */
export const formatData = (data) => {
  let formattedData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null) {
      formattedData[key] = "";
    } else if (typeof value === "number") {
      formattedData[key] = value.toString();
    } else {
      formattedData[key] = value;
    }
  }
  return formattedData;
};
