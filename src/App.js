import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Home from './pages/Home/Home'
import Yoga from './pages/Yoga/Yoga'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/start' element={<Yoga />} />
      </Routes>
    </Router>
  )
}


// Changes To make
// Remove About Section 
// Change in Instruction add link 
// Find Good Pictures
// Find Small Sound Track
// Make new File I mean delete unwanted pages from this project 
// Add Your own Classification Model 
