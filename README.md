# Bookmate – AI-Powered Book Assistant

**Bookmate** is a **React Native mobile application** that allows readers to manage their libraries digitally, store important quotes from the books they read, and discover new books with **AI support**.

---

## Key Features

- **Library Management**
  Searching for books and adding them to a personal library via **Google Books API** integration.

- **Quote Notebook**
  Management of book-specific quotes through **CRUD** operations (Create, Read, Update, Delete).

- **AI Recommendations**
  Personalized book recommendations based on the user's library and reading tastes using the **Groq API (Llama 3 70B)**.

- **Real-Time Synchronization**
  Instant synchronization of data across all devices using **Cloud Firestore**.

- **Profile Management**
  Updating user information and tracking reading statistics.

---

## Technical Architecture and Technologies Used

The application is built on modern **React Native** practices and a component-based architecture.

### General Technologies
- **Framework:** React Native (Functional Components)
- **Language:** JavaScript (JSX)
- **Navigation:** React Navigation (Native Stack Navigator)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, `useContext`)

### Backend & AI
- **Backend as a Service (BaaS):** Firebase
  - Authentication
  - Cloud Firestore
- **AI:** Groq API / Llama 3 70B

### External Services & UI
- **API Communication:** Axios
- **External Services:** Google Books API
- **Visualization:** Lottie Animations, Flash Message

---

## Information Flow and Data Management

The application follows React's **Unidirectional Data Flow** principle.



- **Props**
  Data transfer from parent components to child components 
  *(e.g., passing book details between screens)*.

- **State**
  Management of dynamic data within components 
  *(e.g., form inputs, loading and error states)*.

- **Asynchronous Operations**
  API requests and database operations are performed using the `async/await` structure, ensuring the user interface remains responsive.

- **Offline Management**
  Data can be viewed offline thanks to **Firebase's local caching** features.

---
