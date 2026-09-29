import { createContext } from "react";

export interface NoticeContextType {
  isNoticeOpen: boolean;
  openNotice: () => void;
  closeNotice: () => void;
}

export const NoticeContext = createContext<NoticeContextType | undefined>(
  undefined,
);
