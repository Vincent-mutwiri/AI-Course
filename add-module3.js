const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://vincentmutwiri9:jp32OHoWtyW5Vxeh@cluster0.d7p5zeu.mongodb.net/townhall-icebreaker';

mongoose.connect(MONGODB_URI).then(async () => {
  const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
  
  const course = await Course.findById('68ece1c5f374af2510f87c63');
  
  course.modules.push({
    title: 'Technical Integration with AI',
    description: 'Integrate Inflection AI API into your platform',
    duration: 150,
    order: 3,
    lessons: [{
      title: 'AI Chatbot Implementation',
      description: 'Build a chatbot with conversation history',
      duration: 60
    }]
  });
  
  await course.save();
  console.log('Module 3 added successfully');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
