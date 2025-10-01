import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { movieApi } from '@/services/api';

export const APITest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing API...');
    
    try {
      console.log('🧪 Testing TMDB API...');
      const result = await movieApi.getPopular(1);
      console.log('🧪 API Test Result:', result);
      
      if (result && result.results && result.results.length > 0) {
        setTestResult(`✅ API Working! Found ${result.results.length} popular movies`);
      } else {
        setTestResult('❌ API returned empty results');
      }
    } catch (error) {
      console.error('🧪 API Test Error:', error);
      setTestResult(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">API Test</h1>
        
        <div className="bg-netflix-surface rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">TMDB API Status</h2>
          
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-netflix-red border-t-transparent"></div>
              <span className="text-gray-300">Testing API connection...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {testResult.includes('✅') ? (
                <Alert className="border-green-500 bg-green-500/10">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-400">
                    {testResult}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    {testResult}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button onClick={testAPI} disabled={isLoading}>
                {isLoading ? 'Testing...' : 'Test Again'}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-netflix-surface rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Information</h2>
          <div className="text-gray-300 space-y-2">
            <p><strong>API Base URL:</strong> https://api.themoviedb.org/3</p>
            <p><strong>API Key:</strong> {import.meta.env.VITE_TMDB_API_KEY ? 'Present' : 'Missing'}</p>
            <p><strong>Fallback Key:</strong> b8058a3ca0209dfabe0a564646dc1a46</p>
          </div>
        </div>
      </div>
    </div>
  );
};




