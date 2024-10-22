import React, { useEffect, useState } from "react";
import css from './layout.module.scss';
import Header from '../home/header/Header';
import Card from '../home/header/card/Card'; // Importa el componente Card
import axios from 'axios';
import { URL_POKEMON } from '../../api/apiRest';

export default function LayoutHome() {
  const [arrayPokemon, setArrayPokemon] = useState([]);

  useEffect(() => {
    const api = async () => {
      try {
        const apiPoke = await axios.get(`${URL_POKEMON}`);
        setArrayPokemon(apiPoke.data.results); // Asegúrate de acceder a 'results' correctamente
      } catch (error) {
        console.error("Error al obtener los datos de Pokémon: ", error);
      }
    };

    api();
  }, []);

  return (
    <div className={css.layout}>
      <Header />

      <div>
        {arrayPokemon.map((card, index) => (
          // Renderiza el componente Card y pasa los datos de cada Pokémon
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}
