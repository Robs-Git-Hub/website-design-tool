#!/usr/bin/env node
/**
 * WAS Bundle Validator
 *
 * Validates Website Aesthetic Schema (WAS) bundles against:
 * 1. Schema structure (using Zod)
 * 2. ID validity (styles, lexicon, trends exist in TOML instances)
 * 3. Enum validity (L1 axis values are valid)
 * 4. Range validity (weights are 0.0-1.0)
 *
 * Usage:
 *   npx tsx src/validators/bundle_validator.ts <bundle.json>
 *   npm run validate-bundle <bundle.json>
 */
import { z } from 'zod';
declare const wasBundleSchema: z.ZodObject<{
    meta: z.ZodObject<{
        bundle_id: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
        intent_summary: z.ZodString;
        intent_keywords: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        intent_summary: string;
        intent_keywords: string[];
        bundle_id?: string | undefined;
        created_at?: string | undefined;
    }, {
        intent_summary: string;
        intent_keywords: string[];
        bundle_id?: string | undefined;
        created_at?: string | undefined;
    }>;
    layer1_axes: z.ZodObject<{
        tone: z.ZodString;
        lightness: z.ZodString;
        color_strategy: z.ZodString;
        density: z.ZodString;
        decoration: z.ZodString;
        geometry_depth: z.ZodObject<{
            shape: z.ZodString;
            depth: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            shape: string;
            depth: string;
        }, {
            shape: string;
            depth: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        tone: string;
        lightness: string;
        color_strategy: string;
        density: string;
        decoration: string;
        geometry_depth: {
            shape: string;
            depth: string;
        };
    }, {
        tone: string;
        lightness: string;
        color_strategy: string;
        density: string;
        decoration: string;
        geometry_depth: {
            shape: string;
            depth: string;
        };
    }>;
    layer2_styles: z.ZodRecord<z.ZodString, z.ZodNumber>;
    layer3_lexicon: z.ZodObject<{
        visual_atmosphere: z.ZodOptional<z.ZodString>;
        palette_trait: z.ZodOptional<z.ZodString>;
        surface_texture: z.ZodOptional<z.ZodString>;
        component_styling: z.ZodOptional<z.ZodString>;
        typography_mechanics: z.ZodOptional<z.ZodString>;
        depth_technique: z.ZodOptional<z.ZodString>;
        motion_mechanics: z.ZodOptional<z.ZodString>;
        illustration_style: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        visual_atmosphere?: string | undefined;
        palette_trait?: string | undefined;
        surface_texture?: string | undefined;
        component_styling?: string | undefined;
        typography_mechanics?: string | undefined;
        depth_technique?: string | undefined;
        motion_mechanics?: string | undefined;
        illustration_style?: string | undefined;
    }, {
        visual_atmosphere?: string | undefined;
        palette_trait?: string | undefined;
        surface_texture?: string | undefined;
        component_styling?: string | undefined;
        typography_mechanics?: string | undefined;
        depth_technique?: string | undefined;
        motion_mechanics?: string | undefined;
        illustration_style?: string | undefined;
    }>;
    layer4_trends: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
}, "strip", z.ZodTypeAny, {
    meta: {
        intent_summary: string;
        intent_keywords: string[];
        bundle_id?: string | undefined;
        created_at?: string | undefined;
    };
    layer1_axes: {
        tone: string;
        lightness: string;
        color_strategy: string;
        density: string;
        decoration: string;
        geometry_depth: {
            shape: string;
            depth: string;
        };
    };
    layer2_styles: Record<string, number>;
    layer3_lexicon: {
        visual_atmosphere?: string | undefined;
        palette_trait?: string | undefined;
        surface_texture?: string | undefined;
        component_styling?: string | undefined;
        typography_mechanics?: string | undefined;
        depth_technique?: string | undefined;
        motion_mechanics?: string | undefined;
        illustration_style?: string | undefined;
    };
    layer4_trends: Record<string, number>;
}, {
    meta: {
        intent_summary: string;
        intent_keywords: string[];
        bundle_id?: string | undefined;
        created_at?: string | undefined;
    };
    layer1_axes: {
        tone: string;
        lightness: string;
        color_strategy: string;
        density: string;
        decoration: string;
        geometry_depth: {
            shape: string;
            depth: string;
        };
    };
    layer2_styles: Record<string, number>;
    layer3_lexicon: {
        visual_atmosphere?: string | undefined;
        palette_trait?: string | undefined;
        surface_texture?: string | undefined;
        component_styling?: string | undefined;
        typography_mechanics?: string | undefined;
        depth_technique?: string | undefined;
        motion_mechanics?: string | undefined;
        illustration_style?: string | undefined;
    };
    layer4_trends?: Record<string, number> | undefined;
}>;
export type WASBundle = z.infer<typeof wasBundleSchema>;
export type ValidationErrorType = 'json_structure' | 'schema_violation';
interface ValidationError {
    type: ValidationErrorType;
    path: string;
    message: string;
    severity: 'error' | 'warning';
}
declare class ValidationResult {
    errors: ValidationError[];
    warnings: ValidationError[];
    addError(path: string, message: string, type?: ValidationErrorType): void;
    addWarning(path: string, message: string, type?: ValidationErrorType): void;
    get isValid(): boolean;
    get hasWarnings(): boolean;
}
export declare class WASBundleValidator {
    private validationData;
    constructor(dataDir: string);
    validate(bundle: any): ValidationResult;
    private validateLayer1;
    private validateLayer2;
    private validateLayer3;
    private validateLayer4;
    /**
     * Format validation errors for LLM feedback
     * This is used to provide clear error messages to the LLM when retrying generation
     */
    static formatErrorsForLLM(errors: ValidationError[]): string;
}
export {};
//# sourceMappingURL=bundle_validator.d.ts.map