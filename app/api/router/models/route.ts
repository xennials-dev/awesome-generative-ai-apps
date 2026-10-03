import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const routers = [
    {
      id: 'lm-studio',
      name: 'LM Studio (Local 127.0.0.1:1234)',
      type: 'local',
      baseUrl: 'http://127.0.0.1:1234/v1',
      defaultModel: 'qwen2.5-coder-7b-instruct',
      apiKey: process.env.LM_STUDIO_API_KEY || 'lm-studio',
      status: 'checking',
      models: [] as string[]
    },
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      type: 'local',
      baseUrl: 'http://localhost:11434/v1',
      defaultModel: 'llama3.2',
      apiKey: 'ollama',
      status: 'checking',
      models: [] as string[]
    },
    {
      id: 'nvidia-nim',
      name: 'NVIDIA NIM API Router',
      type: 'cloud-router',
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      defaultModel: 'meta/llama-3.1-70b-instruct',
      apiKey: process.env.MY_MODEL_API_KEY ? 'Configured (nvapi-***)' : '',
      rawApiKey: process.env.MY_MODEL_API_KEY || '',
      status: process.env.MY_MODEL_API_KEY ? 'ready' : 'needs_key',
      models: [
        'meta/llama-3.1-70b-instruct',
        'deepseek-ai/deepseek-r1',
        'nvidia/nemotron-4-340b-instruct',
        'mistralai/mixtral-8x22b-instruct-v0.1'
      ]
    },
    {
      id: 'gemini',
      name: 'Google Gemini Router',
      type: 'cloud-router',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      defaultModel: 'gemini-2.0-flash',
      apiKey: process.env.GEMINI_API_KEY ? 'Configured' : '',
      rawApiKey: process.env.GEMINI_API_KEY || '',
      status: process.env.GEMINI_API_KEY ? 'ready' : 'needs_key',
      models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash']
    },
    {
      id: 'openrouter',
      name: 'OpenRouter (Universal Gateway)',
      type: 'cloud-router',
      baseUrl: 'https://openrouter.ai/api/v1',
      defaultModel: 'auto',
      apiKey: process.env.OPENROUTER_API_KEY ? 'Configured' : '',
      rawApiKey: process.env.OPENROUTER_API_KEY || '',
      status: process.env.OPENROUTER_API_KEY ? 'ready' : 'needs_key',
      models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct']
    },
    {
      id: 'muapi',
      name: 'MuAPI Gateway (100+ Models)',
      type: 'cloud-router',
      baseUrl: 'https://api.muapi.ai/api/v1',
      defaultModel: 'google/gemini-2.5-flash',
      apiKey: process.env.MUAPI_API_KEY ? 'Configured' : '',
      rawApiKey: process.env.MUAPI_API_KEY || '',
      status: process.env.MUAPI_API_KEY ? 'ready' : 'optional',
      models: ['google/gemini-2.5-flash', 'flux-1-schnell', 'kling-v1', 'seedance-v2']
    }
  ];

  // Probe local LM Studio
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    let res = await fetch('http://127.0.0.1:1234/v1/models', { signal: controller.signal }).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch('http://localhost:1234/v1/models', { signal: controller.signal }).catch(() => null);
    }
    clearTimeout(timeout);
    if (res && res.ok) {
      const data = await res.json();
      routers[0].status = 'online';
      if (data.data && Array.isArray(data.data)) {
        routers[0].models = data.data.map((m: any) => m.id);
        if (routers[0].models.length > 0) {
          routers[0].defaultModel = routers[0].models[0];
        }
      }
    } else {
      routers[0].status = 'offline';
    }
  } catch {
    routers[0].status = 'offline';
  }

  // Probe local Ollama
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      routers[1].status = 'online';
      if (data.models && Array.isArray(data.models)) {
        routers[1].models = data.models.map((m: any) => m.name);
        if (routers[1].models.length > 0) {
          routers[1].defaultModel = routers[1].models[0];
        }
      }
    } else {
      routers[1].status = 'offline';
    }
  } catch {
    routers[1].status = 'offline';
  }

  return NextResponse.json({
    success: true,
    routers,
    activeLocalModelCount: routers.filter(r => r.status === 'online').length,
    activeCloudRouterCount: routers.filter(r => r.status === 'ready').length
  });
}
