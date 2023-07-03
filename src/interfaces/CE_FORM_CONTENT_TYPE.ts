export const CE_FORM_CONTENT_TYPE = {
  MULTI_PART: 'multipart/form-data',
  URL_ENCODE: 'application/x-www-form-urlencoded',
  JSON: 'application/json',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/naming-convention
export type CE_FORM_CONTENT_TYPE = (typeof CE_FORM_CONTENT_TYPE)[keyof typeof CE_FORM_CONTENT_TYPE];
