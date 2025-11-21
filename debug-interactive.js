// Debug script to check interactive elements
console.log('Checking interactive elements...');

// Check if components exist
const components = [
  'PlayerTypeSimulator',
  'RewardScheduleDesigner', 
  'FlowChannelEvaluator',
  'AIGameMasterGenerator'
];

components.forEach(comp => {
  try {
    const element = document.querySelector(`[data-component="${comp}"]`);
    console.log(`${comp}: ${element ? 'Found' : 'Not found'}`);
  } catch (e) {
    console.log(`${comp}: Error - ${e.message}`);
  }
});

// Check for error messages
const errorElements = document.querySelectorAll('[class*="error"], [class*="red-"]');
console.log('Error elements found:', errorElements.length);
errorElements.forEach(el => console.log(el.textContent));