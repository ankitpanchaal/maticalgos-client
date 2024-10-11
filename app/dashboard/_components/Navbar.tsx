"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/public/logo_black.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/lib/hooks/useLogout";
import { getAccount, updateTradeStatus } from "../_actions";
import { useQuery } from "@tanstack/react-query";
import { AccountResponse } from "../type";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

const Navbar = () => {
  const path = usePathname();
  const { logout } = useLogout();

  const { isPending, error, data, refetch } = useQuery<AccountResponse>({
    queryKey: ["account"],
    queryFn: getAccount,
    retry: 2,
  });

  const [tradeStatus, setTradeStatus] = useState<string | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const name = data?.data?.[0]?.AccountName;

  useEffect(() => {
    if (data?.data) {
      setTradeStatus(data?.data?.[0]?.Trade === "Y" ? "active" : "inactive");
    }
  }, [data]);

  const handleTradeStatusToggle = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    const newStatus = tradeStatus === "active" ? "inactive" : "active";
    const apiStatus = newStatus === "active" ? "Y" : "N";

    toast
      .promise(updateTradeStatus(apiStatus), {
        loading: "Updating trade status...",
        success: () => {
          setTradeStatus(newStatus);
          refetch(); // Refetch the account data
          return "Trade status updated successfully";
        },
        error: "Failed to update trade status",
      })
      .finally(() => setIsUpdating(false));
  };

  const menuItems = [
    { label: "Explore", href: "/explore" },
    { label: "My Strategies", href: "/my-strategies" },
    { label: "Analysis", href: "/analysis" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-secondary fixed top-0 w-full">
      <div className="flex items-center justify-between p-4 container max-w-[90%] mx-auto">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="w-[120px] h-[45px] md:w-[160px] md:h-[60px] cursor-pointer relative"
          >
            <Image src={Logo} alt="logo" fill className="object-contain" />
          </Link>
        </div>

        <div className="md:flex hidden space-x-12">
          {menuItems.map((item) => (
            <Menu
              key={item.href}
              label={item.label}
              href={item.href}
              isActive={path === `/dashboard${item.href}`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden md:inline">
              Trade Status:
            </span>
            {isPending ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <Badge
                status={tradeStatus}
                onClick={handleTradeStatusToggle}
                disabled={isUpdating}
              />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
              {isPending ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
                    alt={name}
                  />
                  <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                Account : {isPending ? <Skeleton className="h-4 w-20" /> : name}
              </DropdownMenuItem>
              <div className="md:hidden">
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.href} className={`${path === `/dashboard${item.href}` ? "bg-gray-100":""}`} >
                    <Link href={`/dashboard${item.href}`} className="w-full">
                      {item.label}
                    </Link>
                    <ExternalLink className="ml-2" />
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 cursor-pointer hover:!text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

const Menu = ({
  label,
  href,
  isActive,
}: {
  label: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Link href={`/dashboard${href}`} passHref>
      <span
        className={`font-semibold inline-flex items-center relative group hover:text-gray-900 ${
          isActive ? "text-black" : "text-gray-700"
        }`}
      >
        {label}
        <span
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-all duration-300 ease-in-out ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        ></span>
      </span>
    </Link>
  );
};

const Badge = ({ status, onClick, disabled }: { status: string | undefined, onClick: () => void, disabled: boolean }) => {
  const bgColor = status === "active" ? "bg-green-100" : "bg-red-100";
  const textColor = status === "active" ? "text-green-800" : "text-red-800";
  const hoverColor = status === "active" ? "hover:bg-green-200" : "hover:bg-red-200";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} ${hoverColor} transition-colors duration-200 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {status === "active" ? "Active" : "Inactive"}
    </button>
  );
};

export default Navbar;