/**
 * Website Aesthetic Schema (WAS) Bundle Types
 */

export interface WASBundle {
  meta: {
    bundle_id: string; // Programmatically injected
    created_at: string; // Programmatically injected (ISO-8601)
    intent_summary: string; // LLM-generated
    intent_keywords: string[]; // LLM-generated
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
  layer2_styles?: Record<string, number>; // Weights 0.0-1.0
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
  layer4_trends?: Record<string, number>; // Weights 0.0-1.0 (like layer2_styles)
}

/**
 * Validation Error Types
 */
export type ValidationErrorType = 'json_structure' | 'schema_violation';

export interface ValidationError {
  type: ValidationErrorType;
  path?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

/**
 * Model Capabilities
 */
export interface ModelCapabilities {
  supportsStructuredOutput: boolean;
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
  reasoning: string | null;
  feedback: string | null;
  validation: ValidationResult;
  modelCapabilities: ModelCapabilities;
  generationTime: number;
  model: string;
  attempts: number;
  initialValidationErrors?: ValidationError[] | null; // Errors from first attempt (if retries were needed)
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
