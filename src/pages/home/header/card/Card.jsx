import React, { useEffect, useState } from 'react';
import css from './card.module.scss';
import axios from 'axios';
import { URL_ESPECIES,
  URL_EVOLUCIONES, 
  URL_POKEMON } from '../../../../api/apiRest';

export default function Card({ card }) {
  const [itemPokemon, setItemPokemon] = useState({});
  const [especiePokemon, setEspeciePokemon] = useState({});
  const [evoluciones, setEvoluciones] = useState([]);

  useEffect(() => {
    const dataPokemon = async () => {
        const api = await axios.get(`${URL_POKEMON}/${card.name}`);
        
        setItemPokemon(api.data);

    };
    dataPokemon();
  }, [card]);

  useEffect(() => {
    const dataEspecie = async () => {
      try {
        const URL = card.url.split("/");
        const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
        setEspeciePokemon({
          url_especie: api?.data?.evolution_chain,
          data: api?.data,
        });
      } catch (error) {
        console.error("Error fetching species data:", error);
      }
    };
    dataEspecie();
  }, [card]);

  useEffect(() => {
    async function getPokemonImagen(id) {
      try {
        const response = await axios.get(`${URL_POKEMON}/${id}`);
        return response?.data?.sprites?.other["official-artwork"]?.front_default;
      } catch (error) {
        console.error("Error fetching Pokemon image:", error);
      }
    }

    if (especiePokemon.url_especie) {
      const obtenerEvoluciones = async () => {
        const arrayEvoluciones = [];
        const URL = especiePokemon.url_especie.url.split("/");
        const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);

        const addEvolution = async (species) => {
          const ID = species?.url.split("/")[6];
          const img = await getPokemonImagen(ID);
          arrayEvoluciones.push({
            img,
            name: species?.name,
          });
        };

        await addEvolution(api?.data?.chain?.species);
        
        if (api?.data?.chain?.evolves_to?.length > 0) {
          await addEvolution(api?.data?.chain.evolves_to[0].species);
          if (api?.data?.chain.evolves_to[0].evolves_to?.length > 0) {
            await addEvolution(api?.data?.chain.evolves_to[0].evolves_to[0].species);
          }
        }

        setEvoluciones(arrayEvoluciones);
      };
      obtenerEvoluciones();
    }
  }, [especiePokemon]);

  let pokeId = itemPokemon?.id?.toString().padStart(3, '0');

  return (
    <div className={css.card}>
      <img
        className={css.img_poke}
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
        alt="pokemon"
      />
      <div className={`bg-${especiePokemon?.data?.color?.name} ${css.sub_card}`}>
        <strong className={css.id_card}>#{pokeId}</strong>
        <strong className={css.name_card}>{itemPokemon.name}</strong>
        <h4 className={css.altura_poke}>Altura: {itemPokemon.height}0 cm</h4>
        <h4 className={css.peso_poke}>Peso: {itemPokemon.weight} kg</h4>
        <h4 className={css.habitat_poke}>Habitat: {especiePokemon?.data?.habitat?.name}</h4>

        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => (
            <h6 key={index} className={css.item_stats}>
              <span className={css.name}>{sta.stat.name}</span>
              <progress value={sta.base_stat} max={110}></progress>
              <span className={css.numero}>{sta.base_stat}</span>
            </h6>
          ))}
        </div>

        <div className={css.div_type_color}>
          {itemPokemon?.types?.map((ti, index) => (
            <h6 key={index} className={`color-${ti.type.name} ${css.color_type}`}>
              {ti.type.name}
            </h6>
          ))}
        </div>

        <div className={css.div_evolucion}>
          {evoluciones.map((evo, index) => (
            <div className={css.item_evo}  key={index}>
              <img src={evo.img} alt="evo" className={css.img} />
              <h6>{evo.name}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
