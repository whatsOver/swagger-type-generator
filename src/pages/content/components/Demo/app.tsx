import { noop } from "@/shared/util/common";
import { useEffect } from "react";

export default function App() {
  useEffect(noop, []);

  return <div className="content-view">content view</div>;
}
