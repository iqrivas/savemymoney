// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDcQAqiwbRyVgR3WdezSj1hpQoLAuBGG4M",
  authDomain: "savemymoney-ec2ca.firebaseapp.com",
  projectId: "savemymoney-ec2ca",
  storageBucket: "savemymoney-ec2ca.appspot.com",
  messagingSenderId: "442520639107",
  appId: "1:442520639107:web:3bb6007192f315cd1c2db6",
  measurementId: "G-RSLY3QK3FH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);  
  
// Firestone DB Connection
const db = firebase.firestore();

const transactionsTable = document.querySelector(".section_table table");

// Get all transactions
const getTransactions = () => db.collection('transactions').get();

// Painting transactions in DOM
window.addEventListener('DOMContentLoaded', async (e) =>{

    const transactions = await getTransactions();
    transactions.forEach(doc => {
        console.log(doc.data());
        
        const name = doc.data().name;
        const category = doc.data().category;
        const date = doc.data().date;
        const amount = doc.data().amount;

        const tableMarkup = `
          <tr>
            <td class="table_name">${name}</td>
            <td class="table_category">${category}</td>
            <td class="table_date">15 April 2021</td>
            <td class="table_amount">$.${amount}</td>
          </tr>
        `
        transactionsTable.innerHTML += tableMarkup;

    });
})
