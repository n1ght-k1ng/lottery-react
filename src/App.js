
import "./App.css";
import React from "react";
import lottery from "./lottery.js";
import web3 from './web3.js';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({ manager, players , balance  }) 
  }
  onSubmit = async (event) => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts() // before calling our lottery contract we have to fetch the list of accounts
    // assuming the first account in our accounts array send the transaction to the contract 
    this.setState({message: 'Waiting on transaction success...' })
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    }) // send the transaction to the contract takes 10 - 15 secs to complete
    this.setState({message: 'You have been entered!'}) // we are sending a transaction so there will be no return value
  }

  onClick = async () =>{
    const accounts  = await web3.eth.getAccounts()
    this.setState({message: 'Waiting for the winner to be picked'})
    await lottery.methods.pickWinner().send({
      from: accounts[0]

    })

    this.setState({message: 'A winner has been picked'})
  }
  render() {
    console.log(web3.version)
    
    return (
     <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {this.state.manager} </p>
      <p>
      There are currently {this.state.players.length} competing for {web3.utils.fromWei(this.state.balance,'ether')} ether!
      </p>
      
      <form onSubmit = {this.onSubmit}>
        <h4>Want to try your luck ?</h4>
        <div>
          <label>Amount of ether to enter

          </label>
          <input value = {this.state.value} 
          onChange = {event => this.setState({value: event.target.value}) 
          }></input>
          
          
        </div>
        <button >Enter</button>
      </form>
      <hr/>
      <h4>
        Ready to pick a winner?
      </h4>
      <button onClick = {this.onClick}>Pick a winner!</button>
      <hr/> 
      <h1>{this.state.message}</h1>
     </div>
    );
  }
}
export default App;
