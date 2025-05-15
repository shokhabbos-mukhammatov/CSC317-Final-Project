# Contributions – Trip Tuner (Group Project)

This section outlines our individual contributions to the development of **Trip Tuner**, a collaborative full-stack web application built in a team setting for CSC 317.

---

## Shokhabbos Mukhammatov – Contributions

###  AI Trip Planner Integration
- Developed the logic to capture user input (destination, dates, budget, preferences) and send it to the backend AI handler.
- Handled the connection with Azure OpenAI to receive HTML-formatted itineraries.
- Displayed the AI-generated trip plans dynamically within the user interface.

###  Contact Form + Nodemailer Integration
- Designed and implemented the "Contact Us" form layout and field structure.
- Integrated **Nodemailer** with Mailtrap for secure HTML email delivery.
- Added server-side validation, success/error messaging, and visual feedback.

###  Form Handling & Validation
- Built and styled the AI prompt form and contact form using clean, responsive HTML/CSS.
- Implemented client-side validation with real-time feedback using JavaScript.
- Ensured all form inputs were validated both on the frontend and backend.

###  UI Contributions
- Styled the homepage’s trip planner section and hero banner.
- Helped design a clean, card-based layout for the “About This Application” and “Technology Stack” sections. Followed guidelines and assistance of Meridian Helmantoler.

---

## Aketzali Zeledon - Contributions

### User Profile & Itinerary History Management
- Designed and implemented the User Profile Page to display user-specific information such as username, email, and registration date. 
- Integrated the History Model with Mongoose to store itinerary histories linked to specific users. The schema includes userId, location, itinerary, and createdAt.
- Made the accordion UI for viewing past itineraries, allowing users to expand and collapse each trip for a clean and organized display.

### History Controller Logic
Built out CRUD operations in the historyController, including:

- getHistory: Fetches all itineraries for the logged-in user and renders them in the profile view.
- deleteHistory: Implemented deletion logic using History.findByIdAndDelete, ensuring secure and smooth removal of itineraries from both the database and the UI.

### Route Handling
- Added new routes in the historyRoutes file to manage itinerary retrieval and deletion, following REST principles. Registered these routes within app.js for proper middleware handling and session control.


---

### Meridian Helmantoler - Contributions

### Layout Design
- Reworked pages to create a better flow with the UI and CSS design
- Helped to set up the pages and layout for the project
- Implemented about us page cards for the team profiles

### CSS style sheet
- Worked on CSS styling to persoanlize our project
- Cleaned up pages to work with CSS styling, adding in IDs, Class', div's, etc.

### Troubleshooting
- troubleshooting website pages and features
- going over code and checking in with teammates, making sure that code and files are intentional and checked for validation and bugs 
