import Cookies from "universal-cookie";

export default function setCookies(name, value, days) {
    const cookies = new Cookies();
    cookies.set(name, value, { path: '/', expires: days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : undefined });
}
