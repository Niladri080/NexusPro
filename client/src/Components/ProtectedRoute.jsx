import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import RiseLoaderWrapper from "./RiseLoader";
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return <RiseLoaderWrapper />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl="/dashboard" />; // ✅ 
  }
  return children;
}

export default ProtectedRoute;
