import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import app from "./firebase";

const auth = getAuth(app);

export const registerUser = async (
  email,
  password
) => {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const loginUser = async (
  email,
  password
) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return {
    uid: user.uid,
    nombre: user.displayName || user.email.split("@")[0],
    email: user.email,
  };
};

export const deleteUserAccount = async (password) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No hay usuario autenticado.");

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
};

export default auth;