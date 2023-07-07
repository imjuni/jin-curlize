/* eslint-disable @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/naming-convention */
export type JSONValue = string | number | boolean | JSONObject | JSONArray | undefined | null;

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}
