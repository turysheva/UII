import React, { useState } from 'react';
import { MicIcon } from './icons/MicIcon';

interface InputFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topic);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Введите тему, например, 'будущее удаленной работы' или 'ИИ в биотехе'..."
          className="w-full p-4 pr-12 text-base bg-brand-surface border border-brand-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors duration-200 resize-none text-brand-text placeholder-brand-text-secondary"
          rows={2}
          disabled={isLoading}
        />
        <div className="absolute top-0 right-0 h-full flex items-center pr-3">
          <button
              type="button"
              className="p-2 text-brand-text-secondary hover:text-brand-text transition-colors"
              title="Голосовой ввод (скоро)"
              disabled
            >
              <MicIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="mt-4 w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isLoading ? 'Анализирую...' : 'Найти скрытый тренд'}
      </button>
    </form>
  );
};

export default InputForm;