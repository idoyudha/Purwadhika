import './App.css';
import React from 'react';
import HomePage from './pages/home';
import { Route } from "react-router-dom";

const App = () => {

  return (
    <>
      <Route path="/" component={HomePage} exact />
    </>
  );
}

export default App;
