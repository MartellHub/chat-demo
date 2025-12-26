import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../firebase/GoogleAuth";

//icons
import GoogleIcon from "../img/google-login-icon.png";
import FacebookIcon from "../img/facebook-login-icon.png";
import DiscordIcon from "../img/discord-login-icon.png";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const userDemo = { email: "yevgenil", password: 123456 };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (email === userDemo.email && password == userDemo.password) {
      console.log("Login successful");
      navigate("/Chat");
      setEmail("");
      setPassword("");
    } else {
      console.log("Invalid email or password");
    }
  };

  const handelForgotPassword = () => {
    console.log("Navigate to forgot password page");
  };

  const handleRegister = () => {
    console.log("Navigate to registration page");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1f22] text-white w-95 rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4">Log in</h2>

        {/* Email / Password */}
        <div className="space-y-3 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#2b2d31] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#2b2d31] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </div>

        {/* forgot password/register */}
        <div>
          <p className="text-xs text-gray-400 text-center">
            <span
              className="hover:text-white cursor-pointer"
              onClick={handelForgotPassword}
            >
              Forgot your password?
            </span>{" "}
            |{" "}
            <span
              className="hover:text-white cursor-pointer"
              onClick={handleRegister}
            >
              Register
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <div className="flex-1 h-px bg-gray-700" />
          OR
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Socials (smaller) */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              signInWithGoogle()
                .then((user) => {
                  navigate("/Chat");
                  onClose();
                })
                .catch(console.error);
            }}
            className="p-2 rounded bg-white hover:bg-gray-200 transition"
          >
            <img src={GoogleIcon} className="w-5 h-5" />
          </button>

          <button
            onClick={() => console.log("Facebook login")}
            className="p-2 rounded bg-[#1877f2] hover:opacity-90 transition"
          >
            <img src={FacebookIcon} className="w-5 h-5" />
          </button>

          <button
            onClick={() => console.log("Discord login")}
            className="p-2 rounded bg-[#5865F2] hover:opacity-90 transition"
          >
            <img src={DiscordIcon} className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
