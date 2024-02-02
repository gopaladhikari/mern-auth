export type User = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  accessToken: string;
  refreshToken: string;
};
