import './App.css';
//import Event from './Event/Event';
//import bbq from './assets/bbq.png';
import Society from './Society/Society';

function App() {
  return (
    <>
      <Society 
      name="RizzSoc"
      image="https://media.tenor.com/c6_k3koMQckAAAAe/rizz-flower.png" 
      backgroundPositionY='150px'
      color='hsl(0, 43%, 92%)'    
      />
      <Society 
      name="TestSoc"
      image="https://media.tenor.com/c6_k3koMQckAAAAe/rizz-flower.png"  
      />
    </>
  );
}

export default App;
