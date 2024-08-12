'use client';

import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import SubmitButton from "@/components/SubmitButton";
import { getSku } from "@/server/functions";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/react";
import { descontinueSku } from "@/server/functions";
import { formatDateForInput } from "@/utils";

import useClases from "@/hooks/useClases";
import useDepartamentos from "@/hooks/useDepartamentos";
import useFamilias from "@/hooks/useFamilias";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Familia, Clase, Departamento } from "@/types";

const initialState = {
  sku: "",
  articulo: "",
  marca: "",
  modelo: "",
  departamento: 0,
  clase: 0,
  familia: 0,
  stock: 0,
  cantidad: 0,
  fechaBaja: "",
  fechaAlta: "",
  descontinuado: 0,
};

export default function Home() {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState(null);
  const [estado, setEstado] = useState("search");
  const [loading, setLoading] = useState(false);

  // Custom hooks
  const [clases, clasesLoading] = useClases();
  const [departamentos, departamentosLoading] = useDepartamentos();
  const [familias, familiasLoading] = useFamilias();

  const [filteredClases, setFilteredClases] = useState<Clase[]>([]);
  const [filteredFamilias, setFilteredFamilias] = useState<Familia[]>([]);

  console.log(clases, departamentos, familias)

  const buttonColor = state.descontinuado === 1 ? "danger" : "default";

  // Search for SKU
  const getItem = async () => {
    setLoading(true);
    const result = await getSku(state.sku);
    setLoading(false);
    return result;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const fetchedData = await getItem();
    setLoading(false);

    if (!fetchedData) {
      setEstado("create");
    } else {
      setEstado("update");
      setState(fetchedData);
    }
  };

  const handleReset = () => {
    setState(initialState);
    setEstado("search");
  };

  const handleDescontinueSku = async () => {
    setLoading(true);
    await descontinueSku(state.sku, state.descontinuado === 1 ? 0 : 1);
    setLoading(false);
  };

  // Filter classes based on selected department
  useEffect(() => {
    if (state.departamento) {
      const filtered = clases.filter(clase => clase.departamentoId === state.departamento.toString());
      setFilteredClases(filtered);
    } else {
      setFilteredClases(clases);
    }
  }, [state.departamento, clases]);

  // Filter families based on selected class
  useEffect(() => {
    if (state.clase) {
      const filtered = familias.filter(familia => familia.claseId === state.clase.toString());
      setFilteredFamilias(filtered);
    } else {
      setFilteredFamilias(familias);
    }
  }, [state.clase, familias]);

  console.log(filteredFamilias)
  console.log(state)

  return (
    <main className="relative h-screen w-screen bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="h-full w-full space-y-4 p-4"
      >
        <div className="w-full flex flex-row space-x-4 items-center">
          <Input
            label="Sku"
            name="sku"
            value={state.sku}
            onChange={handleInputChange}
            required
            disabled={estado === "update" || estado === "create"}
          />
          <Button type="submit" color={buttonColor} size="md" variant="flat" onClick={handleDescontinueSku}>
            Descontinuado
          </Button>
        </div>

        <div className="col-span-2">
          <Input
            label="Articulo"
            name="articulo"
            value={state.articulo}
            onChange={handleInputChange}
            disabled={estado === "search"}
          />
        </div>
        <div className="col-span-2 row-start-3">
          <Input
            label="Marca"
            name="marca"
            value={state.marca}
            onChange={handleInputChange}
            disabled={estado === "search"}
          />
        </div>
        <div className="col-span-2 row-start-4">
          <Input
            label="Modelo"
            name="modelo"
            value={state.modelo}
            onChange={handleInputChange}
            disabled={estado === "search"}
          />
        </div>

        <div className="col-span-2 row-start-5">
          <Autocomplete
            label="Departamento"
            variant="bordered"
            isDisabled={estado === "search"}
            selectedKey={state.departamento.toString()}
            onSelectionChange={(value) => setState(prev => ({
              ...prev,
              departamento: Number(value),
              clase: 0,  // Reset clase and familia when department changes
              familia: 0
            }))}
          >
            {departamentos.map(departamento => (
              <AutocompleteItem key={departamento.id} value={departamento.id}>
                {departamento.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <div className="col-span-2 row-start-6">
          <Autocomplete
            label="Clase"
            isDisabled={estado === "search" || !state.departamento}
            selectedKey={state.clase.toString()}
            onSelectionChange={(value) => setState(prev => ({
              ...prev,
              clase: Number(value),
              familia: 0  // Reset familia when clase changes
            }))}
          >
            {filteredClases.map(clase => (
              <AutocompleteItem key={clase.id} value={clase.id}>
                {clase.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <Autocomplete
          label="Familia"
          isDisabled={estado === "search" || !state.clase}
          selectedKey={state.familia.toString().padStart(2, '0')}
          onSelectionChange={(value) => {
            const selectedValue = value ? String(value).padStart(2, '0') : '00';
            setState(prev => ({
              ...prev,
              familia: Number(selectedValue)
            }));
          }}
        >
          {filteredFamilias.map(familia => (
            <AutocompleteItem key={familia.id} value={familia.id.toString().padStart(2, '0')}>
              {familia.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <div className="flex flex-row space-x-4">
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={state.stock.toString()}
            onChange={handleInputChange}
            disabled={estado === "search"}
          />
          <Input
            label="Cantidad"
            name="cantidad"
            type="number"
            value={state.cantidad.toString()}
            onChange={handleInputChange}
            disabled={estado === "search"}
          />
        </div>

        <div className="flex flex-row space-x-4">
          <Input
            label="Fecha Alta"
            name="fechaAlta"
            isReadOnly
            value={formatDateForInput(state.fechaAlta)}
            onChange={handleInputChange}
            disabled={estado === "search" || estado === "create"}
          />
          <Input
            label="Fecha Baja"
            name="fechaBaja"
            isReadOnly
            value={formatDateForInput(state.fechaBaja)}
            onChange={handleInputChange}
            disabled={estado === "search" || estado === "create"}
          />
        </div>

        <div className="flex flex-row justify-between">
          <Button color="danger" onClick={handleReset}>
            Limpiar
          </Button>
          <SubmitButton estado={estado} data={state} />
        </div>
      </form>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <Spinner size="lg" color="white" />
        </div>
      )}
    </main>
  );
}
