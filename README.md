# Notes Management System 📝

A full-stack application built to manage, organize, and search through personal notes with a high-performance backend and a responsive, modern frontend.

##  Deployment Links
- **Live Demo:** [https://noteflow-app-seven.vercel.app/](https://noteflow-app-seven.vercel.app/)
- **GitHub Repository:** [https://github.com/maniksharma22/notes-management-system](https://github.com/maniksharma22/notes-management-system)

##  Core Features
- **Notes Management:** Complete CRUD operations (Create, Read, Update, Delete).
- **Advanced Search:** Real-time search by Title and Content for efficient retrieval.
- **Smart Sorting:** Notes are automatically sorted by the most recently updated.
- **Pinning System (Bonus):** Pin important notes to keep them at the top of the list.
- **Rich Preview:** View note titles, content snippets, and precise IST timestamps.
- **Validation:** Strict validation to ensure titles are never empty with user-friendly error messages.
- **Responsive UI:** Fully optimized for mobile, tablet, and desktop experiences.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Spring Boot 3.x, Java 17, Spring Data JPA.
- **Database:** PostgreSQL (Hosted on Render).
- **Deployment:** Vercel (Frontend & API).

## Project Architecture
- **Package Structure:** `com.system.notes_management.model`
- **Frontend Components:** Modular architecture with `NoteList`, `AddNote`, and API service layers.
- **Database Schema:** Optimized for efficient CRUD and string-based searching.

## Backend Configuration (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://<your-render-host>/<your-db-name>?sslmode=require&serverTimezone=Asia/Kolkata
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jackson.time-zone=Asia/Kolkata
```

## 🛠 Installation & Setup

### 1. Clone the project
```bash
git clone [https://github.com/maniksharma22/notes-management-system.git](https://github.com/maniksharma22/notes-management-system.git)
cd notes-management-system


### 2. Backend Setup
# Update src/main/resources/application.properties with your credentials
mvn clean install
mvn spring-boot:run

### 3. Frontend Setup
# Open a new terminal in the frontend directory
npm install
npm run dev
