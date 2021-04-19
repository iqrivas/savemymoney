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

const transactionsTable = document.querySelector(".section_table table tbody");
const totalIncome = document.querySelector("#total_income");
const totalExpenditure = document.querySelector("#total_expenditure");

const dateInput = document.getElementById('transaction_date');
const defaultDate = new Date().toLocaleString("en-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
dateInput.defaultValue = defaultDate;

let categories = new Map();
let sumOfIncome = 0;
let sumOfExpenditure = 0;
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
function getIcon (icon) {
  let iconPath = "";
  switch (icon){
    case 'Transport':
      iconPath =  "/assets/transport_icon.svg";
      break;
    case 'Shopping':
      iconPath =  "/assets/shopping_icon.svg";
      break;
    case 'Travels':
      iconPath =  "/assets/travels_icon.svg";
      break;
    case 'Electronics':
      iconPath =  "/assets/electronics_icon.svg";
      break;
    case 'Utilities':
      iconPath =  "/assets/home_icon.svg";
      break;
    case 'Other':
      iconPath =  "/assets/other_icon.svg";
      break;  
    case 'Salary':
    case 'Bonus':
      iconPath =  "/assets/money_icon.svg";
      break;
    default:
      iconPath = "/assets/other_icon.svg";
  };
  return iconPath;
}

function getCategories(transactions) {
  let categoriesSection = document.querySelector("#categories");
  categoriesSection.innerHTML =
    '<span class="section_title">Category Statistics</span>';

  let catSort = new Map([...categories.entries()].sort((a, b) => b[1] - a[1]));
  let catNames = [...catSort.keys()];

  catNames.forEach((cat) => {
    let catPercent = Math.round(
      ((categories.get(cat) || 0) / sumOfExpenditure) * 100
    );

    transactions.forEach((doc) => {
      if (doc.category == cat) {
        catTotal += doc.amount;
      }
    });

    const catIcon = getIcon(cat);
    const categoryMarkup = `
      <div class="category_stats ">
      <img class="category_icon" src=${catIcon} alt="${cat} Icon">
      <div class="category_progress">
        <progress value="${catPercent}" max="100"></progress>
        <span class="category_name">${cat}</span>
      </div>
      <span class="category_percent">${catPercent}%</span>
      </div>
      `;

    categoriesSection.innerHTML += categoryMarkup;
  });
}

window.addEventListener('DOMContentLoaded', async (e) =>{

  onGetTransactions((transactions) => {
    sumOfIncome = 0;
    sumOfExpenditure = 0;
    categories.clear();
    
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
        const icon = getIcon(category);

        const tableMarkup = `
          <tr>
            <td ><img class="table_icon" src=${icon}></td>
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
              notification('delete');
            }
          });
        });


        if ( type == 'income') {
          sumOfIncome += amount;
        }
        if ( type == 'expenditure') {
          sumOfExpenditure += amount;
          let categoryCurrentValue= categories.get(category) || 0;
          categories.set(category, categoryCurrentValue + amount )
        }

        
        
    });
    
    getCategories(transactions);
    
    totalIncome.innerHTML = new Intl.NumberFormat('en-US', options).format(sumOfIncome);
    totalExpenditure.innerHTML = new Intl.NumberFormat('en-US', options).format(sumOfExpenditure);
    
  });

})

//Add a Transaction
const inputAmount = document.getElementById('transaction_amount');
const inputName = document.getElementById('transaction_name');
const inputCategory = document.getElementById('transaction_category');
const inputDate = document.getElementById('transaction_date');

function clearInputs () {
  inputAmount.value = '';
  inputName.value = '';
  inputCategory.value = '';
  inputDate.value = defaultDate;
}

const addBtn = document.querySelectorAll(".add__btn");

addBtn.forEach(item => {
  item.addEventListener('click', async (ev) => {
    const transactionAmount = inputAmount.value;
    const transactionName = inputName.value;
    const transactionCategory = inputCategory.value;
    const transactionDate = new Date(inputDate.value).setDate(new Date(inputDate.value).getDate()+1);
    const dateFormatted = firebase.firestore.Timestamp.fromMillis(transactionDate);
    const amountFormatted = transactionAmount*1;
    const transactionType = ev.target.value;

    if(transactionAmount == null || transactionAmount == '' || transactionName == null || transactionName == '' || transactionCategory == null || transactionCategory == '') {
      alert("One or more fields are empty! Please complete all required fields.");
    } else if (transactionAmount <= 0) {
        alert("Amount must be above zero.");      
    } else {
      await saveTransaction(amountFormatted, transactionCategory, dateFormatted, transactionName, transactionType );
  
      notification('success');
      clearInputs();
    }

  })
});

function notification(type) {
  let clear;
  let msgDuration = 2000;
  let msgSuccess = "The transaction was saved successfully!";
  let msgDelete = "The transaction has been deleted successfully!";

  let msg = document.getElementById("message");

  hide();

  switch (type) {
      case "success":
        msg.classList.add("msg-success", "active")
        msg.innerHTML = (msgSuccess);
        break;
        case "delete":
          msg.classList.add("msg-success", "active")
          msg.innerHTML = (msgDelete);
          break;
  }

  function timer() {
    clearTimeout(clear);
    clear = setTimeout(function () {
      hide();
    }, msgDuration);
  }
  function hide() {
    msg.classList.remove("msg-success", "msg-danger", "msg-warning", "msg-info", "active");
  }

  msg.addEventListener('transitionend', timer);
  
}