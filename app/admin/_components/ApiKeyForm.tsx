import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import toast from "react-hot-toast";

interface ApiKeyFormProps {
  onLogout: () => void;
}

const ApiKeyForm = ({ onLogout }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    // Check if API key is already stored
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/admin/check-api-key", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.isStored) {
          setApiKey("********");
        }
      } catch (error) {
        console.error("Error checking API key:", error);
      }
    };

    checkApiKey();
  }, []);

  const handleApiKeyTest = async () => {
    try {
      const response = await fetch("/api/admin/test-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to test API key");
      }
    } catch (error) {
      console.error("Error testing API key:", error);
      toast.error("An error occurred while testing the API key");
    }
  };

  const handleApiKeySubmit = async () => {
    try {
      const response = await fetch("/api/admin/submit-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setApiKey("********");
      } else {
        toast.error(data.message || "Failed to submit API key");
      }
    } catch (error) {
      console.error("Error submitting API key:", error);
      toast.error("An error occurred while submitting the API key");
    }
  };

  return (
    <>
      <Input
        type={"text"}
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
      <div className="flex justify-between mb-4">
        <Button
          onClick={handleApiKeyTest}
          disabled={apiKey.length === 0 || apiKey === "********"}
        >
          Test
        </Button>
        <Button
          onClick={handleApiKeySubmit}
          disabled={apiKey.length === 0 || apiKey === "********"}
        >
          Submit
        </Button>
      </div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline">
          Change Password
        </Button>
        <Button onClick={onLogout} variant="destructive">
          Logout
        </Button>
      </div>
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
};

export default ApiKeyForm;
