import Cookies from 'universal-cookie';

export default function getCookies(name) {
    const cookies = new Cookies(document.cookie);
    return cookies.get(name);
}
