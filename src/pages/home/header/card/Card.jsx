import React, { useEffect, useState } from 'react';
import css from './card.module.scss';
import axios from 'axios';
import { URL_ESPECIES, URL_POKEMON } from '../../../../api/apiRest';

export default function Card({ card }) {

  const [itemPokemon, setItemPokemon] = useState({})
  const [especiePokemon, setEspeciePokemon] = useState({})

  console.log(itemPokemon);

  useEffect(() => {
    const dataPokemon = async () => {
      
        // Usa 'await' para esperar la respuesta de la API
        const api = await axios.get(`${URL_POKEMON}/${card.name}`);

        setItemPokemon(api.data)
      
    };
  
    dataPokemon();

  }, []);

  
  useEffect(() => {
    const especiePokemon = async () => {
      const URL = card.url.split("/");
      // Usa 'await' para esperar la respuesta de la API
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
      setEspeciePokemon(api.data)
    };
    especiePokemon();
    
  }, []);
  
  
  
  
  
  console.log(especiePokemon?.color?.name);
  return (
    <div className={css.card}>
      <img className={css.img_poke} src={itemPokemon?.sprites?.other["official-artwork"]?.front_default} alt="pokemon" 
      />
      <div className={`bg-${especiePokemon?.color?.name} ${css.sub_card}  `  }  >
        <strong className={css.id_card}> 011 </strong>
        <strong className={css.name_card}> name </strong>
        <h4 className={css.altura_poke}>10cms</h4 >
        <h4 className={css.peso_poke}>peso</h4>
        <h4 className={css.habitat_poke}>habitat</h4>

        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return(
              <h6 key={index} className={css.item_stats}>
                <span className={css.name}> {sta.stat.name}  </span>
                <progress value={sta.base_stat}   max={110}></progress>
                <span className={css.numero}> {sta.base_stat}  </span>
              </h6>
            );
          } )}
        </div>


          <div>
            {itemPokemon?.types?.map((ti , index) =>{
              return<h6 key={index}>
                {ti.type.name}
              </h6>;
              
            })}
          </div>
      </div>
    </div>
  )
}
