import axios from "axios";

export default function Logout() {
    const logout = async () => {
        try {
            const response = await axios.post("http://localhost:5000/logout", {}, {
                withCredentials: true
            });
            console.log("Log out successful", response);

        } catch (error) {
            console.error("Log out failed:", error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <button onClick={logout}>
            <h2>Log out</h2>
        </button>
    );
}
