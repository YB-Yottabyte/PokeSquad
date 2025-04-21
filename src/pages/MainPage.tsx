import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
          Welcome to the <span className="text-blue-600">PokeSquad</span>!
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Strategically assemble your Pokemon squad to defend against those vicious 'Bloons' and conquer every challenge!
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div 
          className="card p-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Create Your Team</h2>
          <p className="text-slate-600 mb-6">
            Build your perfect defense team by selecting from powerful Pokemon types. 
            Each Pokemon brings unique abilities to help you pop those pesky bloons!
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center">
            Create Pokemon Team <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
        
        <motion.div 
          className="card p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Manage Your Team</h2>
          <p className="text-slate-600 mb-6">
            View your entire Pokemon squad, edit their stats, or check detailed information about each squad member.
          </p>
          <Link to="/gallery" className="btn-primary inline-flex items-center">
            View Squad <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </div>

      <motion.div 
        className="rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <img 
          src="/src/Images/image_4.png" 
          alt="Multiple Pokemon from Bloons TD" 
          className="w-full h-auto object-cover"
        />
      </motion.div>

      <motion.div 
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-4">Ready to Defend?</h2>
        <p className="text-slate-600 mb-6">
          Let's build your ultimate defense strategy with the perfect Pokemon squad!
        </p>
        <img 
          src="/src/Images/image.png" 
          alt="Purple MOAB from Bloons TD" 
          className="max-w-sm mx-auto rounded-xl shadow-lg animate-float"
        />
      </motion.div>
    </div>
  );
};

export default MainPage;
