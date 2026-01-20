import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "../styles/auth.css";

export default function AuthWrapper({ children }) {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <Authenticator
          loginMechanisms={["email"]}
          signUpAttributes={["email"]}
        >
          {({ signOut, user }) => children({ signOut, user })}
        </Authenticator>
      </div>
    </div>
  );
}