async function paymentConfirmation(
  name: any,
  emailid: any,
  mobile: any,
  courseName: any,
  courseId: any,
  files: any
) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("emailid", emailid);
    formData.append("mobile", mobile);
    formData.append("courseName", courseName);
    formData.append("courseId", courseId);
    formData.append("files", files);

    const response = await fetch(
      `http://52.0.173.253:8000/lmsusers/payment-confirmation`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to submit payment: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting payment:", error);
    throw new Error("Failed to submit payment");
  }
}
export { paymentConfirmation };
