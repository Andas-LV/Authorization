import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Protected from "./components/Protected";

function App() {
  const [token, setToken] = useState("");

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  return (
    <div className="App">
      <h1>Authentication Example</h1>
      <Register />
      <Login onLogin={handleLogin} />
      {token && <Protected token={token} />}
    </div>
  );
}

export default App;
