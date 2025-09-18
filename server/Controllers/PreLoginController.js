import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const sendMailController=async (req,res)=>{
  try {
    const {name,email,company,subject,message}=req.body;
  const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.BUSINESS_EMAIL,
      pass:process.env.APP_PASSWORD
    }
  })
  const mailOptions={
    from: `"nexusPro Contact form" ${process.env.BUSINESS_EMAIL}`,
    to : process.env.BUSINESS_EMAIL,
    replyTo: email,
    subject: `New message from ${name}-${company}`,
    html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
  }
  await transporter.sendMail(mailOptions);
  console.log("Message sent successfully")
  res.status(200).json({success:true,message:"Your message sent successfully"})
  } catch (err){
    console.log(err);
    res.status(500).json({message: "Internal Server Error"
    })
  }
}