import { importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAwUkNpEdEqgTyjqRwo-GMFeWf5S4TW6JY",
  authDomain: "ring-of-fire-8d680.firebaseapp.com",
  projectId: "ring-of-fire-8d680",
  storageBucket: "ring-of-fire-8d680.firebasestorage.app",
  messagingSenderId: "166470029365",
  appId: "1:166470029365:web:3967a5f66fd32f79b4a17c"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth())
    )
  ]
};

