import nodemailer from "nodemailer";

interface SendEmailPayload {
  from_name: string;
  from_email: string;
  message: string;
}


const sendEmailContact = async (payload: SendEmailPayload) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  });


  await transporter.sendMail({

    from: process.env.SMTP_AUTH_USER,

    to: process.env.SMTP_AUTH_USER,

    replyTo: payload.from_email,

    subject: `New Contact From ${payload.from_name}`,

    html: `
      <h2>New Contact Message</h2>

      <p>
        <b>Name:</b> ${payload.from_name}
      </p>

      <p>
        <b>Email:</b> ${payload.from_email}
      </p>

      <p>
        <b>Message:</b>
      </p>

      <p>
        ${payload.message}
      </p>
    `,
  });

};


export default sendEmailContact;