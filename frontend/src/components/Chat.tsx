import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage, CorrectGuessData } from "../types";

interface ChatProps {
  socket: Socket;
  roomId: string;
}

const Chat: React.FC<ChatProps> = ({ socket, roomId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    console.log(`📤 Sending guess: "${message}" to room: ${roomId}`);
    socket.emit("guess_word", {
      roomId,
      message
    });

    setMessage("");
  };

  useEffect(() => {
    socket.on("chat_message", (data: ChatMessage) => {
      console.log(`💬 Chat message received:`, data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("correct_guess", (data: CorrectGuessData) => {
      console.log(`✅ Correct guess event received:`, data);
      setMessages((prev) => [
        ...prev,
        {
          playerId: "system",
          playerName: "System",
          message: `${data.playerName} guessed the word!`,
          system: true,
          timestamp: Date.now()
        }
      ]);
    });

    return () => {
      socket.off("chat_message");
      socket.off("correct_guess");
    };
  }, [socket]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h3 style={{ 
        marginTop: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        💬 Chat
      </h3>

      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="message"
            style={{
              background: msg.system 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "white",
              color: msg.system ? "white" : "#333",
              borderLeft: msg.system ? "3px solid #ffd700" : "3px solid #667eea"
            }}
          >
            {msg.system ? (
              <b style={{ fontSize: "14px" }}>🎉 {msg.message}</b>
            ) : (
              <span style={{ fontSize: "14px" }}>
                <strong style={{ color: "#667eea" }}>{msg.playerName}:</strong>{" "}
                {msg.message}
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          placeholder="Type your guess..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          Send 📤
        </button>
      </div>
    </div>
  );
};

export default Chat;
