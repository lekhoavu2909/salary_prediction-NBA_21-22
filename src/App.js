import logo from './logo.svg';
import './App.css';
import {Button, TextField} from '@mui/material';
import {useState} from 'react';
import Toastr from 'toastr2';
import 'toastr2/dist/toastr.min.css';

function App() {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState(0);
  const [predict, setPredict] = useState(0);
  const [info, setInfo] = useState("")
  const toastr = new Toastr();
  
  let handleSubmit = async (e) => {
    e.preventDefault();
    const object = {
      'name' : name.toLowerCase()
    }
    // console.log(object);
    fetch(`http://127.0.0.1:2020/name`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(object),
    })
    .then(res => res.json())
    .then(data => {
      if (data === "Cannot find"){
        toastr.error("We cannot find player " + name.bold(), "Not found!!!")
        setInfo("")
        setSalary(0)
        setPredict(0)
        setName("No such player")
      }
      setSalary(data['salary'])
      setPredict(data['predict'])
      if (data['info'] === "Waste"){
        setInfo("The player is overpaid")
      }
      else if (data['info'] === "Justify"){
        setInfo("The salary is justified")
      }
      else if (data['info'] === "Stonk"){
        setInfo("The player is underpaid")
      }
    })
  }
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <TextField id="name" label="Player Name" variant="filled" placeholder="Enter a player's name" onChange={(e) => setName(e.target.value)}></TextField>
        <Button type="submit">Submit</Button>
      </form>

      <h1>{name}</h1>
      <p>{info}</p>
      Actual <p>$ {salary}</p>
      Predicted <p> $ {predict}</p>
    </div>
  );
}

export default App;
