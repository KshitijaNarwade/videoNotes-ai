import { useContext } from "react";
import { NoticeContext } from "./NoticeContext";

export function useNotice() {
  const context = useContext(NoticeContext);

  if (!context) {
    throw new Error("useNotice must be used inside NoticeProvider");
  }

  return context;
}
