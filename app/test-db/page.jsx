"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestDBPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const setupDatabase = async () => {
    setLoading(true);
    setStatus('Setting up database...');
    
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('Database setup successful!');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCVAnalysis = async () => {
    setLoading(true);
    setStatus('Testing CV analysis...');
    
    try {
      const testUserId = `test_user_${Date.now()}`;
      const testCVText = `
        John Doe
        Software Engineer
        john.doe@email.com
        +1-555-123-4567
        
        EDUCATION:
        Bachelor of Science in Computer Science
        Stanford University, 2020
        
        EXPERIENCE:
        Software Engineer at Google
        Jan 2021 - Present
        - Developed scalable web applications
        - Led team of 5 developers
        - Implemented CI/CD pipelines
        
        SKILLS:
        JavaScript, React, Node.js, Python, AWS
        
        LANGUAGES:
        English, Spanish
        
        CERTIFICATIONS:
        AWS Certified Developer
      `;
      
      const response = await fetch('/api/cv-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: testCVText,
          userId: testUserId,
          originalFileName: 'test_cv.pdf',
          extractedText: testCVText
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`CV analysis successful! Name: ${data.name}, Email: ${data.email}, Skills: ${data.skills?.join(', ')}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Database Test Page</h1>
      
      <div className="space-y-4">
        <Button
          onClick={setupDatabase}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Setting up...' : 'Setup Database Tables'}
        </Button>
        
        <Button
          onClick={testCVAnalysis}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test CV Analysis'}
        </Button>
      </div>
      
      {status && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  );
} 