import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex justify-center h-screen w-screen items-center">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );
};

export default loading;
