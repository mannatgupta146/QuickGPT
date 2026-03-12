import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Chat from "../models/Chat.js"

// generate jwt
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// api to register function 
export const registerUser = async(req, res) => {
    const {name, email, password} = req.body

    try {
        const userExists = await User.findOne({email})

        if(userExists){
            return res.json({
                success: false,
                message: 'User already exists'
            })
        }

        const user = await User.create({name, email, password})
        console.log("SUCCESS: User created:", user._id);

        const token = generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            success: true,
            token
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// api to login user
export const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {

        const user = await User.findOne({email})
        
        if(user){
            const isMatch =  await bcrypt.compare(password, user.password)

            if(isMatch){
                const token = generateToken(user._id)
                
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, // Required for sameSite: 'none'
                    sameSite: 'none', // Required for cross-site (Vercel to Render)
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
                });

                return res.json({
                    success: true,
                    token
                })
            }
        }

        return res.json({
            success: false,
            message: 'Invalid email or password'
        })
        
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// api to get user data 
export const getUser = async (req, res) =>{
    try {
        const user = req.user
        return res.json({
            success: true,
            user
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// // api to get published images 
// export const getPublishedImages = async (req, res) => {
//     try {
//         const publishedImageMessages = await Chat.aggregate([
//             {$unwind: "$messages"},
//             {$match: {
//                 "messages.isImage": true,
//                 "messages.isPublished": true,
//             }},
//             {
//                 $project: {
//                     _id: 0,
//                     imageUrl: "$messages.content",
//                     userName: "$userName"
//                 }
//             }
//         ])

//         res.json({
//             success: true, 
//             images: publishedImageMessages.reverse()
//         })

//     } catch (error) {
//         res.json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
          timestamp: "$messages.timestamp",
        },
      },
      { $sort: { timestamp: -1 } },
    ])

    res.json({
      success: true,
      images: publishedImageMessages,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}
