import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from './ChangePasswordDialog';

interface ApiKeyFormProps {
    onLogout: () => void;
}

const ApiKeyForm = ({ onLogout }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleApiKeyTest = () => {
    // Implement API key test logic
    console.log('Testing API key:', apiKey);
  };

  const handleApiKeySubmit = () => {
    // Implement API key submission logic
    console.log('Submitting API key:', apiKey);
  };

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
        <Button onClick={handleApiKeyTest}>Test</Button>
        <Button onClick={handleApiKeySubmit}>Submit</Button>
      </div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline">
          Change Password
        </Button>
        <Button onClick={onLogout} variant="destructive">Logout</Button>
      </div>
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
};

export default ApiKeyForm;