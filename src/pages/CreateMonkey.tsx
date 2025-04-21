import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MonkeyPowerType, powerTypeColors } from '../types';

interface CreateMonkeyProps {
  refreshMonkeys: () => Promise<void>;
}

const CreateMonkey: React.FC<CreateMonkeyProps> = ({ refreshMonkeys }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    power_type: '' as MonkeyPowerType,
  });
  const [errors, setErrors] = useState({
    name: '',
    level: '',
    power_type: '',
  });
  const [loading, setLoading] = useState(false);

  const monkeyPowers: MonkeyPowerType[] = ([
    'None', 'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
    'Dragon', 'Dark', 'Steel', 'Fairy'
  ] as MonkeyPowerType[]).filter((power) => power !== 'None');  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePowerSelect = (power: MonkeyPowerType) => {
    setFormData(prev => ({
      ...prev,
      power_type: power,
    }));
    
    // Clear error when user selects a power
    if (errors.power_type) {
      setErrors(prev => ({
        ...prev,
        power_type: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      level: '',
      power_type: '',
    };
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate level
    if (!formData.level) {
      newErrors.level = 'Level is required';
      isValid = false;
    } else {
      const levelNum = parseInt(formData.level);
      if (isNaN(levelNum) || levelNum < 1 || levelNum > 10) {
        newErrors.level = 'Level must be between 1 and 10';
        isValid = false;
      }
    }

    // Validate power type
    if (!formData.power_type) {
      newErrors.power_type = 'Power type is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Convert level to number
      const monkeyData = {
        ...formData,
        level: parseInt(formData.level),
      };

      const { error } = await supabase
        .from('Monkeys')
        .insert(monkeyData)
        .select();

      if (error) {
        console.error('Error creating monkey:', error);
        throw error;
      }

      // Refresh the monkeys data in the parent component
      await refreshMonkeys();

      // Show success and navigate to gallery
      navigate('/gallery');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold mb-3">Create a New Pokémon</h1>
                  <p className="text-slate-600">
                    Add a new creature to your Poké team with unique types and levels.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="relative" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <img 
                    src="/src/Images/image_7.gif"
                    alt="Multiple Pokemon from series" 
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </motion.div>
              </div>

              <div className="md:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Pokemon Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter squad member's name"
                        className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <X size={16} className="mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">
                        Level (1-100)
                      </label>
                      <input
                        type="number"
                        id="level"
                        name="level"
                        min="1"
                        max="10"
                        value={formData.level}
                        onChange={handleChange}
                        placeholder="Enter level from 1-10"
                        className={`input-field ${errors.level ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {errors.level && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <X size={16} className="mr-1" /> {errors.level}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Pokemon Type
                    </label>
                    
                    {errors.power_type && (
                      <p className="mb-2 text-sm text-red-600 flex items-center">
                        <X size={16} className="mr-1" /> {errors.power_type}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {monkeyPowers.map((power) => (
                        <div 
                          key={power}
                          onClick={() => handlePowerSelect(power)}
                          className={`relative border rounded-lg p-4 cursor-pointer transition-all text-center ${
                            formData.power_type === power 
                              ? `border-2 ${powerTypeColors[power]} shadow-md` 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {formData.power_type === power && (
                            <span className={`absolute top-1 right-1 text-white ${powerTypeColors[power]} rounded-full p-0.5`}>
                              <Check size={14} />
                            </span>
                          )}
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{power}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>Create Monkey</>
                      )}
                    </button>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateMonkey;