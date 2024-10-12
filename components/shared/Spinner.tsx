import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Spinner = ({ className, size = 20 }: SpinnerProps) => {
  return <Loader2 className={cn("animate-spin ", className)} size={size} />;
};

export default Spinner;

type SpinnerProps = {
  className?: string;
  size?: number;
};
