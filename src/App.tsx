import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Monkey } from './types';

// Components
import Sidebar from './components/layout/Sidebar';

// Pages
import MainPage from './pages/MainPage';
import MonkeyGallery from './pages/MonkeyGallery';
import CreateMonkey from './pages/CreateMonkey';
import EditMonkey from './pages/EditMonkey';
import MonkeyDetails from './pages/MonkeyDetails';

function App() {
  const [monkeys, setMonkeys] = useState<Monkey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonkeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Monkeys')
        .select('*')
        .order('created_at', { ascending: false });
  
      console.log("✅ Monkeys data:", data);
      console.log("❌ Supabase error:", error);
  
      if (error) {
        console.error('Error fetching monkeys:', error);
      } else {
        setMonkeys(data || []);
      }
    } catch (error) {
      console.error('❗ Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchMonkeys();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/gallery" element={<MonkeyGallery monkeys={monkeys} refreshMonkeys={fetchMonkeys} />} />


          <Route path="/create" element={<CreateMonkey refreshMonkeys={fetchMonkeys} />} />
          <Route path="/edit/:id" element={<EditMonkey monkeys={monkeys} refreshMonkeys={fetchMonkeys} />} />
          <Route path="/details/:id" element={<MonkeyDetails monkeys={monkeys} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;