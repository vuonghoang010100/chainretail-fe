import { useState } from "react";

const useToggle = (initValue = false) => {
  const [on, setOn] = useState(initValue);

  const onToggle = () => {
    setOn(prev => !prev);
  }

  return [on, onToggle];
}

export default useToggle;