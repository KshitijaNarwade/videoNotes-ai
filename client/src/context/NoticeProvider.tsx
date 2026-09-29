import { useCallback, useState, type ReactNode } from "react";

import { NoticeContext } from "./NoticeContext";

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const openNotice = useCallback(() => {
    setIsNoticeOpen(true);
  }, []);

  const closeNotice = useCallback(() => {
    setIsNoticeOpen(false);
  }, []);

  return (
    <NoticeContext.Provider
      value={{
        isNoticeOpen,
        openNotice,
        closeNotice,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
}
