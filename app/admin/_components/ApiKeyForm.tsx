import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ApiKeyFormProps {
    onLogout: () => void;
}

const ApiKeyForm = ({ onLogout }:ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');

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
      <Button onClick={onLogout} className="w-full">Logout</Button>
    </>
  );
};

export default ApiKeyForm;