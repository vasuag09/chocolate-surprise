import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';

// --- Custom Chocolate Assets ---

const ChocolateAsset = ({ type }) => {
  switch (type) {
    case 'dairymilk':
      return (
        <div className="w-16 h-20 bg-[#2e003e] rounded-sm shadow-md flex items-center justify-center relative overflow-hidden border border-[#4a006a]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
          <div className="text-[8px] text-[#cda434] font-serif font-bold tracking-widest transform -rotate-45 z-10">OREO SILK</div>
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#cda434] rounded-full opacity-20 blur-sm"></div>
        </div>
      );
    case '5star':
      return (
        <div className="w-20 h-8 bg-gradient-to-r from-[#e6b31e] to-[#cf9f14] rounded-full shadow-md flex items-center justify-center relative border border-[#b8860b]">
          <div className="absolute top-1 left-2 w-16 h-2 bg-white/30 rounded-full blur-[1px]"></div>
          <div className="text-[10px] text-[#3e0000] font-black italic tracking-tighter z-10 drop-shadow-sm">5 STAR</div>
          <div className="absolute -right-1 top-0 text-white fill-white">
            <Sparkles size={8} className="text-white fill-current" />
          </div>
        </div>
      );
    case 'kitkat':
      return (
        <div className="w-16 h-12 bg-[#d80000] rounded-sm shadow-md flex items-center justify-center relative overflow-hidden border-b-4 border-[#a00000] transform skew-x-[-5deg]">
          <div className="absolute inset-y-0 left-1/2 w-1 bg-black/10"></div>
          <div className="bg-white px-1 py-0.5 transform -rotate-12 shadow-sm">
             <div className="text-[8px] text-[#d80000] font-black tracking-tighter uppercase">Have a Break, Have a kitkat</div>
          </div>
        </div>
      );
    case 'ferrero':
      return (
        <div className="w-14 h-14 rounded-full shadow-lg relative flex items-center justify-center">
           {/* Gold Foil Wrapper */}
           <div className="absolute inset-0 rounded-full bg-[#d4af37] border-2 border-[#b8860b] shadow-inner overflow-hidden">
              <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] [background-size:4px_4px]"></div>
           </div>
           {/* Sticker */}
           <div className="w-8 h-6 bg-white/90 rounded-full z-10 flex items-center justify-center shadow-sm">
             <div className="w-6 h-4 border border-[#d4af37] rounded-full"></div>
           </div>
           {/* Brown Cup Base */}
           <div className="absolute -bottom-1 w-10 h-4 bg-[#4a2c2a] rounded-full -z-10"></div>
        </div>
      );
    default:
      return null;
  }
};

const SURPRISE_ITEMS = [
  {
    id: 1,
    type: 'dairymilk',
    message: "Silkier than silk...",
    delay: 1,
    angle: -10
  },
  {
    id: 2,
    type: '5star',
    message: "Lost in your thoughts",
    delay: 3, // Adjusted timing
    angle: 15
  },
  {
    id: 3,
    type: 'kitkat',
    message: "You're my favorite break",
    delay: 5, // Adjusted timing
    angle: -5
  },
  {
    id: 4,
    type: 'ferrero',
    message: "Golden moments with you",
    delay: 7, // Adjusted timing
    angle: 10
  }
];

const FloatingParticle = ({ delay, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.8, 0],
      y: -150 - Math.random() * 150,
      x: (Math.random() - 0.5) * 200,
      scale: [0, 1, 0.5],
      rotate: Math.random() * 360
    }}
    transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: delay, ease: "easeOut" }}
    className="absolute pointer-events-none"
  >
    {type === 'heart' ? (
      <Heart className="w-3 h-3 text-pink-300 fill-pink-200" />
    ) : (
      <Sparkles className="w-3 h-3 text-yellow-300" />
    )}
  </motion.div>
);

