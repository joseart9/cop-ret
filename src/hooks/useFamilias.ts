import { useState, useEffect } from "react";
import { getAllFamilias } from "@/server/functions";
import { Familia } from "@/types";

export default function useFamilias() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllFamilias();
      if (data) {
        setFamilias(data);
      } else {
        // handle error
        console.error("Error fetching classes");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return [familias, loading] as const;
}
