'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MigratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runMigration = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/run-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#191011] mb-6">Database Migration</h1>
        
        <p className="text-gray-600 mb-6">
          This will create the UserConnections and Chat tables needed for the friend system.
        </p>
        
        <Button 
          onClick={runMigration}
          disabled={isLoading}
          className="w-full bg-[#be3144] hover:bg-[#a82a3d] mb-4"
        >
          {isLoading ? 'Running Migration...' : 'Run Migration'}
        </Button>
        
        {result && (
          <div className={`p-4 rounded-lg ${
            result.success 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? 'Success!' : 'Error'}
            </h3>
            <p className="text-sm">{result.message || result.error}</p>
            {result.details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Details</summary>
                <pre className="text-xs mt-2 whitespace-pre-wrap">{result.details}</pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 