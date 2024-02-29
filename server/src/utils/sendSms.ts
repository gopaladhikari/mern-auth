import twilio from "twilio";

import { env } from "../conf/env";

export const sendSms = async (phoneNumber: string, otp: string) => {
  try {
    const client = twilio(env.twilioSid, env.twilioToken);

    const message = await client.messages.create({
      body: `Your mern-auth verification code is : ${otp}`,
      from: env.twilioFrom,
      to: `+${phoneNumber}`,
    });

    console.log("twilio message", message);

    return message;
  } catch (error) {
    console.log("twilio error", error);
    return null;
  }
};
