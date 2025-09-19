import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import RiseLoaderWrapper from "./RiseLoader";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    // 🔑 This prevents redirect until Clerk is ready
    return <RiseLoaderWrapper />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl="/dashboard" />; // ✅ Explicitly tell Clerk where to go after sign-in
  }

  return children;
}

export default ProtectedRoute;
