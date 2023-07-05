let nodemailer=require('nodemailer');
let dotenv = require('dotenv');

dotenv.config({path:"./environment.env"});
// console.log(process.env.PASS,process.env.EMAIL)
let sendMail=async(options)=>{
    let transport=nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port:465, // if secure false port = 587, if true port= 465
        secure: true
        ,auth:{user:process.env.EMAIL,pass:process.env.PASS}
    });
    let mailOptions={
        from:"<E-SHOP>",
        to:options.email,
        subject:options.subject,
        message:options.message
    };
    return transport.sendMail(mailOptions);
}
module.exports =sendMail