import "./App.css";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/admin" element={<Admin></Admin>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
      </Routes>
    </div>
  );
}

export default App;
