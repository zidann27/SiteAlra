import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const examples = [
  {
    name: 'Warung Bu Sari',
    category: 'Kuliner',
    tagline: 'Cita Rasa Rumahan yang Selalu Dinantikan',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-900',
    bgLight: 'bg-amber-50',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Jasa Bersih Pro',
    category: 'Jasa',
    tagline: 'Kebersihan Terjamin, Hidup Lebih Nyaman',
    color: 'from-sky-500 to-blue-600',
    textColor: 'text-sky-900',
    bgLight: 'bg-sky-50',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Batik Nusantara',
    category: 'Fashion',
    tagline: 'Keindahan Budaya dalam Setiap Helai Kain',
    color: 'from-rose-500 to-pink-600',
    textColor: 'text-rose-900',
    bgLight: 'bg-rose-50',
    image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
    badge: 'bg-rose-100 text-rose-700',
  },
];

export default function ExamplesSection() {
  return (
    <section id="examples" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Contoh Website</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Lihat hasilnya sendiri
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Berikut contoh website yang dihasilkan oleh SiteAlra untuk berbagai kategori UMKM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((ex) => (
            <div key={ex.name} className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={ex.image}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${ex.color} opacity-60`} />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit mb-2 bg-white/20 text-white`}>
                    {ex.category}
                  </span>
                  <h3 className="text-white font-bold text-xl">{ex.name}</h3>
                </div>
              </div>
              <div className={`${ex.bgLight} p-5`}>
                <p className="text-gray-600 text-sm mb-4 italic">"{ex.tagline}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
                    ))}
                    <div className="w-2 h-2 rounded-full bg-gray-300 ml-1" />
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ExternalLink size={11} />
                    Contoh Preview
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
          >
            Buat Website Saya Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
