const KIT_API_URL = 'https://api.kit.com/v4/subscribers';

interface SubscribeParams {
  email: string;
  firstName: string;
  fields: Record<string, string>;
}

export async function subscribeToKit({ email, firstName, fields }: SubscribeParams): Promise<void> {
  const apiKey = import.meta.env.PUBLIC_KIT_API_KEY;

  if (!apiKey || apiKey === 'your-kit-api-key-here') {
    console.warn('[Kit] No API key configured — skipping subscription.');
    return;
  }

  const response = await fetch(KIT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify({
      email_address: email,
      first_name: firstName,
      state: 'active',
      fields,
    }),
  });

  // 200 = updated, 201 = created, 202 = async processing
  if (response.ok) return;

  const errorBody = await response.json().catch(() => null);
  const message =
    errorBody?.errors?.[0]?.message ||
    errorBody?.message ||
    `Subscription failed (${response.status})`;

  throw new Error(message);
}
