# CSC317-Final-Project

#  Trip Tuner – AI Travel Itinerary Generator

**Trip Tuner** is a full-stack web application that lets users generate personalized, day-by-day travel itineraries powered by AI. It uses user preferences, destination, and travel dates to instantly create a trip plan. Users can also register, save, and manage their itineraries securely.

---

##  Features

-  AI-powered itinerary generation (Azure OpenAI / GPT-4)
-  User input form for destination, preferences, and travel budget
-  Authentication and user sessions
-  Save and delete previous trip histories
-  Upload profile images
-  Contact form (using Mailtrap + Nodemailer)
-  CSRF protection & password hashing
-  Responsive & accessible design


---

##  Technology Stack

| Layer      | Technologies                                     |
|------------|--------------------------------------------------|
| **Frontend**   | HTML, CSS, JavaScript (Vanilla), EJS               |
| **Backend**    | Node.js, Express.js                              |
| **Database**   | MongoDB, Mongoose                                |
| **AI**         | Azure OpenAI (GPT-4.1 via REST API)              |
| **Email**      | Nodemailer + Mailtrap                            |
| **Auth**       | express-session, bcrypt, CSRF protection         |

---

## Working deployed version

https://triptuner-1mqe.onrender.com

## Video Presentation

video1591583978.mp4 is our demo presentation video

##  Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/trip-tuner.git
cd trip-tuner