export default function App() {
  const [stage, setStage] = useState('closed'); // closed, opening, open, revealed
  const [currentMessage, setCurrentMessage] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  // Handle the sequence of messages appearing
  useEffect(() => {
    if (stage === 'open') {
      let timeouts = [];
      
      SURPRISE_ITEMS.forEach((item, index) => {
        // We sync the text exactly to the delay plus a tiny buffer for the pop animation to start
        const timeout = setTimeout(() => {
          setCurrentMessage(item.message);
          if (index === SURPRISE_ITEMS.length - 1) {
            setTimeout(() => setStage('revealed'), 3500);
          }
        }, item.delay * 1000); 
        timeouts.push(timeout);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [stage]);

  const handleEggClick = () => {
    if (stage === 'closed') {
      setStage('opening');
      setTimeout(() => setStage('open'), 800);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000"
      style={{
        background: stage === 'revealed' 
          ? 'radial-gradient(circle at center, #fff0f5 0%, #ffe4e1 100%)' 
          : 'radial-gradient(circle at center, #fdfbf7 0%, #fce7f3 100%)'
      }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} type={i % 2 === 0 ? 'heart' : 'star'} />
        ))}
      </div>

      {/* Audio Toggle */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:bg-white/60 transition-all z-50 text-slate-600 group"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="text-pink-500" />}
      </button>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4">
        
        {/* Header Text */}
        <AnimatePresence mode="wait">
          {stage !== 'revealed' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16 text-center"
            >
              <h1 className="text-4xl font-bold text-slate-700 mb-2 font-serif tracking-tight">
                Sweet Surprise
              </h1>
              <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">
                {stage === 'closed' ? "Tap to Unwrap" : "Unwrapping Love..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The EGG Container */}
        <div className="relative w-72 h-96 flex items-center justify-center perspective-1000">
          
          {/* Shine effect behind the egg */}
          {stage === 'closed' && (
             <motion.div 
               animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-pink-400/20 blur-[60px] rounded-full -z-10"
             />
          )}

          {/* Items Container (Behind the egg initially) */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
             <AnimatePresence>
              {stage === 'open' || stage === 'revealed' ? (
                <>
                  {SURPRISE_ITEMS.map((item) => (
                    // PARENT MOTION DIV: Handles the Reveal/Entry
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, y: 80, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        y: 0, 
                        x: (item.id % 2 === 0 ? 1 : -1) * (50 * item.id + 20),
                        opacity: 1,
                        rotate: item.angle
                      }}
                      transition={{ 
                        delay: item.delay, 
                        type: "spring",
                        stiffness: 150,
                        damping: 15
                      }}
                      className="absolute flex items-center justify-center z-10"
                    >
                      {/* CHILD MOTION DIV: Handles the Idle Bobbing separately */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2.5, 
                          ease: "easeInOut",
                          delay: Math.random() // Random phase for bobbing is fine here
                        }}
                        className="transform hover:scale-110 transition-transform cursor-pointer"
                      >
                        <ChocolateAsset type={item.type} />
                      </motion.div>
                    </motion.div>
                  ))}
                  
                  {/* Golden Inner Glow when opened */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: 1, scale: 1.8 }}
                    transition={{ duration: 0.8 }}
                    className="absolute w-32 h-32 bg-yellow-200/50 blur-[50px] rounded-full -z-10"
                  />
                  
                  {/* Confetti Burst */}
                   <motion.div
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.8 }}
                    className="absolute w-full h-full border-4 border-pink-300 rounded-full z-0"
                  />
                </>
              ) : null}
             </AnimatePresence>
          </div>

          {/* The Egg Top Half (Cream/White) */}
          <motion.div
            className="absolute top-0 w-full h-1/2 z-20 origin-bottom cursor-pointer"
            animate={
              stage === 'opening' ? {
                x: [-2, 3, -2, 3, 0],
                rotate: [-2, 2, -2, 2, 0],
                y: -10
              } : stage === 'open' || stage === 'revealed' ? {
                y: -160,
                rotate: -25,
                opacity: 0,
                scale: 0.9
              } : {
                y: [0, -5, 0] // Gentle float when closed
              }
            }
            transition={
              stage === 'opening' ? { duration: 0.5 } 
              : stage === 'closed' ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
              : { duration: 0.8, type: "spring", bounce: 0.4 }
            }
            onClick={handleEggClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Main Shell Shape */}
            <div className="w-full h-full bg-[#fdfbf7] rounded-t-[50%] relative overflow-hidden shadow-[inset_-20px_-10px_40px_rgba(0,0,0,0.05),inset_10px_10px_20px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.05)] z-10">
               
               {/* Specular Highlight (The "shiny plastic" look) */}
               <div className="absolute top-12 left-10 w-20 h-10 bg-gradient-to-br from-white to-transparent rounded-full opacity-90 blur-[1px] transform -rotate-12"></div>
               
               {/* Subtle Rim Light */}
               <div className="absolute top-2 right-12 w-32 h-32 bg-white/40 rounded-full blur-xl"></div>
            </div>
            
            {/* Separation Tab */}
             <div className="absolute bottom-[-6px] left-[-5%] w-[110%] h-4 bg-[#f0f0f0] rounded-[50%] z-0 shadow-sm"></div>
          </motion.div>

          {/* The Egg Bottom Half (Red/Pink Wrapper) */}
          <motion.div
            className="absolute bottom-0 w-full h-1/2 z-20 origin-top cursor-pointer"
            animate={
              stage === 'opening' ? {
                x: [-2, 3, -2, 3, 0],
                rotate: [-2, 2, -2, 2, 0],
                y: 10
              } : stage === 'open' || stage === 'revealed' ? {
                y: 160,
                rotate: 25,
                opacity: 0,
                scale: 0.9
              } : {
                 y: [0, 5, 0] // Gentle float when closed
              }
            }
            transition={
              stage === 'opening' ? { duration: 0.5 } 
              : stage === 'closed' ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
              : { duration: 0.8, type: "spring", bounce: 0.4 }
            }
            onClick={handleEggClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
             {/* Main Wrapper Shape - Complex Gradient */}
             <div className="w-full h-full bg-gradient-to-b from-[#ff4d6d] to-[#c9184a] rounded-b-[50%] relative overflow-hidden shadow-[inset_-20px_-20px_50px_rgba(100,0,20,0.3),inset_5px_5px_15px_rgba(255,255,255,0.2),0_20px_40px_rgba(255,50,50,0.2)]">
                
                {/* Wave/Foil Pattern Overlay */}
                <div className="absolute top-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Branding Band */}
                <div className="absolute top-0 w-full h-16 bg-white flex items-center justify-center transform skew-y-3 origin-left shadow-lg border-b border-gray-100">
                   <div className="flex items-center gap-2 transform -skew-y-3">
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      <span className="text-red-500 font-black tracking-tighter text-lg uppercase font-sans">Kinder Joy Love</span>
                   </div>
                </div>

                {/* Bottom Shine */}
                <div className="absolute bottom-6 left-12 w-32 h-20 bg-pink-400/30 rounded-full blur-xl transform -rotate-12"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 rounded-full blur-lg"></div>
             </div>
             
             {/* Thumb Tab (For opening) */}
             <div className="absolute top-[-10px] right-[-10px] w-12 h-12 bg-[#ff4d6d] rounded-full border-4 border-white shadow-md z-30 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
             </div>
          </motion.div>

        </div>

        {/* Dynamic Messages Area */}
        <div className="h-32 mt-12 flex items-center justify-center w-full px-4 text-center z-30 perspective-500">
          <AnimatePresence mode="wait">
            {stage === 'open' && currentMessage && (
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, rotateX: 90, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: -90, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white/70 backdrop-blur-md px-8 py-4 rounded-full shadow-lg border border-white/50 text-slate-700 font-medium text-lg"
              >
                {currentMessage}
              </motion.div>
            )}
            
            {stage === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col items-center w-full"
              >
                <div className="bg-white/80 backdrop-blur-xl px-8 py-8 rounded-[2rem] shadow-2xl shadow-pink-200/50 text-center border border-white max-w-sm w-full relative overflow-hidden">
                  {/* Card decoration */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-red-300 to-pink-300"></div>
                  
                  <h2 className="text-3xl font-bold text-slate-800 mb-3 font-serif">You are the prize.</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">No chocolate is sweeter than you.</p>
                  
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto drop-shadow-lg" />
                    <motion.div 
                      animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-rose-400 rounded-full blur-xl -z-10"
                    />
                  </motion.div>

                  <button 
                    onClick={() => {
                        setStage('closed');
                        setCurrentMessage("");
                    }}
                    className="mt-8 px-6 py-2 rounded-full bg-slate-100 text-slate-500 text-xs font-bold tracking-widest hover:bg-slate-200 hover:text-slate-700 transition-all"
                  >
                    WRAP IT UP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-slate-400/60 text-[10px] font-bold tracking-[0.3em]">
        CHOCOLATE DAY EDITION
      </div>
    </div>
  );
}