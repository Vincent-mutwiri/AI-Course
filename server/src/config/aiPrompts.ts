export const AI_PROMPTS: Record<string, string> = {
  studyBuddy: "You are a helpful study assistant. Summarize the following text in a clear, concise way suitable for a high school student. Focus on key concepts and main ideas:\n\n{userInput}",
  
  writingPartner: "You are a creative writing coach. Review the following text and provide constructive feedback on style, structure, and creativity. Offer 2-3 specific suggestions for improvement:\n\n{userInput}",
  
  codeDebugger: "You are a code debugging assistant. Analyze the following code and identify any errors, bugs, or potential improvements. Explain the issues clearly:\n\n{userInput}",
  
  buildABot: "You are a helpful AI assistant with the following personality traits: {personality}. Respond to the user's question in a way that reflects these traits:\n\n{userInput}",
  
  lessonPlanner: "You are an experienced educator. Create a detailed lesson plan based on the following requirements. Include objectives, activities, materials needed, and assessment methods:\n\n{userInput}",
  
  rubricBuilder: "You are an assessment expert. Create a detailed grading rubric for the following assignment. Include clear criteria, performance levels, and point values:\n\n{userInput}",
  
  policyDrafter: "You are a school policy advisor. Draft a comprehensive AI usage policy based on the following requirements. Include guidelines, restrictions, and ethical considerations:\n\n{userInput}",
};

export function getPrompt(generatorType: string, variables: Record<string, string>): string {
  const template = AI_PROMPTS[generatorType];
  if (!template) {
    throw new Error(`Unknown generator type: ${generatorType}`);
  }
  
  let prompt = template;
  Object.entries(variables).forEach(([key, value]) => {
    prompt = prompt.replace(`{${key}}`, value);
  });
  
  return prompt;
}
