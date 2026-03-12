import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message';
const ChatBox = () => {

  const containerRef = useRef(null)

  const {selectedChat, theme, sendMessage} = useAppContext();

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e)=>{
    e.preventDefault()
    if(!selectedChat || !prompt) return;

    setLoading(true)
    const currentPrompt = prompt;
    setPrompt('')
    const success = await sendMessage(selectedChat._id, currentPrompt, mode, isPublished)
    setLoading(false)
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    } 
    else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages])
  

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>

      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-4 text-primary opacity-80'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68 drop-shadow-2xl'/>
            <p className='mt-5 text-4xl sm:text-6xl text-center font-bold tracking-tight text-gray-300 dark:text-white/20 bg-clip-text'>Ask me anything</p>
          </div>
        )}

        {messages.map((message, index)=>(
          <Message key={index} message={message}/>
        ))}

        {/* Premium AI Loading Animation */}
        {
          loading && (
            <div className='flex items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-2 duration-300'>
              <div className='p-2 rounded-md bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30'>
                <div className='flex gap-1 items-center px-2 py-1'>
                  <div className='w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(192,132,252,0.8)]'></div>
                  <div className='w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(168,85,247,0.8)]'></div>
                  <div className='w-2 h-2 rounded-full bg-purple-600 animate-bounce shadow-[0_0_8px_rgba(147,51,234,0.8)]'></div>
                  <span className='ml-2 text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider animate-pulse'>
                    {mode === 'image' ? 'AI is generating image...' : 'AI is thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )
        }
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-2 md:mb-3 text-[10px] md:text-sm mx-auto cursor-pointer group'>
          <p className='text-gray-500 dark:text-gray-400 group-hover:text-purple-600 transition-colors'>
            <span className='sm:hidden uppercase font-bold tracking-tighter'>Publish to Community</span>
            <span className='hidden sm:inline'>Published Generated Image to Community</span>
          </p>
          <input type="checkbox" className='cursor-pointer accent-purple-600 w-3.5 h-3.5 md:w-4 md:h-4' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)}/>
        </label>
      )}

      {/* Prompt Input Box */}
      <div className='w-full max-w-3xl mx-auto px-2 md:px-4 pb-4 md:pb-0'>
        <form onSubmit={onSubmit}
        className='bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-white/10 rounded-xl md:rounded-2xl w-full p-1 md:p-2 pl-2 md:pl-4 flex gap-2 md:gap-4 items-center shadow-xl shadow-black/5 dark:shadow-none backdrop-blur-3xl transition-all hover:border-purple-400/50 dark:hover:border-purple-500/30'>
        <div className='flex p-1 bg-gray-100/80 dark:bg-white/5 rounded-lg md:rounded-2xl border border-gray-200 dark:border-white/10 shrink-0 gap-0.5 md:gap-1'>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md md:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-500 flex items-center justify-center gap-2 relative ${
              mode === 'text' 
                ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-lg shadow-purple-500/10' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <span className='sm:hidden font-bold'>T</span>
            <span className='hidden sm:block'>Text</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md md:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-500 flex items-center justify-center gap-2 relative ${
              mode === 'image' 
                ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-lg shadow-purple-500/10' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <img 
              src={assets.gallery_icon} 
              className={`w-3.5 h-3.5 sm:hidden ${mode === 'image' ? (theme === 'dark' ? 'brightness-0 invert' : 'brightness-0') : 'brightness-0 dark:invert opacity-60'}`} 
              alt="Image Mode" 
            />
            <span className='hidden sm:block'>Image</span>
          </button>
        </div>
          <input 
            onChange={(e)=>setPrompt(e.target.value)} 
            value={prompt} 
            type="text" 
            placeholder={mode === 'image' ? 'Describe image...' : 'Ask anything...'} 
            className='flex-1 w-full text-sm md:text-base outline-none bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-slate-100 min-w-0' 
            required
          />
          <button 
            disabled={loading}
            className='bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 group shrink-0'
          >
            <img 
              src={loading ? assets.stop_icon : assets.send_icon} 
              className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${!loading && 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
              style={{filter: 'brightness(0) invert(1)'}}
              alt="" 
            />
          </button>
        </form>
      </div>
      
    </div>
  )
}

export default ChatBox
