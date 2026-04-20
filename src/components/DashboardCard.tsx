type Props = {
  title: string;
  value: string | number;
};

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-slate-500 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}