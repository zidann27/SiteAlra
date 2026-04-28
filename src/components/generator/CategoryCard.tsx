interface CategoryCardProps {
  value: string;
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  label,
  icon,
  selected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-center hover:-translate-y-0.5 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className={`text-xs font-medium leading-tight ${selected ? "text-blue-700" : "text-gray-600"}`}
      >
        {label}
      </span>
    </button>
  );
}
