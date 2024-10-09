"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/store/user/userStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo_black.png";

const LoginPage = () => {
  const [accountName, setAccountName] = useState("");
  const { setAccName } = useUserStore();

  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accountName) return;
    setAccName(accountName);
    router.push("/dashboard/explore");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="flex justify-center py-4 mb-8">
          <Image src={Logo} alt="logo" width={200} height={100} />
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login With Choice
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-center">
              <Button type="submit" className="w-full">
                LOGIN
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
