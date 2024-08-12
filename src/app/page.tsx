'use client';

import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import SubmitButton from "@/components/SubmitButton";
import { getSku } from "@/server/functions";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/react";
import { descontinueSku } from "@/server/functions";
import { formatDateForInput, validate, alert } from "@/utils";

import useClases from "@/hooks/useClases";
import useDepartamentos from "@/hooks/useDepartamentos";
import useFamilias from "@/hooks/useFamilias";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Familia, Clase, Departamento } from "@/types";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { revalidatePath } from "next/cache";

const initialState = {
  sku: "",
  articulo: "",
  marca: "",
  modelo: "",
  departamento: 0,
  clase: 0,
  familia: "00",
  stock: 0,
  cantidad: 0,
  fechaBaja: "",
  fechaAlta: "",
  descontinuado: 0,
};

export default function Home() {
  const [state, setState] = useState(initialState);
  const [estado, setEstado] = useState("search");
  const [loading, setLoading] = useState(false);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState<'opaque' | 'blur' | 'transparent' | undefined>('opaque');

  // Custom hooks
  const [clases, clasesLoading] = useClases();
  const [departamentos, departamentosLoading] = useDepartamentos();
  const [familias, familiasLoading] = useFamilias();

  const [filteredClases, setFilteredClases] = useState<Clase[]>([]);
  const [filteredFamilias, setFilteredFamilias] = useState<Familia[]>([]);

  const buttonColor = state.descontinuado === 1 ? "danger" : "default";

  const handleOpen = (backdrop: any) => {
    setBackdrop(backdrop)
    onOpen();
  }

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


    const errors = validate(state);

    if (errors !== 1) {
      for (const error of errors) {
        alert(error, "error");
      }
      setLoading(false);
    } else {
      const fetchedData = await getItem();
      setLoading(false);

      if (!fetchedData) {
        setEstado("create");
      } else {
        setEstado("update");
        setState(fetchedData);
      }
    }
  };

  const handleReset = () => {
    setState(initialState);
    setEstado("search");
  };

  const handleDescontinueSku = async () => {
    setLoading(true);
    await descontinueSku(state.sku, state.descontinuado === 1 ? 0 : 1);
    const refetch = await getItem();
    setState(refetch);
    setLoading(false);
    onClose();
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

  // Filter families based on selected class and department
  useEffect(() => {
    if (state.departamento && state.clase) {
      const filtered = familias.filter(familia =>
        familia.departamentoId === state.departamento.toString() &&
        familia.claseId === state.clase.toString()
      );
      setFilteredFamilias(filtered);
    } else {
      setFilteredFamilias(familias);
    }
  }, [state.departamento, state.clase, familias]);

  console.log(filteredFamilias)
  console.log(filteredClases)

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
            disabled={estado === "update"}
          />
          <Button onPress={onOpen} isDisabled={estado === "search" || estado === "create"} type="submit" color={buttonColor} size="md" variant="flat">
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
            isDisabled={estado === "search"}
            selectedKey={state.departamento.toString()}
            onSelectionChange={(value) => setState(prev => ({
              ...prev,
              departamento: Number(value),
              clase: 0,  // Reset clase and familia when department changes
              familia: "00"
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
              familia: "00"  // Reset familia when clase changes
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
              familia: selectedValue
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
          <Button color="danger" isDisabled={estado === "search"} variant='flat' onClick={handleReset}>
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
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}><ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <p>
                Estas seguro que deseas continuar con la acción?
              </p>
            </ModalBody>
            <ModalFooter className="flex flex-row justify-between">
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleDescontinueSku}>
                Confirmar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      </Modal>
    </main>
  );
}
