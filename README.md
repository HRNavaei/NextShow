# 🎬 Cinema Booking API

This is a Node.js-based REST API for a cinema application. Users can view scheduled movies per room, see seat availability, and book seats. Admins can manage rooms, movies, and user roles.

---

## 🧪 How to Test the API

You can use **Postman** to easily test this API. If you haven’t already:

1. [Download and install Postman](https://www.postman.com/downloads/)
2. Import the provided Postman Collection using the links below:

- 📘 [API Documentation (Postman)](https://documenter.getpostman.com/view/35280116/2sB2cbayTA)
- 📦 [Postman Collection](https://www.postman.com/hrnavaei1/workspace/my-public-workspace/collection/35280116-844bc987-cab5-4582-a93d-3e38fe20cb64?action=share&creator=35280116&active-environment=35280116-2f770e48-8a17-406e-a031-d23c34b54cf7)

> 🔔 **Important:** After importing the collection, make sure to select the `NextShow` environment from the top-right dropdown in Postman.

### 🌐 Choose Your Testing Mode

#### ✅ To test the **deployed** version:

- Set the `url` environment variable in Postman to:
  ```
  http://nextshow.liara.run
  ```
- Run the requests as provided in the collection.

#### 🧪 To test the **local** version:

- Clone the project and run it locally (see instructions below).
- Set the `url` environment variable in Postman to:
  ```
  http://localhost:[PORT]
  ```
  Replace `[PORT]` with the port you configured (default is `3000`).

> ⚠️ **Note:** The image upload feature does **not** work on the deployed version due to hosting limitations.  
> To test image uploading, you must run the project **locally**.

---

## 🔧 Environment Variables

To run the project locally, create a `.env` file in the root directory and include the following variables:

```
NODE_ENV=development
PORT=3000
DB_URI=[your local MongoDB connection URI]
JWT_SECRET=[your JWT secret]
```

> ⚠️ Replace the values in brackets with your actual values.

---

## 🚀 Features

- **User authentication** (sign up / sign in with JWT)
- **Admin role restriction**
- **CRUD for rooms** (admin only)
- **CRUD for movies** (admin only)
- **Poster upload**
- **Book a seat for a movie** (user only)
- **Seat lock per movie showtime**
- **Validation & error handling**

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Multer (file upload)
- Postman (for API testing)

---

## 📦 Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start MongoDB (locally or with a service like Atlas)

4. Create a `.env` file (see example above)

5. Run the server:
   ```bash
   npm start
   ```

---

## 🔐 Authentication & Roles

- Some endpoints require authentication via JWT
- Admin-only endpoints require a user with the `'admin'` role
- If no admin exists, you can:
  - Sign up as a regular user
  - Manually update the role in the database, or use the `Change Role` endpoint

### 🔓 Log out in Postman

Click the **eye icon** in the top right → click the **pencil icon** next to `jwt` → clear the token value.

---

## 📬 Endpoints

All endpoints are documented in the attached **Postman Collection**.  
You can test login, movie creation, room booking, and more.

> Some endpoints (like `changeRole`, `uploadPoster`) are not explicitly mentioned in the task flow but were added for completeness.

---

## 🖼 Poster Upload

Use `POST /api/v1/uploadMoviePoster` to upload a poster.  
The response contains an image URL, which can be used as the `poster` field when adding a movie.

> In a real frontend, this upload process would typically be handled automatically.

---

## 🗂 Folder Structure

- `/src/models` → Mongoose models
- `/src/routes` → Route modules
- `/src/controllers` → Request handlers
- `/src/utils` → Reusable helpers and error handlers
- `/public/movie-posters` → Uploaded poster images

---

## 👤 Submitted by

**Hamidreza Navaei**  
For STDev — Node.js Developer Task

---

### ✅ Getting Started

1. Use the **Sign Up** request to create your own user.
2. Or use an existing user by sending the **Sign In** request with one of the following credentials:

#### 👤 Regular User

- Email: `user@gmail.com`
- Password: `123456`

#### 🛠 Admin User

- Email: `admin@gmail.com`
- Password: `123456`

---

## ⚙️ How This API Works

- The API uses **MongoDB** for data storage.
- It includes collections for `Users`, `Rooms`, and `Movies`.
- Each movie is linked to a specific room and has a date/time slot.
- Booked seats are stored within the movie document as an array of objects, including seat coordinates and the user who booked them.

### 🔐 Authentication

- JWT (JSON Web Token) is used for authentication.
- Upon logging in, the token is returned in the `token` field of the response.
- Postman is preconfigured with a script that automatically saves this token as an environment variable named `jwt`.
- For all authenticated requests, the token is included in the `Authorization` header as:
  ```
  Authorization: Bearer <token>
  ```

> ✅ All token management is handled automatically in Postman, so once you're signed in, you can make authorized requests without manually copying tokens.
