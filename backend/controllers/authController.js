const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({ success: false, message: 'Invalid Password!' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'leyladigitalsecret', {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        accessToken: token,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
