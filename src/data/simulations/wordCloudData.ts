export const lesson2_2_Cloud = {
  words: [
    { text: 'Choice', value: 85 },
    { text: 'Hands-On', value: 92 },
    { text: 'PictoBlox', value: 70 },
    { text: 'Real-World', value: 78 },
    { text: 'Solving Problems', value: 60 },
    { text: 'Teamwork', value: 55 },
    { text: 'Projects', value: 80 },
    { text: 'Freedom', value: 40 },
    { text: 'Creativity', value: 65 },
    { text: 'Collaboration', value: 58 },
    { text: 'Impact', value: 72 },
    { text: 'Discovery', value: 68 },
  ],
  mappings: {
    'Choice': 'Autonomy',
    'Freedom': 'Autonomy',
    'Hands-On': 'Mastery',
    'PictoBlox': 'Mastery',
    'Projects': 'Mastery',
    'Discovery': 'Mastery',
    'Solving Problems': 'Purpose',
    'Real-World': 'Purpose',
    'Teamwork': 'Purpose',
    'Collaboration': 'Purpose',
    'Impact': 'Purpose',
    'Creativity': 'Autonomy',
  } as Record<string, string>
};

// Add more word cloud data as needed
export const moduleCompletionCloud = {
  words: [
    { text: 'Engaged', value: 90 },
    { text: 'Motivated', value: 85 },
    { text: 'Curious', value: 75 },
    { text: 'Confident', value: 80 },
    { text: 'Empowered', value: 70 },
  ],
  mappings: {
    'Engaged': 'Active Learning',
    'Motivated': 'Intrinsic Drive',
    'Curious': 'Purpose',
    'Confident': 'Mastery',
    'Empowered': 'Autonomy',
  } as Record<string, string>
};
