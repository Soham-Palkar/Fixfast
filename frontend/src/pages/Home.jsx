import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Search, 
  Users, 
  Zap, 
  Award,
  ThumbsUp,
  MapPin,
  ChevronRight
} from "lucide-react";

const services = [
  { id: "plumber", name: "Plumbing", price: "Starts from ₹299", image: "/images/services/Plumbing.png", desc: "Leakage repair, pipe fitting, tap replacement and bathroom issues.", },
  { id: "electrician", name: "Electrician", price: "Starts from ₹199", image: "/images/services/Electrician.png", desc: "Fan, switchboard, wiring, MCB, and lighting solutions.", },
  { id: "ac-repair", name: "AC Repair", price: "Starts from ₹499", image: "/images/services/AC-Repair.png", desc: "AC servicing, gas refill, cooling issue and installation support.", },
  { id: "painter", name: "Painting", price: "Starts from ₹999", image: "/images/services/Painting.png", desc: "Wall painting, touch-up work, waterproof coating and finishes.", },
  { id: "deep-cleaning", name: "Deep Cleaning", price: "Starts from ₹799", image: "/images/services/Deep-Cleaning.png", desc: "Kitchen, bathroom, sofa, mattress and full home deep cleaning.", },
  { id: "carpenter", name: "Carpentry", price: "Starts from ₹399", image: "/images/services/Carpentry.png", desc: "Furniture repair, door fitting, shelf installation and more.", },
];

const testimonials = [
  { name: "Ananya Iyer", role: "Homeowner", content: "FixFast is a lifesaver! The electrician arrived within 20 minutes and fixed our short circuit issue perfectly.", avatar: "https://i.pravatar.cc/150?img=44" },
  { name: "Vikram Malhotra", role: "Property Manager", content: "I use FixFast for all my rental properties. Reliable, transparent pricing, and top-notch professionalism.", avatar: "https://i.pravatar.cc/150?img=68" },
  { name: "Sara Khan", role: "Working Professional", content: "Finally, a service that values my time. The deep cleaning was thorough and very professionally handled.", avatar: "https://i.pravatar.cc/150?img=47" },
];

