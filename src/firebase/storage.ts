"use client";

import { getStorage } from "firebase/storage";
import { useFirebase } from "./provider";

/**
 * @deprecated use useStorage() instead
 */
export function getFirebaseStorage() {
  const { storage } = useFirebase();
  return storage;
}
