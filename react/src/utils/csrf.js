// csrf.js
export async function getCSRFToken() {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        return csrfToken;
    }

    try {
        const response = await fetch('http://localhost:8000/api/get_csrf_token/');

        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const token = data.csrfToken;
            setCookie('csrftoken', token, 1); // Adjust expiry as needed
            return token;
        } else {
            throw new Error('Response was not in JSON format');
        }
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error; // Optionally handle or rethrow the error as needed
    }
}

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
