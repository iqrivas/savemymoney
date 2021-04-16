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
const incomeBtn = document.querySelector(".addTransaction__btn--income");
const transactionsTable = document.querySelector(".section_table table tbody");
const totalIncome = document.querySelector("#total_income");
const totalExpenditure = document.querySelector("#total_expenditure");

const dateInput = document.getElementById('transaction_date');
dateInput.defaultValue = new Date().toLocaleString("en-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });

let options = { style: 'currency', currency: 'USD' };

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
// Delete transaction
const deleteTransaction = id => db.collection('transactions').doc(id).delete();

const onGetTransactions = (callback) => db.collection("transactions").orderBy("date", "desc").onSnapshot(callback);

// Painting transactions in DOM
window.addEventListener('DOMContentLoaded', async (e) =>{

  onGetTransactions((transactions) => {
    let sumOfIncome = 0;
    let sumOfExpenditure = 0;
    let categories = new Set();

    transactionsTable.innerHTML = '';

    transactions.forEach(doc => {
        
        const name = doc.data().name;
        const category = doc.data().category;
        const date = doc.data().date;
        const formatted_date = date.toDate().toLocaleString("en-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
        const amount = doc.data().amount;
        const formatted_amount = new Intl.NumberFormat('en-US', options).format(doc.data().amount);
        const type = doc.data().type;
        const transactionId = doc.id;
        let icon = "/assets/shopping_icon.svg";
        switch (category){
          case 'Transport':
            icon =  "/assets/transport_icon.svg";
            break;
          case 'Travels':
            icon =  "/assets/travels_icon.svg";
            break;
          case 'Electronics':
            icon =  "/assets/electronics_icon.svg";
            break;
          case 'Utilities':
            icon =  "/assets/home_icon.svg";
            break;
          case 'Salary':
          case 'Bonus':
            icon =  "/assets/money_icon.svg";
            break;
          default:
            icon = "/assets/shopping_icon.svg";
        };

        const tableMarkup = `
          <tr>
            <td class="table_icon"><img class="category_icon" src=${icon}></td>
            <td class="table_name">${name}</td>
            <td class="table_category">${category}</td>
            <td class="table_date">${formatted_date}</td>
            <td class="table_amount table_amount--type-${type}" data-type="${type}">${formatted_amount}</td>
            <td><span class="btn-delete" data-id="${transactionId}"></span></td>
          </tr>
        `
        transactionsTable.innerHTML += tableMarkup;

        const btnsDelete = document.querySelectorAll('span.btn-delete');
        btnsDelete.forEach(btn => {
          btn.addEventListener('click', async (e) => {
            if(confirm("Do you want to delete this transaction?")){
              await deleteTransaction(e.target.dataset.id);
            }
          });
        });


        if ( type == 'income') {
          sumOfIncome += amount;
        }
        if ( type == 'expenditure') {
          sumOfExpenditure += amount;
          categories.add(category)
        }

        
    });
    
    totalIncome.innerHTML = new Intl.NumberFormat('en-US', options).format(sumOfIncome);
    totalExpenditure.innerHTML = new Intl.NumberFormat('en-US', options).format(sumOfExpenditure);
    console.log(categories);
  });

})




expenditureBtn.addEventListener('click', async () => {

  const transactionAmount = document.getElementById('transaction_amount').value*1;
  const transactionName = document.getElementById('transaction_name').value;
  const transactionCategory = document.getElementById('transaction_category').value;
  const transactionDate = firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('transaction_date').value));
  const transactionType = expenditureBtn.value;

  await saveTransaction(transactionAmount, transactionCategory, transactionDate, transactionName, transactionType );
  transactionAmount.value = '';
  transactionName.value = '';
  transactionCategory.value = '';
  transactionDate.value = '';
});

incomeBtn.addEventListener('click', async () => {
  const transactionAmount = document.getElementById('transaction_amount').value*1;
  const transactionName = document.getElementById('transaction_name').value;
  const transactionCategory = document.getElementById('transaction_category').value;
  const transactionDate = firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('transaction_date').value));
  const transactionType = incomeBtn.value;

  await saveTransaction(transactionAmount, transactionCategory, transactionDate, transactionName, transactionType );
  transactionAmount.value = '';
  transactionName.value = '';
  transactionCategory.value = '';
  transactionDate.value = '';

});