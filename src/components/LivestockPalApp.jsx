import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Users, 
  Calendar, 
  Settings, 
  ChevronRight, 
  Plus, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  Sun,
  CloudRain,
  Shield,
  Home,
  Utensils,
  Thermometer,
  DollarSign,
  Phone,
  CheckCircle,
  AlertTriangle,
  Globe,
  HelpCircle,
  Menu,
  X,
  Clock
} from 'lucide-react';

/**
 * MOCK DATA & CONTENT REPOSITORY
 */
const LIVESTOCK_DATA = {
  cows: {
    id: 'cows',
    name: 'Cattle',
    icon: '🐮',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Dairy and beef cattle management.',
    guides: {
      feeding: [
        { title: 'Grazing', text: 'Ensure cattle have access to fresh grass for at least 6 hours.' },
        { title: 'Supplements', text: 'Provide salt licks to boost mineral intake.' },
        { title: 'Water', text: 'A mature cow needs 40-60 liters of water daily.' }
      ],
      disease: [
        { title: 'Foot & Mouth', text: 'Watch for blisters in mouth and feet. Isolate immediately.' },
        { title: 'Ticks', text: 'Dip or spray animals weekly to prevent tick-borne fever.' }
      ],
      housing: [
        { title: 'Ventilation', text: 'Sheds must be well-ventilated to prevent respiratory issues.' },
        { title: 'Flooring', text: 'Use concrete floors with slopes for easy cleaning.' }
      ],
      breeds: [
        { title: 'Bunaji (White Fulani)', text: 'Excellent for milk and resistant to heat.' },
        { title: 'Sokoto Gudali', text: 'Good for beef and dairy in dry regions.' }
      ]
    }
  },
  goats: {
    id: 'goats',
    name: 'Goats',
    icon: '🐐',
    color: 'bg-amber-100 text-amber-800',
    description: 'Hardy animals suitable for all seasons.',
    guides: {
      feeding: [
        { title: 'Browsing', text: 'Goats prefer leaves and shrubs over grass.' },
        { title: 'Dry Fodder', text: 'Feed hay or dry groundnut haulms during dry season.' }
      ],
      disease: [
        { title: 'PPR (Kata)', text: 'Vaccinate annually against PPR. Symptoms include discharge and sores.' }
      ],
      housing: [
        { title: 'Elevated Housing', text: 'Goats hate wet floors. Build sleeping areas on raised platforms.' }
      ],
      breeds: [
        { title: 'Red Sokoto', text: 'Famous for high-quality leather and meat.' },
        { title: 'West African Dwarf', text: 'Trypanotolerant and prolific breeders.' }
      ]
    }
  },
  poultry: {
    id: 'poultry',
    name: 'Poultry',
    icon: '🐔',
    color: 'bg-orange-100 text-orange-800',
    description: 'Layers, broilers, and local chickens.',
    guides: {
      feeding: [
        { title: 'Layers Mash', text: 'Feed 120g per bird daily for optimal egg production.' },
        { title: 'Calcium', text: 'Add oyster shells to feed for stronger eggshells.' }
      ],
      disease: [
        { title: 'Newcastle', text: 'Deadly viral disease. Follow a strict vaccination schedule.' },
        { title: 'Coccidiosis', text: 'Keep litter dry to prevent bloody diarrhea.' }
      ],
      housing: [
        { title: 'Deep Litter', text: 'Use wood shavings (3-4 inches deep) to absorb droppings.' }
      ],
      breeds: [
        { title: 'Isa Brown', text: 'Commercial layers for high egg production.' },
        { title: 'Noiler', text: 'Dual purpose bird suitable for Nigerian backyard farming.' }
      ]
    }
  },
  sheep: {
    id: 'sheep',
    name: 'Sheep',
    icon: '🐑',
    color: 'bg-stone-200 text-stone-800',
    description: 'Grazers for meat and wool.',
    guides: {
      feeding: [
        { title: 'Grazing', text: 'Sheep are grazers. They need good quality pasture.' }
      ],
      disease: [
        { title: 'Bloat', text: 'Avoid grazing on wet, lush legumes early in the morning.' }
      ],
      housing: [
        { title: 'Shelter', text: 'Protect from rain and cold winds to prevent pneumonia.' }
      ],
      breeds: [
        { title: 'Yankasa', text: 'Most common breed in Nigeria.' },
        { title: 'Balami', text: 'Large white sheep, excellent for ram fattening.' }
      ]
    }
  }
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ha', label: 'Hausa' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
];

