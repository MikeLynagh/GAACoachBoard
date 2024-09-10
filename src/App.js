import React from "react";
import { DndProvider} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import TacticalBoard from "./components/TacticalBoard"

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints;


const App = () => (
  <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
    <div className="App">
      <h1>GAA Tactical Board</h1>
      <TacticalBoard />
    </div>
  </DndProvider>
);

export default App;