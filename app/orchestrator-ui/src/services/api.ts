/**
 * Backend API Service
 *
 * Handles all communication with the WAS Orchestrator backend API
 */

import axios from 'axios';
import type { WASBundle } from '../types/was';
import type { ImageData } from './openrouter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export interface GenerateRequest {
  userInput: string;
  model?: string;
  image?: ImageData;
}

export interface GenerateResponse {
  bundle: WASBundle;
  generationTime: number;
  model: string;
}

export interface PromptResponse {
  prompt: string;
  lastModified: number;
  version: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  recommended?: boolean;
  description?: string;
}

export interface ModelsResponse {
  models: ModelInfo[];
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  openRouterConfigured: boolean;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    console.log('[API] Initialized with base URL:', this.baseURL);
  }

  /**
   * Generate a WAS Bundle
   */
  async generateBundle(request: GenerateRequest): Promise<GenerateResponse> {
    const startTime = Date.now();
    const url = `${this.baseURL}/generate`;

    console.log('[API] POST /generate - Request:', {
      url,
      model: request.model,
      inputLength: request.userInput.length,
      hasImage: !!request.image,
    });

    try {
      const response = await axios.post<GenerateResponse>(url, request);
      const duration = Date.now() - startTime;

      console.log('[API] POST /generate - Success:', {
        duration: `${duration}ms`,
        generationTime: response.data.generationTime,
        model: response.data.model,
      });

      return response.data;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (axios.isAxiosError(error)) {
        console.error('[API] POST /generate - Error:', {
          duration: `${duration}ms`,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.response?.data?.error?.message || error.message,
          url,
        });

        throw new Error(
          error.response?.data?.error?.message || 'Failed to generate bundle'
        );
      }

      console.error('[API] POST /generate - Unknown Error:', {
        duration: `${duration}ms`,
        error,
      });

      throw error;
    }
  }

  /**
   * Get the system prompt
   */
  async getPrompt(): Promise<PromptResponse> {
    const url = `${this.baseURL}/prompt`;
    console.log('[API] GET /prompt - Request:', { url });

    try {
      const response = await axios.get<PromptResponse>(url);
      console.log('[API] GET /prompt - Success:', {
        promptLength: response.data.prompt.length,
        version: response.data.version,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[API] GET /prompt - Error:', {
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
        });
        throw new Error(
          error.response?.data?.error?.message || 'Failed to load prompt'
        );
      }
      throw error;
    }
  }

  /**
   * Get available models
   */
  async getModels(): Promise<ModelsResponse> {
    const url = `${this.baseURL}/models`;
    console.log('[API] GET /models - Request:', { url });

    try {
      const response = await axios.get<ModelsResponse>(url);
      console.log('[API] GET /models - Success:', {
        count: response.data.models.length,
        models: response.data.models.map(m => m.id),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[API] GET /models - Error:', {
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
        });
        throw new Error(
          error.response?.data?.error?.message || 'Failed to load models'
        );
      }
      throw error;
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<HealthResponse> {
    const url = `${this.baseURL}/health`;
    console.log('[API] GET /health - Request:', { url });

    try {
      const response = await axios.get<HealthResponse>(url);
      console.log('[API] GET /health - Success:', {
        status: response.data.status,
        uptime: `${response.data.uptime}s`,
        openRouterConfigured: response.data.openRouterConfigured,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[API] GET /health - Error:', {
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
          details: 'Backend API may not be running. Check console for details.',
        });
        throw new Error(
          error.response?.data?.error?.message || 'Failed to check health'
        );
      }
      throw error;
    }
  }
}

export const apiService = new APIService();
