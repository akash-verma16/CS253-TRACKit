import "./App.css";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/admin" element={<Admin></Admin>}></Route>
      </Routes>
    </div>
  );
}

export default App;
