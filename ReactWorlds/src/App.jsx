import { useState, useEffect  } from 'react'
import './App.css'

function App() {
const [data, setData] = useState([]);
  useEffect(() =>{
    fetchData();
  },[])

  const fetchData = async () => {
    const response = await fetch('http://localhost:3001/Worlds2024');

    const data = await response.json();
    console.log(data);
    setData(data);
  }
  
  const handleDelete = async (id) => {
    await fetch('http://localhost:3001/Worlds2024/'+id,{
      method: 'DELETE'
    }).then(() =>{
      console.log('Elemento eliminado');
      fetchData();
    })
  }

  const handleRow = async (id) => {
    const respuesta = await fetch('http://localhost:3001/Worlds2024/'+id);

    const dataID = await respuesta.json();
    console.log(dataID);
    setData(dataID);
  }
  
  return (
    <div className="App">
      <h1>Worlds2024</h1>
      <div className="table-container">
      <table>
      <thead>
        <tr>
          {data[0] && Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      {data.map((item, id) => (
      <tr key={id}>
        {Object.keys(item).map((key) => (
          <td key={key}>{typeof item[key] === 'number' ? item[key].toFixed(2) : item[key]}</td>
        ))}
        <td><button onClick={() => handleDelete(item.id)}>Eliminar</button></td>
        <td><button onClick={() => handleRow(item.id)}>Seleccionar</button></td>
      </tr>
))}

    </table>  
      </div> 

    </div>
    
  );
}

export default App

