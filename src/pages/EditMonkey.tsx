import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Trash2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Monkey, MonkeyPowerType, powerTypeColors } from '../types';

interface EditMonkeyProps {
  monkeys: Monkey[];
  refreshMonkeys: () => Promise<void>;
}

const EditMonkey: React.FC<EditMonkeyProps> = ({ monkeys, refreshMonkeys }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [monkey, setMonkey] = useState<Monkey | null>(null);
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
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const monkeyPowers: MonkeyPowerType[] = [
    'None', 'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
    'Dragon', 'Dark', 'Steel', 'Fairy'
  ] as MonkeyPowerType[];

  // Find monkey in props first (for quick rendering), then fetch from DB
  useEffect(() => {
    // Try to find the monkey in the props first
    const monkeyFromProps = monkeys.find(m => m.id.toString() === id);
    if (monkeyFromProps) {
      setMonkey(monkeyFromProps);
      setFormData({
        name: monkeyFromProps.name,
        level: monkeyFromProps.level.toString(),
        power_type: monkeyFromProps.power_type,
      });
    }
    
    // Fetch from Supabase
    async function fetchMonkey() {
      try {
        const { data, error } = await supabase
          .from('Monkeys')
          .select()
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching monkey:', error);
          navigate('/gallery');
          return;
        }

        setMonkey(data);
        setFormData({
          name: data.name,
          level: data.level.toString(),
          power_type: data.power_type,
        });
      } catch (error) {
        console.error('Error:', error);
        navigate('/gallery');
      }
    }
    
    fetchMonkey();
  }, [id, monkeys, navigate]);

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
        .update(monkeyData)
        .eq('id', id);

      if (error) {
        console.error('Error updating monkey:', error);
        throw error;
      }

      // Refresh the monkeys data in the parent component
      await refreshMonkeys();

      // Show success and navigate to details
      navigate(`/details/${id}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('Monkeys')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting monkey:', error);
        throw error;
      }

      // Refresh the monkeys data
      await refreshMonkeys();

      // Navigate to gallery
      navigate('/gallery');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!monkey) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <Link to={`/details/${id}`} className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Details
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`h-3 ${powerTypeColors[monkey.power_type]}`}></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold mb-3">Edit Monkey</h1>
                  <p className="text-slate-600">
                    Update <span className="font-medium">{monkey.name}'s</span> information and abilities.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-slate-100 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="font-medium mb-2">Current Information</h3>
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium">Name:</span> {monkey.name}
                  </p>
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium">Level:</span> {monkey.level}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Power:</span> {monkey.power_type}
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className={`
                      w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors
                      ${deleteConfirm 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
                    `}
                  >
                    <Trash2 size={18} className="mr-2" />
                    {deleteConfirm ? 'Confirm Deletion' : 'Delete Monkey'}
                  </button>
                  
                  {deleteConfirm && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Are you sure? This action cannot be undone.
                    </p>
                  )}
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
                        Monkey Name
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
                        Level (1-10)
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
                      Monkey Power Type
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
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Update Pokemon
                        </>
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

export default EditMonkey;