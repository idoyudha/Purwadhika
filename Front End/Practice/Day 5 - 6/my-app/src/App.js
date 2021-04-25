import './App.css';
import LandingPage from './pages/landingPage'
import Navbar from './components/navbar'
import RegisterPage from './pages/registerPage'
import LoginPage from './pages/loginPage'
import DetailPage from './pages/detailPage'
import { Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Navbar brand="React"/>
      <Route path="/" component={LandingPage} exact/>
      <Route path="/register" component={RegisterPage}/>
      <Route path="/login" component={LoginPage}/>
      <Route path="/detail/:title" component={DetailPage}/>
    </div>
  );
}

export default App;
