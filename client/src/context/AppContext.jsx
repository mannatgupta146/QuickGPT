import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'
axios.defaults.withCredentials = true

const AppContext = createContext()

export const AppContextProvider = ({children}) =>{

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [loadingUser, setLoadingUser] = useState(true)

    const fetchUser = async() =>{
        try {

            const {data} = await axios.get('/api/user/data', {headers: {Authorization: token}})

            if(data.success){
                setUser(data.user)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        finally{
            setLoadingUser(false)
        }
    }

    const createNewChat = async () => {
        try {
            if(!user) return toast('Login to create a new chat')

            navigate('/')

            await axios.get('/api/chat/create', {headers: {Authorization: token}})
            await fetchUserChats()

        } catch (error) {
            toast.error(error.message)
        }
    }
    
    const fetchUserChats = async() =>{
        try {
            const {data} = await axios.get('/api/chat/get', {headers: {Authorization: token}})

            if(data.success){
                setChats(data.chats)

                if (data.chats.length === 0) {
                    await createNewChat()
                    return fetchUserChats()
                }
                else {
                    // Only set selectedChat if none is selected or if we need to force it
                    setSelectedChat(prev => {
                        if (prev && data.chats.some(c => c._id === prev._id)) {
                             // Keep current selection but update its content from fetched data if necessary
                             // Actually, for simplicity, let's just keep it if it exists
                             return prev;
                        }
                        return data.chats[0];
                    })
                }
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() =>{
        if(token){
            fetchUser()
        }
        else{
            setUser(null)
            setLoadingUser(false)
        }
    },[token])

    useEffect(() =>{
        if(user?._id){
            fetchUserChats()
        } 
        else if(!user){
            setChats([])
            setSelectedChat(null)
        }
    },[user?._id])

    useEffect(() =>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark')
        }
        else{
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)

        // Enable smooth transition temporarily during theme change
        document.body.classList.add('theme-changing')
        const timer = setTimeout(() => {
            document.body.classList.remove('theme-changing')
        }, 500)

        return () => clearTimeout(timer)
    },[theme])

    const sendMessage = async (chatId, prompt, mode, isPublished) => {
        try {
            if (!token) return toast.error('Login to send messages');

            // Optimistic Update: Add user message immediately
            const userMsg = { role: 'user', content: prompt, isImage: false, timestamp: Date.now() };
            
            setSelectedChat(prev => {
                const updatedMessages = [...(prev?.messages || []), userMsg];
                return { ...prev, messages: updatedMessages };
            });

            // Also update the chat in the sidebar (chats array)
            setChats(prev => prev.map(chat => 
                chat._id === chatId ? { ...chat, messages: [...(chat.messages || []), userMsg] } : chat
            ));

            // Optimistic Update: Deduct credits
            setUser(prev => ({ ...prev, credits: prev.credits - (mode === 'image' ? 2 : 1) }));

            const endpoint = mode === 'image' ? '/api/message/image' : '/api/message/text';
            const payload = mode === 'image' ? { chatId, prompt, isPublished } : { chatId, prompt };

            const { data } = await axios.post(endpoint, payload, { headers: { Authorization: token } });

            if (data.success) {
                // Update with AI reply
                setSelectedChat(prev => ({
                    ...prev,
                    messages: [...(prev?.messages || []), data.reply]
                }));

                // Sync sidebar chats as well
                setChats(prev => prev.map(chat => 
                    chat._id === chatId ? { ...chat, messages: [...(chat.messages || []), data.reply] } : chat
                ));

                return true;
            } else {
                // Rollback or show error
                toast.error(data.message);
                // Optional: You could implement a rollback here if needed
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }

    const renameChat = async (chatId, newName) => {
        try {
            const { data } = await axios.post('/api/chat/rename', { chatId, name: newName }, { headers: { Authorization: token } });
            if (data.success) {
                setChats(prev => prev.map(chat => chat._id === chatId ? { ...chat, name: newName } : chat));
                if (selectedChat?._id === chatId) {
                    setSelectedChat(prev => ({ ...prev, name: newName }));
                }
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const buyPlan = async (planId) => {
        try {
            console.log(">>> buyPlan called with planId:", planId);
            if (!token) {
                console.error("!!! No token found in AppContext");
                return toast.error('Login to purchase credits');
            }
            
            console.log(">>> Sending POST request to /api/credit/purchase...");
            const { data } = await axios.post('/api/credit/purchase', { planId }, { headers: { Authorization: token } });
            console.log(">>> Received response from /api/credit/purchase:", data);
            
            if (data.success) {
                console.log(">>> Redirecting to Stripe session URL:", data.session);
                window.location.href = data.session;
            } else {
                console.error("!!! API returned failure:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("!!! Catch error in buyPlan:", error);
            toast.error(error.message);
        }
    }

    const value = {
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser, fetchUserChats, token, setToken, axios, sendMessage, renameChat, buyPlan
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)