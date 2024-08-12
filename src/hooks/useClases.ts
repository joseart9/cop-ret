import { useState, useEffect } from "react";
import { getAllClases } from "@/server/functions";
import { Clase } from "@/types";

export default function useClases() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllClases();
      if (data) {
        setClases(data);
      } else {
        // handle error
        console.error("Error fetching classes");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return [clases, loading] as const;
}
