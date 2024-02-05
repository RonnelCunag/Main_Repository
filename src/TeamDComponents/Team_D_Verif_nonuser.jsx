import React, { useState } from "react";
import "../TeamDComponents/TeamD_Css/verification.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AiFillSafetyCertificate } from "react-icons/ai";
import warningErr from "../TeamDComponents/TeamD_Assets/icons8-warning-96.png";
import Team_D_HeaderLanding from "./Team_D_HeaderLanding";
import Verification from './../TeamAComponents/components/Verification';
import "../TeamAComponents/styles/Auth.css";
import { Link } from "react-router-dom";

const Team_D_Verif_nonuser = () => {
  const [code, setCode] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidSerial, setIsValidSerial] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Replace the URL with your actual API endpoint
      const response = await fetch(
        `http://localhost:8080/api/certifications/verifyCertificate/${code}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setVerificationResult(null);
          setErrorMessage(
            "Sorry, the serial number you entered does not exist in our system. Please check the serial number and try again."
          );
          setIsValidSerial(false);
        } else {
          setVerificationResult(data);
          setErrorMessage(""); // Clear previous error message if any
          setIsValidSerial(true);
        }
      } else {
        // Handle non-200 status codes
        if (response.status === 404) {
          setVerificationResult(null);
          setErrorMessage(
            "Sorry, the serial number you entered does not exist in our system. Please check the serial number and try again."
          );
          setIsValidSerial(false);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
    } catch (error) {
      // Handle fetch errors
      console.error("Error verifying certificate:", error);
      setVerificationResult(null);
      setErrorMessage(
        "An error occurred while verifying the certificate. Please try again."
      );
      setIsValidSerial(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="home-header">
        <div className="logo-container">
          <img
            src="..\src\assets\TeamAassets\companyLogo.png"
            alt="Logo"
            className="logo"
          />
        </div>
        <nav>
          <ul>
            <Link to="/">
              <button className="nav-HOME-button">Home</button>
            </Link>
          </ul>
        </nav>
      </div>

      <section className="verification_container">
        <div className="verification_title">
          <span></span>
        </div>
        <div className="verification_search">
          <div className="left">
            <h2>Verify Course Certificate</h2>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter Serial Number"
              value={code}
              onClick={() => {
                // Append "B55-" when the input field is clicked
                setCode("B55-");
                setIsValidSerial(false); // Reset isValidSerial on input click
              }}
              onChange={(e) => {
                const inputValue = e.target.value
                  .toUpperCase()
                  .substring(0, 18); // Limit to 18 characters
                setCode(inputValue);
                setIsValidSerial(false); // Reset isValidSerial on input change
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // Handle the "Enter" key press, e.g., trigger the verification function
                  handleVerify();
                }
              }}
              style={{
                borderColor: isValidSerial
                  ? "#28a745"
                  : errorMessage
                  ? "#ff0000"
                  : "#ced4da",
                borderWidth: "1.5px", // Adjust the border width as needed
                color: isValidSerial
                  ? "#28a745"
                  : errorMessage
                  ? "#ff0000"
                  : "inherit" // Set font color to green when certified
              }}
            />
            <Button
              variant="primary"
              className="verify"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
          <div className="right">
            <div className="nameVerification">
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder={verificationResult ? verificationResult[0].full_name : ""}
                readOnly
              />
            </div>
            <div className="serialVerification">
              {/* used tailwind to realign icon 2/5/24 */}
              <div className="flex gap-x-2">
                Certificate Serial No.
                <AiFillSafetyCertificate className="icon" />
              </div>
              <Form.Control
                size="sm"
                type="text"
                placeholder={verificationResult ? verificationResult[0].serial_no : ""}
                readOnly
              />
            </div>
            <div className="serialVerification">
              <Form.Label>Course Certified</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder={verificationResult ? verificationResult[0].course_title : ""}
                readOnly
              />
            </div>
            {errorMessage && (
              <div className="error-message">
                <img src={warningErr} alt="warningErr" />
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team_D_Verif_nonuser;
