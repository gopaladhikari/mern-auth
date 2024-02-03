const DB_URI = import.meta.env.VITE_DB_URI;

export const logoutUser = async () => {
  const res = await fetch(`${DB_URI}/api/v1/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
