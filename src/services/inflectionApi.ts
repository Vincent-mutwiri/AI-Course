export const chatWithAI = async (message: string, userId: string) => {
  const response = await fetch('http://localhost:5000/api/inflection-ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from AI');
  }

  const data = await response.json();
  return data.response;
};
