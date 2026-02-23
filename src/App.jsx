import { useEffect } from "react";
import api from "./services/api";

function App() {
  useEffect(() => {
    api.get("/")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>CPSMS Client Running</h1>;
}

export default App;