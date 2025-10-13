const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://vincentmutwiri9:jp32OHoWtyW5Vxeh@cluster0.d7p5zeu.mongodb.net/townhall-icebreaker';

mongoose.connect(MONGODB_URI).then(async () => {
  const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
  
  const allCourses = await Course.find({});
  console.log('All courses:', allCourses.map(c => ({ id: c._id.toString(), title: c.title })));
  
  const course = await Course.findOne({ _id: '68ece1c5f374af2510f87c63' });
  
  if (!course) {
    console.error('Course not found');
    process.exit(1);
  }
  
  console.log('Found course:', course.title);
  console.log('Current modules:', course.modules.length);
  
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
