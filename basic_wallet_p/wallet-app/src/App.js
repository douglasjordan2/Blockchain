import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    id: '',
    chain: [],
    transactions: [],
    balance: 0
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/chain')
      .then(res => {
        console.log(res.data)
        this.setState({ chain: res.data.chain })
      })
      .catch(err => console.log(err))
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  getWallet = e => {
    e.preventDefault()

    const { id, chain } = this.state;

    const _chain = chain.map(block => block.transactions)
    const transactions = []
    let balance = 0

    for(let i = 0; i < _chain.length; i++) {
      const t = _chain[i].filter(a => a.recipient === id || a.sender === id)
      if(t.length > 0) {
        transactions.push(_chain[i])
        _chain[i].forEach(x => {
          if(x.recipient === id) {
            balance += 1
          } else if(x.sender === id) {
            balance -= 1
          }
        })
      }
    }

    this.setState({ transactions, balance })
  }

  render() {
    const page = {
      height: '100vh',
      width: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }

    const column = {
      display: 'flex',
      flexDirection: 'column',
    }

    const form = {
      ...column,
      padding: '0 25px',
      minHeight: '125px',
      justifyContent: 'space-evenly',
      border: '2px solid black',
      width: '200px'
    }

    const input = {
      border: '1px solid black',
      margin: '5px',
      padding: '5px'
    }

    const card = {
      border: '2px solid black',
      marginTop: '20px',
      padding: '10px',
      width: '200px',
      lineHeight: '20px'
    }

    const { transactions, balance } = this.state;

    return (
      <div style = { page }>
        <form 
          style = { form }
          onSubmit = { this.getWallet }
        >
          <span style = {{ textAlign: 'center' }}>Enter Wallet ID</span>
          <div style = { column }>
            <input 
              style = { input }
              type="text"
              placeholder="ID"
              name="id"
              value = { this.state.id }
              onChange = { this.handleChange }
            />
            <input 
              style = { input }
              type="submit"
            />
          </div>
        </form>

        { transactions.length > 0 ? 
          <>
            <div style = {{ marginTop: '20px', fontSize: '2rem' }}>
              <span>{ `Balance: ${balance}` }</span>
            </div>
            <div style = { column }>
              { transactions.map(t => (
                <div style = { column }>
                  { t.map(_t => (
                    <div style = { card }>
                      <span>{ `Sender: ${_t.sender}` }</span><br />
                      <span>{ `Recipient: ${_t.recipient}` }</span><br />
                      <span>{ `Amount: ${_t.amount}` }</span><br />
                    </div>
                  )) }
                </div>
              )) }
            </div>
          </>
        :
          null
        }
      </div>
    );
  }
}

export default App;
