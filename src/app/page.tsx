import FormRajaOngkir from '@/components/formRajaOngkir';

async function getCities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city`, {
      method: 'GET',
      headers: {
        key: process.env.NEXT_PUBLIC_API_KEY || '',
      },
    });

    const data = await res.json();

    return data.rajaongkir.results;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default async function Home() {
  const cities = await getCities();

  return (
    <main className="flex min-h-screen flex-col items-center p-16">
      <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Cek ongkos kirim bersama&nbsp;
          <code className="font-mono font-bold">RajaOngkir</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dibuat oleh <b>Muhamad Aziz Prasetyo</b> 💙
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row py-14">
        <FormRajaOngkir cities={cities} />
      </div>
    </main>
  );
}
