import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Obtener solo las listas activas (no archivadas) de la sección
export const getLists = async (idSeccion) => {
  if (!idSeccion) return [];
  const q = query(
    collection(db, "listas"),
    where("idSeccion", "==", idSeccion)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((lista) => !lista.archivada);
};

// Crear una nueva lista
export const createList = async (listData) => {
  const docRef = await addDoc(collection(db, "listas"), {
    ...listData,
    archivada: false,
    fechaCreacion: new Date().toISOString(),
  });
  return docRef.id;
};

// Archivar/completar la lista
export const completeList = async (idLista) => {
  const listRef = doc(db, "listas", idLista);
  await updateDoc(listRef, {
    archivada: true,
    completada: true,
    fechaCompletada: new Date().toISOString(),
  });
};

// Borrar la lista definitivamente para todos los miembros de la sección
export const deleteList = async (idLista) => {
  const listRef = doc(db, "listas", idLista);
  await deleteDoc(listRef);
};