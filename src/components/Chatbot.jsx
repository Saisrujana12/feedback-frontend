import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your Feedback Assistant. I can help you understand how to formulate great feedback or navigate the system. What can I help you with?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const msg = userMsg.text.toLowerCase();
      let botResponse = "I'm your AI Feedback Assistant! If you want to leave feedback, head to the 'Give Feedback' page.";
      
      if (msg.includes('how') || msg.includes('feedback')) {
        botResponse = "To give great feedback, navigate to 'Give Feedback'. Select your target company (like Apple or Google), classify it as a Bug or Feature, and provide details!";
      } else if (msg.includes('dashboard')) {
        botResponse = "Your dashboard is where you track all submitted feedback. Admins review it and update the status from 'Pending' to 'In Progress' or 'Completed'.";
      } else if (msg.includes('apple')) {
        botResponse = "Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in April 1976. It started in Jobs's garage to develop and sell the Apple I personal computer. Today, Apple is headquartered in Cupertino, California, at Apple Park. It is one of the world's most valuable companies, known for revolutionizing personal technology with the Macintosh, iPod, iPhone, iPad, and Apple Watch. Its massive ecosystem also includes services like Apple Music, iCloud, and the App Store. Let us know if your feedback is aimed at iOS, macOS, or specific hardware!";
      } else if (msg.includes('google')) {
        botResponse = "Google was founded in September 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University. Initially starting as a search engine project named 'BackRub', it quickly grew to dominate the internet. Today, Google is a subsidiary of Alphabet Inc., headquartered in Mountain View, California (the Googleplex). It offers a vast array of services including Search, YouTube, Android, Google Cloud, Workspace, and advanced AI projects like Gemini. What specific Google product are you leaving feedback for?";
      } else if (msg.includes('microsoft')) {
        botResponse = "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. It rose to dominate the personal computer operating system market with MS-DOS in the mid-1980s, followed by Windows. Headquartered in Redmond, Washington, Microsoft is now a massive global enterprise focusing on cloud computing (Azure), enterprise software (Office 365, Teams), hardware (Surface, Xbox), and AI (partnership with OpenAI, Copilot). Do you have feedback for a specific Microsoft service?";
      } else if (msg.includes('amazon')) {
        botResponse = "Amazon was founded by Jeff Bezos on July 5, 1994, from his garage in Bellevue, Washington. It began as an online marketplace for books before expanding into a multitude of product categories. Today, Amazon is headquartered in Seattle, Washington (with a second HQ in Arlington, Virginia) and is the world's largest online retailer and marketplace. It is also the global leader in cloud computing via Amazon Web Services (AWS), and massive in streaming, AI (Alexa), and logistics. Are you reviewing their e-commerce UX or AWS tools?";
      } else if (msg.includes('meta')) {
        botResponse = "Meta Platforms, formerly Facebook, Inc., was founded by Mark Zuckerberg, Eduardo Saverin, Andrew McCollum, Dustin Moskovitz, and Chris Hughes in February 2004 while they were students at Harvard University. What started as a college networking site has grown into the world's largest social media empire. Headquartered in Menlo Park, California, Meta owns Facebook, Instagram, WhatsApp, and Threads. It is also heavily invested in virtual reality and the metaverse through Reality Labs (Oculus). Is your feedback regarding social platforms or VR?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden z-50 shadow-2xl border border-indigo-500/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Bot size={24} />
                <span className="font-bold">AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 dark:bg-black/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-gray-800 dark:text-gray-100 rounded-tl-none border border-black/5 dark:border-white/5 backdrop-blur-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-black/10 dark:border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 glass-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex shrink-0 items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white z-50 hover:shadow-indigo-500/50 transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </motion.button>
    </>
  );
}
