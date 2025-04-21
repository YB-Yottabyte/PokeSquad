import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Monkey, powerTypeColors, powerTypeTextColors } from '../types';

interface MonkeyDetailsProps {
  monkeys: Monkey[];
}

const MonkeyDetails: React.FC<MonkeyDetailsProps> = ({ monkeys }) => {
  const { id } = useParams<{ id: string }>();
  const [monkey, setMonkey] = useState<Monkey | null>(null);
  const [loading, setLoading] = useState(true);
  const [pokemonImage, setPokemonImage] = useState<string | null>(null);

  // Fetching the Pokémon image from the PokéAPI
  const fetchPokemonImage = async (pokemonName: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      const data = await response.json();
      setPokemonImage(data.sprites.front_default);
    } catch (error) {
      console.error('Error fetching Pokémon image:', error);
    }
  };

  // Find monkey in props first (for quick rendering), then fetch from DB
  useEffect(() => {
    // Try to find the monkey in the props first
    const monkeyFromProps = monkeys.find(m => m.id.toString() === id);
    if (monkeyFromProps) {
      setMonkey(monkeyFromProps);
      setLoading(false);
      // Fetch Pokémon image based on the monkey name (assuming the monkey name corresponds to a Pokémon name)
      fetchPokemonImage(monkeyFromProps.name);
    }

    // Fetch the monkey data from supabase
    async function fetchMonkey() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Monkeys')
          .select()
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching monkey:', error);
        } else {
          setMonkey(data);
          // Fetch Pokémon image based on the monkey name (assuming the monkey name corresponds to a Pokémon name)
          fetchPokemonImage(data.name);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMonkey();
  }, [id, monkeys]);

  // Level descriptions for different monkey levels
  const getLevelDescription = (level: number) => {
    const descriptions = [
      "This monkey is just getting started.",
      "A level 2 monkey ready for action.",
      "Level 3 - This monkey is improving.",
      "This monkey is a decent competitor now!",
      "Level 5 - Great level balance.",
      "Top tier Monkey!",
      "This Monkey is now amongst the best!",
      "A well respected Monkey Level!",
      "Whoo! What a nice level!",
      "Max Level Monkey! Let's get the job done!"
    ];

    if (level >= 1 && level <= descriptions.length) {
      return descriptions[level - 1];
    }
    return "This monkey's level is a mystery!";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!monkey) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Monkey Not Found</h2>
        <p className="mb-6">The monkey you're looking for doesn't exist or has been removed.</p>
        <Link to="/gallery" className="btn-primary">
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/gallery" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Gallery
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`h-3 ${powerTypeColors[monkey.power_type]}`}></div>

          <div className="p-8">
            <div className="sm:flex items-start">
              <motion.div
                className="sm:w-1/3 mb-6 sm:mb-0 sm:mr-8 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Pokémon Image */}
                {pokemonImage ? (
                  <img
                    src={pokemonImage}
                    alt={`${monkey.name} Pokémon`}
                    className="w-48 h-48 object-contain animate-float"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">Loading...</div>
                )}
              </motion.div>

              <div className="sm:w-2/3">
                <div className="flex justify-between items-start">
                  <motion.h1
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {monkey.name}
                  </motion.h1>

                  <Link to={`/edit/${monkey.id}`} className="btn-secondary inline-flex items-center">
                    <Edit size={18} className="mr-2" />
                    Edit
                  </Link>
                </div>

                <motion.div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${powerTypeColors[monkey.power_type]} text-white`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {monkey.power_type} Specialist
                </motion.div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Monkey Stats</h2>

                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">Experience Level</span>
                      <span className="text-sm font-medium">{monkey.level}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <motion.div
                        className={`h-2.5 rounded-full ${powerTypeColors[monkey.power_type]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${monkey.level * 10}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      ></motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="bg-slate-100 rounded-lg p-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <p className="italic text-slate-700">{getLevelDescription(monkey.level)}</p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <h3 className="text-sm text-slate-500 mb-1">Specialty</h3>
                      <p className={`font-semibold ${powerTypeTextColors[monkey.power_type]}`}>{monkey.power_type}</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <h3 className="text-sm text-slate-500 mb-1">Combat Readiness</h3>
                      <p className="font-semibold">
                        {monkey.level >= 8 ? 'Elite' : monkey.level >= 5 ? 'Advanced' : 'Trainee'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MonkeyDetails;