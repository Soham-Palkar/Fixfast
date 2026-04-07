import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import { getImageSrc, getImageType } from "../utils/imageUtils.js";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { Star, MapPin, Award, Search, Filter, Briefcase, Zap, ShieldCheck } from "lucide-react";
const SERVICE_PRICES = {
  "AC Repair": 500,
  "Deep Cleaning": 800,
  "Plumbing": 300,
  "Electrician": 250,
  "Painting": 2500,
  "Carpentry": 400,
  "Appliance Repair": 600,
  "Pest Control": 700,
};

const SERVICE_LIST = Object.keys(SERVICE_PRICES);

const SERVICES = [
  // AC Repair
  {
    id: "ac-1",
    name: "Ramesh Patil",
    service: "AC Repair",
    price: SERVICE_PRICES["AC Repair"],
    rating: 4.7,
    experience: "5 years",
    location: "Andheri",
    img: "/images/services/ac-repair.png",
    desc: "AC servicing, gas refill, installation & cooling issue repair",
  },
  {
    id: "ac-2",
    name: "Suresh Yadav",
    service: "AC Repair",
    price: 599,
    rating: 4.6,
    experience: "4 years",
    location: "Borivali",
    img: "/images/services/ac-repair.png",
    desc: "Split and window AC repair with quick doorstep service",
  },
  {
    id: "ac-3",
    name: "Amit Sharma",
    service: "AC Repair",
    price: 549,
    rating: 4.8,
    experience: "6 years",
    location: "Thane",
    img: "/images/services/ac-repair.png",
    desc: "AC maintenance, installation, servicing and fault diagnosis",
  },
  {
    id: "ac-4",
    name: "Faizan Khan",
    service: "AC Repair",
    price: 520,
    rating: 4.5,
    experience: "3 years",
    location: "Ghatkopar",
    img: "/images/services/ac-repair.png",
    desc: "Home AC service and cooling problem specialist",
  },
  {
    id: "ac-5",
    name: "Vikram Joshi",
    service: "AC Repair",
    price: 650,
    rating: 4.7,
    experience: "7 years",
    location: "Navi Mumbai",
    img: "/images/services/ac-repair.png",
    desc: "Expert in AC servicing, gas charging and installation",
  },

  // Deep Cleaning
  {
    id: "clean-1",
    name: "Neha More",
    service: "Deep Cleaning",
    price: 799,
    rating: 4.6,
    experience: "4 years",
    location: "Dadar",
    img: "/images/services/deep-cleaning.png",
    desc: "Kitchen, bathroom and full-home deep cleaning service",
  },
  {
    id: "clean-2",
    name: "Pooja Singh",
    service: "Deep Cleaning",
    price: 899,
    rating: 4.7,
    experience: "5 years",
    location: "Mulund",
    img: "/images/services/deep-cleaning.png",
    desc: "Professional home cleaning with hygiene-focused service",
  },
  {
    id: "clean-3",
    name: "Kavita Jadhav",
    service: "Deep Cleaning",
    price: 850,
    rating: 4.5,
    experience: "3 years",
    location: "Thane",
    img: "/images/services/deep-cleaning.png",
    desc: "Bathroom, kitchen and sofa cleaning specialist",
  },
  {
    id: "clean-4",
    name: "Rekha Gupta",
    service: "Deep Cleaning",
    price: 950,
    rating: 4.8,
    experience: "6 years",
    location: "Andheri",
    img: "/images/services/deep-cleaning.png",
    desc: "Complete deep cleaning for flats, homes and offices",
  },
  {
    id: "clean-5",
    name: "Sana Shaikh",
    service: "Deep Cleaning",
    price: 820,
    rating: 4.6,
    experience: "4 years",
    location: "Kurla",
    img: "/images/services/deep-cleaning.png",
    desc: "Affordable and reliable home deep cleaning service",
  },

  // Plumbing
  {
    id: "plumb-1",
    name: "Ganesh Sawant",
    service: "Plumbing",
    price: 299,
    rating: 4.5,
    experience: "5 years",
    location: "Vashi",
    img: "/images/services/plumbing.png",
    desc: "Leak fix, tap repair, pipe replacement and fitting work",
  },
  {
    id: "plumb-2",
    name: "Imran Shaikh",
    service: "Plumbing",
    price: 349,
    rating: 4.7,
    experience: "6 years",
    location: "Dombivli",
    img: "/images/services/plumbing.png",
    desc: "Bathroom and kitchen plumbing repair services",
  },
  {
    id: "plumb-3",
    name: "Mahesh Jagtap",
    service: "Plumbing",
    price: 320,
    rating: 4.6,
    experience: "4 years",
    location: "Panvel",
    img: "/images/services/plumbing.png",
    desc: "Pipe leakage, tank connection and tap installation work",
  },
  {
    id: "plumb-4",
    name: "Arif Memon",
    service: "Plumbing",
    price: 299,
    rating: 4.4,
    experience: "3 years",
    location: "Byculla",
    img: "/images/services/plumbing.png",
    desc: "Quick plumbing support for home maintenance issues",
  },
  {
    id: "plumb-5",
    name: "Rohit Chavan",
    service: "Plumbing",
    price: 399,
    rating: 4.8,
    experience: "8 years",
    location: "Andheri",
    img: "/images/services/plumbing.png",
    desc: "Experienced plumber for urgent home service needs",
  },

  // Electrician
  {
    id: "elec-1",
    name: "Akash Verma",
    service: "Electrician",
    price: 199,
    rating: 4.6,
    experience: "4 years",
    location: "Malad",
    img: "/images/services/electrician.png",
    desc: "Wiring, switchboard, lights and appliance fault repair",
  },
  {
    id: "elec-2",
    name: "Harish Naik",
    service: "Electrician",
    price: 249,
    rating: 4.7,
    experience: "6 years",
    location: "Kandivali",
    img: "/images/services/electrician.png",
    desc: "Fan, MCB, wiring and socket repair specialist",
  },
  {
    id: "elec-3",
    name: "Sameer Shaikh",
    service: "Electrician",
    price: 220,
    rating: 4.5,
    experience: "3 years",
    location: "Thane",
    img: "/images/services/electrician.png",
    desc: "Fast and reliable home electrical repair service",
  },
  {
    id: "elec-4",
    name: "Nitin Kadam",
    service: "Electrician",
    price: 280,
    rating: 4.8,
    experience: "7 years",
    location: "Chembur",
    img: "/images/services/electrician.png",
    desc: "Experienced electrician for complete home fault fixing",
  },
  {
    id: "elec-5",
    name: "Yusuf Ali",
    service: "Electrician",
    price: 230,
    rating: 4.6,
    experience: "5 years",
    location: "Nerul",
    img: "/images/services/electrician.png",
    desc: "Switchboard, fuse and lighting issue repair service",
  },

  // Painting
  {
    id: "paint-1",
    name: "Prakash More",
    service: "Painting",
    price: 2499,
    rating: 4.7,
    experience: "8 years",
    location: "Powai",
    img: "/images/services/painting.png",
    desc: "Interior and exterior painting with smooth finishing",
  },
  {
    id: "paint-2",
    name: "Raju Tiwari",
    service: "Painting",
    price: 2699,
    rating: 4.6,
    experience: "6 years",
    location: "Goregaon",
    img: "/images/services/painting.png",
    desc: "Wall painting, polish and touch-up services",
  },
  {
    id: "paint-3",
    name: "Deepak Thakur",
    service: "Painting",
    price: 2599,
    rating: 4.8,
    experience: "9 years",
    location: "Mira Road",
    img: "/images/services/painting.png",
    desc: "Professional painter for premium home finishing work",
  },
  {
    id: "paint-4",
    name: "Sanjay Yadav",
    service: "Painting",
    price: 2400,
    rating: 4.5,
    experience: "5 years",
    location: "Kurla",
    img: "/images/services/painting.png",
    desc: "Affordable paint work for flats and home interiors",
  },
  {
    id: "paint-5",
    name: "Anil Mishra",
    service: "Painting",
    price: 2800,
    rating: 4.7,
    experience: "7 years",
    location: "Bhandup",
    img: "/images/services/painting.png",
    desc: "Wall texture, color finishing and house painting",
  },

  // Carpentry
  {
    id: "carp-1",
    name: "Sandeep Pawar",
    service: "Carpentry",
    price: 399,
    rating: 4.5,
    experience: "4 years",
    location: "Vile Parle",
    img: "/images/services/carpentry.png",
    desc: "Furniture repair, fitting and door alignment service",
  },
  {
    id: "carp-2",
    name: "Javed Khan",
    service: "Carpentry",
    price: 449,
    rating: 4.6,
    experience: "5 years",
    location: "Andheri",
    img: "/images/services/carpentry.png",
    desc: "Wood fitting, shelf installation and furniture fixing",
  },
  {
    id: "carp-3",
    name: "Rahul Salunkhe",
    service: "Carpentry",
    price: 420,
    rating: 4.7,
    experience: "6 years",
    location: "Thane",
    img: "/images/services/carpentry.png",
    desc: "Cupboard, bed and table repair specialist",
  },
  {
    id: "carp-4",
    name: "Mubin Sheikh",
    service: "Carpentry",
    price: 390,
    rating: 4.4,
    experience: "3 years",
    location: "Navi Mumbai",
    img: "/images/services/carpentry.png",
    desc: "Basic home carpentry and furniture maintenance",
  },
  {
    id: "carp-5",
    name: "Dinesh Patil",
    service: "Carpentry",
    price: 480,
    rating: 4.8,
    experience: "7 years",
    location: "Borivali",
    img: "/images/services/carpentry.png",
    desc: "Expert carpentry service for household repair work",
  },
];

