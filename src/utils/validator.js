/**
   * Validate uniqe field
   * @param {fieldValue} value
   * @param {[value]} usedList
   * @param {string} label
   * @returns Field validate status
   */
const uniqueValidator = async (value, usedList, label) => {
  if (value?.length > 0 && usedList.includes(value)) {
    return Promise.reject(`${label} đã được sử dụng!`);
  }
  return Promise.resolve();
};

const VALIDATE_PATTERNS = {
  TENANT_NAME: "^[-a-z0-9]{1,63}$",
  TENANT_NAME_REGIS: "^(?![Aa][Dd][Mm][Ii][Nn]|[Tt][Ee][Ss][tt]|[Aa][Pp][Ii]|[Ww][Ww][Ww])(?:[-a-z0-9]{1,63})$",
  
}

export { uniqueValidator, VALIDATE_PATTERNS };