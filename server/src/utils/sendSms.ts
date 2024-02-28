import twilio from "twilio";

import { env } from "../conf/env";

export const sendSms = async (phoneNumber: string) => {
	const client = twilio(env.twilioSid, env.twilioToken);

	const message = await client.messages.create({
		body: "Hello from twilio-node",
		to: phoneNumber, // Text your number
		from: env.phoneNumber, // From a valid Twilio number
	});

	console.log("twilio message", message);

	return message;
};
