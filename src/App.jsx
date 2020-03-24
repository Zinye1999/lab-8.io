import React, { Component } from 'react';
import {v4} from 'uuid';
import axios from 'axios';
import firebase from './firebase/firebase';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import AddTransaction from './components/AddTransaction';
import Balance from './components/Balance';
import IncomeExpense from './components/IncomeExpense';
import TransactionTable from './components/TransactionTable';
import About from './components/About';

import './App.css';

export default class App extends Component {
  state = {
    transactions: [],
    image :''
  }

  loadData = () => {
    // get data from variable
    const data = [ 
      {
        id: v4(),
        name: 'Dinner with family',
        amount: -1250,
        date: new Date(2020,1,28)
      },
      {
        id: v4(),
        name: 'Movie',
        amount: -200,
        date: new Date(2020,1,29)
      },
      {
        id: v4(),
        name: 'Lottery',
        amount: 1500,
        date: new Date(2020,2,2)
      },
      {
        id: v4(),
        name: 'Salary',
        amount: 6500,
        date: new Date(2020,1,25)
      }
    ];

    this.setState( { transactions: data } );
  }

  loadJsonData = () => {
    // get data from json file: "public/static/data.json"
    // axios.get('/static/data.json')
    //   .then( res => {
    //     const data = res.data;
    //     this.setState( { transactions: data } );
    //   });

    firebase.firestore().collection('data').onSnapshot(Items=>{
      const transaction = []
      Items.forEach(res => {
        transaction.push(res.data())
      })
      this.setState({transactions:transaction})
    })
  }

  componentDidMount() {
    // this.loadData();   // load data from variable
    this.loadJsonData();  // load data from JSON file on server
    // this.loadFirebase(); // load data from Firebase
    firebase.storage().ref('IMG_1244.JPG').getDownloadURL().then(res =>{
      this.setState({image:res})
    })
  }

  validateForm = (name,amount) => {
    if (!name || !amount) {
      window.alert('Please fill in ALL data fields.');
      return false;
    } else if ( !isNaN(name)) {
      window.alert('Please fill only TEXT detail in transaction name.');
      return false;
    } else if(!Number.isInteger(+amount)){
      window.alert('Please fill only Integer in Amount.');
      return false;
    }else if (+amount === 0) {
      window.alert('Amount CANNOT be zero!');
      return false;
    }
  
    return true;
  }

  addTransaction = (name,amount) => {

    if(!this.validateForm(name,amount)) {
      return false;
    }

    const newTransaction = {
      id: v4(),
      name,
      amount: +amount,
      date: new Date().getTime()  }

    firebase.firestore().collection('data').add(newTransaction)
    this.state.transactions.unshift(newTransaction);
    this.setState( { transactions: this.state.transactions } );
  }

  clearTransactions = () => {
    let ans = window.confirm("You are going to clear all transaction history!!!")
    if (ans) {

      firebase.firestore().collection('data').get().then(function(Snapshot){
        Snapshot.forEach(function(doc){
          doc.ref.delete()
        })

      })

      this.setState( { transactions: [] } );
    }
  }

  render() {
    return (
      <Router>
      <div className="container mt-4 mb-5">
        <Header />

        <Route exact path="/" render={ props => (
          <div>
          <AddTransaction addTransaction={this.addTransaction} />
          <Balance transactions={this.state.transactions}/>
          <IncomeExpense transactions={this.state.transactions}/>
          <TransactionTable 
              transactions={this.state.transactions} 
              clearTransactions={this.clearTransactions} />
          </div>
        )} />
          
        <Route path="/about" component={About} />        
      </div>
      </Router>
    )
  }
}
