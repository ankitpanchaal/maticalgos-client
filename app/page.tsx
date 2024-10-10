"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo_black.png";

const LoginPage = () => {
  const [accountName, setAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const response = await fetch('/api/user/login', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          router.push("/dashboard/explore");
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // If there's an error, we stay on the login page
      }
    };

    checkExistingToken();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accountName) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/user/login?Acname=${encodeURIComponent(accountName)}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      router.push("/dashboard/explore");
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex items-center justify-center">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;