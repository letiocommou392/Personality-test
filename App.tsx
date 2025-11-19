import React, { useState } from 'react';
import { FormSection } from './components/FormSection';
import { ResultsSection } from './components/ResultsSection';
import { AnalysisResult, FormData } from './types';
import { analyzePersonality } from './services/api';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzePersonality(data);
      setResults(analysis);
      setStep('results');
    } catch (err) {
      console.error(err);
      setError("Unable to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setResults(null);
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900 overflow-x-hidden">
      <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            P
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">PersonaFlow</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection 
                onSubmit={handleFormSubmit} 
                isLoading={loading} 
                error={error}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {results && (
                <ResultsSection 
                  data={results} 
                  onRetake={handleRetake} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} PersonaFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default App;