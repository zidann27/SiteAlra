import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const steps = [
  'Menganalisis data bisnis Anda...',
  'Menghasilkan judul & tagline...',
  'Membuat deskripsi konten...',
  'Menyusun daftar produk & layanan...',
  'Memilih skema warna yang tepat...',
  'Finalisasi website Anda...',
];

export default function GenerationProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
      setProgress((prev) => {
        const next = prev + 100 / steps.length;
        return Math.min(next, 95);
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Loader2 size={36} className="text-blue-600 animate-spin" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">Membuat Website Anda...</h3>
      <p className="text-gray-500 text-sm mb-8">AI sedang memproses bisnis Anda</p>

      <div className="max-w-sm mx-auto">
        <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 py-1.5 px-3 rounded-lg transition-all duration-300 ${
                index === currentStep
                  ? 'bg-blue-50 text-blue-700'
                  : index < currentStep
                  ? 'text-green-600'
                  : 'text-gray-300'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  index === currentStep
                    ? 'bg-blue-500 animate-pulse'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
              <span className="text-xs font-medium text-left">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
