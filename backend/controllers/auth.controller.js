export const signup = async (req, res) => {
  res.json({ message: "User signed up" });
};

export const login = async (req, res) => {
  res.json({ message: "User logged in" });
};

export const logout = async (req, res) => {
  res.json({ message: "User logged out" });
};
