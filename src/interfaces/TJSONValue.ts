export type TJSONValue = string | number | boolean | IJSONObject | IJSONArray | undefined;

export interface IJSONObject {
  [x: string]: TJSONValue;
}

// eslint-disable-next-line
export interface IJSONArray extends Array<TJSONValue> {}
