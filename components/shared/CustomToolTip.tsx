import React, { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { InfoIcon } from "lucide-react";

interface TooltipProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const CustomToolTip: React.FC<TooltipProps> = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen || isHovered}>
        <TooltipTrigger asChild>
          <div
            onClick={handleClick}
            ref={tooltipRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {trigger}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomToolTip;
