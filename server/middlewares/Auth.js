import User from "../models/User.js"
import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found"
      })
    }

    req.user = user
    next()
    
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed"
    })
  }
}
