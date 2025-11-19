import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { QUESTIONS } from '../constants';
import { FormData } from '../types';

interface FormSectionProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  error: string | null;
}

export const FormSection: React.FC<FormSectionProps> = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear specific error if it exists
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    
    if (!formData.name?.trim()) errors.push("Please enter your name.");
    QUESTIONS.forEach(q => {
      if (!formData[q.id]) errors.push(`Please answer: "${q.text}"`);
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSubmit(formData as FormData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
        >
          Discover Your <span className="text-primary">Personality Type</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 max-w-xl mx-auto"
        >
          Answer 5 quick questions to unlock your detailed Myers-Briggs personality analysis.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Display */}
        {(validationErrors.length > 0 || error) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-semibold mb-1">Please fix the following errors:</p>
              <ul className="list-disc pl-4 space-y-1">
                {error && <li>{error}</li>}
                {validationErrors.slice(0, 3).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {validationErrors.length > 3 && <li>...and {validationErrors.length - 3} more</li>}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Name Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
        >
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            First Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Alex"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
            disabled={isLoading}
          />
        </motion.div>

        {/* Questions */}
        {QUESTIONS.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-primary flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              {q.text}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((option) => (
                <label 
                  key={option} 
                  className={`
                    relative flex items-center p-4 rounded-xl cursor-pointer border-2 transition-all
                    ${formData[q.id] === option 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100'}
                  `}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    checked={formData[q.id] === option}
                    onChange={() => handleChange(q.id, option)}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${formData[q.id] === option ? 'border-primary' : 'border-slate-300'}`}>
                    {formData[q.id] === option && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`font-medium ${formData[q.id] === option ? 'text-primary' : 'text-slate-600'}`}>
                    {option}
                  </span>
                  {formData[q.id] === option && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 text-primary"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  )}
                </label>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Submit Button */}
        <div className="sticky bottom-6 z-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-primary/30 
              flex items-center justify-center gap-2 transition-all
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-primary hover:bg-indigo-500'}
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing your personality...
              </>
            ) : (
              <>
                Analyze My Personality
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};