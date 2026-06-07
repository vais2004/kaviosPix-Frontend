import logo from "../img/8916beee-6eac-4165-b2bd-8a750ddf8a3e.png";

export default function Header() {
  return (
    <header
      style={{
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #ddd",
      }}>
      <img
        src="https://via.placeholder.com/150"
        alt="logo"
        style={{
          width: "120px",
          height: "60px",
          border: "2px solid red",
        }}
      />

      <button className="btn btn-danger">Logout</button>
    </header>
  );
}
