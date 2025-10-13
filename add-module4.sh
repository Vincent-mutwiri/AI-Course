#!/bin/bash
curl -X PUT http://localhost:5000/api/courses/68ece1c5f374af2510f87c63 \
  -H "Content-Type: application/json" \
  -d '{
    "modules": [
      {
        "_id": "68ece1c5f374af2510f87c64",
        "title": "Introduction to AI in Education",
        "description": "Understanding the role of AI in modern education",
        "order": 1,
        "lessons": [
          {"_id": "68ece1c5f374af2510f87c65", "title": "Welcome to the Course", "description": "Course overview", "duration": 15, "order": 1},
          {"_id": "68ece1c5f374af2510f87c66", "title": "The State of AI in EdTech", "description": "Current trends", "duration": 25, "order": 2}
        ]
      },
      {
        "_id": "68ece1c5f374af2510f87c67",
        "title": "Building AI-Powered Learning Platforms",
        "description": "Technical foundations for educational AI applications",
        "order": 2,
        "lessons": [
          {"_id": "68ece1c5f374af2510f87c68", "title": "Architecture of Learning Platforms", "description": "Designing scalable systems", "duration": 30, "order": 1},
          {"_id": "68ece1c5f374af2510f87c69", "title": "Integrating AI Components", "description": "Adding intelligence", "duration": 35, "order": 2}
        ]
      },
      {
        "_id": "68ecee092c54e55276fa863a",
        "title": "Technical Integration with AI",
        "description": "Integrate Inflection AI API into your platform",
        "order": 3,
        "lessons": [
          {"_id": "68ecee092c54e55276fa863b", "title": "AI Chatbot Implementation", "description": "Build a chatbot", "duration": 60, "order": 1}
        ]
      },
      {
        "title": "Building Interactive Course Components",
        "description": "Create AI-powered assessments and quizzes",
        "order": 4,
        "lessons": [
          {"title": "AI-Generated Quizzes", "description": "Dynamic quiz generation with AI", "duration": 45, "order": 1}
        ]
      }
    ]
  }'
