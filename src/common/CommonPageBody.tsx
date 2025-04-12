import {ReactNode} from "react";

import "./CommonPageBody.css";

type CommonPageBodyProps = {
  children: ReactNode;
};

function CommonPageBody({ children }: CommonPageBodyProps) {
  return (
    <div className={"common-page-body"}>
      { children }
    </div>
  )
}

export default CommonPageBody;