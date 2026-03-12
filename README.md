# QuickGPT - AI-Powered Chat & Image Generation 🚀

QuickGPT is a premium, full-stack AI application that brings the power of Google's Gemini to your fingertips. Generate intelligent text responses and stunning AI images, manage your chat history, and join a thriving community showcase—all within a sleek, modern interface.

![QuickGPT Banner](https://img.shields.io/badge/AI-Gemini-blue?style=for-the-badge&logo=google-gemini)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)

---

## ✨ Key Features

- **🤖 Dual AI Modes**: Seamlessly switch between **Text Mode** for intelligent conversations and **Image Mode** for AI art generation.
- **🖼️ Community Showcase**: Share your best generations with the world. Creators have full control to manage and remove their shared art.
- **💳 Credit System**: A balanced economy where text costs 1 credit and images cost 2 credits.
- **💰 Stripe Integration**: Fully integrated 3-tier pricing (Basic, Pro, Premium) with secure Stripe Checkout.
- **📜 Smart History**: Automated chat creation and renaming with persistent storage across sessions.
- **🌓 Dynamic UI**: Premium dark/light mode with smooth transitions and glassmorphism accents.
- **📱 Mobile Optimized**: A "mobile-first" approach ensuring a flawless experience on every device.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: CSS Transitions & Lucide-inspired icons
- **State Management**: React Context API
- **Feedback**: React Hot Toast

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **AI Engines**: Google Generative AI (Gemini 2.0 Flash) & ImageKit Generator
- **Storage**: ImageKit.io
- **Payments**: Stripe SDK
- **Auth**: JWT with Secure HttpOnly Cookies

---

## ⚙️ Environment Variables

### Server (`/server/.env`)
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://your-app.vercel.app

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_endpoint

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Client (`/client/.env`)
```env
VITE_SERVER_URL=https://your-api.onrender.com
```

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd QuickGPT
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Add your .env variables
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../client
   npm install
   # Add your .env variables
   npm run dev
   ```

---

## 🌐 Deployment

### Client (Vercel)
- Set `ROOT_DIRECTORY` to `client`.
- Add rewrite rules in `vercel.json` for SPA support (included).
- Add `VITE_SERVER_URL` to environment variables.

### Server (Render)
- Use `node server.js` as the start command.
- Add all server `.env` variables to Render's "Environment" tab.
- Set `FRONTEND_URL` to your Vercel URL to enable secure cross-site cookies.

---

## 📁 Project Structure

```text
QuickGPT/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── context/     # App-wide state (Auth, Stripe, Chat)
│   │   ├── pages/       # Page-level components
│   │   └── assets/      # Static images and icons
├── server/              # Express backend
│   ├── configs/         # DB, AI, and ImageKit setup
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── middlewares/     # Auth and security
```

---

## 🛣️ Roadmap

- [ ] **Voice Interaction**: Speak to Gemini and hear responses.
- [ ] **Advanced Image Editing**: In-painting and out-painting features.
- [ ] **Multi-Model Support**: Switch between specialized AI models.
- [ ] **Collaborative Chating**: Shared workspaces for teams.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ❓ Troubleshooting

- **CORS Errors**: Ensure `FRONTEND_URL` on the backend matches your Vercel URL exactly (including `https://`).
- **Invalid API Key**: Double-check your Gemini and Stripe keys in the `.env` files.
- **Port 3000 in use**: If the server won't start, change the `PORT` in `.env` or kill the process using port 3000.

---
Built with ❤️ by [Mannat Gupta](https://github.com/mannatgupta146)

⭐ **Give a star if you like this project!**
