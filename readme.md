# AI-QUIZ Backend

This is the backend for an AI-Quiz application built using **Node.js**, **Express**, **MongoDB**, and **JWT**. The application allows users to register, log in, and participate in quizzes. The results are stored in the database, and users can filter their submission history based on marks, subject, and grade level.

## Tech Stack

- **Node.js** - JavaScript runtime for building the backend
- **Express.js** - Web framework for building RESTful APIs
- **MongoDB** - NoSQL database for storing data
- **JWT (JSON Web Tokens)** - Used for token-based authentication
- **bcrypt.js** - For hashing passwords before storing them in the database

## Features

- **User Authentication**: 
  - Users can register with a username and password. The password is hashed before storage using **bcrypt.js**.
  - Users can log in with their credentials, and if authenticated, a **JWT** token is generated to identify the user in subsequent requests.

- **Quiz Management**:
  - Admins can generate quizzes that consist of questions, options, and the correct answers.

- **Quiz Submission**:
  - Users can submit quizzes, and their answers are stored along with the calculated score.
  - Each submission is linked to the user and the quiz.

- **History of Submissions**:
  - Users can check the history of their submissions with filters such as marks, grade level, and subject.
  - The history is available only for logged-in users.


## Folder Structure

```

AI-QUIZ/├── node_modules/ # Installed npm packages (auto-generated) 
        ├── src/ # Main application source code 
        │ ├── config/ # Configuration files (e.g., database connection, environment setup) 
        │ ├── controllers/ # Controller functions handling request and response logic 
        │ ├── middleware/ # Middleware functions (e.g., authentication) 
        │ ├── models/ # Mongoose models for database schemas 
        │ ├── routes/ # API route definitions 
        │ └── app.js # Entry point of the application 
        ├── .env # Environment variables (e.g., database URI, secret keys) 
        ├── package-lock.json # Dependency tree (auto-generated) 
        ├── package.json # Project metadata and dependencies 
        └── readme.md # Project documentation

```

## Database Models

There are 3 main database models used in this project:

1. **User Model**: Stores user information including username, password (hashed), and grade level.
2. **Quiz Model**: Stores quiz questions, options, the correct answer, subject, and grade level.
3. **QuizSubmission Model**: Stores submission details like the quiz taken, user's answers, score, and attempt number.

---

## API Endpoints

The following table provides an overview of the API endpoints:

| **Endpoint**               | **Method** | **Description**                                            | **Authentication** | **Request Body / Query Parameters**                                                  | **Response**                                                                 |
|-----------------------------|------------|------------------------------------------------------------|--------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `/api/auth/register`        | `POST`     | Register a new user                                         | No                 | `{ "username": "john_doe", "password": "yourpassword" }`                            | `{ "message": "User registered successfully" }`                             |
| `/api/auth/login`           | `POST`     | Log in a user and generate a JWT token                     | No                 | `{ "username": "john_doe", "password": "yourpassword" }`                            | `{ "token": "your_jwt_token" }`                                             |
| `/api/quiz/create`          | `POST`     | Create a new quiz                                           | Yes                | `{ "subject": "Math", "gradeLevel": "9", "questions": [...] }`                      | `{ "message": "Quiz created successfully" }`                                |
| `/api/quiz/submit`          | `POST`     | Submit answers to a quiz and calculate the score           | Yes                | `{ "quizId": "quiz123", "answers": [1, 0, 2, 1], "userId": "user456" }`             | `{ "submission": { "quizId": "...", "score": 30, ... } }`                   |
| `/api/quiz/history`         | `GET`      | Fetch all quiz submissions for the logged-in user          | Yes                | No                                                                                   | `{ "submissions": [...] }`                                                  |
| `/api/quiz/history/marks`   | `GET`      | Fetch submissions filtered by marks                        | Yes                | Query: `minMarks`, `maxMarks` (e.g., `?minMarks=30&maxMarks=80`)                    | `{ "submissions": [...] }`                                                  |
| `/api/quiz/history/subject` | `GET`      | Fetch submissions filtered by subject                      | Yes                | Query: `subject` (e.g., `?subject=Math`)                                            | `{ "submissions": [...] }`                                                  |
| `/api/quiz/history/grade`   | `GET`      | Fetch submissions filtered by grade level                  | Yes                | Query: `gradeLevel` (e.g., `?gradeLevel=9`)                                         | `{ "submissions": [...] }`                                                  |
| `/api/quiz/history/date`    | `GET`      | Fetch submissions filtered by date range                   | Yes                | Query: `startDate`, `endDate` (e.g., `?startDate=2024-01-01&endDate=2024-02-01`)    | `{ "submissions": [...] }`                                                  |

---

## Example of Endpoints

## API Endpoints

### 1. User Registration
- **POST** `/api/auth/register`
  - Request Body:
    ```json
    {
      "username": "your username",
      "password": "your password"
    }
    ```
  - Response:
    ```json
    {
      "message": "User registered successfully"
    }
    ```

### 2. User Login
- **POST** `/api/auth/login`
  - Request Body:
    ```json
    {
      "username": "your username",
      "password": "your password"
    }
    ```
  - Response:
    ```json
    {
      "token": "your_jwt_token"
    }
    ```

### 3. Generate Quiz
- **POST** `/api/quiz/create`
  - Request Body:
    ```json
    {
      "subject": "Math",
      "gradeLevel": "9",
      "questions": [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctOption": 1
        }
      ]
    }
    ```
  - Response:
    ```json
    {
      "message": "Quiz created successfully"
    }
    ```

### 4. Submit Quiz
- **POST** `/api/quiz/submit`
  - Request Body:
    ```json
    {
      "quizId": "quiz123",
      "answers": [1, 0, 2, 1],
      "userId": "user456"
    }
    ```
  - Response:
    ```json
    {
      "submission": {
        "quizId": "quiz123",
        "userId": "user456",
        "answers": [0, 1, 2, 1],
        "score": 30,
        "attemptNumber": 1,"gradeLevel": "1",
        "subject": "Mathematics",
        "createdAt": "2024-11-01T12:00:00Z"
      }
    }
    ```

### 5. Get Submission History (Filter by Marks, Subject, Grade Level) (This 3 API is seprate in production)
- **GET** `/api/quiz/history`
  - Request Query Parameters:
    - `marks`: Filter by score range (e.g., `min=50&max=100`)
    - `subject`: Filter by subject
    - `gradeLevel`: Filter by grade level
  - Response:
    ```json
    {
      "submissions": [
        {
          "quizId": "quiz123",
          "userId": "user456",
          "score": 80,
          "gradeLevel": "9",
          "subject": "Math",
          "createdAt": "2024-11-01T12:00:00Z"
        }
      ]
    }
    ```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Thuner Client](https://www.thunderclient.com/) (Optional for API testing)

### Steps to Install

1. Clone the repository:
    ```bash
    git clone https://github.com/vidja-abhay/AI-QUIZ.git
    cd ai-quiz-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```
    JWT_SECRET=your_jwt_secret_key
    MONGO_URI=your_mongodb_connection_string
    ```

4. Start the server:
    ```bash
    npm start
    ```

The server will start running on `http://localhost:8000`.

---

## Security Considerations

- **JWT**: All authenticated routes require a JWT token for access. This token should be passed in the `Authorization` header as `Bearer <token>`.
- **Password Hashing**: Passwords are hashed using **bcrypt.js** before being stored in the database.

---

## Acknowledgments

- Thanks to the **Node.js** and **Express** communities for creating the foundational technologies for this backend.
- Thanks to **MongoDB** for offering a scalable database solution.
