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
  }

  /**
   * Generate a WAS Bundle
   */
  async generateBundle(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await axios.post<GenerateResponse>(
        `${this.baseURL}/generate`,
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error?.message || 'Failed to generate bundle'
        );
      }
      throw error;
    }
  }

  /**
   * Get the system prompt
   */
  async getPrompt(): Promise<PromptResponse> {
    try {
      const response = await axios.get<PromptResponse>(
        `${this.baseURL}/prompt`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
    try {
      const response = await axios.get<ModelsResponse>(
        `${this.baseURL}/models`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
    try {
      const response = await axios.get<HealthResponse>(
        `${this.baseURL}/health`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error?.message || 'Failed to check health'
        );
      }
      throw error;
    }
  }
}

export const apiService = new APIService();
