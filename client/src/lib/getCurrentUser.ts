const dbUri = import.meta.env.VITE_DB_URI;

export const getCurrentUser = async () => {
  const res = await fetch(`${dbUri}/api/v1/user/get-current-user`);
  const data = await res.json();
  return data;
};
