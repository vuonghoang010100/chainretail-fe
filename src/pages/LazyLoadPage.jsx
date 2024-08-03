import { Suspense } from "react";
import Loading from "@/pages/Loading";

/**
 * @typedef LazyLoadPageParam
 * @property {React.JSX.Element} children
 */
/**
 * LazyLoadPage
 * To improve performace
 * @param {LazyLoadPageParam} props {@link LazyLoadPageParam} 
 * @returns React.JSX.Element
 */
const LazyLoadPage = ({children}) => {
  return (
    <Suspense fallback={<Loading/>}>
      {children}
    </Suspense>
  );
}

export default LazyLoadPage;