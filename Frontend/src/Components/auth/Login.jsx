import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@src/providers/axiosInstance";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, role } = res.data.data;

      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("role", role);

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STAFF") {
        navigate("/staff/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-[#6f6db3] text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-md" />
          <span className="font-semibold">Produce-ui</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">Heading Goes Here</h1>
          <p className="text-sm opacity-80 max-w-md">
            Lorem ipsum dolor sit amet consectetur. Commodo diam suspendisse
            tortor dignissim mollis.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <button className="w-8 h-8 bg-white text-[#6f6db3] rounded-full flex items-center justify-center">
              ‹
            </button>
            <div className="w-10 h-1 bg-white rounded-full opacity-60" />
            <button className="w-8 h-8 bg-white text-[#6f6db3] rounded-full flex items-center justify-center">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
            Login
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Lorem ipsum dolor sit amet consectetur.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Email Id
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <HiEyeOff size={20} />
                  ) : (
                    <HiEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#6f6db3] text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
