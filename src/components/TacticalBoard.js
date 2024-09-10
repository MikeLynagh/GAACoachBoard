import React, {useEffect, useState, useCallback, useRef}  from "react";
import { useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import PlayerMarker from "./PlayerMarker"
import FormationSelector from "./FormationSelector"
import Toolbar from "./Toolbar";
import { formations } from "./formations"

const TacticalBoard = () => {
    const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });
    const [players, setPlayers] = useState([]);
    const [isDrawMode, setIsDrawMode] = useState(false)
    const [drawings, setDrawings] = useState([])
    const [showNumbers, setShowNumbers ] = useState(false)
    const canvasRef = useRef(null)
    const isDrawingRef = useRef(false)

    useEffect(() => {
      const updateDimensions = () => {
        const board = document.getElementById("tactical-board");
        if (board) {
          setBoardDimensions({ width: board.offsetWidth, height: board.offsetHeight });
        }
      };
      window.addEventListener("resize", updateDimensions);
      updateDimensions();
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        setPlayers(formations["15v15"])
    }, [])
  
    const movePlayer = useCallback((id, left, top) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === id ? { ...player, left, top } : player
        )
      );
    }, []);
  
    const [, drop] = useDrop(() => ({
      accept: "player",
      drop: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          let left = Math.round(item.left + (delta.x / boardDimensions.width) * 100);
          let top = Math.round(item.top + (delta.y / boardDimensions.height) * 100);
          
          left = Math.max(0, Math.min(left, 100));
          top = Math.max(0, Math.min(top, 100));
          
          movePlayer(item.id, left, top);
        }
      },
    }), [boardDimensions, movePlayer]);

    const changeFormation = (formation) => {
        setPlayers(formations[formation])
    }

    const handleAddPlayer = () => {
      const newId = Math.max(...players.map(p => p.id)) + 1;
      setPlayers(prevPlayers => [...prevPlayers, {id: newId, left: 50, top: 50, color: "black"}])
    };

    const handleRemovePlayer = () => {
      if (players.length > 0 ){
        setPlayers(players.slice(0, -1))
      } 
    }

    const handleToggleDrawMode = () => {
      setIsDrawMode(!isDrawMode)
    }

    const handleClearDrawings = () => {
      setDrawings([])
    }

    const handleToggleNumbers = () => {
      setShowNumbers(!showNumbers)
    }

    const startDrawing = (x, y) => {
      isDrawingRef.current = true;
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (x - rect.left) / rect.width * 100;
      const newY = (y - rect.top) / rect.height * 100;
      setDrawings([...drawings, { type: 'path', points: [[newX, newY]] }]);
    }

    const draw = (x, y) => {
      if (isDrawMode && isDrawingRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const newX = (x - rect.left) / rect.width * 100;
        const newY = (y - rect.top) / rect.height * 100;
        const newDrawings = [...drawings];
        newDrawings[newDrawings.length - 1].points.push([newX, newY]);
        setDrawings(newDrawings);
      }
    }

    const stopDrawing = () => {
      isDrawingRef.current = false;
    }

    const handleMouseDown = (e) => {
      if (isDrawMode) startDrawing(e.clientX, e.clientY);
    }

    const handleMouseMove = (e) => {
      if (isDrawMode) draw(e.clientX, e.clientY);
    }

    const handleMouseUp = () => {
      if (isDrawMode) stopDrawing();
    }

    const handleTouchStart = (e) => {
      if (isDrawMode) {
        const touch = e.touches[0];
        startDrawing(touch.clientX, touch.clientY);
      }
    };
  
    const handleTouchMove = (e) => {
      if (isDrawMode) {
        const touch = e.touches[0];
        draw(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      if (isDrawMode) stopDrawing();
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawings.forEach(drawing => {
        if (drawing.type === 'path' && drawing.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(drawing.points[0][0] * canvas.width / 100, drawing.points[0][1] * canvas.height / 100);
          for (let i = 1; i < drawing.points.length; i++) {
            ctx.lineTo(drawing.points[i][0] * canvas.width / 100, drawing.points[i][1] * canvas.height / 100);
          }
          ctx.stroke();
        }
      });
    }, [drawings]);

    return (
        <div>
          <FormationSelector onChange={changeFormation} />
          <Toolbar 
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onToggleDrawMode={handleToggleDrawMode}
          onClearDrawings={handleClearDrawings}
          onToggleNumbers={handleToggleNumbers}
          isDrawMode={isDrawMode}
          showNumbers={showNumbers}
          />
          <div
            id="tactical-board"
            ref={drop}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1200px",
              aspectRatio: "16 / 9",
              border: "2px solid black",
              backgroundImage: 'url("/gaafield.png")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              margin: "0 auto",
              touchAction: isDrawMode ? "none" : "auto",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <canvas 
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0, 
                width: "100%",
                height: "100%",
                pointerEvents: "none"
              }}
            />
            {players.map((player, index) => (
              <PlayerMarker
                key={player.id}
                {...player}
                number={showNumbers ? index + 1: null}
                onMove={movePlayer}
              />
            ))}
          </div>
        </div>
    )
  };

export default TacticalBoard;