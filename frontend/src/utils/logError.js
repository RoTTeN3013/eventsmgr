export default function logClientError(error) {
  fetch('http://localhost:8000/api/log-client-error', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: error?.toString?.() || 'Unknown error',
      stack: error?.stack || '',
      response: error.response?.data,
      status: error.response?.status,
    }),
  });
}