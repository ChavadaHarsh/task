import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="w-[90%] xl:w-[65%]  mt-[50px] mb-[10px] flex flex-col mx-auto">
      {children}
    </div>
  );
}
