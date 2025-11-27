/**
 * Website Aesthetic Schema (WAS) Bundle Types
 */

export interface WASBundle {
  meta: {
    intent_keywords: string[];
    reasoning_notes: string;
  };
  layer1_axes: {
    tone: string;
    lightness: string;
    color_strategy: string;
    geometry_depth: {
      shape: string;
      depth: string;
    };
    density: string;
    decoration: string;
  };
  layer2_styles?: Record<string, number>;
  layer3_lexicon?: {
    visual_atmosphere?: string;
    palette_trait?: string;
    surface_texture?: string;
    component_styling?: string;
    depth_technique?: string;
    typography_mechanics?: string;
    illustration_style?: string;
    motion_mechanics?: string;
  };
  layer4_trends?: Record<string, number>;
}

export interface ImageData {
  base64: string;
  mediaType: string;
}

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

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  recommended?: boolean;
  description?: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  environment: string;
  uptime: number;
  openRouterConfigured: boolean;
}
