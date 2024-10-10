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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const handleTradeStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const apiStatus = newStatus === "active" ? "Y" : "N";
    
    toast.promise(
      updateTradeStatus(apiStatus),
      {
        loading: 'Updating trade status...',
        success: () => {
          setTradeStatus(newStatus);
          refetch(); // Refetch the account data
          return 'Trade status updated successfully';
        },
        error: 'Failed to update trade status',
      }
    ).finally(() => setIsUpdating(false));
  };

  const menuItems = [
    { label: "Explore", href: "/explore" },
    { label: "My Strategies", href: "/my-strategies" },
    { label: "Analysis", href: "/analysis" },
  ];

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-secondary container max-w-[90%] mx-auto">
      <div className="flex items-center space-x-8">
        <Link href="/" className="w-[120px] h-[45px] md:w-[160px] md:h-[60px] cursor-pointer relative" >
          <Image
            src={Logo}
            alt="logo"
            fill
            className="object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 hidden md:inline">Trade Status:</span>
          {isPending ? (
            <Skeleton className="h-10 w-[100px]" />
          ) : (
            <Select 
              value={tradeStatus} 
              onValueChange={handleTradeStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger
                className={`bg-gray-50 border ${
                  tradeStatus === "active" ? "border-green-600" : "border-red-400"
                } w-[100px]`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  className="text-green-600 hover:!text-green-600"
                >
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-gray-800">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
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
            <DropdownMenuItem>Account :  {isPending ? <Skeleton className="h-4 w-20" /> : name}</DropdownMenuItem>
            <div className="md:hidden">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.href}>
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
        className={`font-semibold inline-flex items-center relative group text-gray-700 hover:text-gray-900 ${
          isActive ? "text-black" : ""
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

export default Navbar;