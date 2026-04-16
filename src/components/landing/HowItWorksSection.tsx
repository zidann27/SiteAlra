import { ClipboardList, Sparkles, Eye, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Isi Form Bisnis',
    description: 'Masukkan nama usaha, deskripsi singkat, dan pilih kategori bisnis Anda.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Generate Konten',
    description: 'AI kami memproses data Anda dan menghasilkan konten website yang relevan dan profesional.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    number: '03',
    icon: Eye,
    title: 'Preview Hasil',
    description: 'Lihat tampilan website Anda secara langsung sebelum dipublikasikan.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deploy & Bagikan',
    description: 'Klik deploy dan website Anda langsung online dengan URL unik yang bisa dibagikan.',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Cara Kerja</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            4 langkah menuju website impian
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Proses yang sederhana, hasil yang luar biasa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-200 via-amber-200 to-green-200" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className={`relative z-10 w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
                <step.icon size={28} className={step.color} />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full text-xs font-bold text-gray-500 flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
