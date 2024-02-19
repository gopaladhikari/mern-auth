import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const dbUri = import.meta.env.VITE_DB_URI;

export default function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();

	const verifyEmail = useCallback(async () => {
		try {
			const res = await fetch(`${dbUri}/api/v1/user/verify-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});
			const data = await res.json();
			if (data.status === 200) navigate("/login");
		} catch (error) {
			throw new Error(`Failed to verify email ${error}`);
		}
	}, [token, navigate]);
	useEffect(() => {
		verifyEmail();
	}, [verifyEmail, token, navigate]);

	return <main> token : {token} </main>;
}
