const {
	MONGO_URI,
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRY,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_SECRET_KEY,
	FRONTEND_DOMAIN,
	FRONTEND_DEV_DOMAIN,
	USER,
	PASS,
	TWILO_SID,
	TWILO_TOKEN,
	TWILO_VERIFY_SID,
	PHONE_NUMBER,
} = process.env;

export const env = {
	mongoUri: String(MONGO_URI),
	accessTokenSecret: String(ACCESS_TOKEN_SECRET),
	accessTokenExpiry: String(ACCESS_TOKEN_EXPIRY),
	refreshTokenSecret: String(REFRESH_TOKEN_SECRET),
	refreshTokenExpiry: String(REFRESH_TOKEN_EXPIRY),
	coludinaryName: String(CLOUDINARY_CLOUD_NAME),
	cloudinaryApi: String(CLOUDINARY_API_KEY),
	cloudinarySecretKey: String(CLOUDINARY_SECRET_KEY),
	frontendDomain: String(FRONTEND_DOMAIN),
	frontendDevDomain: String(FRONTEND_DEV_DOMAIN),
	user: String(USER),
	pass: String(PASS),
	twilioSid: String(TWILO_SID),
	twilioToken: String(TWILO_TOKEN),
	twilioVerifyToken: String(TWILO_VERIFY_SID),
	phoneNumber: String(PHONE_NUMBER),
};
