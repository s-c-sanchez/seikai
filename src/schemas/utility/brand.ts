import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"

declare const BRAND_SYMBOL: unique symbol

interface Brand<TBrand extends string> {
  [BRAND_SYMBOL]: TBrand
}

export interface BrandSchema<TSchema extends Schema<unknown>, TBrand extends string>
  extends Schema<Input<TSchema>, Output<TSchema> & Brand<TBrand>> {
  readonly type: "brand"
  readonly inner: TSchema
}

export interface BrandAsyncSchema<TSchema extends GenericSchema<unknown>, TBrand extends string>
  extends AsyncSchema<Input<TSchema>, Output<TSchema> & Brand<TBrand>> {
  readonly type: "brand"
  readonly inner: TSchema
}

export function brand<TSchema extends Schema<unknown>, TBrand extends string>(
  inner: TSchema,
  _brand: TBrand,
): BrandSchema<TSchema, TBrand> {
  return {
    "~run": (input, ctx, path) => {
      return inner["~run"](input, ctx, path) as Output<TSchema> & Brand<TBrand>
    },
    type: "brand",
    isAsync: false,
    inner,
  }
}

export function brandAsync<TSchema extends GenericSchema<unknown>, TBrand extends string>(
  inner: TSchema,
  _brand: TBrand,
): BrandAsyncSchema<TSchema, TBrand> {
  return {
    "~run": async (input, ctx, path) => {
      return (await inner["~run"](input, ctx, path)) as Output<TSchema> & Brand<TBrand>
    },
    type: "brand",
    isAsync: true,
    inner,
  }
}
