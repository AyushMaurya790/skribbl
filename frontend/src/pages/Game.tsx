import { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import PlayerList from "../components/PlayerList";
import socket from "../socket";
import { RoundData } from "../types";
import "../index.css";

interface GameProps {
  roomId: string;
  name: string;
}

const Game: React.FC<GameProps> = ({ roomId, name }) => {
  const [word, setWord] = useState<string>("");
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [time, setTime] = useState<number>(60);
  const [round, setRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(3);
  const [drawer, setDrawer] = useState<string>("");
  const [isDrawer, setIsDrawer] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [winnerMessage, setWinnerMessage] = useState<string>("");
  const [timeOverMessage, setTimeOverMessage] = useState<string>("");
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [currentWinner, setCurrentWinner] = useState<string>("");

  useEffect(() => {
    console.log(`🔌 Joining room: ${roomId} as ${name}`);
    socket.emit("join_room", {
      roomId,
      name
    });

    socket.on("word_options", (words: string[]) => {
      console.log(`📝 Received word options:`, words);
      setWordOptions(words);
      // Check if current player is drawer
      setIsDrawer(socket.id === drawer || words.length > 0);
    });

    socket.on("word_selected", (hiddenWord: string) => {
      console.log(`🔤 Word selected (hidden):`, hiddenWord);
      setWord(hiddenWord);
      setWordOptions([]);
      setGameStarted(true);
    });

    socket.on("timer", (timeLeft: number) => {
      console.log(`⏱️ Timer update:`, timeLeft);
      setTime(timeLeft);
    });

    socket.on("new_round", (data: RoundData) => {
      console.log(`🔄 New round:`, data);
      setRound(data.round);
      setDrawer(data.drawer);
      setWord("");
      setTime(60);
      setIsDrawer(data.drawerId === socket.id);
      setWinnerMessage("");
      setCurrentWinner(""); // Clear winner on new round
    });

    socket.on("round_start", (data: { drawerId: string; drawerName: string; round: number }) => {
      console.log(`🎮 Round start:`, data);
      setRound(data.round);
    });

    socket.on("room_settings", (data: { rounds: number; drawTime: number; maxPlayers: number }) => {
      console.log(`⚙️ Room settings received:`, data);
      setTotalRounds(data.rounds);
    });

    socket.on("winner_declared", (data: { winnerId: string; winnerName: string; word: string; score: number }) => {
      console.log(`🏆 Winner declared:`, data);
      
      // Set current winner
      setCurrentWinner(data.winnerName);
      
      // Show celebration effects
      setShowCelebration(true);
      
      // Show alert for winner
      setTimeout(() => {
        alert(`🎉 WINNER!\n\n${data.winnerName} guessed the word correctly!\n\nWord: "${data.word}"\nPoints: +10\nTotal Score: ${data.score}`);
      }, 500);
      
      // Show banner message
      const message = `🎉 ${data.winnerName} guessed "${data.word}" correctly! +10 points! 🏆`;
      setWinnerMessage(message);
      
      // Also show in chat
      console.log(`✅ Winner: ${data.winnerName} with score: ${data.score}`);
      
      // Clear celebration and winner message after 5 seconds
      setTimeout(() => {
        setWinnerMessage("");
        setShowCelebration(false);
      }, 5000);
    });

    socket.on("time_over", (data: { word: string; message: string }) => {
      console.log(`⏰ Time over:`, data);
      
      // Show alert
      alert(`⏰ TIME OVER!\n\nThe correct word was: "${data.word}"\n\nNo one guessed it! 😔`);
      
      // Also show banner
      setTimeOverMessage(`⏰ Time Over! The word was: "${data.word}"`);
      setWord(data.word);
      
      // Clear time over message after 4 seconds
      setTimeout(() => {
        setTimeOverMessage("");
      }, 4000);
    });

    socket.on("round_end", (data) => {
      console.log(`🏁 Round ended:`, data);
      setWord(data.word);
      setTimeout(() => {
        setWord("");
        setWordOptions([]);
      }, 3000);
    });

    socket.on("game_over", (data) => {
      console.log(`🎉 Game over:`, data);
      
      // Create leaderboard display
      const leaderboardText = data.leaderboard
        .map((p: any, i: number) => `${i + 1}. ${p.name}: ${p.score} points`)
        .join('\n');
      
      alert(`🎉 GAME OVER!\n\n🏆 Winner: ${data.winner.name}\n💯 Score: ${data.winner.score} points\n\n📊 Final Leaderboard:\n${leaderboardText}`);
      setGameStarted(false);
      setWord("");
      setRound(1);
      setTime(60);
      setDrawer("");
    });

    socket.on("error", (message: string) => {
      console.error(`❌ Error from server:`, message);
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off("word_options");
      socket.off("word_selected");
      socket.off("timer");
      socket.off("new_round");
      socket.off("round_start");
      socket.off("room_settings");
      socket.off("winner_declared");
      socket.off("time_over");
      socket.off("round_end");
      socket.off("game_over");
      socket.off("error");
    };
  }, [roomId, name]);

  const chooseWord = (selectedWord: string) => {
    socket.emit("choose_word", {
      roomId,
      word: selectedWord
    });
  };

  const startGame = () => {
    console.log(`🎮 Starting game for room: ${roomId}`);
    socket.emit("start_game", roomId);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert(`Room ID copied: ${roomId}`);
  };

  return (
    <div className="game-container">
      {/* Celebration Overlay with Flowers */}
      {showCelebration && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          pointerEvents: "none"
        }}>
          {/* Flowers falling */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="flower"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🌸', '🌺', '🌼', '🌻', '🌷', '🏵️', '💐'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
          
          {/* Confetti */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Navbar with Player Name and Winner */}
      <div style={{
        gridColumn: "1 / -1",
        background: "white",
        color: "#333",
        padding: "20px 30px",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
        gap: "15px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ 
            fontSize: "28px", 
            fontWeight: "bold",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🎨 Skribbl
          </span>
          <span style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "8px 20px", 
            borderRadius: "25px",
            fontSize: "15px",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
          }}>
            👤 {name}
          </span>
          
          {/* Current Winner Display */}
          {currentWinner && (
            <span style={{ 
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "8px 20px", 
              borderRadius: "25px",
              fontSize: "15px",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
              animation: "pulse 1s infinite",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              🏆 Winner: {currentWinner}
            </span>
          )}
        </div>
        <div style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)"
        }}>
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            🔑 Room: {roomId}
          </span>
          <button
            onClick={copyRoomId}
            style={{
              background: "white",
              color: "#f5576c",
              border: "none",
              padding: "6px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              boxShadow: "none"
            }}
          >
            📋 Copy
          </button>
        </div>
      </div>

      <div className="players">
        <PlayerList socket={socket} currentPlayerName={name} />
      </div>

      <div className="canvas-container">
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px" }}>
          {!gameStarted && (
            <div style={{ textAlign: "center" }}>
              <button 
                onClick={startGame}
                style={{
                  padding: "15px 40px",
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                  boxShadow: "0 5px 20px rgba(56, 239, 125, 0.4)"
                }}
              >
                🎮 Start Game
              </button>
            </div>
          )}

          {/* Winner Celebration Message */}
          {winnerMessage && (
            <div style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              animation: "bounce 0.5s ease-in-out infinite",
              boxShadow: "0 10px 40px rgba(245, 87, 108, 0.6)",
              border: "4px solid #fff",
              marginBottom: "15px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "40px",
                animation: "bounce 1s ease-in-out infinite"
              }}>🎉</div>
              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "40px",
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: "0.2s"
              }}>🏆</div>
              <div style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                fontSize: "40px",
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: "0.4s"
              }}>⭐</div>
              <div style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "40px",
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: "0.6s"
              }}>✨</div>
              {winnerMessage}
            </div>
          )}

          {/* Time Over Message */}
          {timeOverMessage && (
            <div style={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              animation: "pulse 1s infinite",
              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4)",
              border: "3px solid #fff"
            }}>
              {timeOverMessage}
            </div>
          )}

          {/* Game Info Bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px"
          }}>
            <div style={{
              flex: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "15px",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}>
              🎯 Round: {round} / {totalRounds}
            </div>
            <div style={{
              flex: 1,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "15px",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)"
            }}>
              ⏱️ Time: {time}s
            </div>
          </div>

          {/* Drawer Info */}
          <div style={{
            background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            padding: "12px",
            borderRadius: "12px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#d35400",
            fontSize: "15px"
          }}>
            🎨 Drawer: {drawer || "Waiting..."}
          </div>

          {/* Word Display */}
          <div style={{
            background: "white",
            border: "3px dashed #667eea",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#667eea",
            letterSpacing: "3px",
            minHeight: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {word || "_ _ _ _ _"}
          </div>

          {/* Word Options - Shown to ALL players */}
          {wordOptions.length > 0 && (
            <div style={{ 
              textAlign: "center",
              background: isDrawer 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              padding: "20px",
              borderRadius: "12px",
              border: "3px solid #fff",
              color: "white",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
            }}>
              <h4 style={{ 
                marginBottom: "15px",
                fontSize: "18px",
                marginTop: 0
              }}>
                {isDrawer 
                  ? "✨ You are the Drawer! Choose a word to draw:" 
                  : "👀 Word Options (Drawer will choose one):"}
              </h4>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                {wordOptions.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => isDrawer && chooseWord(w)}
                    disabled={!isDrawer}
                    style={{
                      padding: "12px 24px",
                      fontSize: "16px",
                      background: isDrawer ? "white" : "rgba(255,255,255,0.3)",
                      color: isDrawer ? "#667eea" : "white",
                      border: "2px solid white",
                      borderRadius: "10px",
                      cursor: isDrawer ? "pointer" : "not-allowed",
                      fontWeight: "bold",
                      opacity: isDrawer ? 1 : 0.7,
                      boxShadow: isDrawer ? "0 4px 15px rgba(0,0,0,0.2)" : "none"
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
              {!isDrawer && (
                <p style={{ 
                  marginTop: "15px", 
                  marginBottom: 0,
                  fontSize: "14px",
                  opacity: 0.9
                }}>
                  💡 Guess which word the drawer is drawing!
                </p>
              )}
            </div>
          )}

          <Canvas socket={socket} roomId={roomId} isDrawer={isDrawer} />
        </div>
      </div>

      <div className="chat">
        <Chat socket={socket} roomId={roomId} />
      </div>
    </div>
  );
};

export default Game;
