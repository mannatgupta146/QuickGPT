import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const SideBar = ({isMenuOpen, setIsMenuOpen}) => {

  const {chats, selectedChat, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUserChats, token, setToken, renameChat} = useAppContext()
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [tempName, setTempName] = useState('')

  const logout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
  }

  const deleteChat = async(e, chatId)=> {
    try {
      e.stopPropagation()
      const confirm = window.confirm('Are you sure to delete this chat? ')

      if(!confirm) return 
      const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization: token}})

      if(data.success){
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUserChats()
        toast.success(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRename = async (chatId) => {
    const wordCount = tempName.trim().split(/\s+/).length
    if (wordCount > 3) {
      return toast.error('Please keep the name under 3 words')
    }
    if (tempName.trim() === '') {
      return toast.error('Name cannot be empty')
    }
    await renameChat(chatId, tempName.trim())
    setEditingId(null)
  }

  return (
    <div className={`flex flex-col h-screen w-72 min-w-72 p-5 bg-white dark:bg-[#18161b] border-r border-gray-200 dark:border-white/10 
    transition-all duration-300 max-md:fixed left-0 z-[60] ${(!isMenuOpen && 'max-md:-translate-x-full')}`}>
      {/* Logo & Close Button (Mobile) */}
      <div className='flex items-center justify-between'>
        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-44'/>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className='md:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 active:scale-95 transition-all'
        >
          <img src={assets.close_icon} className='w-4 not-dark:invert' alt="" />
        </button>
      </div>

      {/* New Chat Button*/}
      <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-8 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] 
      text-sm rounded-md cursor-pointer'>
        <span className='mr-2 text-base'>+ New Chat</span>  
      </button>

      {/* Search Conversations*/}
      <div className='flex items-center gap-2 p-2 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
        <img src={assets.search_icon} alt="" className='w-4 not-dark:invert'/>
        <input onChange={(e) =>setSearch(e.target.value)} value={search} type="text" placeholder='Search Conversations' 
        className='text-base placeholder:text-gray-400 outline-none w-full bg-transparent'/>
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className='mt-3 text-base'>Recent Chats</p>}
      <div className='flex-1 overflow-y-scroll mt-3 text-base space-y-2 pr-1 custom-scrollbar'>
        {
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : 
          chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) =>(
            <div onClick={() => {navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}} key={chat._id} className={`p-2 px-4 dark:bg-[#57317C]/10 
            border rounded-md cursor-pointer flex justify-between group transition-all duration-300 ${
              selectedChat?._id === chat._id 
                ? 'bg-purple-100/50 dark:bg-[#57317C]/40 border-purple-400 dark:border-purple-500/60 shadow-lg shadow-purple-500/5' 
                : 'bg-transparent dark:bg-[#57317C]/10 border-gray-300 dark:border-[#80609F]/15 hover:bg-gray-100 dark:hover:bg-[#57317C]/20'
            }`}>
              <div className='flex-1 min-w-0 pr-2'>
                <div className='h-7 flex items-center'>
                  {editingId === chat._id ? (
                    <div className='flex items-center w-full gap-2' onClick={(e) => e.stopPropagation()}>
                      <input 
                        autoFocus
                        className='bg-gray-100 dark:bg-white/5 border border-purple-500/50 rounded px-2 py-0.5 outline-none flex-1 min-w-0 text-base font-medium focus:ring-1 focus:ring-purple-500/50 transition-all'
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(chat._id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                      />
                      <div className='flex items-center gap-1.5 shrink-0'>
                        <img 
                          src={assets.tick_icon} 
                          alt="Save" 
                          className='w-4 h-4 cursor-pointer hover:scale-110 active:scale-95 transition-transform'
                          onClick={() => handleRename(chat._id)}
                        />
                        <img 
                          src={assets.close_icon} 
                          alt="Cancel" 
                          className='w-3.5 h-3.5 cursor-pointer hover:scale-110 active:scale-95 transition-transform opacity-60 hover:opacity-100 not-dark:invert'
                          onClick={() => setEditingId(null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className='truncate text-base font-medium'>
                      {chat.messages.length > 0 && chat.name === 'New Chat' ? chat.messages[0].content.slice(0, 32) : chat.name}
                    </p>
                  )}
                </div>
                <p className='text-[10px] text-gray-500 dark:text-[#B1A6C0] mt-0.5'>{moment(chat.updatedAt).fromNow()}</p>
              </div>
              
              <div className='flex items-center gap-2'>
                {editingId !== chat._id && (
                  <>
                    <img 
                      src={assets.edit_icon} 
                      alt="" 
                      className={`${selectedChat?._id === chat._id ? 'block' : 'hidden md:group-hover:block max-md:block'} w-3.5 h-3.5 opacity-60 hover:opacity-100 not-dark:invert ml-1`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(chat._id);
                        setTempName(chat.messages.length > 0 && chat.name === 'New Chat' ? chat.messages[0].content.slice(0, 32) : chat.name);
                      }}
                    />
                    <img 
                      src={assets.bin_icon} 
                      alt="" 
                      className={`${selectedChat?._id === chat._id ? 'block' : 'hidden md:group-hover:block max-md:block'} w-3.5 h-3.5 opacity-60 hover:opacity-100 not-dark:invert`}
                      onClick={e=> toast.promise(deleteChat(e, chat._id), {loading: 'deleting...'})}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        }
      </div>

      {/* Community Images */}
      <div onClick={() =>{navigate('/community'); setIsMenuOpen(false)}} className='flex items-center gap-2 p-2 mt-4 border border-gray-300 
       dark:border-white/15 rounded-md cursor-pointer hover-scale-103 transition-all'>
        <img src={assets.gallery_icon} alt="" className='w-4.5 not-dark:invert'/>
        <div className='flex flex-col text-base'>
          <p>Community Images</p>
        </div>
      </div>

      {/* Credit purchase option */}
      <div onClick={() =>{navigate('/credits'); setIsMenuOpen(false)}} className='flex items-center gap-1 p-2 mt-4 border border-gray-300
       dark:border-white/15 rounded-md  cursor-pointer hover:scale-105 transition-all'>
        <img src={assets.diamond_icon} alt="" className='w-4.5 -mt-4 dark:invert'/>
        <div className='flex flex-col text-sm'>
          <p>Credits: {user?.credits}</p>
          <p className='text-xs text-gray-400'>Purchase credits to use QuickGPT</p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className='flex items-center justify-between gap-1 p-2 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>
        <div className='flex items-center gap-2 text-sm'>
          <img src={assets.theme_icon} alt="" className='w-4 not-dark:invert'/>
          <p>Dark Mode</p>
        </div>
        <label className='relative inline-flex cursor-pointer'>
          <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === 'dark'}/>
          <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
        </label>
      </div>

      {/* User Account */}
      <div onClick={() =>{navigate('/community')}} className='flex items-center gap-3 p-2 mt-4 border border-gray-300 dark:border-white/15 rounded-md 
      cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors'>
        {user ? (
          <div className='w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white text-xs font-bold shadow-sm'>
            {user.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img src={assets.user_icon} alt="" className='w-6 not-dark:invert opacity-70 group-hover:opacity-100'/>
        )}
        <p className='flex-1 text-sm dark:text-primary truncate font-medium'>{user ? user.name : "Login your account"}</p>
        {user && <img onClick={(e) => {e.stopPropagation(); logout()}} src={assets.logout_icon} className='h-4.5 cursor-pointer hidden not-dark:invert group-hover:block transition-all opacity-60 hover:opacity-100'/>}
      </div>


    </div>
  )
}

export default SideBar
