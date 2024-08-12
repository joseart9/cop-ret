import { useState, useEffect } from "react";
import { getAllDepartamentos } from "@/server/functions";
import { Departamento } from "@/types";

export default function useDepartamentos() {
  const [departamento, setDepartamento] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllDepartamentos();
      if (data) {
        setDepartamento(data);
      } else {
        // handle error
        console.error("Error fetching classes");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return [departamento, loading] as const;
}
