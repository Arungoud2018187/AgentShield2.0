import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
    return (
        <header
            style={{
                height: 60,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px",
                borderBottom: "1px solid #ddd",
            }}
        >
            <h3>Admin Portal</h3>

            <div style={{ display: "flex", gap: 20 }}>
                <Bell />
                <UserCircle />
            </div>
        </header>
    );
}