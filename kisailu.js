export function headers() {
  const h = {
    'content-type': 'application/json',
    'langcode': 'fi',
    'requestid': String(Date.now()),
    'x-api-key': process.env.KISAILU_API_KEY || '',
    'x-api-validation': process.env.KISAILU_API_VALIDATION || ''
  };
  if (process.env.KISAILU_AUTHORIZATION) h.authorization = process.env.KISAILU_AUTHORIZATION;
  return h;
}
