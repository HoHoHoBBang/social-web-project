import React, { useEffect, useState } from "react";
import { ChildrenProps } from "../../assets/types/postType";

const Loading = ({ children }: ChildrenProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 500);
  }, []);

  return (
    <>
      {!loading && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black bg-opacity-25 backdrop-blur-sm dark:bg-opacity-70">
          <div className="h-20 w-20 animate-spin rounded-full border-[15px] border-t-purple-500"></div>
          <p className="text-xl font-bold dark:text-white">LOADING...</p>
        </div>
      )}
      {loading && children}
    </>
  );
};

export default Loading;
