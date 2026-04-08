const KIT_API_BASE = 'https://api.kit.com/v4';

interface SubscribeParams {
  email: string;
  firstName: string;
  fields: Record<string, string>;
  formId?: number;
}

export async function subscribeToKit({ email, firstName, fields, formId }: SubscribeParams): Promise<void> {
  const apiKey = import.meta.env.PUBLIC_KIT_API_KEY;

  if (!apiKey || apiKey === 'your-kit-api-key-here') {
    console.warn('[Kit] No API key configured — skipping subscription.');
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Kit-Api-Key': apiKey,
  };

  // Create/update subscriber with custom fields
  const subResponse = await fetch(`${KIT_API_BASE}/subscribers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email_address: email,
      first_name: firstName,
      state: 'active',
      fields,
    }),
  });

  if (!subResponse.ok) {
    const errorBody = await subResponse.json().catch(() => null);
    const message =
      errorBody?.errors?.[0]?.message ||
      errorBody?.message ||
      `Subscription failed (${subResponse.status})`;
    throw new Error(message);
  }

  // Add subscriber to form if specified
  if (formId) {
    await fetch(`${KIT_API_BASE}/forms/${formId}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: email }),
    });
  }
}
