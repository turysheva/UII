
import React from 'react';
import type { TrendAnalysis } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { LinkIcon } from './icons/LinkIcon';

interface ResultsDisplayProps {
  isLoading: boolean;
  result: TrendAnalysis | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, result }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-brand-text-secondary">Ищу неочевидные связи...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Синтез речи не поддерживается в вашем браузере.');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Block 1: Main Insight */}
      <div className="bg-brand-surface/70 border border-brand-border rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-brand-text">Главный инсайт (Не для всех)</h2>
          <button
            onClick={() => handleSpeak(result.insight)}
            className="p-2 rounded-full hover:bg-brand-border transition-colors text-brand-text-secondary hover:text-brand-text"
            title="Озвучить инсайт"
          >
            <SpeakerIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed">{result.insight}</p>
      </div>

      {/* Block 2: Evidence */}
      <div className="bg-brand-surface/70 border border-brand-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-brand-text mb-4">Доказательства (Реальные ссылки)</h2>
        <ul className="space-y-3">
          {result.sources.map((source, index) => (
            <li key={index}>
              <a
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-brand-accent hover:text-brand-accent-hover transition-colors group"
              >
                <LinkIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-brand-accent-hover" />
                <span className="underline decoration-dotted underline-offset-4">{source.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Block 3: The Post */}
      <div className="bg-brand-surface/70 border border-brand-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-brand-text mb-4">Пост, который будут обсуждать</h2>
        <div className="bg-brand-bg p-4 rounded-md whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
          {result.post}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
