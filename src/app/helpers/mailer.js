import nodemailer from 'nodemailer';


const sendEmail = async ({ useremail,subject,text,html, }) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465,             
      secure: true,          
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD,       
      },
    });

    const mailOption = {
      from:`Cp Cheats<${process.env.EMAIL}>`,
      to: useremail,
      subject: subject,
    text: text,
    html: html,
    };

    const mailResponse = await transport.sendMail(mailOption);

    return mailResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export default sendEmail;
