// lib/api.ts
async function loginUser(emailid: any, password: any) {
  const response = await fetch(`http://52.0.173.253::8000/lmsusers/login`,{
  method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emailid, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401) {
      throw new Error(errorData.message || "Incorrect password");
    } else if (response.status === 404) {
      throw new Error(errorData.message || "User not found");
    } else {
      throw new Error("An error occurred while logging in");
    }
  }

  const data = await response.json();
  return data;
}

async function signinUser(name: any, mobile: any, emailid: any, password: any) {
  console.log(name, mobile, emailid, password, "password here");
  const response = await fetch(`api/auth/users`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, mobile, emailid, password }),
  });

  console.log(response);

  if (response.status === 400) {
      alert("User with this email already exists!");
  } else if (response.status === 201) {
      alert("Signed in successfully");
  }

  const data = await response.json();
  return { status: response.status, data: data }; // Return both status and data
}


async function contactUser(name: any, emailid: any, mobile: any, message: any) {
  const response = await fetch(`http://52.0.173.253:8000/lmsusers/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, emailid, mobile, message }),
  });

  console.log(response);

  const data = await response.json();
  return data;
}

export {loginUser, signinUser, contactUser };

