const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const register = async (req, res) => {
  const {email, password} = req.body;

try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({

    data :{
        email : email,
        password : hashedPassword
    }
  })
  res.status(201).json({
    message: 'User registered successfully', 
    userId: user.id
});
    
} catch (error) {
    res.status(500).json({
        error : 'Intertnal server error',
        details : error.message
    })   
};

};

const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email}}
    );
    if(!user){
        return res.status(404).json({
            error:'user not found',
            details : 'No user found with the provided email'
        })
    }
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if(!ispasswordValid){
        return res.status(401).json({
            error : 'incorrect password',
            details : 'The provided password is incorrect'
        })
    }

    res.status(200).json({
        message : 'Login successful',
        token : jwt.sign({
            userId : user.id
        },
            process.env.jwtSecret, {expiresIn : '1h'})
    });
    }catch (error) {
        res.status(500).json({
            error : 'Intertnal server error',
            details : error.message
        })
    };

};


module.exports = {register, login};
