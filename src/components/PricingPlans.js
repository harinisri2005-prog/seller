
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const plans = [
  { id: 1, price: 299, posts: 5 },
  { id: 2, price: 399, posts: 8 },
  { id: 3, price: 599, posts: 15 },
  { id: 4, price: 999, posts: 30 }
];

export default function PricingPlans() {
  const navigate = useNavigate();
  const { vendor } = useAuth();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSelect = async (plan) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      // Fallback navigation
      navigate("/upload", { state: { plan } });
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Public Test Key for demo
      currency: "INR",
      amount: plan.price * 100,
      name: "Vendor Marketplace",
      description: `Subscription for ${plan.posts} Posts`,
      // image: "https://your-logo-url.com/logo.png",
      handler: function (response) {
        // Payment Success
        // Here you would normally verify signatures
        // For this task, we just navigate
        navigate("/upload", { state: { plan, paymentId: response.razorpay_payment_id } });
      },
      prefill: {
        name: vendor?.owner_name || "Vendor",
        email: vendor?.email || "vendor@example.com",
        contact: vendor?.phone || "9999999999",
      },
      notes: {
        address: "Vendor Address",
      },
      theme: {
        color: "#d4af37",
      },
      modal: {
        ondismiss: function () {
          // User closed the modal without paying
          // Requirement: "not necessary to pay... to navigate"
          // So we navigate anyway!
          console.log("Payment cancelled/closed. navigating anyway.");
          navigate("/upload", { state: { plan, paymentId: "bypass" } });
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Subscription Plan</h1>
      <h3>Select the best subscription to list your products</h3>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
          >
            {plan.popular && <span className="badge">Most Popular</span>}

            <h2 className="price">₹{plan.price}</h2>
            <p className="posts">{plan.posts} Product Posts</p>

            <ul>
              <li>✔ {plan.posts} Listings</li>
              <li>✔ Admin Approval</li>
              <li>✔ Visible to Customers</li>
            </ul>

            <button onClick={() => handleSelect(plan)}>
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
