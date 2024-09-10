import React from "react";
import { useDrag } from "react-dnd"

const PlayerMarker = ({ id, left, top, color, number }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "player",
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }), [id, left, top]);
  
    return (
      <div
        ref={drag}
        style={{
          position: "absolute",
          left: `${left}%`,
          top: `${top}%`,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: color,
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "12px",
          fontWeight: "bold"
        }}
      >
        {number}
        </div>
    );
  };

  export default PlayerMarker