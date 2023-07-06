import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  // Agrega aquí la configuración específica de tu proyecto de Firebase
  apiKey: "AIzaSyD4NvkvC3YpLpkhHl0TZqu5xPXwO8d3Jg0",
  authDomain: "app-escalada-799de.firebaseapp.com",
  projectId: "app-escalada-799de",
  storageBucket: "app-escalada-799de.appspot.com",
  messagingSenderId: "140153557759",
  appId: "1:140153557759:web:f1063ea7c6046bbe5a32ca"
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de autenticación de Firebase
const auth = getAuth(app);
// Obtener la instancia de Firestore de Firebase
const firestore = getFirestore(app);

// Proveedor de autenticación de Google
const googleProvider = new GoogleAuthProvider();

// Función para iniciar sesión con Google
const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Resetear contraseña
const resetPassword = (email) => {
  return auth.sendPasswordResetEmail(email);
};


export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithGoogle, resetPassword, firestore, collection };
