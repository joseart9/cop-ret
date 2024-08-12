'use client';

import { Button } from "@nextui-org/button";
import { createSku, updateSku } from "@/server/functions";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";
import { validate, alert } from "@/utils";


export default function SubmitButton({ estado, data }: { estado: string, data: any }) {
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            const errors = validate(data)

            if (errors !== 1) {
                for (const error of errors) {
                    alert(error, "error");
                }
            } else {
                data.fechaAlta = new Date().toISOString();
                data.fechaBaja = "1900-01-01";
                await createSku(data);
                alert("Articulo creado correctamente", "success");
            }
        } catch (error) {
            alert("Hubo un error inesperado, intentelo de nuevo mas tarde", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const errors = validate(data)

            if (errors !== 1) {
                for (const error of errors) {
                    // alert(error, "error");
                }
            } else {
                await updateSku(data.sku, data);
                alert("Articulo actualizado correctamente", "success");
            }
        } catch (error) {
            alert("Hubo un error inesperado, intentelo de nuevo mas tarde", "error");
        } finally {
            setLoading(false);
        }
    }

    if (estado === "search") {
        return (
            <Button type="submit" variant='flat' color="primary" aria-disabled={false}>
                Validar
            </Button>
        );
    } else if (estado === "create") {
        return (
            <div>
                <Button type="submit" variant='flat' color="primary" aria-disabled={false} onClick={handleCreate}>
                    Crear
                </Button>
                {
                    loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-35">
                            <Spinner size="lg" color="white" />
                        </div>
                    )
                }
            </div>
        );
    } else {
        return (
            <div>
                <Button type="submit" variant='flat' color="primary" aria-disabled={false} onClick={handleUpdate}>
                    Actualizar
                </Button>
                {
                    loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-35">
                            <Spinner size="lg" color="white" />
                        </div>
                    )
                }
            </div>
        );
    }
}
