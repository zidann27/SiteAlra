import { ClipboardList, Sparkles, Eye, Rocket } from 'lucide-react';
import { useScrollReveal, revealStyle } from '../../lib/useScrollReveal';

const steps = [
  { number: '01', icon: ClipboardList, title: 'Isi Form Bisnis', description: 'Masukkan nama usaha, deskripsi singkat, dan pilih kategori bisnis Anda.', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/60' },
  { number: '02', icon: Sparkles, title: 'AI Generate Konten', description: 'AI kami memproses data Anda dan menghasilkan konten website yang relevan dan profesional.', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950/60' },
  { number: '03', icon: Eye, title: 'Preview Hasil', description: 'Lihat tampilan website Anda secara langsung sebelum dipublikasikan.', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/60' },
  { number: '04', icon: Rocket, title: 'Deploy & Bagikan', description: 'Klik deploy dan website Anda langsung online dengan URL unik yang bisa dibagikan.', color: 'text-rose-600', bgColor: 'bg-rose-50 dark:bg-rose-950/60' },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={revealStyle(visible, index * 120)}
      className="relative flex flex-col items-center text-center"
    >
      <div className={`relative z-10 w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
        <step.icon size={28} className={step.color} />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-full text-xs font-bold text-gray-500 dark:text-gray-300 flex items-center justify-center">
          {index + 1}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} style={revealStyle(headingVisible)} className="text-center mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Cara Kerja</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            4 langkah menuju website impian
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Proses yang sederhana, hasil yang luar biasa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-200 via-amber-200 to-green-200 dark:from-blue-900 dark:via-amber-900 dark:to-green-900" />
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
