import { useState } from "react";
import socket from "../socket";
import "../index.css";

interface LobbyProps {
  setRoomId: (roomId: string) => void;
  setInGame: (inGame: boolean) => void;
  setName: (name: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ setRoomId, setInGame, setName }) => {
  const [localName, setLocalName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [rounds, setRounds] = useState<number>(3);
  const [drawTime, setDrawTime] = useState<number>(60);
  const [maxPlayers, setMaxPlayers] = useState<number>(8);

  const joinRoom = () => {
    if (!localName || !room) return;

    socket.emit("join_room", {
      name: localName,
      roomId: room
    });

    setName(localName);
    setRoomId(room);
    setInGame(true);
  };

  const createRoom = () => {
    if (!localName) return;

    // Generate a more readable room ID (uppercase, 5 characters)
    const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();

    socket.emit("create_room", {
      name: localName,
      roomId,
      settings: {
        rounds,
        drawTime,
        maxPlayers
      }
    });

    setName(localName);
    setRoomId(roomId);
    setInGame(true);
  };

  return (
    <div className="lobby">
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ 
          fontSize: "36px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "10px"
        }}>
          🎨 Skribbl
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Draw, Guess, and Have Fun!
        </p>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="👤 Enter your name"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "20px",
        color: "white",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)"
      }}>
        <h3 style={{ marginTop: 0, fontSize: "20px", marginBottom: "10px" }}>
          🎮 Create New Room
        </h3>
        <p style={{ fontSize: "14px", marginBottom: "20px", opacity: 0.9 }}>
          Start a new game and share the Room ID with friends
        </p>

        {/* Game Settings */}
        <div style={{ 
          background: "rgba(255,255,255,0.15)", 
          padding: "20px", 
          borderRadius: "10px",
          marginBottom: "20px"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "10px", 
              fontWeight: "bold", 
              fontSize: "15px",
              textAlign: "center"
            }}>
              🎯 Rounds: <span style={{ 
                background: "rgba(255,255,255,0.3)", 
                padding: "4px 12px", 
                borderRadius: "15px",
                marginLeft: "8px"
              }}>{rounds}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              style={{ width: "100%", cursor: "pointer", height: "6px" }}
            />
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: "12px", 
              opacity: 0.8, 
              marginTop: "8px",
              paddingLeft: "5px",
              paddingRight: "5px"
            }}>
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "10px", 
              fontWeight: "bold", 
              fontSize: "15px",
              textAlign: "center"
            }}>
              ⏱️ Draw Time: <span style={{ 
                background: "rgba(255,255,255,0.3)", 
                padding: "4px 12px", 
                borderRadius: "15px",
                marginLeft: "8px"
              }}>{drawTime}s</span>
            </label>
            <input
              type="range"
              min="30"
              max="180"
              step="15"
              value={drawTime}
              onChange={(e) => setDrawTime(Number(e.target.value))}
              style={{ width: "100%", cursor: "pointer", height: "6px" }}
            />
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: "12px", 
              opacity: 0.8, 
              marginTop: "8px",
              paddingLeft: "5px",
              paddingRight: "5px"
            }}>
              <span>30s</span>
              <span>180s</span>
            </div>
          </div>

          <div style={{ marginBottom: "0" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "10px", 
              fontWeight: "bold", 
              fontSize: "15px",
              textAlign: "center"
            }}>
              👥 Max Players: <span style={{ 
                background: "rgba(255,255,255,0.3)", 
                padding: "4px 12px", 
                borderRadius: "15px",
                marginLeft: "8px"
              }}>{maxPlayers}</span>
            </label>
            <input
              type="range"
              min="2"
              max="12"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              style={{ width: "100%", cursor: "pointer", height: "6px" }}
            />
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: "12px", 
              opacity: 0.8, 
              marginTop: "8px",
              paddingLeft: "5px",
              paddingRight: "5px"
            }}>
              <span>2</span>
              <span>12</span>
            </div>
          </div>
        </div>

        <button 
          onClick={createRoom} 
          disabled={!localName}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            fontWeight: "bold",
            background: "white",
            color: "#667eea",
            border: "none",
            borderRadius: "10px",
            cursor: localName ? "pointer" : "not-allowed",
            opacity: localName ? 1 : 0.5,
            boxShadow: localName ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          ✨ Create Room
        </button>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        padding: "25px",
        borderRadius: "15px",
        color: "white",
        boxShadow: "0 8px 25px rgba(245, 87, 108, 0.3)"
      }}>
        <h3 style={{ marginTop: 0, fontSize: "20px", marginBottom: "10px" }}>
          🚪 Join Existing Room
        </h3>
        <p style={{ fontSize: "14px", marginBottom: "15px", opacity: 0.9 }}>
          Enter the Room ID shared by your friend
        </p>
        <input
          type="text"
          placeholder="🔑 Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value.toUpperCase())}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "10px",
            marginBottom: "15px",
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: "bold"
          }}
        />
        <button 
          onClick={joinRoom} 
          disabled={!localName || !room}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            fontWeight: "bold",
            background: "white",
            color: "#f5576c",
            border: "none",
            borderRadius: "10px",
            cursor: (localName && room) ? "pointer" : "not-allowed",
            opacity: (localName && room) ? 1 : 0.5,
            boxShadow: (localName && room) ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          🎯 Join Room
        </button>
      </div>
    </div>
  );
};

export default Lobby;