export default function Home() {
  const navigate = useNavigate();

  const goToServices = () => navigate("/services");
  const goToSignup = () => navigate("/signup");

  return (
    <div className="flex flex-col bg-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-48 bg-mesh-emerald overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-brand-200/20 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-[300px] md:h-[300px] bg-emerald-100/30 rounded-full blur-[60px] md:blur-[100px] -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-brand-100 text-brand-700 font-bold text-xs mb-8 shadow-sm">
                <Badge variant="secondary" className="bg-brand-500 text-white border-none text-[10px] uppercase tracking-tighter px-2">New</Badge>
                FixFast is now live in your city
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-surface-950 leading-[1.1] lg:leading-[0.95] tracking-tight">
                Premium Home <br />
                <span className="text-gradient-emerald">Repairs.</span>
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-surface-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Connect with highly-skilled, background-checked professionals for plumbing, electrical, and more—delivered to your doorstep in minutes.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button size="lg" className="h-16 px-10 text-lg font-bold bg-brand-600 hover:bg-brand-700 shadow-2xl shadow-brand-500/20 group" onClick={goToServices}>
                  Book a Service
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <div className="flex items-center gap-4 justify-center">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-lg transform hover:-translate-y-1 transition">
                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center text-yellow-500">
                       <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="text-xs font-bold text-surface-900 leading-none mt-1">10k+ Happy Clients</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Dashboard Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-400 to-emerald-300 rounded-[3rem] blur-3xl opacity-20 -z-10" />
              
              <Card className="glass-premium rounded-[2.5rem] border-white/50 shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                <div className="bg-brand-900/90 px-8 py-5 flex items-center justify-between text-white backdrop-blur-md">
                   <div className="flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5 text-brand-300" />
                     <span className="font-bold tracking-tight">Verified Live Booking</span>
                   </div>
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-ping" />
                      Live
                   </div>
                </div>
                
                <CardContent className="p-6 md:p-10 bg-white/60 text-left">
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex gap-4 md:gap-5 items-center">
                       <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-orange-200/50 flex-none">⚡</div>
                       <div>
                         <p className="font-black text-lg md:text-xl text-surface-900">Electrical Issue</p>
                         <p className="text-surface-500 font-medium text-xs md:text-sm">Switchboard replacement needed</p>
                       </div>
                    </div>
                    
                    <div className="relative pl-7 space-y-6 md:space-y-8">
                       <div className="absolute left-[3.5px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand-500 via-brand-200 to-brand-100" />
                       
                       <div className="relative">
                          <div className="absolute -left-[30px] bg-brand-500 w-5 h-5 rounded-full border-4 border-white shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10" />
                          <div className="flex justify-between items-start">
                             <div>
                               <p className="text-xs md:text-sm font-black text-brand-800">Request Accepted</p>
                               <p className="text-[10px] md:text-[11px] font-bold text-surface-400 mt-1 uppercase">Today, 10:45 AM</p>
                             </div>
                             <Badge variant="secondary" className="bg-brand-50 text-brand-600 border-brand-100 text-[9px] md:text-[10px] font-black">CONFIRMED</Badge>
                          </div>
                       </div>
                       
                       <div className="relative">
                          <div className="absolute -left-[30px] bg-brand-200 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 animate-pulse" />
                          <p className="text-xs md:text-sm font-black text-surface-900">Provider on the way</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-surface-400" />
                             <p className="text-[10px] md:text-[11px] font-bold text-surface-400 uppercase">Arriving in 15 mins</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-4 md:p-5 rounded-3xl bg-white border border-surface-100 flex items-center gap-3 md:gap-5 shadow-sm transform group-hover:translate-x-1 transition-transform">
                       <div className="relative flex-none">
                          <img className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shadow-md" src="https://i.pravatar.cc/150?img=33" alt="Tech" />
                          <div className="absolute -bottom-1 -right-1 bg-brand-500 p-1 rounded-full text-white border-2 border-white">
                             <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          </div>
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="font-black text-base md:text-lg text-surface-950 underline decoration-brand-200 decoration-4 underline-offset-2 truncate">Rahul Sharma</p>
                          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-yellow-500 font-black mt-0.5">
                             <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" /> 4.9 <span className="text-surface-400 font-bold ml-1 truncate">• 120 JOBS DONE</span>
                          </div>
                       </div>
                       <button className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 transition hover:bg-brand-600 hover:text-white cursor-pointer shadow-sm flex-none">
                          <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                       </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-brand-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Verified Specialists", value: "500+", icon: Award },
              { label: "Bookings Monthly", value: "2.4k+", icon: Zap },
              { label: "Safety Rating", value: "99.9%", icon: ShieldCheck },
              { label: "Cities covered", value: "20+", icon: MapPin },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex p-3 rounded-2xl bg-white/10 text-brand-400 mb-4 group-hover:scale-110 transition duration-300">
                   <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-white leading-none">{stat.value}</h3>
                <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-brand-300/60 leading-none">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4">Process</h2>
              <h3 className="text-4xl md:text-6xl font-black text-surface-950 leading-tight">Professional results in three simple steps.</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: "Select Service", desc: "Choose from our wide range of premium repair and maintenance services.", icon: Search },
                { title: "Expert Matches", desc: "We instantly match you with the best background-checked professional near you.", icon: Users },
                { title: "Job Completed", desc: "Your pro arrives fully equipped and ensures the work is done perfectly.", icon: ThumbsUp },
              ].map((step, i) => (
                <div key={step.title} className="relative p-7 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-surface-50 border border-surface-100 group hover:bg-white hover:shadow-2xl hover:border-brand-100 transition-all duration-500">
                   <div className="text-5xl md:text-6xl font-black text-brand-100 absolute top-6 right-8 md:top-8 md:right-10 group-hover:text-brand-50 transition-colors">0{i+1}</div>
                   <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-6 md:mb-8 shadow-sm">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                   </div>
                   <h4 className="text-xl md:text-2xl font-black text-surface-950 mb-3 md:mb-4">{step.title}</h4>
                   <p className="text-sm md:text-base text-surface-600 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-surface-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                 <h2 className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4">Marketplace</h2>
                 <h3 className="text-4xl md:text-6xl font-black text-surface-950 leading-tight">Everything you need, professionally done.</h3>
              </div>
              <Button variant="outline" className="h-14 px-8 border-brand-200 text-brand-700 font-bold hover:bg-white rounded-full transition-transform hover:-rotate-2" onClick={goToServices}>
                 View All Services
              </Button>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service) => (
                 <Card key={service.id} className="group flex flex-col overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-700 transform rounded-[2rem] bg-white">
                    <div className="aspect-[4/3] w-full bg-surface-100 relative overflow-hidden">
                       <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors z-10" />
                       <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                       <div className="absolute top-4 left-4 z-20">
                          <div className="bg-white/95 text-brand-800 backdrop-blur-md shadow-sm rounded-xl font-black text-[10px] uppercase tracking-widest px-3 py-1.5 border border-brand-100">
                             {service.price}
                          </div>
                       </div>
                    </div>
                    <CardContent className="flex flex-col flex-1 p-8">
                       <h4 className="text-2xl font-black text-surface-950 flex items-center justify-between group-hover:text-brand-600 transition-colors">
                         {service.name}
                         <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                       </h4>
                       <p className="text-surface-500 mt-4 flex-1 font-medium leading-relaxed">{service.desc}</p>
                       
                       <Button className="w-full h-14 mt-8 bg-brand-50 text-brand-800 hover:bg-brand-600 hover:text-white transition-all border-none font-bold text-sm rounded-2xl" onClick={goToServices}>
                         Explore {service.name}
                       </Button>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4">Reviews</h2>
              <h3 className="text-4xl md:text-5xl font-black text-surface-950 leading-tight">What our customers say about FixFast.</h3>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-brand-50/30 border border-brand-100/50 hover:border-brand-200 transition duration-500">
                   <div className="flex items-center gap-1 text-yellow-500 mb-6">
                      <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                   </div>
                   <p className="text-surface-700 font-medium italic text-lg leading-relaxed mb-8">"{t.content}"</p>
                   <div className="flex items-center gap-4">
                      <img className="w-12 h-12 rounded-full shadow-md object-cover" src={t.avatar} alt={t.name} />
                      <div>
                        <p className="font-black text-surface-950 text-sm leading-none">{t.name}</p>
                        <p className="text-[10px] font-bold text-surface-400 mt-1 uppercase tracking-widest">{t.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-brand-950 to-brand-900 px-6 py-16 md:py-24 text-center shadow-3xl relative group">
               {/* Decorative lights */}
               <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[20rem] md:w-[40rem] h-[20rem] md:h-[30rem] rounded-full bg-brand-600/30 blur-[60px] md:blur-[100px] opacity-40 group-hover:opacity-60 transition duration-1000" />
               <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[15rem] md:w-[30rem] h-[15rem] md:h-[30rem] rounded-full bg-emerald-500/20 blur-[60px] md:blur-[100px] opacity-40" />
               
               <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] md:leading-[0.95] tracking-tight">
                     Join FixFast and experience hassle-free repairs.
                  </h2>
                  <p className="mt-6 md:mt-8 text-lg md:text-xl text-brand-100/90 font-medium max-w-xl mx-auto">
                     Create your account today and get instant access to hundreds of verified professionals in your area.
                  </p>
                  
                  <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6 items-center">
                     <Button 
                       variant="white" 
                       size="lg" 
                       className="w-full sm:w-auto h-16 px-12 text-lg font-black rounded-2xl transform hover:scale-105 transition duration-300 group" 
                       onClick={goToSignup}
                     >
                        Create Free Account
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                     </Button>
                     <Button 
                       variant="brand-outline" 
                       size="lg" 
                       className="w-full sm:w-auto h-16 px-10 text-lg font-black rounded-2xl" 
                       onClick={goToServices}
                     >
                        Explore Pros
                     </Button>
                  </div>
                  
                  <div className="mt-12 md:mt-16 flex items-center justify-center gap-4 md:gap-8 flex-wrap text-brand-200/50 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-500" /> No hidden fees</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-500" /> Verified Pros</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-500" /> Secure Payments</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}