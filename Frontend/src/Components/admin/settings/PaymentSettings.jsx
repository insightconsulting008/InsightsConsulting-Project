import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Save } from "lucide-react";

const API_URL = "https://insightsconsult-backend.onrender.com/settings/payment";

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

  const [paymentMethods, setPaymentMethods] = useState([]);

  /* ------------------------------------
     GET PAYMENT SETTINGS
  ------------------------------------ */
  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get(API_URL);

      if (res.data?.success) {
        setPaymentMethods(res.data.data); // ✅ IMPORTANT
      }
    } catch (err) {
      console.error("Failed to fetch payment methods", err);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  /* ------------------------------------
     SAVE PAYMENT SETTINGS
  ------------------------------------ */
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!isRazorpayEnabled) {
      setError("Please enable Razorpay to save payment settings");
      return;
    }

    if (!razorpayKeyId.trim()) {
      setError("Razorpay Key ID is required");
      return;
    }

    if (!razorpaySecret.trim()) {
      setError("Razorpay Secret Key is required");
      return;
    }

    if (!webhookSecret.trim()) {
      setError("Webhook Secret is required");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        API_URL,
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

      setIsRazorpayEnabled(false);
      setRazorpayKeyId("");
      setRazorpaySecret("");
      setWebhookSecret("");

      fetchPaymentMethods(); // ✅ refresh list

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save payment settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-20 container mx-auto">
      {/* HEADER */}
      <div className="bg-[#6869AC] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Payment Settings</h1>
        <p className="text-sm opacity-90">
          Configure your Razorpay payment gateway
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}

      {/* FORM */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* TOGGLE */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <h3 className="font-semibold text-gray-800">Enable Razorpay</h3>
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

        {/* INPUTS */}
        <div className="grid grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Razorpay Key ID"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <div className="relative">
            <input
              type={showRazorpaySecret ? "text" : "password"}
              placeholder="Razorpay Secret Key"
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showRazorpaySecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showWebhookSecret ? "text" : "password"}
              placeholder="Webhook Secret"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowWebhookSecret(!showWebhookSecret)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showWebhookSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-3 flex items-center gap-2 bg-[#6869AC] text-white rounded-xl disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* LIST PAYMENT METHODS */}
      <div className="mt-10 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Added Payment Methods
        </h2>

        {paymentMethods.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No payment methods added yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-2">Gateway</th>
                <th>Status</th>
                <th>Key ID</th>
                <th>Last Updated</th>
              </tr>
            </thead>

            <tbody>
              {paymentMethods.map((item) => (
                <tr
                  key={item.paymentSettingId}
                  className="border-b last:border-none"
                >
                  <td className="px-2 py-3 font-medium">
                    Razorpay
                  </td>

                  <td className="text-center">
                    {item.isRazorpayEnabled ? (
                      <span className="text-green-600 font-semibold">
                        Enabled
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="text-gray-700 text-center">
                    {item.razorpayKeyId.slice(0, 6)}••••
                  </td>

                  <td className="text-gray-500 text-center">
                    {new Date(item.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
