import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, RotateCcw, CheckCircle, Target, Briefcase, Users, Lightbulb, Linkedin, Twitter } from 'lucide-react';
import { AnalysisResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultsSectionProps {
  data: AnalysisResult;
  onRetake: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ data, onRetake }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.userName}-personality-report.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const handleShare = (platform: 'linkedin' | 'twitter') => {
    const text = `I just discovered I'm a ${data.mbtiName} (${data.mbtiCode})! Check out PersonaFlow to find your type.`;
    const url = window.location.href;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Your Analysis</h2>
            <p className="text-slate-500">Hi {data.userName}! Here is your detailed report.</p>
        </div>
        <div className="flex gap-3">
             <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
        </div>
      </div>

      <motion.div 
        ref={printRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 bg-white md:bg-transparent" // White bg for clean PDF print
      >
        {/* Top Hero Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 md:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="relative z-10 inline-block bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 mb-4 border border-white/30"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest drop-shadow-sm">{data.mbtiCode}</h1>
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold relative z-10">{data.mbtiName}</h2>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                The {data.mbtiName} Personality
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {data.description}
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.traits}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={data.userName}
                    dataKey="A"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3 border-slate-100">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {data.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Growth Areas */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3 border-slate-100">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Areas for Growth
            </h3>
            <ul className="space-y-3">
              {data.weaknesses.map((weakness, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></span>
                  {weakness}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Careers */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3 border-slate-100">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Career Matches
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.careers.map((career, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {career}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Compatible Types */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3 border-slate-100">
              <Users className="w-5 h-5 text-pink-500" />
              Compatible Types
            </h3>
            <div className="flex gap-4">
              {data.compatibleTypes.map((type, i) => (
                <div key={i} className="flex-1 text-center p-3 bg-pink-50 rounded-xl border border-pink-100">
                  <span className="block font-bold text-pink-700">{type}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Personal Growth Tips (Full Width) */}
         <motion.div variants={itemVariants} className="bg-indigo-50 rounded-2xl border border-indigo-100 p-8">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Personal Growth Tips</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.growthTips.map((tip, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                      <span className="block text-2xl font-bold text-indigo-200 mb-2">0{i+1}</span>
                      <p className="text-slate-700 text-sm font-medium">{tip}</p>
                  </div>
                ))}
             </div>
         </motion.div>

      </motion.div>

      {/* Actions Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center border-t pt-8 border-slate-200"
      >
        <div className="flex gap-4">
          <button 
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Linkedin className="w-4 h-4" /> Share on LinkedIn
          </button>
          <button 
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Twitter className="w-4 h-4" /> Share on Twitter
          </button>
        </div>
        <button 
          onClick={onRetake}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-semibold"
        >
          <RotateCcw className="w-4 h-4" /> Take Test Again
        </button>
      </motion.div>
    </div>
  );
};