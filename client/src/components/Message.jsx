import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import { useAppContext } from '../context/AppContext'

const Message = ({message}) => {

  const {user} = useAppContext()

  useEffect(() =>{
    Prism.highlightAll()
  },[message.content])

  return (
    <div>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2.5 px-5 bg-white dark:bg-purple-900/20 border border-gray-100 dark:border-purple-500/30 rounded-2xl rounded-tr-none max-w-2xl shadow-sm'>
            <p className='text-base text-gray-800 dark:text-slate-100 leading-relaxed font-normal'>{message.role === 'user' ? (message.content) : (<Markdown>{message.content}</Markdown>)}</p>
            <span className='text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-tight'>{moment(message.timestamp).fromNow()}</span>
          </div>
          {user ? (
            <div className='w-8 h-8 min-w-[32px] flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white text-sm font-bold shadow-md'>
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img src={assets.user_icon} alt="" className='w-8 rounded-full shadow-sm'/>
          )}
        </div>
      )
      : 
      (
        <div className='inline-flex flex-col gap-2 p-2.5 px-5 max-w-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl rounded-tl-none my-4 shadow-sm backdrop-blur-sm'>
          {message.isImage ? (
            <div className='relative group'>
              <img src={message.content} alt="" className='w-full max-w-md mt-2 rounded-xl shadow-lg ring-1 ring-black/5'/>
            </div>
          )
          :
          (
            <div className='text-base text-gray-800 dark:text-slate-100 reset-tw leading-relaxed font-normal'><Markdown>{message.content}</Markdown></div>
          )
        }
          <span className='text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-tight'>{moment(message.timestamp).fromNow()}</span>
        </div>
      )
    }
    </div>
  )
}

export default Message
