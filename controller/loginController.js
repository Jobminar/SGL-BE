// import Login from "../model/loginModel.js";
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';

// const loginController = {
//   signup: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new Login({ email, password: hashedPassword });
//       const savedUser = await newUser.save();
//       res.status(201).json({ message: 'User registered successfully', user: savedUser });
//     } catch (error) {
//       console.error("Signup error:", error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await Login.findOne({ email });

//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       res.status(200).json({ message: 'Login successful' });
//     } catch (error) {
//       console.error("Login error:", error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   forgotPassword: async (req, res) => {
//     try {
//       const { email } = req.body;
//       const user = await Login.findOne({ email });

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const resetToken = crypto.randomBytes(20).toString('hex');
//       const resetTokenExpiration = new Date(Date.now() + 3600000);

//       user.resetToken = resetToken;
//       user.resetTokenExpiration = resetTokenExpiration;

//       await user.save();

      

//       res.status(200).json({ message: 'Password reset link sent to your email' });
//     } catch (error) {
//       console.error("Forgot password error:", error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   resetPassword: async (req, res) => {
//     try {
//       const { token } = req.params;
//       const { password } = req.body;

//       const user = await Login.findOne({
//         resetToken: token,
//         resetTokenExpiration: { $gt: new Date() },
//       });

//       if (!user) {
//         return res.status(400).json({ error: 'Invalid or expired token' });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       user.password = hashedPassword;
//       user.resetToken = null;
//       user.resetTokenExpiration = null;

//       await user.save();

//       res.status(200).json({ message: 'Password reset successful' });
//     }catch (error) {
//       console.error("Signup error:", error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
// };

// export default loginController;


import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Login from "../model/loginModel.js";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USERNAME,
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    refreshToken: 'YOUR_REFRESH_TOKEN',
    accessToken: 'YOUR_ACCESS_TOKEN',
    expires: 3600,
  },
});

const loginController = {
  signup: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Login({ email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Login.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Login.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiration = new Date(Date.now() + 3600000);

      user.resetToken = resetToken;
      user.resetTokenExpiration = resetTokenExpiration;

      await user.save();

      // Assuming you want to send an email, uncomment the following lines
      // const mailOptions = {
      //   from: process.env.EMAIL_USERNAME,
      //   to: user.email,
      //   subject: 'Password Reset',
      //   html: `
      //     <p>You requested a password reset</p>
      //     <p>Click this <a href="http://localhost:3000/reset-password/${resetToken}">link</a> to reset your password.</p>
      //   `,
      // };
      // await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await Login.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;

      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const allUsers = await Login.find({}, { password: 0, resetToken: 0, resetTokenExpiration: 0 });
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default loginController;
