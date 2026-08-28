import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0417841512",
  appId: "1:179044081688:web:b4ec53bce7be340f23a36d",
  apiKey: "AIzaSyBSMaIEVLLI2GLKDqifN5DR3HpUS_sgNzc",
  authDomain: "gen-lang-client-0417841512.firebaseapp.com",
  storageBucket: "gen-lang-client-0417841512.firebasestorage.app",
  messagingSenderId: "179044081688"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-5a950ff3-89b9-40a0-beb5-a8238168aa4b");

async function run() {
  console.log("Starting DB fix...");
  const q = collection(db, 'studyMaterials');
  const snap = await getDocs(q);
  console.log(`Found ${snap.docs.length} materials`);
  
  let fixedCount = 0;
  for (const document of snap.docs) {
    const data = document.data();
    if (data.materialType === 'Question Paper' || data.materialType === 'Question Papers') {
      console.log(`Fixing ID: ${document.id}, title: "${data.title}" from '${data.materialType}' to 'Chapter'`);
      await updateDoc(doc(db, 'studyMaterials', document.id), {
        materialType: 'Chapter'
      });
      fixedCount++;
    }
  }
  console.log(`Fixed ${fixedCount} documents.`);
  process.exit(0);
}
run();