async function saveBooking(booking) {
  try {
    const token = localStorage.getItem('fixfast_token');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        providerId: booking.providerId,
        serviceName: booking.serviceName,
        price: booking.price,
        userLocation: booking.userLocation
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving booking:', error);
    toast.error('Failed to create booking. Please try again.', {
      icon: "❌",
      style: {
        borderLeft: "5px solid #ef4444",
      },
    });
    throw error;
  }
}

export default function Services() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [registeredProviders, setRegisteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered - loading providers..."); // Debug log
    const loadProviders = async () => {
      try {
        setLoading(true);
        console.log("Making API call to:", `${import.meta.env.VITE_API_URL}/api/providers`); // Debug log

        // Load registered providers from API
        const providersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/providers`);
        if (providersResponse.ok) {
          const providers = await providersResponse.json();
          console.log("API Providers:", providers); // Debug log

          // ✅ ADD MORE DEBUGGING
          providers.forEach((p, index) => {
            const imageType = getImageType(p.profilePhoto);
            console.log(`Provider ${index}:`, {
              _id: p._id,
              fullName: p.fullName,
              profilePhoto: p.profilePhoto?.substring(0, 50) + "...",
              imageType: imageType,
              yearsOfExperience: p.yearsOfExperience,
              serviceArea: p.serviceArea
            });
          });

          const formattedProviders = providers.map((p) => ({
            _id: p._id,
            name: p.fullName, // correct field

            services: p.services || [],

            // FIX EXPERIENCE
            experience: p.yearsOfExperience
              ? `${p.yearsOfExperience} years`
              : "Not specified",

            // FIX SERVICE AREA
            serviceArea: p.serviceArea || "Not specified",

            // DO NOT USE city here
            location: p.serviceArea || p.city,

            rating: Number(p.rating || 0).toFixed(1),

            availability: p.availability || "available",

            // ✅ FIX IMAGE - Handle ALL image formats
            profilePhoto: p.profilePhoto
              ? getImageSrc(p.profilePhoto)
              : null,
          }));

          console.log("STATE UPDATE - Setting providers to state"); // Debug log
          setRegisteredProviders(formattedProviders);
          console.log("STATE UPDATED - Providers now in state"); // Debug log
        } else {
          console.error('Failed to load providers');
        }
      } catch (error) {
        console.error('Error loading providers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);
  const allProviders = registeredProviders;

  const dynamicServices = ["all", ...SERVICE_LIST];

  const serviceCards = useMemo(() => {
    return allProviders.flatMap(provider => {
      const services = provider.services || [];

      return services.map(service => ({
        providerId: provider._id,
        name: provider.name,
        service,
        experience: provider.experience,
        area: provider.serviceArea,
        rating: provider.rating,
        price: SERVICE_PRICES[service] || 500,
        availability: provider.availability || "available",
        profilePhoto: provider.profilePhoto,
        uniqueId: `${provider._id}-${service}`,
      }));
    });
  }, [allProviders]);

  const filtered = useMemo(() => {
    return serviceCards.filter((s) => {
      // REMOVE OFFLINE USERS
      if (s.availability === "offline") return false;

      const matchesQ =
        !q.trim() ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.service.toLowerCase().includes(q.toLowerCase()) ||
        s.area.toLowerCase().includes(q.toLowerCase());

      const matchesService =
        serviceFilter === "all" ||
        s.service.toLowerCase() === serviceFilter.toLowerCase();

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "4.5" && Number(s.rating) >= 4.5) ||
        (ratingFilter === "4.7" && Number(s.rating) >= 4.7);

      return matchesQ && matchesService && matchesRating;
    });
  }, [serviceCards, q, serviceFilter, ratingFilter]);

  const handleBook = async (card) => {
    const token = localStorage.getItem('fixfast_token');
    const currentUser = JSON.parse(
      localStorage.getItem("fixfast_current_user") || "null"
    );

    if (card.availability === "busy") {
      toast.error("This technician is currently busy.", {
        icon: "⏰",
        style: {
          borderLeft: "5px solid #f59e0b",
        },
      });
      return;
    }

    if (!currentUser) {
      toast.error("Please login first", {
        icon: "🔐",
        style: {
          borderLeft: "5px solid #3b82f6",
        },
      });
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error("Authentication required. Please login again.", {
        icon: "🔐",
        style: {
          borderLeft: "5px solid #3b82f6",
        },
      });
      navigate("/login");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported in this browser", {
        icon: "🌍",
        style: {
          borderLeft: "5px solid #f59e0b",
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await saveBooking({
            providerId: card.providerId,
            serviceName: card.service, // Use selected service
            price: card.price,
            userLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          });

          navigate("/my-bookings");
        } catch (error) {
          console.error('Booking error:', error);
        }
      },
      (error) => {
        toast.error("Please allow location access to book service.", {
          icon: "📍",
          style: {
            borderLeft: "5px solid #f59e0b",
          },
        });
      },
      {
        enableHighAccuracy: true
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl -z-10" />

      <div className="mb-10 text-center md:text-left relative z-10">
         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 font-bold tracking-wider text-xs uppercase mb-4 shadow-sm border border-brand-100">
            <Zap className="w-4 h-4" /> Recommended Pros
         </div>
         <h1 className="text-4xl font-black tracking-tight text-surface-900 md:text-5xl">
           Available Providers
         </h1>
         <p className="mt-4 text-surface-600 max-w-2xl text-lg font-medium">
           Choose from multiple professionals verified and rated by the community. Book instantly without hassle.
         </p>
      </div>

      <div className="mt-4 md:mt-8 rounded-3xl md:rounded-[2rem] bg-white/70 backdrop-blur-xl border border-surface-200/60 shadow-glass p-4 md:p-6 sticky top-16 md:top-20 z-40">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-brand-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search technician, service or area..."
            className="w-full rounded-2xl border-none bg-surface-100/50 pl-11 md:pl-14 pr-4 py-3 md:py-4 text-base md:text-lg outline-none focus:bg-white focus:ring-4 focus:ring-brand-100 transition-all duration-300 font-medium text-surface-900 placeholder:text-surface-400"
          />
        </div>

        <div className="mt-4 md:mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between pt-4 md:pt-6 border-t border-surface-100/60">
          <div className="flex items-center gap-3 min-w-0">
            <Badge className="bg-surface-100 text-surface-600 border-none font-bold uppercase tracking-wider text-[9px] px-2 flex-none"><Briefcase className="w-3 h-3 inline mr-1" /> Service</Badge>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1 px-1">
              {dynamicServices.map((service) => (
                <Chip
                  key={service}
                  active={serviceFilter === service}
                  onClick={() => setServiceFilter(service)}
                  className="whitespace-nowrap"
                >
                  {service === "all" ? "All" : service}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1 px-1">
            <Badge className="bg-surface-100 text-surface-600 border-none font-bold uppercase tracking-wider text-[9px] px-2 flex-none"><Filter className="w-3 h-3 inline mr-1" /> Quality</Badge>
            <Chip active={ratingFilter === "all"} onClick={() => setRatingFilter("all")} className="whitespace-nowrap">All</Chip>
            <Chip active={ratingFilter === "4.5"} onClick={() => setRatingFilter("4.5")} className="whitespace-nowrap">4.5+</Chip>
            <Chip active={ratingFilter === "4.7"} onClick={() => setRatingFilter("4.7")} className="whitespace-nowrap">4.7+</Chip>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.uniqueId} className="group flex flex-col overflow-hidden relative border-none shadow-soft hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-[2rem]">
            {s.availability === "available" && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-emerald-400" />
            )}
            {s.availability !== "available" && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500" />
            )}
            
            <CardContent className="p-6 md:p-8 flex flex-col flex-1">
              
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="relative flex-none">
                    {s.profilePhoto ? (
                      <img
                        src={getImageSrc(s.profilePhoto)}
                        alt={s.name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover ring-4 ring-brand-50 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 font-black text-xl md:text-2xl ring-4 ring-brand-50 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                        {s.name?.charAt(0)}
                      </div>
                    )}
                    {s.availability === "available" && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-brand-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-black text-surface-900 capitalize tracking-tight flex items-center gap-1 truncate">
                      {s.name} <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-500 flex-none" />
                    </h3>
                    <p className="text-[10px] md:text-sm font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md inline-block mt-1 truncate">
                      {s.service}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-yellow-50 border border-yellow-100 px-2 md:px-3 py-1 md:py-2 rounded-xl flex-none">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm md:text-base font-black text-surface-900 leading-none mt-1">{s.rating}</span>
                </div>
              </div>

              <div className="my-5 md:my-6 p-4 rounded-2xl bg-surface-50 border border-surface-100 space-y-3">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-surface-500 font-medium">
                     <Award className="w-3.5 h-3.5 md:w-4 md:h-4" /> Experience
                  </div>
                  <span className="text-surface-900 font-bold">{s.experience}</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-surface-500 font-medium">
                     <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> Location
                  </div>
                  <span className="text-surface-900 font-bold truncate ml-2">{s.area}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-surface-100/60 flex items-center justify-between gap-4">
                <div className="flex-none">
                   <span className="text-[10px] font-bold text-surface-400 tracking-wider uppercase">Starts At</span>
                   <p className="text-xl md:text-2xl font-black text-surface-900">₹{s.price}</p>
                </div>
                <Button
                  onClick={() => handleBook(s)}
                  disabled={s.availability !== "available"}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-3.5 md:py-4 rounded-xl font-bold shadow-lg transition-transform text-sm md:text-base ${s.availability==='available'?'bg-brand-600 hover:bg-brand-700 shadow-brand-200 text-white hover:scale-105':'bg-surface-200 text-surface-500 shadow-none'}`}
                >
                  {s.availability === "available" ? "Book Now" : "Busy"}
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-surface-500 p-16 bg-white rounded-[2rem] border-2 border-dashed border-brand-200">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Search className="w-10 h-10 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-surface-900">No providers found</p>
          <p className="mt-2 text-lg">Try adjusting your filters or search query to find more professionals.</p>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-4 py-2 text-xs md:text-sm font-bold transition-all duration-300 " +
        (active
          ? "bg-brand-600 text-white shadow-md shadow-brand-500/30 scale-105"
          : "bg-surface-50 text-surface-600 hover:bg-surface-100 hover:text-surface-900") +
        " " + className
      }
    >
      {children}
    </button>
  );
}