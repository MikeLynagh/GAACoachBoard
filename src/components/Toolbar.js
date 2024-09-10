import React from "react";

const Toolbar = ({
    onAddPlayer, 
    onRemovePlayer, 
    onToggleDrawMode, 
    onClearDrawings, 
    onToggleNumbers, 
    isDrawMode, 
    showNumbers,
}) => {
    const buttonStyle = {
        padding:"12px 20px",
        fontSize: "16px",
        margin: "0 10px 10px 0",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4CAF50",
        color: "white",
        cursor: "pointer",
        touchAction: "manipulation",
    }

    return(
        <div style={{marginBottom: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            <button style={buttonStyle} onClick={onAddPlayer}>Add Player</button>
            <button style={buttonStyle} onClick={onRemovePlayer}>Remove Player</button>
            <button style={buttonStyle} onClick={onToggleDrawMode}>
                {isDrawMode ? "Stop Drawing" : "Start Drawing"}
            </button>
            <button style={buttonStyle} onClick={onClearDrawings}>Clear Drawings</button>
            <button style={buttonStyle} onClick={onToggleNumbers}>
                {showNumbers ? "Hide Numbers" : "Show Numbers "}
            </button> 
        </div>
    )
}

export default Toolbar