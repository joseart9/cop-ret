'use client';

import { Button } from "@nextui-org/button";
import { createSku, getSku, updateSku } from "@/server/functions";
import { create } from "domain";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function SubmitButton({ estado, data }: { estado: string, data: any }) {
    const [loading, setLoading] = useState(false);
    console.log(data)

    const handleCreate = async () => {
        setLoading(true);
        try {
            data.fechaAlta = new Date().toISOString();
            data.fechaBaja = "1900-01-01";
            await createSku(data);
        } catch (error) {
            console.error("Error creating SKU:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        console.log(data)
        await updateSku(data.sku, data)
        setLoading(false);
    }

    if (estado === "search") {
        return (
            <Button type="submit" color="primary" aria-disabled={false}>
                Consultar
            </Button>
        );
    } else if (estado === "create") {
        return (
            <div>
                <Button type="submit" color="primary" aria-disabled={false} onClick={handleCreate}>
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
                <Button type="submit" color="primary" aria-disabled={false} onClick={handleUpdate}>
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
