import { useState, useRef } from "react";
import axios from "axios";
//import { ThreeDots } from "react-loader-spinner";
//import "./Warranty.css";
import WarrantyPolicy from "./Claim";

function Warranty() {
  const formRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mode, setMode] = useState("register");

  const [claimNumber, setClaimNumber] = useState("");
  const [claimSerialNumber, setClaimSerialNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClaim = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        // "https://warranty.mopawa.co.ke/getWarrantySms",
        "http://localhost:5000/api/warranty/getWarrantySms", 
      {
        phoneNumber: claimNumber,
        serialNumber: claimSerialNumber,
      });
      setSuccessMessage("OTP sent successfully!");
      setOtpSent(true);
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
      setTimeout(() => setErrorMessage(""), 3000); 
      setSuccessMessage("");
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    try {
      // const response = await axios.post(
      //   // "https://warranty.mopawa.co.ke/verifyOtp",
      //   "http://localhost:5000/verifyOtp", 
      // {
      //   phoneNumber: claimNumber,
      //   otp,
      // });
      const response = await 
      axios.post("http://localhost:5000/api/warranty/verifyOtp", {
        phoneNumber: claimNumber.trim(),
        otp: otp.trim(),
      });
      
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 3000); 
      setOtpSent(false);
      setOtp("");
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP.");
      setTimeout(() => setErrorMessage(""), 3000); 
      setSuccessMessage("");
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
  
    try {
      const response = await axios.post(
      // "https://warranty.mopawa.co.ke/register",
        "http://localhost:5000/api/warranty/register", 
      {
        phone_number: phoneNumber,
        serial_number: serialNumber,
      });
      setSuccessMessage("Warranty registered successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); 
      setPhoneNumber("");
      setSerialNumber("");
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
      setTimeout(() => setErrorMessage(""), 3000); 
      setSuccessMessage("");
      setLoading(false);
    }
  };

  return (
    <div>
      
      <div className="h-[50vh] w-[100vw] z-1 relative">
        <div className="h-[50vh] w-[100vw] z-1 absolute bg-black opacity-40"></div>
        {/* <img
          src="https://www.jacanawarranty.com/wp-content/uploads/elementor/thumbs/Warranty-01-1024x651-1-q8nzmxabqfbqzcxo77dcks2kuea1li9g6v3k5yajrc.webp"
          alt="Hero section"
          className="w-[100vw] h-[50vh] object-cover"
        /> */}
        <div className="text-white absolute h-full w-full top-0 left-0 lg:ml-[10%] flex flex-col justify-center lg:items-start items-center">
          <h1 className="font-bold text-4xl mb-10">Register Warranty</h1>
          <span className="lg:text-2xl text-lg font-normal">
            Mopawa - Best Power Bank Manufacturer.
          </span>
        </div>
      </div>

      
      <div className="min-h-[50vh] py-10">
        <WarrantyPolicy setMode={(modeType) => {
          setMode(modeType);
          setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100); 
        }} />

        <hr />

        <div ref={formRef} className="flex flex-col items-center px-3 mx-auto my-10">
          <h2 className="font-bold text-2xl my-2">Warranty Information</h2>

          <p className="my-2 font-bold">
            Please note that warranty details cannot be changed once registered
          </p>

          
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          
          <div className="my-4">
            {mode === "register" ? (
              <p>
                Already registered?{" "}
                <button
                  className="text-blue-600 underline"
                  onClick={() => setMode("claim")}
                >
                  Click here to claim warranty
                </button>
              </p>
            ) : (
              <p>
                Need to register your warranty?{" "}
                <button
                  className="text-blue-600 underline"
                  onClick={() => setMode("register")}
                >
                  Click here to register
                </button>
              </p>
            )}
          </div>

          
          {mode === "register" && (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="p-5">
                <label htmlFor="serialNumber" className="mr-10">
                  Serial Number:
                </label>
                <input
                  className="rounded-md font-sans"
                  type="text"
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                />
              </div>

              <div className="p-5">
                <label htmlFor="phoneNumber" className="mr-10">
                  Phone Number:
                </label>
                <input
                  className="rounded-md font-sans"
                  placeholder="2547XXXXXXXX"
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {loading ? (
                <div className="text-white bg-yellow-400 px-3 py-2 rounded-md mt-3">
                  {/* <ThreeDots
                    visible={true}
                    height="40"
                    width="40"
                    color="#ffffff"
                    radius="9"
                    ariaLabel="three-dots-loading"
                  /> */}
                </div>
              ) : (
                <button
                  className="text-white bg-yellow-400 px-3 py-2 rounded-md mt-3"
                  type="submit"
                >
                  Register Warranty
                </button>
              )}
            </form>
          )}

          
          {mode === "claim" && (
            <>
              <form onSubmit={handleClaim} className="flex flex-col">
                <div className="p-5">
                  <label htmlFor="claimSerialNumber" className="mr-10">
                    Serial Number:
                  </label>
                  <input
                    className="rounded-md font-sans"
                    type="text"
                    id="claimSerialNumber"
                    value={claimSerialNumber}
                    onChange={(e) => setClaimSerialNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="p-5">
                  <label htmlFor="claimNumber" className="mr-10">
                    Phone Number:
                  </label>
                  <input
                    className="rounded-md font-sans"
                    placeholder="2547XXXXXXXX"
                    type="text"
                    id="claimNumber"
                    value={claimNumber}
                    onChange={(e) => setClaimNumber(e.target.value)}
                    required
                  />
                </div>

                {loading ? (
                  <div className="text-white bg-blue-400 px-3 py-2 rounded-md mt-3">
                    {/* <ThreeDots
                      visible={true}
                      height="40"
                      width="40"
                      color="#ffffff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                    /> */}
                  </div>
                ) : (
                  <button
                    className="text-white bg-blue-400 px-3 py-2 rounded-md mt-3"
                    type="submit"
                  >
                    Claim Warranty
                  </button>
                )}
              </form>

              
              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col items-center mt-4">
                  <label htmlFor="otp" className="mb-2 font-bold">
                    Enter OTP:
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-md font-sans mb-3"
                    required
                  />
                  <button
                    type="submit"
                    className="text-white bg-green-500 px-3 py-2 rounded-md"
                  >
                    Verify OTP
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Warranty;
