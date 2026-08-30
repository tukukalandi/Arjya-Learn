import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function checkData() {
  const snapshot = await getDocs(collection(db, 'studyMaterials'));
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`Title: ${data.title}, Class: ${data.classLevel}, Subject: ${data.subject}`);
  });
  process.exit(0);
}
checkData();
