import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import authRoutes from './routes/authroutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())
  
app.get("/", (req,res)=>{
  res.render("src/app/login/page.tsx");
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});





// // Handle errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

// // Handle 404 errors
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Not Found' });
// });