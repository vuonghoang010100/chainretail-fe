import React, { useEffect, useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash.debounce";

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 500,
  formatResponeData,
  onSelect,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const [baseOptions, setBaseOptions] = useState([]);
  const fetchRef = useRef(0);

  useEffect(() => {
    debounceFetcher(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions(baseOptions);
      setFetching(true);
      fetchOptions(value).then((responseData) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        const newOptions = formatResponeData(responseData.data);
        setOptions(newOptions);
        setFetching(false);

        if (!value) {
          // case base options
          setBaseOptions(newOptions);
        }
      });
    };
    return debounce(loadOptions, debounceTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
      onInputKeyDown={(e) => {
        if (e.key === "Backspace" && e.target.value.length === 0) {
          e.stopPropagation();
        }
      }}
      onSelect={onSelect}
    />
  );
}

export { DebounceSelect };
