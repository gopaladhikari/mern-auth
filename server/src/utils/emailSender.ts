import bcyrpt from "bcrypt";
import nodemailer, { SendMailOptions } from "nodemailer";
import { User } from "../models/user.model";
import { ApiError } from "./ApiError";
import { getMailUI } from "./sendMailUI";

const { FRONTEND_DOMAIN, USER, PASS } = process.env;
type EmailType = "verify" | "reset";

export const sendEmail = async (
  email: string,
  emailType: EmailType,
  userId: string
) => {
  let userName;
  const subject = emailType === "verify" ? "Verify Email" : "Reset Password";
  try {
    const hashedToken = await bcyrpt.hash(userId.toString(), 10);

    if (emailType === "verify") {
      const user = await User.findByIdAndUpdate(userId, {
        $set: {
          emailVerificationToken: hashedToken,
          emailVerificationTokenExpiry: Date.now() + 3600000,
        },
      });
      userName = user?.firstName + " " + user?.lastName;
    } else if (emailType === "reset") {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          },
        },
        { new: true }
      );
      userName = user?.firstName + " " + user?.lastName;
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: '"Mern Auth 👻" <mern-auth@gmail.com>',
      to: `${userName}, ${email}`,
      subject: subject,
      html: getMailUI({
        email,
        emailType,
        frontendDomain: String(FRONTEND_DOMAIN),
        hashedToken,
      }),
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log("error", error);
    throw new ApiError(500, "Failed to send email");
  }
};
