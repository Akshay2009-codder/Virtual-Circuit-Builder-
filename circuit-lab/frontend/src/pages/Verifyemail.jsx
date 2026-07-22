import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import OtpPanel from "../components/OtpPanel";

// Standalone fallback route (e.g. a bookmarked/deep link). The normal flow
// now shows this inline on the Login/Register pages instead of navigating
// here, but this page still works on its own if someone lands on it directly.
export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AuthLayout
      eyebrow="Verify your email"
      title="Enter your code"
      subtitle="We sent a 6-digit code to the email you signed up with."
    >
      <OtpPanel email={location.state?.email || ""} onVerified={() => navigate("/dashboard")} />
    </AuthLayout>
  );
}