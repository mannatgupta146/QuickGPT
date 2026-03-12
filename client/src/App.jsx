import React, { useState } from 'react'
import SideBar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const {user, loadingUser} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation()

  if(pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
    <Toaster />
    {!isMenuOpen && (
      <button 
        onClick={() => setIsMenuOpen(true)}
        className='fixed top-4 left-4 z-40 p-3 bg-white dark:bg-[#1E1A25] border border-purple-200 dark:border-[#80609F]/40 rounded-full shadow-lg md:hidden active:scale-95 transition-all'
      >
        <div className='flex flex-col gap-1 w-5 h-4 justify-center items-center'>
          <div className='w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'></div>
          <div className='w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'></div>
          <div className='w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'></div>
        </div>
      </button>
    )}

    {/* Mobile Overlay */}
    {isMenuOpen && (
      <div 
        onClick={() => setIsMenuOpen(false)}
        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden'
      />
    )}

    {user ? (
      <div className='dark:bg-[#121015] dark:text-white'>
      <div className='flex h-screen w-screen overflow-hidden'>
        <SideBar isMenuOpen = {isMenuOpen} setIsMenuOpen = {setIsMenuOpen}/>
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </div>
    ) : (
      <div className='bg-gradient-to-b from-purple-200 via-purple-500 to-[#1a1028] flex items-center justify-center h-screen w-screen'><Login /></div>
    )
    }
    </>
  )
}

export default App
