import { useEffect, useState } from 'react';
import './App.css';

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
          <th>TeamName</th>
          <th>PlayerName</th>
          <th>Position</th>
          <th>Games</th>
          <th>Winrate</th>
          <th>KDA</th>
          <th>Avgkills</th>
          <th>Avgdeaths</th>
          <th>Avgassists</th>
          <th>CSPerMin</th>
          <th>GoldPerMin</th>
          <th>KP</th>
          <th>DamagePercent</th>
          <th>DPM</th>
          <th>VSPM</th>
          <th>AvgWPM</th>
          <th>AvgWCPM</th>
          <th>AvgVWPM</th>
          <th>GD15</th>
          <th>CSD15</th>
          <th>XPD15</th>
          <th>FB</th>
          <th>FBVictim</th>
          <th>PentaKills</th>
          <th>SoloKills</th>
          <th>Country</th>
          <th>FlashKeybind</th>
        </tr>
      </thead>
      {data.map((item, id) => (
      <tr key={id}>
        <td>{item.TeamName}</td>
        <td>{item.PlayerName}</td>
        <td>{item.Position}</td>
        <td>{item.Games}</td>
        <td>{item.Winrate.toFixed(2)}</td>
        <td>{item.KDA}</td>
        <td>{item.Avgkills}</td>
        <td>{item.Avgdeaths}</td>
        <td>{item.Avgassists}</td>
        <td>{item.CSPerMin}</td>
        <td>{item.GoldPerMin}</td>
        <td>{item.KP.toFixed(2)}</td>
        <td>{item.DamagePercent.toFixed(2)}</td>
        <td>{item.DPM}</td>
        <td>{item.VSPM}</td>
        <td>{item.AvgWPM}</td>
        <td>{item.AvgWCPM}</td>
        <td>{item.AvgVWPM}</td>
        <td>{item.GD15}</td>
        <td>{item.CSD15}</td>
        <td>{item.XPD15}</td>
        <td>{item.FB.toFixed(2)}</td>
        <td>{item.FBVictim.toFixed(2)}</td>
        <td>{item.PentaKills}</td>
        <td>{item.SoloKills}</td>
        <td>{item.Country}</td>
        <td>{item.FlashKeybind}</td>
        <td><button onClick={() => handleDelete(item.id)}>Eliminar</button></td>
        <td><button onClick={() => handleRow(item.id)}>Seleccionar</button></td>
      </tr>
))}

    </table>  
      </div> 

    </div>
    
  );
}

export default App;
