import React from "react";

const FormationSelector = ({onChange}) => {
    return(
        <div style={{marginBottom: "10px"}}>
            <button onClick={() => onChange("15v15")}>15 vs 15 </button>
            <button onClick={() => onChange("6v6")}>6 atk vs 6 def </button>
        </div>
    )
}


export default FormationSelector