import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Save } from "lucide-react";

const PaymentSettings = () => {
  const [isRazorpayEnabled, setIsRazorpayEnabled] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const handleSubmit = async () => {
  setError("");
  setSuccess("");

  // ✅ Must enable Razorpay
  if (!isRazorpayEnabled) {
    setError("Please enable Razorpay to save payment settings");
    return;
  }

  // ✅ Razorpay Key ID
  if (!razorpayKeyId.trim()) {
    setError("Razorpay Key ID is required");
    return;
  }

  if (!/^rzp_(test|live)_[a-zA-Z0-9]{10,}$/.test(razorpayKeyId)) {
    setError("Invalid Razorpay Key ID format");
    return;
  }

  // ✅ Razorpay Secret (FIXED REGEX)
  if (!razorpaySecret.trim()) {
    setError("Razorpay Secret Key is required");
    return;
  }

  if (!/^[a-zA-Z0-9_]{20,50}$/.test(razorpaySecret)) {
    setError("Invalid Razorpay Secret Key");
    return;
  }

  // ✅ Webhook Secret
  if (!webhookSecret.trim()) {
    setError("Webhook Secret is required");
    return;
  }

  if (webhookSecret.length < 10) {
    setError("Webhook Secret must be at least 10 characters");
    return;
  }

  setLoading(true);

  try {
    await axios.post(
      "https://insightsconsult-backend.onrender.com/settings/payment",
      {
        isRazorpayEnabled,
        razorpayKeyId,
        razorpaySecret,
        webhookSecret,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setSuccess("Payment settings saved successfully");

    // ✅ Clear fields
    setIsRazorpayEnabled(false);
    setRazorpayKeyId("");
    setRazorpaySecret("");
    setWebhookSecret("");

    setTimeout(() => setSuccess(""), 3000);

  } catch (err) {
    setError("Failed to save payment settings");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="pl-20 container mx-auto  ">
      {/* Header */}
      <div className="bg-[#6869AC] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Payment Settings</h1>
        <p className="text-sm opacity-90">
          Configure your Razorpay payment gateway
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}

      {/* Card */}
      <div className="mt-8 m-2 bg-white   rounded-xl shadow-sm p-3 space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <h3 className="font-semibold text-gray-800">
              Enable Razorpay
            </h3>
            <p className="text-sm text-gray-500">
              Activate Razorpay payment processing
            </p>
          </div>

          <button
            onClick={() => setIsRazorpayEnabled(!isRazorpayEnabled)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
              isRazorpayEnabled ? "bg-[#6869AC]" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow transform transition ${
                isRazorpayEnabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Inputs */}
       <div className="grid  grid-cols-2 gap-5">
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razorpay Key ID
          </label>
          <input
            type="text"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            placeholder="rzp_live_xxxxxxxxxx"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razorpay Secret Key
          </label>
          <div className="relative">
            <input
              type={showRazorpaySecret ? "text" : "password"}
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setShowRazorpaySecret(!showRazorpaySecret)
              }
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showRazorpaySecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Webhook Secret
          </label>
          <div className="relative">
            <input
              type={showWebhookSecret ? "text" : "password"}
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setShowWebhookSecret(!showWebhookSecret)
              }
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showWebhookSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Save Button */}
       
       </div>
        <div className="w-full flex justify-end items-end">
            <button
          onClick={handleSubmit}
          disabled={loading}
          className=" px-10 py-3 flex items-center gap-2  bg-[#6869AC] hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Settings"}
        </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Your API credentials are stored securely. Never share your secret keys publicly.
        </p>
      </div>
    </div>
  );
};

export default PaymentSettings;
