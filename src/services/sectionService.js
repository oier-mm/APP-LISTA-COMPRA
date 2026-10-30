import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  arrayRemove
} from "firebase/firestore";

// Obtener las secciones donde el usuario actual es miembro
export const getSections = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  
  const q = query(
    collection(db, "secciones"),
    where("miembros", "array-contains", user.uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Crear sección añadiendo al usuario actual como primer miembro
export const createSection = async (sectionData) => {
  const user = auth.currentUser;
  const userId = user ? user.uid : "anon";

  const docRef = await addDoc(collection(db, "secciones"), {
    ...sectionData,
    miembros: [userId],
    creador: userId,
    fechaCreacion: new Date().toISOString(),
  });
  return docRef.id;
};

// Abandonar sección o borrarla si solo queda 1 miembro
export const leaveOrDeleteSection = async (idSeccion) => {
  const user = auth.currentUser;
  if (!user) return;

  const secRef = doc(db, "secciones", idSeccion);
  const secSnap = await getDoc(secRef);
  if (!secSnap.exists()) return;

  const data = secSnap.data();
  const miembros = data.miembros || [];

  if (miembros.length <= 1) {
    // Si solo hay 1 miembro (el usuario actual), se borra la sección por completo
    await deleteDoc(secRef);
  } else {
    // Si hay más miembros, se remueve al usuario actual de la lista de miembros
    await updateDoc(secRef, {
      miembros: arrayRemove(user.uid),
    });
  }
};