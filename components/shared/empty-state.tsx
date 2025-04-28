import { TbMoodEmpty } from 'react-icons/tb'; // install react-icons if you haven't: npm install react-icons

export default function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <TbMoodEmpty size={60} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
}
