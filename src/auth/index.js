export const signup = async (user) => {
  const response = await fetch(`http://localhost:8888/api/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  let data = await response.json();
  return data;
};

export const signin = async (user) => {
  const response = await fetch(`http://localhost:8888/api/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  let data = await response.json();
  return data;
};

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = async (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    const response = await fetch(`http://localhost:8888/api/signout`, {
      method: "GET",
    });
    let data = await response.json();
    return data;
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
