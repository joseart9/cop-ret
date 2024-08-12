"use server";

import { revalidatePath } from "next/cache";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore/lite";
import app from "@/db/firebase";

// Get SKU data from db
export async function getSku(sku: string) {
  const db = getFirestore(app);
  const skuQuery = query(collection(db, "db"), where("sku", "==", sku));
  const querySnapshot = await getDocs(skuQuery);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  const documents: any = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });

  return documents.length > 1 ? documents : documents[0];
}

// Create SKU in db
export async function createSku(sku: any) {
  const db = getFirestore(app);
  const docRef = await addDoc(collection(db, "db"), sku);
  revalidatePath("/");
}

// Update SKU in db
export async function updateSku(sku: string, updatedData: any) {
  const db = getFirestore(app);
  const skuQuery = query(collection(db, "db"), where("sku", "==", sku));
  const querySnapshot = await getDocs(skuQuery);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  const docRef = doc(db, "db", querySnapshot.docs[0].id);

  await updateDoc(docRef, updatedData);
  console.log("Document updated with ID: ", querySnapshot.docs[0].id);
  revalidatePath("/");
}

export async function descontinueSku(sku: string, value: number) {
  const db = getFirestore(app);
  const skuQuery = query(collection(db, "db"), where("sku", "==", sku));
  const querySnapshot = await getDocs(skuQuery);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  const docRef = doc(db, "db", querySnapshot.docs[0].id);

  if (value === 0) {
    await updateDoc(docRef, {
      descontinuado: 0,
      fechaAlta: new Date().toISOString(),
    });
  } else {
    await updateDoc(docRef, {
      descontinuado: 1,
      fechaBaja: new Date().toISOString(),
    });
  }
  console.log(
    "Document updated to discontinued with ID: ",
    querySnapshot.docs[0].id
  );
  revalidatePath("/");
}

// Get all documents from "departamento" collection
export async function getAllDepartamentos() {
  const db = getFirestore(app);
  const departamentoCollection = collection(db, "departamento");
  const querySnapshot = await getDocs(departamentoCollection);

  const documentos = querySnapshot.docs.map((doc) => ({
    id: doc.data().id,
    name: doc.data().name,
    ...doc.data(),
  }));
  return documentos;
}

// Get all documents from "clase" collection
export async function getAllClases() {
  const db = getFirestore(app);
  const claseCollection = collection(db, "clase");
  const querySnapshot = await getDocs(claseCollection);

  const documentos = querySnapshot.docs.map((doc) => ({
    id: doc.data().id,
    name: doc.data().name,
    departamentoId: doc.data().departamentoId,
    ...doc.data(),
  }));
  return documentos;
}

// Get all documents from "familia" collection
export async function getAllFamilias() {
  const db = getFirestore(app);
  const familiaCollection = collection(db, "familia");
  const querySnapshot = await getDocs(familiaCollection);

  const documentos = querySnapshot.docs.map((doc) => ({
    id: doc.data().id,
    name: doc.data().name,
    claseId: doc.data().claseId,
    ...doc.data(),
  }));
  return documentos;
}
