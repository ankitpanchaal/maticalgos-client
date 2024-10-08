import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const Navbar = ({ name = "User", isActive = true }) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-secondary container mx-auto">
      <div className="flex items-center space-x-8 w-1/4">
        <Link href="/" className="text-xl font-bold">
          LOGO
        </Link>
      </div>
      <div className="flex space-x-6">
        <Menu label="Explore" href="/explore" />
        <Menu label="My Strategies" href="/my-strategies" />
        <Menu label="Analysis" href="/analysis" />
      </div>
      <div className="flex items-center space-x-4 w-1/4 justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Trade Status:</span>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
            alt={name}
          />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;

const Menu = ({ label, href }: { label: string; href: string }) => {
  return (
    <Link href={`dashboard${href}`} passHref>
      <span className="font-semibold inline-flex items-center relative group text-gray-800 hover:text-gray-90">
        {label}
        {/* <ArrowRight
          className="ml-1 opacity-0 -translate-x-2 transition-all duration-300 ease-in-out group-hover:opacity-100 text-primary group-hover:translate-x-1"
          size={16}
        /> */}
        <span className="absolute bottom-0 left-0 w-full h-px bg-primary transform origin-left transition-all duration-300 ease-in-out scale-x-0 group-hover:scale-x-100"></span>
      </span>
    </Link>
  );
};
