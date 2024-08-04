import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";
import "ldrs/dotSpinner";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorHandle, setErrorHandle] = useState(null);
  const [search,setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=200";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailResponse = await Promise.all(detailedPokemonData);
      setPokemon(detailResponse);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorHandle(error);
    }
  };
  useEffect(() => {
    fetchPokemon();
  }, []);

  if (errorHandle) {
    return (
      <div>
        <h1>{errorHandle.message}</h1>
      </div>
    );
  }

  const searchData = pokemon.filter((curPokemon) => curPokemon.name.toLowerCase().includes(search.toLowerCase()));


  if (loading) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center bg-[#eff3ff]">
        <l-dot-spinner size="40" speed="0.9" color="black"></l-dot-spinner>

        <h1 className="text-6xl mt-12">Loading...</h1>
      </div>
    );
  }



  return (
    <>
      <section className="container">
        <header>
          <h1>Let's Catch Pokemon</h1>
        </header>

        <div className="pokemon-search">
            <input type="text" placeholder="Search pokemon" value={search} onChange={(e) => setSearch(e.target.value)} />

        </div>

        <div>
          <ul className="cards">
            {searchData.map((curPokemon) => {
              return (
                <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};
