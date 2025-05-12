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
  const response = await fetch(`http://52.0.173.253:8000/lmsusers/signup`, {
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



// const handleSignup = async (event: any) => {
  //   event.preventDefault();
  //   try {
  //     const data = await signinUser(user.name, user.mobile, user.emailid, user.password);
  //     if (data.status === 201) {
  //       localStorage.setItem("emailid", user.emailid || "");
  //       localStorage.setItem("mobile", user.mobile || "");
  //       localStorage.setItem("name", user.name || "");
  //       router.push("/dashboard");
  //     } else if (data.status === 400) {
  //       router.push("/signup");
  //     } else {
  //       console.error("Unhandled status code:", data.status);
  //     }
  //   } catch (error) {
  //     console.error("Signup failed", error);
  //   }
  // };


  //  const handleEmailChange = (e: any) => {
  //   const email = e.target.value;
  //   if (email === "" || validateEmail(email)) {
  //     setUser({ ...user, emailid: email, emailError: "" });
  //   } else {
  //     setUser({
  //       ...user,
  //       emailid: email,
  //       emailError: "Please enter a valid email address",
  //     });
  //   }
  // };


  // const handlePasswordChange = (e: any) => {
  //   const password = e.target.value;
  //   setUser((prevUser) => ({
  //     ...prevUser,
  //     password: password,
  //   }));
  //   validatePassword(password);
  // };