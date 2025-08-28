import { useState, useEffect } from "react";
import usePlayers from "../CustomHooks/usePlayers";

function PlayerTable() {
  const {players, selected, handleDelete, handleRow, fetchData} = usePlayers() || [];

  return (
    <div className="table-container">
        <table>
            <thead>
                <tr>
                {players[0] && Object.keys(players[0]).map((key) => (
                    <th key={key}>{key}</th>
                ))}
                {selected ? (<th></th>) 
                  : ( 
                    <>
                     <th></th>
                     <th></th>
                    </>
                  )} 
                </tr>
            </thead>
            {players.map((item, id) => (
            <tr key={id}>
                {Object.keys(item).map((key) => (
                <td key={key}>{typeof item[key] === 'number' && item[key].toString().includes(".") ? item[key].toFixed(2) : item[key]}</td>
                ))}
                {selected === false ? (
                  <>
                   <td><button onClick={() => handleDelete(item.id)}>Eliminar</button></td>
                   <td><button onClick={() => handleRow(item.id)}>Seleccionar</button></td>
                  </>
                ) : (
                  <td><button onClick={() => fetchData()}>Volver</button></td> 
                )}
            </tr>
            ))}
        </table>  
    </div> 
  )
}

export default PlayerTable;