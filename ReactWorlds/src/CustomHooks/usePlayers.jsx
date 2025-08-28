import { useState, useEffect} from "react";

const usePlayers = () => {
    const [players, setPlayers] = useState([]); 
    const [selected, setSelected] = useState(false);

   useEffect(() => {
    const fetchInitialPlayers = async () => {
      try {
        const response = await fetch("http://localhost:3001/loadInitialData");
        const initialPlayers = await response.json();
        setPlayers(initialPlayers.data); // asumiendo que tu backend devuelve { players: [...] }
        console.log(initialPlayers.data);
      } catch (error) {
        console.error("Error cargando players:", error);
      }
    };

    fetchInitialPlayers();
   }, []);


   const fetchData = async () => {
    try {
        const response = await fetch("http://localhost:3001/Worlds2024");
        const allPlayers = await response.json();
        setSelected(false);
        setPlayers(allPlayers);
      } catch (error) {
        console.error("Error cargando players:", error);
      }   
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
    try{
        const respuesta = await fetch('http://localhost:3001/Worlds2024/'+id);
        const playerID = await respuesta.json();
        setPlayers([playerID]);
        console.log([playerID]);
        setSelected(true);
    }
    catch(error){
        console.error("Error al seleccionar el jugador:", error);
    }
  }

  return {players, selected, handleDelete, handleRow, fetchData };  
}

export default usePlayers;