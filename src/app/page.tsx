import Image from 'next/image';
import Login from '@/app/components/login_form';

/*
 This is for the top bar of the login screen
*/
function Header() {
  return (
    <header className="flex flex-row space-x-2 bg-black/80 xl:space-x-4">
      <Image
        src="/anya_chibi_t.png"
        alt="Image of tiny anya"
        width={100}
        height={100}
        sizes="100vw"
        className="m-2 w-1/5 xl:w-24"
      />
      <h1 className="mt-8 text-5xl xl:mt-10 xl:text-7xl">Ani x Family</h1>
    </header>
  );
}

// Login Page
export default function Page() {
  return (
    <div className="flex h-screen flex-col justify-between bg-slate-900 bg-[url(/album_collage_1080.jpeg)] bg-cover bg-center bg-no-repeat opacity-80 bg-blend-screen">
      <Header />
      <Login />
      <div></div>
    </div>
  );
}
