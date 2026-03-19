import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Player } from "../types";

interface PlayerListProps {
  socket: Socket;
  currentPlayerName?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ socket, currentPlayerName }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.on("player_list", (data: Player[]) => {
      setPlayers(data);
    });

    return () => {
      socket.off("player_list");
    };
  }, [socket]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h3 style={{ 
        marginTop: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        👥 Players ({players.length})
      </h3>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {players.map((player, index) => (
          <div
            key={index}
            className="player"
            style={{
              background: player.name === currentPlayerName 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "#f8f9fa",
              color: player.name === currentPlayerName ? "white" : "#333",
              borderLeft: player.name === currentPlayerName ? "4px solid #ffd700" : "none",
              paddingLeft: player.name === currentPlayerName ? "8px" : "12px"
            }}
          >
            <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {player.name === currentPlayerName && "👤"}
              {player.name}
            </strong>
            <span style={{ 
              background: player.name === currentPlayerName ? "rgba(255,255,255,0.3)" : "#4caf50", 
              color: "white", 
              padding: "4px 10px", 
              borderRadius: "15px",
              fontSize: "13px",
              fontWeight: "bold"
            }}>
              ⭐ {player.score}
            </span>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <p style={{ 
          textAlign: "center", 
          color: "#999",
          padding: "20px",
          fontSize: "14px"
        }}>
          No players yet
        </p>
      )}
    </div>
  );
};

export default PlayerList;
