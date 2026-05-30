'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Send, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export default function InsuranceAgentDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF documents are supported.');
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !query.trim()) {
      setError('Please provide both an insurance document and a valid query.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process document.');
      }

      const data = await response.json();
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">InsureIntel AI</h1>
            <p className="text-xs text-slate-500">Agentic Insurance RAG & Regulatory Compliance Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <CheckCircle className="h-4 w-4" />
          <span>Backend Connected</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Document Upload</h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                file ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf" 
                className="hidden" 
              />
              <Upload className={`mx-auto h-10 w-10 mb-3 ${file ? 'text-emerald-500' : 'text-slate-400'}`} />
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-emerald-700 truncate max-w-xs mx-auto">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-700">Click to upload insurance policy</p>
                  <p className="text-xs text-slate-400 mt-1">Supports standard PDF formats</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Analysis Instructions</label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Identify core exclusions and cross-reference current 2026 flood mandates..."
                  rows={4}
                  className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 resize-none text-slate-800"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file || !query.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Agent Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Run Deep Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="bg-white min-h-[500px] rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Analysis Findings</h2>
            </div>

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">Executing Agentic Reasoning Loop</p>
                  <p className="text-xs text-slate-400 mt-1">Extracting document text, verifying compliance, and performing live web searches...</p>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                <FileText className="h-12 w-12 stroke-1 mb-2" />
                <p className="text-sm">Upload a policy and enter a query on the left to initialize analysis.</p>
              </div>
            )}

            {!loading && result && (
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                  {result}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}