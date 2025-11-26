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
