"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import ApiKeyForm from "./ApiKeyForm";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("adminToken");
      if (token) {
        try {
          const response = await fetch("/api/admin/auth/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            // If token is invalid, remove it from session storage
            sessionStorage.removeItem("adminToken");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          sessionStorage.removeItem("adminToken");
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto flex items-center h-screen ">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
          ) : (
            <ApiKeyForm onLogout={handleLogout} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
