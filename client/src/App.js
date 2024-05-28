import Register from "./components/Register";
import Login from "./components/Login";
import getCookies from "./cookies/getCookie";
import Protected from "./components/Protected";
import React from "react";

function App() {
    const token = getCookies('token')
    console.log("token =>",token)

  return (
    <div className="App">
      <h1>Authentication Example</h1>
      <Register />
      <Login />
        <Protected token={token}/>
    </div>
  );
}

export default App;
