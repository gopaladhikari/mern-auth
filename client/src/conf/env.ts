const { VITE_DB_URI } = import.meta.env;

export const env = {
  dbUri: String(VITE_DB_URI),
};
