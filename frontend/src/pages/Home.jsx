import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, BarChart3, ShieldCheck, Check, Star, Users, Zap, Briefcase } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden pb-20">
      
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] text-center w-full px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold text-indigo-300 border rounded-full border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
            <Sparkles size={16} />
            <span>FeedbackVortex Enterprise V3 is Now Live</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-purple-500 mb-8 drop-shadow-lg leading-tight">
            The Ultimate Feedback Infrastructure.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Unify customer feedback across dozens of companies and product lines. Listen to your users, leverage AI analytics, and build better products faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup" className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-white transition-all transform rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] z-10">
              Get Started for Free
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 text-lg font-bold transition-all border rounded-2xl text-indigo-900 dark:text-white border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 z-10">
              Sign In to Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. Features Grid */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Enterprise-grade capabilities</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to successfully manage user requests across multiple tenants and companies.</p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={<MessageCircle />} title="Omnichannel Collection" desc="Gather insights from in-app widgets, public pages, and email directly." />
          <FeatureCard icon={<Briefcase />} title="Multi-Company Targeting" desc="Allow users to submit feedback to specific corporate tenants or product lines." />
          <FeatureCard icon={<BotIcon />} title="AI Chatbot Assistant" desc="Instantly answer user queries using natural language processing." />
          <FeatureCard icon={<BarChart3 />} title="Command Center V2" desc="Visualize request volume and bug trajectories with live Recharts integration." />
        </motion.div>
      </section>

      {/* 3. Testimonials */}
      <section className="w-full py-24 px-4 bg-indigo-900/5 dark:bg-indigo-900/20 rounded-[3rem] my-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-16 text-center">Loved by Product Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard name="Sarah Jenkins" role="PM at TechFlow" text="FeedbackVortex transformed how we categorize feature requests. The AI assistant literally saves me hours every single day learning what users actually want." />
            <TestimonialCard name="David Chen" role="Founder, Nexus" text="The multi-tenant feature allows us to track feedback across 5 different products in one unified Command Center. Absolute game changer." />
            <TestimonialCard name="Elena Rodriguez" role="Lead Designer" text="I was blown away by the design out of the box. Dark mode is gorgeous, and the PWA native feel is top notch. It just works." />
          </div>
        </div>
      </section>

      {/* 4. Pricing */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard title="Starter" price="Free" features={["1 Product line", "Up to 100 tickets/mo", "Basic Analytics", "Community Support"]} />
          <PricingCard title="Pro" price="$49" isPopular features={["Unlimited Products", "AI Chatbot Assistant", "Command Center Analytics", "Priority Support"]} />
          <PricingCard title="Enterprise" price="Custom" features={["Custom Integrations", "Dedicated Account Manager", "SLA Guarantees", "White-labeling"]} />
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="p-8 border rounded-3xl bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/5 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <div className="p-8 border rounded-3xl bg-white dark:bg-black/30 border-black/5 dark:border-white/5 shadow-xl relative">
      <div className="flex text-yellow-500 mb-6 gap-1">
        {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
      </div>
      <p className="text-lg mb-8 italic text-gray-700 dark:text-gray-300">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ title, price, features, isPopular }) {
  return (
    <div className={`p-8 rounded-3xl border flex flex-col relative ${isPopular ? 'bg-indigo-600 border-indigo-500 shadow-2xl text-white transform scale-105 z-10' : 'bg-white dark:bg-[#0f0f13] border-black/10 dark:border-white/10 shadow-lg'}`}>
      {isPopular && <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold rounded-full text-white shadow-lg">MOST POPULAR</div>}
      <h3 className={`text-2xl font-bold mb-2 ${isPopular ? '' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
      <div className="mb-8">
        <span className="text-5xl font-black">{price}</span>
        {price !== "Custom" && <span className={`text-lg ml-2 ${isPopular ? 'text-indigo-200' : 'text-gray-500'}`}>/month</span>}
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            <Check size={20} className={isPopular ? 'text-white' : 'text-indigo-500'} />
            <span className={isPopular ? 'text-white' : 'text-gray-600 dark:text-gray-300'}>{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/signup" className={`w-full py-4 font-bold text-center transition-all rounded-xl ${isPopular ? 'bg-white text-indigo-900 hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'}`}>
        Get Started
      </Link>
    </div>
  );
}

function BotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  );
}
