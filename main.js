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

const expenditureBtn = document.querySelector(".addTransaction__btn--expenditure");
const transactionsTable = document.querySelector(".section_table table");

// Get all transactions
const getTransactions = () => db.collection('transactions').get();

// Save Transaction
const saveTransaction = (amount, category, date, name, type) => {
    db.collection('transactions').doc().set({
        amount,
        category,
        date,
        name,
        type

    });
}

const onGetTransactions = (callback) => db.collection("transactions").onSnapshot(callback);

// Painting transactions in DOM
window.addEventListener('DOMContentLoaded', async (e) =>{

  onGetTransactions((transactions) => {
    
    const tableHead = `
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Date</th>
        <th>Amount</th>
      </tr>`;

    transactionsTable.innerHTML = tableHead;
    
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
            <td class="table_date">${date}</td>
            <td class="table_amount">$.${amount}</td>
          </tr>
        `
        transactionsTable.innerHTML += tableMarkup;

    });
  });

})

expenditureBtn.addEventListener('click', async () => {

  const transactionAmount = document.getElementById('transaction_amount');
  const transactionName = document.getElementById('transaction_name');
  const transactionCategory = document.getElementById('transaction_category');
  const transactionDate = document.getElementById('transaction_date');
  const transactionType = expenditureBtn.value;

  await saveTransaction(transactionAmount.value, transactionCategory.value, transactionDate.value,transactionName.value,  transactionType, );
});