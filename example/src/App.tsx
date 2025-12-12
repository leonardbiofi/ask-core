import React, { useEffect, useState } from "react";
import "./App.css";
import { api } from "./ask-services";
import type { Breed } from "./features/breeds/api";

function App() {
  const [data, setData] = useState<Breed[] | undefined>();

  useEffect(() => {
    const fetchBreeds = async () => {
      const responseData = await api.breeds.getAll();
      setData(responseData);
    };
  }, []);
  return (
    <div className="App">
      {data?.map((b) => (
        <li key={b.id}>{b.id}</li>
      ))}
    </div>
  );
}

export default App;
