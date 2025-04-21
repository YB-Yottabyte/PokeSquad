import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monkey, powerTypeColors } from '../types';
import { motion } from 'framer-motion';

const nameToPokemon: Record<string, string> = {
  sanvi: 'pikachu',
  rithwik: 'charizard',
  tx: 'bulbasaur',
};

interface MonkeyCardProps {
  monkey: Monkey;
}

const MonkeyCard: React.FC<MonkeyCardProps> = ({ monkey }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonImage = async () => {
      const pokemonName = nameToPokemon[monkey.name.toLowerCase()];

      if (!pokemonName) {
        console.warn(`No Pokémon mapping found for ${monkey.name}`);
        return;
      }

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const data = await response.json();
        setImageUrl(data.sprites.other['official-artwork'].front_default);
      } catch (error) {
        console.error(`Failed to fetch Pokémon image for ${monkey.name}:`, error);
      }
    };

    fetchPokemonImage();
  }, [monkey.name]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="card relative"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
    >
      <div className={`absolute top-0 right-0 w-3 h-3 rounded-full m-3 ${powerTypeColors[monkey.power_type]}`} />

      <div className="p-6">
        <div className="mb-4 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${monkey.name} Pokémon`}
              className="w-full h-32 object-contain animate-float"
            />
          ) : (
            <div className="text-center text-slate-400">Loading image...</div>
          )}
        </div>

        <h3 className="font-bold text-xl mb-2 truncate capitalize">{monkey.name}</h3>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-600">Level</span>
            <span className="text-sm font-medium">{monkey.level}/10</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${powerTypeColors[monkey.power_type]}`}
              style={{ width: `${monkey.level * 10}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-sm text-slate-600 mr-2">Type:</span>
          <span className={`text-sm font-medium ${powerTypeColors[monkey.power_type]} text-white px-2 py-0.5 rounded`}>
            {monkey.power_type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link to={`/details/${monkey.id}`} className="btn-secondary text-center text-sm">
            View Details
          </Link>
          <Link to={`/edit/${monkey.id}`} className="btn-primary text-center text-sm">
            Edit
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MonkeyCard;
