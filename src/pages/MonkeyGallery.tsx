import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import MonkeyCard from '../components/MonkeyCard';
import { Monkey } from '../types';

interface MonkeyGalleryProps {
  monkeys: Monkey[];
  loading: boolean;
  refreshMonkeys: () => Promise<void>;
}

const MonkeyGallery: React.FC<MonkeyGalleryProps> = ({ monkeys, loading, refreshMonkeys }) => {
  useEffect(() => {
    refreshMonkeys(); // Fetch data when the component mounts
  }, [refreshMonkeys]);

  // Animation variants for staggered list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Function to fetch Pokémon image (adjusting the name to lowercase)
  const fetchPokemonImage = async (pokemonName: string) => {
    try {
      // Convert name to lowercase before fetching from the API
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      const data = await response.json();
      console.log("Pokemon Image URL: ", data.sprites.front_default);
    } catch (error) {
      console.error('Error fetching Pokémon image:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pokemon Squad Gallery</h1>
          <p className="text-slate-600">View and manage your complete squad of monkeys</p>
        </motion.div>
        
        <motion.div 
          className="flex space-x-3 mt-4 md:mt-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button 
            onClick={refreshMonkeys} 
            className="btn-secondary inline-flex items-center"
            disabled={loading}
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link to="/create" className="btn-primary inline-flex items-center">
            <Plus size={18} className="mr-2" />
            Add Monkey
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center my-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : monkeys.length === 0 ? (
        <motion.div 
          className="text-center py-20 bg-white rounded-xl shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Your squad is currently empty!</h2>
          <p className="text-slate-600 mb-6">Create your first monkey to get started with your defense squad.</p>
          <Link to="/create" className="btn-primary inline-flex items-center">
            <Plus size={18} className="mr-2" />
            Create Your Pokemon
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {monkeys.map((monkey) => {
            // Call fetchPokemonImage with the lowercase version of monkey name
            fetchPokemonImage(monkey.name);
            return <MonkeyCard key={monkey.id} monkey={monkey} />;
          })}
        </motion.div>
      )}
    </div>
  );
};

export default MonkeyGallery;
