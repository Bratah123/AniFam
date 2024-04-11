import Navbar from '@/app/components/navbar';

export default async function Admin() {
  return (
    <div className="h-screen bg-gradient-to-t from-black from-10% via-slate-800 via-40% to-sky-950 to-90% bg-scroll">
      <Navbar isAdmin={false} />
      You can only see this if you are an admin.
    </div>
  );
}
