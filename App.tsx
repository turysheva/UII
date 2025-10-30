
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { fetchTrendAnalysis } from './services/geminiService';
import type { TrendAnalysis } from './types';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrendAnalysis | null>(null);

  const handleAnalysisRequest = useCallback(async (newTopic: string) => {
    if (!newTopic.trim()) {
      setError('Пожалуйста, введите тему.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    setTopic(newTopic);

    try {
      const analysisResult = await fetchTrendAnalysis(newTopic);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <InputForm onSubmit={handleAnalysisRequest} isLoading={isLoading} />
          <div className="mt-12">
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">{error}</div>}
            <ResultsDisplay isLoading={isLoading} result={result} />
          </div>
        </main>
        <footer className="text-center mt-12 text-brand-text-secondary text-sm">
          <p>Trend Scout AI &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
