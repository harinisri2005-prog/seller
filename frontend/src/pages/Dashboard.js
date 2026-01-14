import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Seller Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
