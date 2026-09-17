import { z } from "zod";

// ============================================================================
// Edamam API Response Schemas
// ============================================================================

export const ImageSizeSchema = z.object({
  url: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const NutrientSchema = z.object({
  label: z.string(),
  quantity: z.number(),
  unit: z.string(),
});

export const IngredientSchema = z.object({
  text: z.string(),
  quantity: z.number(),
  measure: z.string(),
  food: z.string(),
  weight: z.number(),
  foodCategory: z.string(),
  image: z.string(),
});

export const EdamamRecipeSchema = z.object({
  uri: z.string(),
  label: z.string(),
  image: z.string().url().optional(),
  images: z.object({
    THUMBNAIL: ImageSizeSchema.optional(),
    SMALL: ImageSizeSchema.optional(),
    REGULAR: ImageSizeSchema.optional(),
    LARGE: ImageSizeSchema.optional(),
  }),
  source: z.string(),
  url: z.string().url(),
  shareAs: z.string(),
  yield: z.number(),
  dietLabels: z.array(z.string()),
  healthLabels: z.array(z.string()),
  cautions: z.array(z.string()),
  ingredientLines: z.array(z.string()),
  ingredients: z.array(IngredientSchema),
  calories: z.number(),
  totalWeight: z.number(),
  totalTime: z.number(),
  cuisineType: z.array(z.string()),
  mealType: z.array(z.string()),
  dishType: z.array(z.string()),
  totalNutrients: z.record(z.string(), NutrientSchema),
  totalDaily: z.record(z.string(), NutrientSchema),
});

export const RecipeHitSchema = z.object({
  recipe: EdamamRecipeSchema,
  _links: z.object({
    self: z.object({
      href: z.string(),
      title: z.string(),
    }),
  }),
});

export const EdamamResponseSchema = z.object({
  from: z.number().int(),
  to: z.number().int(),
  count: z.number().int(),
  _links: z.object({
    next: z
      .object({
        href: z.string(),
        title: z.string(),
      })
      .optional(),
  }),
  hits: z.array(RecipeHitSchema),
});

// ============================================================================
// Filter Params Schema
// ============================================================================

export const FilterParamsSchema = z.object({
  q: z.string().optional(),
  mealType: z.array(z.string()).optional(),
  health: z.array(z.string()).optional(),
  diet: z.array(z.string()).optional(),
  cuisineType: z.array(z.string()).optional(),
  dishType: z.array(z.string()).optional(),
  calories: z.string().optional(),
  time: z.string().optional(),
  ingr: z.string().optional(),
  skip: z.string().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

export function validateEdamamResponse(data: unknown): z.infer<typeof EdamamResponseSchema> {
  return EdamamResponseSchema.parse(data);
}

export function validateFilterParams(data: unknown): z.infer<typeof FilterParamsSchema> {
  return FilterParamsSchema.parse(data);
}

export function safeParseEdamamResponse(data: unknown) {
  return EdamamResponseSchema.safeParse(data);
}

export function safeParseFilterParams(data: unknown) {
  return FilterParamsSchema.safeParse(data);
}

// ============================================================================
// Type Exports (inferred from schemas)
// ============================================================================

export type ImageSize = z.infer<typeof ImageSizeSchema>;
export type Nutrient = z.infer<typeof NutrientSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type EdamamRecipe = z.infer<typeof EdamamRecipeSchema>;
export type RecipeHit = z.infer<typeof RecipeHitSchema>;
export type EdamamResponse = z.infer<typeof EdamamResponseSchema>;
export type FilterParams = z.infer<typeof FilterParamsSchema>;
