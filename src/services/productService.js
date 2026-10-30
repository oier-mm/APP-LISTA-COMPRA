import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Crear producto
export const createProduct = async (productData) => {
  const docRef = await addDoc(collection(db, "productos"), {
    ...productData,
    cogido: false,
    fechaCreacion: new Date().toISOString(),
  });
  return docRef.id;
};

// Marcar / desmarcar como cogido
export const toggleProduct = async (id, estado) => {
  const productRef = doc(db, "productos", id);
  await updateDoc(productRef, {
    cogido: estado,
    fechaCompra: estado ? new Date().toISOString() : null,
  });
};

// Eliminar producto
export const deleteProduct = async (id) => {
  const productRef = doc(db, "productos", id);
  await deleteDoc(productRef);
};

// Subida de imagen (Convierte a Base64 para almacenar sin configuración extra de Storage)
export const uploadProductImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};