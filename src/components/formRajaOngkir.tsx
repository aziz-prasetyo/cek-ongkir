'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function formatEtd(etd: string) {
  if (etd.includes('HARI')) {
    etd = etd.replace('HARI', 'hari');
  }

  if (etd.includes('-')) {
    etd = etd.replace(/(\d+)\s*-\s*(\d+)/g, '$1 - $2 hari');
  }

  if (!isNaN(Number(etd)) && !etd.includes('hari')) {
    etd = etd + ' hari';
  }

  return etd;
}

const formSchema = z.object({
  origin: z
    .string()
    .min(1, { message: 'Pilihan kota asal tidak boleh kosong.' }),
  destination: z
    .string()
    .min(1, { message: 'Pilihan kota tujuan tidak boleh kosong.' }),
  weight: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 30_000 && String(num) === val;
    },
    {
      message: 'Berat barang harus dalam rentang 1 - 30.000 g.',
    }
  ),
  courier: z.string().min(1, { message: 'Pilihan kurir tidak boleh kosong.' }),
});

const defaultValues = {
  origin: '',
  destination: '',
  weight: '0',
  courier: '',
};

interface City {
  city_id: string;
  city_name: string;
}

type Cost = {
  value: number;
  etd: string;
  note: string;
};

type Costs = {
  service: string;
  description: string;
  cost: Cost[];
};

type ResultsCosts = {
  code: string;
  name: string;
  costs: Costs[];
};

type QueryCosts = {
  weight: number;
  courier: string;
};

type OriginDetails = {
  city_name: string;
};

type DestinationDetails = {
  city_name: string;
};

interface RajaOngkirCosts {
  query: QueryCosts;
  origin_details: OriginDetails;
  destination_details: DestinationDetails;
  results: ResultsCosts[];
}

export default function FormRajaOngkir({ cities }: { cities: City[] }) {
  const method = 'POST';

  const [data, setData] = useState({} as RajaOngkirCosts);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const options = {
      method: method,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        origin: values.origin,
        destination: values.destination,
        weight: values.weight,
        courier: values.courier,
      }),
    };

    const url = 'api';

    try {
      const res = await fetch(url, options);
      const final = await res.json();

      setData(final.rajaongkir as RajaOngkirCosts);
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi nanti.');
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
      form.reset(defaultValues);
    }
  }

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Cek Ongkos Kirim</CardTitle>
          <CardDescription>
            Lengkapi semua data untuk mengetahui hasilnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-2xl space-y-4"
              id="rajaongkir"
            >
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota Asal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kota Asal..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota Tujuan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kota Tujuan..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berat Barang (gram)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan Berat Barang..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurir</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kurir..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jne">JNE</SelectItem>
                        <SelectItem value="tiki">TIKI</SelectItem>
                        <SelectItem value="pos">POS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Harap Tunggu
            </Button>
          ) : (
            <Button type="submit" form="rajaongkir">
              Cek Ongkos Kirim
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-2">
        <Card className="w-[350px] h-fit">
          <CardHeader>
            <CardTitle>Hasil Pengecekan</CardTitle>
            <CardDescription>
              Lihat detail ongkos kirim di bawah ini.
            </CardDescription>
          </CardHeader>
          {JSON.stringify(data) !== '{}' && !loading && !error && (
            <CardContent>
              <p>
                <b>{data.origin_details.city_name}</b> ke{' '}
                <b>{data.destination_details.city_name}</b>
              </p>
              <p>
                @<b>{data.query.weight}</b> g
              </p>
            </CardContent>
          )}
        </Card>

        {JSON.stringify(data) !== '{}' &&
          !loading &&
          !error &&
          data.results.map((results) => (
            <Card key={results.code} className="w-[350px] h-fit">
              <CardHeader>
                <CardTitle className="uppercase">{results.code}</CardTitle>
                <CardDescription>{results.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {results.costs.map((costs, key1) => (
                  <div key={key1}>
                    <h2 className="text-xl font-semibold uppercase">
                      {costs.service}
                    </h2>
                    <p>{costs.description}</p>
                    {costs.cost.map((cost, key2) => (
                      <div key={key2}>
                        <div className="flex">
                          <p>Estimasi</p>
                          <Badge className="ml-2">{formatEtd(cost.etd)}</Badge>
                        </div>
                        <h4 className="text-primary text-2xl mt-1 font-bold text-end">
                          Rp{cost.value.toLocaleString('id-ID')}
                        </h4>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
}