const TRANSLATIONS = {
  en: { welcome: 'Welcome back', dashboard: 'My Farm', guides: 'Guides', reminders: 'Tasks', settings: 'Settings' },
  ha: { welcome: 'Barka da zuwa', dashboard: 'Gona ta', guides: 'Jagora', reminders: 'Ayyuka', settings: 'Saituna' },
  yo: { welcome: 'Kaabo pada', dashboard: 'Oko mi', guides: 'Itọsọna', reminders: 'Awọn iṣẹ-ṣiṣe', settings: 'Eto' },
  ig: { welcome: 'Nnoo', dashboard: 'Ugbo m', guides: 'Nduzi', reminders: 'Oru', settings: 'Ntọala' }
};

/**
 * UTILITIES
 */
const hashPassword = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
    hash = hash >>> 0; // Convert to unsigned 32 bit integer
  }
  return hash.toString();
};

const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * COMPONENT: Button
 */
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 hover:bg-emerald-800",
    secondary: "bg-amber-100 text-amber-900 hover:bg-amber-200",
    outline: "border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50",
    ghost: "text-stone-600 hover:bg-stone-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

/**
 * COMPONENT: Input
 */
const Input = ({ label, type = 'text', value, onChange, placeholder, icon: Icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-3.5 text-stone-400 w-5 h-5" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-stone-200 text-stone-800 rounded-xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm`}
      />
    </div>
  </div>
);

/**
 * COMPONENT: Alert
 */
const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 text-red-800 border border-red-100',
    success: 'bg-green-50 text-green-800 border border-green-100'
  };
  return (
    <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${styles[type]} flex items-center gap-2 animate-in fade-in slide-in-from-top-2`}>
      {type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
      {message}
    </div>
  );
};

/**
 * COMPONENT: AddReminderForm (State now fully encapsulated here)
 */
const AddReminderForm = ({ onSaveReminder }) => {
    // Local state for the form input
    const [newReminder, setNewReminder] = useState({ 
        type: 'Feeding', 
        time: '08:00', // Default time
        livestock: 'cows', 
        note: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewReminder(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = () => {
        if (!newReminder.time || !newReminder.note) return;
        
        // Pass the final reminder object back to the parent
        onSaveReminder(newReminder);
        
        // Reset local state after submission
        setNewReminder({ 
            type: 'Feeding', 
            time: '08:00', 
            livestock: 'cows', 
            note: '' 
        });
    };

    return (
        <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
              <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700"><Plus size={20} /></div>
              Add New Task
            </h3>
            
            <div className="space-y-4">
              {/* Livestock Select */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase ml-1 mb-1 block">Livestock</label>
                <select 
                  name="livestock"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-700 focus:outline-emerald-500"
                  value={newReminder.livestock}
                  onChange={handleChange}
                >
                  {Object.values(LIVESTOCK_DATA).map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Activity Type Select */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase ml-1 mb-1 block">Activity Type</label>
                <select 
                  name="type"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-700 focus:outline-emerald-500"
                  value={newReminder.type}
                  onChange={handleChange}
                >
                  <option value="Feeding">Feeding</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Checkup">Checkup</option>
                </select>
              </div>
              
              {/* Time and Details Inputs */}
              <div className="grid grid-cols-2 gap-4">
                {/* Time Input */}
                <div>
                    <label className="text-xs font-bold text-stone-500 uppercase ml-1 mb-1 block">Time</label>
                    <input 
                        type="time" 
                        name="time"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-700 focus:outline-emerald-500"
                        value={newReminder.time}
                        onChange={handleChange}
                    />
                </div>
                {/* Details Input (Now fixed by local state) */}
                <div>
                     <label className="text-xs font-bold text-stone-500 uppercase ml-1 mb-1 block">Details</label>
                     <input 
                        type="text" 
                        name="note"
                        placeholder="e.g. Give hay"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-700 focus:outline-emerald-500"
                        value={newReminder.note}
                        onChange={handleChange}
                    />
                </div>
              </div>
              
              <Button onClick={handleSubmit} variant="primary" className="py-3 mt-4">Save Task</Button>
            </div>
        </div>
    );
};

/**
 * COMPONENT: Booking Modal
 */
const BookingModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [bookingDetails, setBookingDetails] = useState({
        vet: 'Dr. Abubakar',
        time: '14:30',
        date: '2024-12-20',
        issue: ''
    });

    if (!isOpen) return null;

    const handleBooking = () => {
        setStep(2);
        setTimeout(() => setStep(3), 2500);
    };

    const handleClose = () => {
        setStep(1);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 ease-out duration-300">
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                {step === 1 && (
                    <>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">Book Vet Consultation</h3>
                        <p className="text-stone-600 mb-6">Schedule a 30-minute video session with a certified vet for ₦2,000.</p>
                        
                        <div className="space-y-4">
                            <Input 
                                label="Veterinarian" 
                                value={bookingDetails.vet}
                                onChange={() => {}} // Read-only for mock
                                placeholder=""
                                icon={Users}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Preferred Date" 
                                    type="date"
                                    value={bookingDetails.date}
                                    onChange={e => setBookingDetails({...bookingDetails, date: e.target.value})}
                                    placeholder=""
                                />
                                <Input 
                                    label="Preferred Time" 
                                    type="time"
                                    value={bookingDetails.time}
                                    onChange={e => setBookingDetails({...bookingDetails, time: e.target.value})}
                                    placeholder=""
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">Describe Issue</label>
                                <textarea
                                    value={bookingDetails.issue}
                                    onChange={e => setBookingDetails({...bookingDetails, issue: e.target.value})}
                                    placeholder="e.g. My goat has been limping for two days."
                                    rows="3"
                                    className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                                />
                            </div>
                            <Button onClick={handleBooking}>
                                Confirm Booking & Pay ₦2,000
                            </Button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div className="text-center py-10">
                        <Clock size={48} className="animate-spin text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-stone-800">Processing Payment...</h3>
                        <p className="text-stone-500 mt-2">Connecting to payment gateway.</p>
                    </div>
                )}
                
                {step === 3 && (
                    <div className="text-center py-10">
                        <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">Booking Confirmed!</h3>
                        <p className="text-stone-600 font-medium">Your session is scheduled for {bookingDetails.date} at {bookingDetails.time}.</p>
                        <p className="text-stone-500 text-sm mt-1">A video link will be sent to your phone number.</p>
                        <Button onClick={handleClose} className="mt-8" variant="outline">
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};


/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [view, setView] = useState('splash');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLivestock, setActiveLivestock] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', pin: '', securityQ: '', securityA: '' });
  const [authError, setAuthError] = useState('');
  const [reminders, setReminders] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // New state for modal

  useEffect(() => {
    // NOTE: In a real app, Firebase would handle user persistence
    setTimeout(() => {
      const storedUser = localStorage.getItem('lp_currentUser');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        setLanguage(u.language || 'en');
        loadReminders(u.phone);
        setView('dashboard');
      } else {
        setView('login');
      }
      setLoading(false);
    }, 2000);
  }, []);

  const handleAuthChange = (field, value) => {
    setAuthError('');
    setFormData(prev => ({...prev, [field]: value}));
  }

  const handleSignup = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('lp_users') || '[]');
    if (users.find(u => u.phone === formData.phone)) {
      setAuthError('User with this phone number already exists.');
      return;
    }

    const newUser = {
      ...formData,
      password: hashPassword(formData.password),
      language: 'en',
      joined: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('lp_users', JSON.stringify(users));
    localStorage.setItem('lp_currentUser', JSON.stringify(newUser));
    
    setUser(newUser);
    loadReminders(newUser.phone);
    setView('dashboard');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('lp_users') || '[]');
    const foundUser = users.find(u => u.phone === formData.phone && u.password === hashPassword(formData.password));

    if (foundUser) {
      localStorage.setItem('lp_currentUser', JSON.stringify(foundUser));
      setUser(foundUser);
      setLanguage(foundUser.language || 'en');
      loadReminders(foundUser.phone);
      setView('dashboard');
    } else {
      setAuthError('Invalid phone number or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lp_currentUser');
    setUser(null);
    setFormData({ name: '', phone: '', password: '', pin: '', securityQ: '', securityA: '' });
    setView('login');
  };

  const handleUpdateProfile = (updates) => {
    const users = JSON.parse(localStorage.getItem('lp_users') || '[]');
    const updatedUsers = users.map(u => u.phone === user.phone ? { ...u, ...updates } : u);
    const updatedCurrentUser = { ...user, ...updates };

    localStorage.setItem('lp_users', JSON.stringify(updatedUsers));
    localStorage.setItem('lp_currentUser', JSON.stringify(updatedCurrentUser));
    setUser(updatedCurrentUser);
  };

  const loadReminders = (userId) => {
    const allReminders = JSON.parse(localStorage.getItem('lp_reminders') || '[]');
    setReminders(allReminders.filter(r => r.userId === userId));
  };

  // Handler passed to AddReminderForm
  const handleSaveReminder = (newReminderData) => {
    const reminder = {
      id: generateId(),
      userId: user.phone,
      ...newReminderData,
      completed: false
    };
    const allReminders = JSON.parse(localStorage.getItem('lp_reminders') || '[]');
    const updatedAll = [...allReminders, reminder];
    localStorage.setItem('lp_reminders', JSON.stringify(updatedAll));
    setReminders(updatedAll.filter(r => r.userId === user.phone));
  };

  const deleteReminder = (id) => {
    const allReminders = JSON.parse(localStorage.getItem('lp_reminders') || '[]');
    const updatedAll = allReminders.filter(r => r.id !== id);
    localStorage.setItem('lp_reminders', JSON.stringify(updatedAll));
    setReminders(updatedAll.filter(r => r.userId === user.phone));
  };

  // --- LAYOUT HELPERS ---
  const MainLayout = ({ children, title, showBack = false }) => (
    <div className="min-h-screen bg-stone-50 md:flex">
      {/* Desktop Sidebar/Navbar */}
      <div className="hidden md:flex flex-col w-64 bg-emerald-900 text-white fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
           <Leaf className="text-emerald-400" />
           <span className="font-bold text-xl">LivestockPal</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'dashboard' ? 'bg-emerald-800 text-emerald-100 font-bold' : 'hover:bg-emerald-800/50 text-emerald-200'}`}>
             <Home size={20} /> My Farm
          </button>
          <button onClick={() => setView('reminders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'reminders' ? 'bg-emerald-800 text-emerald-100 font-bold' : 'hover:bg-emerald-800/50 text-emerald-200'}`}>
             <Calendar size={20} /> Tasks
             {reminders.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{reminders.length}</span>}
          </button>
          <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'settings' ? 'bg-emerald-800 text-emerald-100 font-bold' : 'hover:bg-emerald-800/50 text-emerald-200'}`}>
             <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-emerald-800">
           <div className="flex items-center gap-3 px-4 py-2">
             <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name.charAt(0)}
             </div>
             <div className="text-sm">
                <p className="font-bold text-emerald-100">{user?.name.split(' ')[0]}</p>
                <button onClick={handleLogout} className="text-emerald-400 text-xs hover:text-white">Sign Out</button>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 relative pb-20 md:pb-0">
         {/* Desktop Header Bar (Visible md+) */}
         <div className="hidden md:flex bg-white border-b border-stone-200 px-8 py-4 justify-between items-center sticky top-0 z-50">
            <h2 className="text-2xl font-bold text-stone-800">{title || TRANSLATIONS[language][view]}</h2>
            <div className="flex items-center gap-4 text-stone-500">
               <span className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-sm"><CloudRain size={14} /> 28°C</span>
               <span>{new Date().toLocaleDateString()}</span>
            </div>
         </div>

         {/* Mobile Header (Visible < md) */}
         <div className="md:hidden bg-emerald-700 text-white p-4 sticky top-0 z-40 flex items-center shadow-md">
            {showBack && (
              <button onClick={() => setView('dashboard')} className="mr-3 p-1 hover:bg-emerald-600 rounded-full">
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-lg font-bold flex-1">{title || (view === 'dashboard' ? 'LivestockPal' : TRANSLATIONS[language][view])}</h1>
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-sm border border-emerald-500">
              {user?.name.charAt(0)}
            </div>
         </div>

         {/* Content Scroll Area */}
         <div className="p-0 md:p-8 max-w-7xl mx-auto">
            {children}
         </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-3 flex justify-between items-center pb-safe z-50">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-emerald-700' : 'text-stone-400'}`}
        >
          <Home size={24} className={view === 'dashboard' ? 'fill-emerald-100' : ''} />
          <span className="text-xs font-medium">{TRANSLATIONS[language].dashboard}</span>
        </button>
        <button 
          onClick={() => setView('reminders')}
          className={`flex flex-col items-center gap-1 ${view === 'reminders' ? 'text-emerald-700' : 'text-stone-400'}`}
        >
          <div className="relative">
            <Calendar size={24} className={view === 'reminders' ? 'fill-emerald-100' : ''} />
            {reminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {reminders.length}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">{TRANSLATIONS[language].reminders}</span>
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-1 ${view === 'settings' ? 'text-emerald-700' : 'text-stone-400'}`}
        >
          <Settings size={24} className={view === 'settings' ? 'fill-emerald-100' : ''} />
          <span className="text-xs font-medium">{TRANSLATIONS[language].settings}</span>
        </button>
      </div>
      
      {/* Booking Modal Render */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </div>
  );

  // --- VIEWS ---

  if (loading || view === 'splash') {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-sm animate-bounce">
          <Leaf size={64} className="text-emerald-300" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">LivestockPal</h1>
        <p className="text-emerald-200 text-lg">Your Farm's Best Friend</p>
        <span className='text-gray-200 text-sm text-center font-mono'>&copy; Copyrighted. All Rights Reserved</span>
        <span className='text-gray-300 text-sm text-center font-stretch-semi-condensed'>Shafii Muhammad Shafii</span>
      </div>
    );
  }

  // --- AUTH VIEW (RESPONSIVE) ---
  if (['login', 'signup', 'forgot'].includes(view)) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
        {/* Left Side (Desktop Branding) / Top Header (Mobile) */}
        <div className="bg-emerald-800 md:w-1/2 h-48 md:h-screen relative flex flex-col items-center justify-center shadow-lg md:shadow-none p-6 text-center z-10">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600 to-emerald-900"></div>
           <Leaf size={64} className="text-emerald-300 mb-4 hidden md:block" />
           <Leaf size={48} className="text-emerald-200/50 absolute top-10 left-10 md:hidden" />
           <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 relative z-10">LivestockPal</h1>
           <p className="text-emerald-200 text-sm md:text-xl max-w-md">The complete digital guide for modern farmers. Manage your livestock efficiently.</p>
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 -mt-10 md:mt-0 z-20">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6 text-center">
              {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            
            <Alert type="error" message={authError} />

            <form onSubmit={view === 'signup' ? handleSignup : handleLogin}>
              {view === 'signup' && (
                <Input 
                  label="Full Name" 
                  value={formData.name} 
                  onChange={e => handleAuthChange('name', e.target.value)}
                  placeholder="Musa Bello"
                  icon={Users}
                />
              )}
              
              <Input 
                label="Phone Number" 
                type="tel"
                value={formData.phone} 
                onChange={e => handleAuthChange('phone', e.target.value)}
                placeholder="080 1234 5678"
                icon={Phone}
              />

              {(view === 'login' || view === 'signup') && (
                <Input 
                  label="Password" 
                  type="password"
                  value={formData.password} 
                  onChange={e => handleAuthChange('password', e.target.value)}
                  placeholder="••••••"
                  icon={Shield}
                />
              )}

              {view === 'signup' && (
                <>
                  <Input 
                    label="Security Question" 
                    placeholder="e.g. My first pet?"
                    value={formData.securityQ}
                    onChange={e => handleAuthChange('securityQ', e.target.value)}
                    icon={HelpCircle}
                  />
                  <Input 
                    label="Answer" 
                    placeholder="Bingo"
                    value={formData.securityA}
                    onChange={e => handleAuthChange('securityA', e.target.value)}
                  />
                </>
              )}

              <div className="mt-8">
                <Button type="submit">
                  {view === 'login' ? 'Login' : view === 'signup' ? 'Start Farming' : 'Reset'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center space-y-3">
              {view === 'login' ? (
                <>
                  <p className="text-stone-500 text-sm">
                    Don't have an account? <button onClick={() => {setAuthError(''); setView('signup');}} className="text-emerald-700 font-bold hover:underline">Sign up</button>
                  </p>
                  <button onClick={() => setView('forgot')} className="text-stone-400 text-sm hover:text-stone-600">Forgot Password?</button>
                </>
              ) : (
                <p className="text-stone-500 text-sm">
                  Already have an account? <button onClick={() => {setAuthError(''); setView('login');}} className="text-emerald-700 font-bold hover:underline">Login</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  if (view === 'dashboard') {
    return (
      <MainLayout>
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-3 lg:col-span-3">
            {/* Hero/Welcome Card - Mobile vs Desktop Styles handled via grid/padding */}
            <div className="bg-emerald-700 text-white p-6 md:p-10 rounded-b-[32px] md:rounded-[32px] shadow-lg mb-6 md:mb-8 relative overflow-hidden">
               <div className="absolute right-0 top-0 opacity-10 p-8 hidden md:block">
                  <Sun size={120} />
               </div>
               <div className="relative z-10 md:flex md:items-center md:justify-between">
                 <div>
                    <p className="text-emerald-200 text-sm mb-1 font-medium tracking-wide uppercase">
                      Overview
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">Hello, {user.name.split(' ')[0]}</h2>
                    <p className="text-emerald-100 text-sm md:text-base max-w-lg">
                      Here's what's happening on your farm today. 
                      You have {reminders.length} pending tasks.
                    </p>
                 </div>
                 
                 <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-start gap-3 md:w-80">
                   <div className="bg-amber-400 p-2 rounded-lg text-amber-900 shrink-0">
                     <Sun size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm mb-1">Daily Farming Tip</h3>
                     <p className="text-xs text-emerald-100 leading-relaxed">
                       Harmattan season is approaching. Ensure your poultry house is free of drafts.
                     </p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="px-6 md:px-0">
              <h3 className="text-stone-800 font-bold text-lg mb-4 flex items-center gap-2">
                <Leaf className="text-emerald-600" size={20} /> 
                Livestock Guides
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {Object.values(LIVESTOCK_DATA).map((animal) => (
                  <button 
                    key={animal.id}
                    onClick={() => {
                      setActiveLivestock(animal);
                      setView('detail');
                    }}
                    className={`p-4 md:p-6 rounded-2xl ${animal.color} transition-all hover:shadow-md active:scale-95 text-left flex flex-col justify-between h-32 md:h-48 relative overflow-hidden group shadow-sm cursor-pointer`}
                  >
                    <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                      {animal.icon}
                    </div>
                    <div className="relative z-10">
                      <span className="text-3xl md:text-4xl mb-2 block">{animal.icon}</span>
                      <span className="font-bold text-lg block">{animal.name}</span>
                    </div>
                    <div className="relative z-10 mt-auto">
                      <span className="text-xs md:text-sm opacity-80 flex items-center gap-1 font-medium bg-white/30 w-fit px-2 py-1 rounded-lg">
                        View Guide <ChevronRight size={12} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Revenue Placeholder / Booking Button */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden md:flex md:items-center md:justify-between">
                 <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                   <DollarSign size={200} />
                 </div>
                 <div className="relative z-10 mb-4 md:mb-0">
                   <h4 className="font-bold text-xl mb-2">Premium Vet Consult</h4>
                   <p className="text-sm text-indigo-100 max-w-md">Get professional advice from certified veterinarians via video call. Available 24/7 for emergencies.</p>
                 </div>
                 <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="relative z-10 bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors whitespace-nowrap active:scale-95"
                 >
                   Book Now (₦2,000)
                 </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // --- DETAIL VIEW ---
  if (view === 'detail' && activeLivestock) {
    return (
      <MainLayout showBack={true} title={activeLivestock.name}>
        <div className="md:px-0">
          {/* Banner */}
          <div className={`${activeLivestock.color} md:rounded-3xl p-6 pb-12 md:pb-12 md:p-12 flex flex-col items-center justify-center text-center relative mb-0 md:mb-8`}>
            <button onClick={() => setView('dashboard')} className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/40 md:hidden">
               <ArrowLeft size={24} />
            </button>
            <div className="text-6xl md:text-8xl mb-4 animate-bounce-slow">{activeLivestock.icon}</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{activeLivestock.name} Guide</h2>
            <p className="opacity-80 max-w-md text-sm md:text-lg font-medium">{activeLivestock.description}</p>
          </div>

          <div className="flex-1 bg-white rounded-t-[32px] md:rounded-3xl -mt-6 md:mt-0 p-6 md:p-8 shadow-up md:shadow-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Feeding Section */}
              <section className="bg-white md:bg-stone-50 md:p-6 md:rounded-2xl md:border md:border-stone-100">
                <h3 className="font-bold text-lg text-stone-800 mb-4 flex items-center gap-2 border-b md:border-none pb-2 md:pb-0 border-stone-100">
                  <Utensils size={20} className="text-orange-500" /> Feeding
                </h3>
                <div className="grid gap-3">
                  {activeLivestock.guides.feeding.map((g, i) => (
                    <div key={i} className="bg-orange-50 p-4 rounded-xl border border-orange-100 hover:bg-orange-100/50 transition-colors">
                      <h4 className="font-bold text-orange-900 text-sm mb-1">{g.title}</h4>
                      <p className="text-stone-600 text-xs md:text-sm leading-relaxed">{g.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Disease Section */}
              <section className="bg-white md:bg-stone-50 md:p-6 md:rounded-2xl md:border md:border-stone-100">
                <h3 className="font-bold text-lg text-stone-800 mb-4 flex items-center gap-2 border-b md:border-none pb-2 md:pb-0 border-stone-100">
                  <Thermometer size={20} className="text-red-500" /> Disease Prevention
                </h3>
                <div className="grid gap-3">
                  {activeLivestock.guides.disease.map((g, i) => (
                    <div key={i} className="bg-red-50 p-4 rounded-xl border border-red-100 hover:bg-red-100/50 transition-colors">
                      <h4 className="font-bold text-red-900 text-sm mb-1">{g.title}</h4>
                      <p className="text-stone-600 text-xs md:text-sm leading-relaxed">{g.text}</p>
                    </div>
                  ))}
                </div>
              </section>

               {/* Housing Section */}
               <section className="bg-white md:bg-stone-50 md:p-6 md:rounded-2xl md:border md:border-stone-100">
                <h3 className="font-bold text-lg text-stone-800 mb-4 flex items-center gap-2 border-b md:border-none pb-2 md:pb-0 border-stone-100">
                  <Home size={20} className="text-blue-500" /> Housing
                </h3>
                <div className="grid gap-3">
                  {activeLivestock.guides.housing.map((g, i) => (
                    <div key={i} className="bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100/50 transition-colors">
                      <h4 className="font-bold text-blue-900 text-sm mb-1">{g.title}</h4>
                      <p className="text-stone-600 text-xs md:text-sm leading-relaxed">{g.text}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // --- REMINDERS VIEW ---
  if (view === 'reminders') {
    return (
      <MainLayout>
        <div className="px-6 md:px-0 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Add Reminder Form - Now handles its own state for stable inputs */}
          <AddReminderForm 
            onSaveReminder={handleSaveReminder}
          />

          {/* List */}
          <div className="w-full md:w-2/3">
             <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                    <h3 className="font-bold text-lg text-stone-800">Your Schedule</h3>
                </div>
                <div className="p-6 space-y-3 min-h-[300px]">
                    {reminders.length === 0 ? (
                    <div className="text-center py-12 opacity-50 flex flex-col items-center">
                        <Calendar size={64} className="mb-4 text-stone-300" />
                        <p className="text-stone-500 font-medium">No tasks scheduled yet.</p>
                        <p className="text-stone-400 text-sm">Add a task to get started.</p>
                    </div>
                    ) : (
                    reminders.map(r => (
                        <div key={r.id} className="group bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                                r.type === 'Feeding' ? 'bg-orange-100 text-orange-600' : 
                                r.type === 'Vaccination' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                                {r.type === 'Feeding' && <Utensils size={20} />}
                                {r.type === 'Vaccination' && <Shield size={20} />}
                                {r.type === 'Cleaning' && <Home size={20} />}
                                {r.type === 'Checkup' && <Thermometer size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800">{r.note}</h4>
                                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{LIVESTOCK_DATA[r.livestock]?.name}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12}/> Today at {r.time}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => deleteReminder(r.id)}
                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Task"
                        >
                            <Trash2 size={20} />
                        </button>
                        </div>
                    ))
                    )}
                </div>
             </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // --- SETTINGS VIEW ---
  if (view === 'settings') {
    return (
      <MainLayout>
        <div className="px-6 md:px-0 max-w-2xl mx-auto space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl text-emerald-800 border-4 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-stone-900">{user.name}</h3>
              <p className="text-stone-500">{user.phone}</p>
              <div className="flex gap-2 mt-3">
                 <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded font-medium">Free Plan</span>
                 <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">Member since {new Date(user.joined).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            {/* Language Selection */}
            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-100">
                    <h4 className="text-stone-800 font-bold flex items-center gap-2"><Globe size={18} /> Language Preference</h4>
                </div>
                <div className="divide-y divide-stone-100">
                {LANGUAGES.map(lang => (
                    <button
                    key={lang.code}
                    onClick={() => {
                        setLanguage(lang.code);
                        handleUpdateProfile({ language: lang.code });
                    }}
                    className={`w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors ${language === lang.code ? 'bg-emerald-50/50' : ''}`}
                    >
                    <div className="flex items-center gap-3">
                        <span className={`text-sm ${language === lang.code ? 'font-bold text-emerald-800' : 'text-stone-700'}`}>
                        {lang.label}
                        </span>
                    </div>
                    {language === lang.code && <CheckCircle size={18} className="text-emerald-600" />}
                    </button>
                ))}
                </div>
            </section>

            {/* Actions */}
            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-100">
                    <h4 className="text-stone-800 font-bold flex items-center gap-2"><Settings size={18} /> Account Actions</h4>
                </div>
                <div className="p-2">
                    <button 
                        onClick={handleLogout}
                        className="w-full p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                    >
                        <LogOut size={18} />
                        Sign Out of Device
                    </button>
                </div>
            </section>
          </div>

          <div className="text-center mt-8 pb-8">
            <p className="text-stone-400 text-xs">LivestockPal v1.1.0 (Desktop & Mobile)</p>
            <p className="text-stone-300 text-[10px] mt-1">Made for Nigeria 🇳🇬</p>
          </div>

        </div>
      </MainLayout>
    );
  }

  return null; // Fallback
}