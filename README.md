# 🎨 Skribbl.io Clone

A real-time multiplayer drawing and guessing game built with React, TypeScript, Node.js, and Socket.IO.

## ✨ Features

- 🎮 Real-time multiplayer gameplay
- 🎨 Canvas drawing with multiple colors and brush sizes
- 💬 Live chat system
- 🏆 Winner celebration with animations
- 📊 Score tracking and leaderboard
- ⚙️ Customizable game settings (rounds, draw time, max players)
- 📱 Fully responsive design (Desktop, Tablet, Mobile)
- 🌸 Beautiful UI with celebration effects (flowers, confetti)

## 🚀 Tech Stack

### Frontend
- React 18
- TypeScript
- Socket.IO Client
- Vite
- CSS3 (with animations)

### Backend
- Node.js
- Express
- Socket.IO
- MongoDB (Mongoose)
- TypeScript

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/AyushMaurya790/skribbl.git
cd skribbl
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URI
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env if needed (default: http://localhost:5002)
```

## 🎮 Running the Application

### Start Backend
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5002`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🎯 How to Play

1. **Create a Room**
   - Enter your name
   - Set game settings (rounds, draw time, max players)
   - Click "Create Room"
   - Share the Room ID with friends

2. **Join a Room**
   - Enter your name
   - Enter the Room ID
   - Click "Join Room"

3. **Start Game**
   - Host clicks "Start Game"
   - Drawer gets 3 word options
   - Drawer selects a word and draws

4. **Guess the Word**
   - Other players see the drawing
   - Type your guess in chat
   - First correct guess wins +10 points!

5. **Winner**
   - Winner is displayed in navbar
   - Celebration effects appear
   - Game continues to next round

## 🎨 Game Settings

- **Rounds**: 1-10 rounds
- **Draw Time**: 30-180 seconds
- **Max Players**: 2-12 players

## 📱 Responsive Design

- ✅ Desktop (1400px+)
- ✅ Laptop (1024px - 1400px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (480px - 768px)
- ✅ Small Mobile (<480px)
- ✅ Landscape support

## 🏗️ Project Structure

```
skribbl/
├── backend/
│   ├── src/
│   │   ├── classes/
│   │   │   ├── GameRoom.ts
│   │   │   └── RoomManager.ts
│   │   ├── models/
│   │   │   └── Room.ts
│   │   ├── socket/
│   │   │   └── gameSocket.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── words.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.tsx
│   │   │   ├── Chat.tsx
│   │   │   └── PlayerList.tsx
│   │   ├── pages/
│   │   │   ├── Game.tsx
│   │   │   └── Lobby.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── socket.ts
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🎨 Features in Detail

### Real-time Drawing
- Multiple colors
- Adjustable brush size
- Undo functionality
- Clear canvas
- Smooth drawing experience

### Chat System
- Real-time messaging
- Guess detection
- System messages
- Winner announcements

### Winner Celebration
- 🌸 Falling flowers animation
- 🎊 Confetti effects
- 🏆 Winner badge in navbar
- 💖 Bouncing banner
- 📢 Alert popup

### Game Management
- Round tracking
- Timer countdown
- Score calculation
- Automatic round progression
- Game over with leaderboard

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
```

### Frontend (.env)
```env
VITE_SOCKET_URL=http://localhost:5002
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Ayush Maurya**
- GitHub: [@AyushMaurya790](https://github.com/AyushMaurya790)

## 🙏 Acknowledgments

- Inspired by Skribbl.io
- Built with modern web technologies
- Designed for fun and learning

## 📸 Screenshots

### Lobby
![Lobby](screenshots/lobby.png)

### Game
![Game](screenshots/game.png)

### Winner Celebration
![Winner](screenshots/winner.png)

---

Made with ❤️ by Ayush Maurya
