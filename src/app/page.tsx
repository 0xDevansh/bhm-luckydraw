"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";

type Entry = {
  id: number;
  content: string;
  luck: number;
  created_at: string;
};

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    // Check for secret in localStorage
    const storedSecret = localStorage.getItem("your_secret");
    if (storedSecret) {
      setSecret(storedSecret);
    }

    // Fetch entries
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
          .from("entries")
          .select("*")
          .order("created_at", { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Lucky Draw Entries</h1>

        {secret && (
            <div className="mb-6 bg-primary/10 p-4 rounded-lg">
              <h2 className="text-xl font-bold">Your Secret Code</h2>
              <p className="text-sm text-muted-foreground">
                Keep this code to check your results later.
              </p>
              <p className="text-xl font-bold mt-2">{secret}</p>
            </div>
        )}

      <Link className={cn(buttonVariants({ variant: 'default' }), 'mb-10 block text-center text-lg')} href={'/result'}>Check Result</Link>

        {loading ? (
            <p className="text-center">Loading entries...</p>
        ) : entries.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Hash</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Luck</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Added At</th>
              </tr>
              </thead>
              <tbody>
              {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border border-gray-300 px-4 py-2">{entry.content}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.luck}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(entry.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <p className="text-center">No entries found.</p>
        )}
      </div>
  );
}