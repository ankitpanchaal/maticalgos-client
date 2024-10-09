import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApiKey, submitApiKey, testApiKey } from "../_action";

interface ApiKeyFormProps {
  onLogout: () => void;
}

const ApiKeyForm = ({ onLogout }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading: isCheckingKey, data: apiKeyData } = useQuery({
    queryKey: ["apiKey"],
    queryFn: fetchApiKey,
  });
  useEffect(() => {
    if (apiKeyData?.isStored) {
      setApiKey("********");
    }
  }, [apiKeyData]);

  const testKeyMutation = useMutation({
    mutationFn: testApiKey,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      console.log("error :t>> ", error);
      toast.error(error.message || "Failed to test API key");
    },
  });

  const submitKeyMutation = useMutation({
    mutationFn: submitApiKey,
    onSuccess: (data) => {
      toast.success(data.message);
      setApiKey("********");
      queryClient.invalidateQueries({ queryKey: ["apiKey"] });
    },
    onError: (error) => {
      console.log("error :>> ", error);
      toast.error(error.message || "Failed to submit API key");
    },
  });

  const handleApiKeyTest = () => {
    testKeyMutation.mutate(apiKey);
  };

  const handleApiKeySubmit = () => {
    submitKeyMutation.mutate(apiKey);
  };

  if (isCheckingKey) {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
      <div className="flex justify-between mb-4">
        <Button
          onClick={handleApiKeyTest}
          disabled={
            testKeyMutation.isPending ||
            apiKey.length === 0 ||
            apiKey === "********"
          }
        >
          {testKeyMutation.isPending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : null}
          Test
        </Button>
        <Button
          onClick={handleApiKeySubmit}
          disabled={
            submitKeyMutation.isPending ||
            apiKey.length === 0 ||
            apiKey === "********"
          }
        >
          {submitKeyMutation.isPending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : null}
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
