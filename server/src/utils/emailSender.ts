import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
import bcyrpt from "bcrypt";
import nodemailer, { SendMailOptions } from "nodemailer";

const { FRONTEND_DOMAIN, USER, PASS } = process.env;
type EmailType = "verify" | "reset";

export const sendEmail = async (
	email: string,
	emailType: EmailType,
	userId: string
) => {
	let userName;
	try {
		const hashedToken = await bcyrpt.hash(userId.toString(), 10);

		if (emailType === "verify") {
			const user = await User.findByIdAndUpdate(userId, {
				emailVerificationToken: hashedToken,
				emailVerificationTokenExpiry: Date.now() + 3600000,
			});
			userName = user?.firstName + " " + user?.lastName;
		} else if (emailType === "reset") {
			const user = await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			});
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
			subject: emailType === "verify" ? "Verify Email" : "Reset Password",
			html: `<p> Click <a href="${FRONTEND_DOMAIN}/${emailType}?token=${hashedToken}" target="_blank"> here </a> to ${
				emailType === "verify" ? "Verify Email" : "Reset Password"
			}</p>`,
		};

		const mailResponse = await transport.sendMail(mailOptions);
		console.log("mailResponse", mailResponse);
		return mailResponse;
	} catch (error) {
		console.log("error", error);
		throw new ApiError(500, "Failed to send email");
	}
};
