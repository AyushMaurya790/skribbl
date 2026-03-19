import { useRef, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DrawData } from "../types";

interface CanvasProps {
  socket: Socket;
  roomId: string;
  isDrawer: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ socket, roomId, isDrawer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [drawing, setDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [strokes, setStrokes] = useState<DrawData[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Temporarily allow drawing for testing
    // if (!isDrawer) return;

    setDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x, y);

    const drawData: DrawData = { x, y, color, size: brushSize, type: "start" };
    setCurrentStroke([drawData]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Temporarily allow drawing for testing
    if (!drawing) return;
    // if (!drawing || !isDrawer) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    const drawData: DrawData = { x, y, type: "move" };
    setCurrentStroke(prev => [...prev, drawData]);

    socket.emit("draw", {
      roomId,
      data: drawData
    });
  };

  const stopDrawing = () => {
    if (!drawing) return;

    setDrawing(false);
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.closePath();
    }

    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const clearCanvas = () => {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    socket.emit("canvas_clear", roomId);
  };

  const undoStroke = () => {
    if (!isDrawer || strokes.length === 0) return;

    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    redrawCanvas(newStrokes);
    socket.emit("draw_undo", roomId);
  };

  const redrawCanvas = (strokesArray: DrawData[][]) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokesArray.forEach(stroke => {
      if (stroke.length === 0) return;

      ctx.strokeStyle = stroke[0].color || "#000000";
      ctx.lineWidth = stroke[0].size || 5;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);

      stroke.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      });

      ctx.closePath();
    });
  };

  useEffect(() => {
    socket.on("draw_data", (data: DrawData) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      if (data.type === "start") {
        ctx.strokeStyle = data.color || "#000000";
        ctx.lineWidth = data.size || 5;
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
      } else {
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
      }
    });

    socket.on("canvas_clear", () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setStrokes([]);
    });

    return () => {
      socket.off("draw_data");
      socket.off("canvas_clear");
    };
  }, [socket]);

  return (
    <div>
      {/* Temporarily show tools for testing - remove isDrawer check */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: "5px" }}
          />
        </label>

        <label>
          Brush Size:
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ marginLeft: "5px" }}
          />
          <span style={{ marginLeft: "5px" }}>{brushSize}px</span>
        </label>

        <button onClick={undoStroke}>Undo</button>
        <button onClick={clearCanvas}>Clear</button>
        
        {!isDrawer && (
          <span style={{ color: "orange", marginLeft: "10px" }}>
            ⚠️ Testing Mode - Drawing enabled
          </span>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid black",
          background: "white",
          cursor: "crosshair"
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Canvas;
