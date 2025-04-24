import { useState, useEffect } from 'react'
import '@ant-design/v5-patch-for-react-19';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import { Contact } from './pages/Contact/Contact'
import { Listings } from './pages/Listings/Listings'
import { CardListing } from './components/CardListing/CardListing';
import { Applications } from './pages/Applications/Applications'
import { Landing } from './pages/Landing/Landing'
import { Layout } from './components/Layout/Layout'
import { LoginRoute } from './pages/LoginRoute/LoginRoute'
import { ApplicantSignUp } from './pages/SignUp/ApplicantSignUp'
// import { TestSignup } from './pages/SignUp/TestSignUp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/landing' element={<Landing />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<Listings />} />
          <Route path='/application' element={<Applications />} />
          <Route path='/ilanlar/:id' element={<CardListing />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login-route' element={<LoginRoute />} />
          <Route path='/Appplicant-SignUp' element={<ApplicantSignUp />} />

        </Route>
      </Routes>
    </Router>
  )
}

export default App    
