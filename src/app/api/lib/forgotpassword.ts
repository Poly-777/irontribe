export const sendForgotPasswordRequest = async (emailid: any) => {
  try {
    const response = await fetch(
      `http://52.0.173.253:8000/lmsusers/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailid }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data;
    } else if (response.status === 404) {
      alert("Enter a valid Emailid");
      return null;
    } else {
      throw new Error(data.error || "Failed to send forgot password request");
    }
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (otp: any) => {
  try {
    const response = await fetch(`http://52.0.173.253:8000/lmsusers/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
export const newPassword = async (emailid: any, newPassword: any) => {
  try {
    const response = await fetch(
      `http://52.0.173.253:8000/lmsusers/new-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailid, newPassword }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
