export const getCurrentUser = async () => {
  const res = await fetch("/api/v1/user/get-current-user");
  const data = await res.json();
  return data;
};
