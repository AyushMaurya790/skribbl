import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import "./App.css";

function App() {
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [inGame, setInGame] = useState<boolean>(false);

  return (
    <div>
      {inGame ? (
        <Game roomId={roomId} name={name} />
      ) : (
        <Lobby 
          setRoomId={setRoomId} 
          setInGame={setInGame} 
          setName={setName}
        />
      )}
    </div>
  );
}

export default App;
