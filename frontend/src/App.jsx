/* eslint-disable no-unused-vars */

import { Route, Router, Routes } from 'react-router-dom';
import Translation from './components/Translation';
import { TranslationProvider } from './components/TranslationContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SignUp from './pages/Signup';
import OpenRoute from './components/core/OpenRoute';
import PrivateRoute from './components/core/PrivateRoute';
import ViewDocument from './components/ViewDocument';


function App() {


  return (
    <div className='w-full  bg-gradient-to-r from-gray-900 to-gray-700'>

      <TranslationProvider>
        <Routes>

          <Route path='/login'
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            } />

          <Route path='/signup'
            element={
              <OpenRoute>
                <SignUp />
              </OpenRoute>
            } />

          <Route path="/translation" element={<Translation />} />
          <Route path='/'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

          <Route path='/profile'

            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          <Route path='/history/:id'

            element={
              <PrivateRoute>
                <ViewDocument />
              </PrivateRoute>
            } />
        </Routes>
      </TranslationProvider>
    </div>
  )
}

export default App
