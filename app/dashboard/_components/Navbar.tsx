'use client'
import React, { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { getAccount } from "../_actions";
import { useQuery } from "@tanstack/react-query";
import { AccountResponse } from "../type";

const Navbar = () => {
  const path = usePathname();
  const {logout} = useLogout();
  
  const { isPending, error, data } = useQuery<AccountResponse>({
    queryKey: ['repoData'],
    queryFn: getAccount,
  })
  const [tradeStatus, setTradeStatus] = useState(data?.data?.[0]?.Trade === "Y" ? "active" : "inactive");
  const name = data?.data?.[0]?.AccountName;

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-secondary container max-w-[90%] mx-auto">
      <div className="flex items-center space-x-8 w-1/4">
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            width={160}
            height={60}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex space-x-12">
        <Menu
          label="Explore"
          href="/explore"
          isActive={path.split("/").includes("explore")}
        />
        <Menu
          label="My Strategies"
          href="/my-strategies"
          isActive={path.split("/").includes("my-strategies")}
        />
        <Menu
          label="Analysis"
          href="/analysis"
          isActive={path.split("/").includes("analysis")}
        />
      </div>
      <div className="flex items-center space-x-4 w-1/4 justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Trade Status:</span>
          <Select value={tradeStatus} onValueChange={setTradeStatus}  >
            <SelectTrigger  className={`bg-gray-50 border ${tradeStatus === "active" ? "border-green-600" : "border-red-400"} w-[100px]`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="text-green-600 hover:!text-green-600" >
                Active
              </SelectItem>
              <SelectItem value="inactive" className="text-gray-800" >
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full" >
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
                alt={name}
              />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{name}</DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer hover:!text-red-600" >
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