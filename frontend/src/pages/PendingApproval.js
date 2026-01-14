const PendingApproval = () => {
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Account Under Review</h2>

        <p style={{ color: "#817f7fff", fontSize: "14px", lineHeight: "1.6" }}>
          Your Seller account has been successfully registered.
          <br /><br />
          Our admin team is reviewing your KYC documents.
          <br /><br />
          Once approved, you will be able to:
        </p>

        <ul style={{ color: "#d4af37", fontSize: "14px" }}>
          <li>Purchase a subscription</li>
          <li>Post jewellery offers</li>
          <li>Manage your offers</li>
        </ul>

        <p style={{ color: "#827f7fff", fontSize: "13px", marginTop: "15px" }}>
          This usually takes 24–48 hours.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
