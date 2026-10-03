'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Play, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Cpu, 
  ArrowUpRight, 
  Sparkles,
  Server,
  Zap,
  RefreshCw,
  Sliders,
  Database
} from 'lucide-react';
import { AIApp } from '../../data/apps';

interface QuickStartModalProps {
  app: AIApp | null;
  onClose: () => void;
}

interface RouterOption {
  id: string;
  name: string;
  type: string;
  baseUrl: string;
  defaultModel: string;
  apiKey: string;
  status: string;
  models: string[];
}

export default function QuickStartModal({ app, onClose }: QuickStartModalProps) {
  const [activeTab, setActiveTab] = useState<'run' | 'deploy'>('run');
  const [routers, setRouters] = useState<RouterOption[]>([]);
  const [selectedRouterId, setSelectedRouterId] = useState<string>('nvidia-nim');
  const [customBaseUrl, setCustomBaseUrl] = useState<string>('');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [port, setPort] = useState<number>(3001);
  const [testResult, setTestResult] = useState<{ testing: boolean; success?: boolean; latency?: number; msg?: string } | null>(null);
  const [launchStatus, setLaunchStatus] = useState<{ loading: boolean; launched?: boolean; error?: string; commands?: any } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Fetch available routers on mount
  useEffect(() => {
    async function loadRouters() {
      try {
        let routerList: RouterOption[] = [];
        const res = await fetch('/api/router/models');
        if (res.ok) {
          const data = await res.json();
          routerList = data.routers || [];
        }

        // Client-side LM Studio detection (vital when visiting from Vercel remote URL)
        try {
          const localCheck = await fetch('http://127.0.0.1:1234/v1/models', { mode: 'cors' }).catch(() => null);
          if (localCheck && localCheck.ok) {
            const localData = await localCheck.json();
            const localModels = localData.data?.map((m: any) => m.id) || [];
            const lmIndex = routerList.findIndex((r: any) => r.id === 'lm-studio');
            if (lmIndex !== -1) {
              routerList[lmIndex].status = 'online';
              if (localModels.length > 0) {
                routerList[lmIndex].models = localModels;
                routerList[lmIndex].defaultModel = localModels[0];
              }
            }
          }
        } catch {
          // Ignore mixed-content or blocked local check on pure cloud
        }

        setRouters(routerList);
        // Default to LM Studio if online, else first online/ready
        const lm = routerList.find((r: RouterOption) => r.id === 'lm-studio' && r.status === 'online');
        const active = lm || routerList.find((r: RouterOption) => r.status === 'online' || r.status === 'ready');
        if (active) {
          setSelectedRouterId(active.id);
          setCustomBaseUrl(active.baseUrl);
          setSelectedModel(active.defaultModel);
        }
      } catch (err) {
        console.error('Failed to load routers', err);
      }
    }
    loadRouters();
  }, []);

  const activeRouter = routers.find(r => r.id === selectedRouterId) || {
    id: 'lm-studio',
    name: 'LM Studio (Local 127.0.0.1:1234)',
    type: 'local',
    baseUrl: customBaseUrl || 'http://127.0.0.1:1234/v1',
    defaultModel: selectedModel || 'qwen2.5-coder-7b-instruct',
    apiKey: customApiKey || 'lm-studio',
    status: 'online',
    models: ['qwen2.5-coder-7b-instruct', 'google/gemma-4-e4b']
  };

  const handleRouterChange = (routerId: string) => {
    setSelectedRouterId(routerId);
    const r = routers.find(item => item.id === routerId);
    if (r) {
      setCustomBaseUrl(r.baseUrl);
      setSelectedModel(r.defaultModel);
      setTestResult(null);
    }
  };

  const testConnection = async () => {
    setTestResult({ testing: true });
    const targetUrl = customBaseUrl || activeRouter.baseUrl;
    const targetModel = selectedModel || activeRouter.defaultModel;
    const targetKey = customApiKey || (activeRouter as any).rawApiKey || activeRouter.apiKey || 'lm-studio';

    try {
      const res = await fetch('/api/router/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: targetUrl,
          apiKey: targetKey,
          model: targetModel
        })
      });
      let data = await res.json();

      // If server probe failed because we are running on Vercel cloud and targeting 127.0.0.1, fallback to client-side direct ping
      if (!data.success && (targetUrl.includes('127.0.0.1') || targetUrl.includes('localhost'))) {
        try {
          const directStart = Date.now();
          const endpoint = targetUrl.endsWith('/') ? `${targetUrl}chat/completions` : `${targetUrl}/chat/completions`;
          const directRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: targetModel,
              messages: [{ role: 'user', content: 'Ping' }],
              max_tokens: 10
            })
          });
          if (directRes.ok) {
            const directData = await directRes.json();
            const latency = Date.now() - directStart;
            const reply = directData.choices?.[0]?.message?.content || 'Pong (OK)';
            data = { success: true, latency, reply };
          }
        } catch {
          // retain original error message
        }
      }

      if (data.success) {
        setTestResult({
          testing: false,
          success: true,
          latency: data.latency,
          msg: `Online! Latency: ${data.latency}ms - Reply: "${data.reply}"`
        });
      } else {
        setTestResult({
          testing: false,
          success: false,
          msg: data.error || 'Connection failed'
        });
      }
    } catch (err: any) {
      setTestResult({
        testing: false,
        success: false,
        msg: err.message
      });
    }
  };

  const handleLaunch = async (autoStart: boolean) => {
    if (!app?.localPath) return;
    setLaunchStatus({ loading: true });

    try {
      const res = await fetch('/api/launcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appName: app.name,
          localPath: app.localPath,
          routerId: selectedRouterId,
          baseUrl: customBaseUrl || activeRouter.baseUrl,
          apiKey: customApiKey || (activeRouter as any).rawApiKey || activeRouter.apiKey,
          model: selectedModel || activeRouter.defaultModel,
          port,
          autoStart
        })
      });

      const data = await res.json();
      if (data.success) {
        setLaunchStatus({
          loading: false,
          launched: data.launched,
          commands: data.commands
        });
      } else {
        setLaunchStatus({
          loading: false,
          error: data.error || 'Failed to configure app'
        });
      }
    } catch (err: any) {
      setLaunchStatus({
        loading: false,
        error: err.message
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (!app) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="card-category-badge">{app.categoryLabel}</span>
              {app.hasLocalCode && (
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={13} /> Ready in Workspace
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {app.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {app.tagline}
            </p>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'run' ? 'active' : ''}`}
            onClick={() => setActiveTab('run')}
          >
            <Play size={16} />
            <span>Run Locally & Router</span>
          </button>
          <button 
            className={`modal-tab ${activeTab === 'deploy' ? 'active' : ''}`}
            onClick={() => setActiveTab('deploy')}
          >
            <Globe size={16} />
            <span>Deploy to Production</span>
          </button>
        </div>

        {/* Tab 1: Run Locally & Model Router */}
        {activeTab === 'run' && (
          <div className="modal-body">
            {/* AI Model Router Selector */}
            <div className="modal-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={16} style={{ color: 'var(--primary)' }} />
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Select AI Engine / Model Router
                  </label>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Use local LLM or cloud API router
                </span>
              </div>

              {/* Router Selector Cards */}
              <div className="router-grid">
                {routers.map(r => (
                  <div 
                    key={r.id}
                    onClick={() => handleRouterChange(r.id)}
                    className={`router-card ${selectedRouterId === r.id ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f1f5f9' }}>{r.name}</span>
                      <span className={`status-pill ${r.status}`}>
                        {r.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.baseUrl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Router Settings */}
              <div className="router-config-box">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                      Base URL
                    </label>
                    <input 
                      type="text" 
                      value={customBaseUrl} 
                      onChange={e => setCustomBaseUrl(e.target.value)}
                      placeholder="http://localhost:1234/v1"
                      className="modal-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                      Target Model
                    </label>
                    <input 
                      type="text" 
                      value={selectedModel} 
                      onChange={e => setSelectedModel(e.target.value)}
                      placeholder="e.g. deepseek-r1, llama3.2"
                      className="modal-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <button 
                    onClick={testConnection} 
                    disabled={testResult?.testing}
                    className="btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    <RefreshCw size={13} className={testResult?.testing ? 'spinning' : ''} />
                    <span>{testResult?.testing ? 'Testing Endpoint...' : 'Test Connection'}</span>
                  </button>

                  {testResult && (
                    <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: testResult.success ? '#34d399' : '#f87171' }}>
                      {testResult.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      <span>{testResult.msg}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Settings */}
            <div className="modal-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Server size={16} style={{ color: '#38bdf8' }} />
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Local Execution Port
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Port:</span>
                  <input 
                    type="number" 
                    value={port} 
                    onChange={e => setPort(Number(e.target.value))}
                    className="modal-input"
                    style={{ width: '80px', padding: '0.3rem 0.5rem', textAlign: 'center' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleLaunch(true)} 
                  disabled={launchStatus?.loading}
                  className="btn-primary"
                  style={{ justifyContent: 'center', padding: '0.75rem' }}
                >
                  <Play size={16} />
                  <span>{launchStatus?.loading ? 'Starting...' : `1-Click Run (Port ${port})`}</span>
                </button>

                <button 
                  onClick={() => handleLaunch(false)} 
                  disabled={launchStatus?.loading}
                  className="btn-secondary"
                  style={{ justifyContent: 'center', padding: '0.75rem' }}
                >
                  <Sliders size={16} />
                  <span>Configure .env Only</span>
                </button>
              </div>

              {/* Success / Launch Status */}
              {launchStatus?.launched && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} />
                    <span>App is starting in the background on <strong>http://localhost:{port}</strong></span>
                  </div>
                  <a 
                    href={`http://localhost:${port}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-card-demo"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    <span>Open App</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              )}

              {launchStatus?.error && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  {launchStatus.error}
                </div>
              )}

              {/* CLI Command Box */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    Terminal Command (If running manually in PowerShell / CMD):
                  </span>
                  <button 
                    onClick={() => copyToClipboard(`cd ${app.localPath}; npm install; npx prisma db push; npm run dev -- -p ${port}`, 'main')}
                    className="btn-ghost"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  >
                    <Copy size={12} />
                    <span>{copiedCmd === 'main' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <pre className="code-block" style={{ fontSize: '0.75rem', padding: '0.65rem' }}>
{`cd "${app.localPath}"
npm install
npx prisma db push
npm run dev -- -p ${port}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deploy to Production */}
        {activeTab === 'deploy' && (
          <div className="modal-body">
            {/* Vercel 1-Click */}
            <div className="deploy-option-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    1. Deploy to Vercel (Recommended)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Instant cloud hosting with serverless functions and edge caching.
                  </p>
                </div>
                <a 
                  href={`https://vercel.com/new/git/external?repository-url=https://github.com/xennials-dev/awesome-generative-ai-apps&root-directory=${encodeURIComponent(app.localPath || '')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                >
                  <span>Deploy to Vercel</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Hostinger / VPS 1-Command Deploy */}
            <div className="deploy-option-card">
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  2. Deploy to KVM VPS / Hostinger
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Use the universal 1-command deployer with automatic Nginx reverse proxy and Let's Encrypt SSL:
                </p>
                <div style={{ position: 'relative' }}>
                  <pre className="code-block" style={{ fontSize: '0.75rem', padding: '0.65rem' }}>
{`deploy-app https://github.com/xennials-dev/awesome-generative-ai-apps myapp.domain.com`}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(`deploy-app https://github.com/xennials-dev/awesome-generative-ai-apps myapp.domain.com`, 'vps')}
                    className="btn-ghost"
                    style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  >
                    <Copy size={12} />
                    <span>{copiedCmd === 'vps' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Docker Container */}
            <div className="deploy-option-card">
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  3. Docker Container
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Run in an isolated container configured with your model router:
                </p>
                <div style={{ position: 'relative' }}>
                  <pre className="code-block" style={{ fontSize: '0.75rem', padding: '0.65rem' }}>
{`docker build -t ${app.id} "${app.localPath}"
docker run -p 3001:3000 -e OPENAI_BASE_URL="${customBaseUrl || activeRouter.baseUrl}" ${app.id}`}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(`docker build -t ${app.id} "${app.localPath}" && docker run -p 3001:3000 ${app.id}`, 'docker')}
                    className="btn-ghost"
                    style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  >
                    <Copy size={12} />
                    <span>{copiedCmd === 'docker' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
