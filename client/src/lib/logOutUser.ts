export const logoutUser = async () => {
  const res = await fetch("/api/v1/user/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
