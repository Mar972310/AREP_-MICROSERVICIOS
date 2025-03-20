// Configuración de AWS Cognito
const CLIENT_ID = "6hvagpfmim6olm4p45nfhm75ce"; // Reemplaza con tu Client ID
const COGNITO_DOMAIN = "https://us-east-1mg57sgq2l.auth.us-east-1.amazoncognito.com"; // Reemplaza con tu dominio
const REDIRECT_URI = "https://apostrep.s3.us-east-1.amazonaws.com/index.html"; // Debe coincidir con el registrado en Cognito
const TOKEN_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/token`;
const AUTH_URL = "https://us-east-1mg57sgq2l.auth.us-east-1.amazoncognito.com/login?client_id=6hvagpfmim6olm4p45nfhm75ce&redirect_uri=https://apostrep.s3.us-east-1.amazonaws.com/index.html&response_type=code&scope=email+openid+phone";

// Extraer el código de autorización de la URL
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

// Si hay un código en la URL, intercambiarlo por un token de acceso
if (code) {
    console.log("Authorization Code:", code);
    getToken(code);
} else {
    console.log("No authorization code found. User might need to log in.");
}

// Función para redirigir a Cognito para iniciar sesión
const login = () => {
    window.location.href = AUTH_URL;
};

// Función para intercambiar el código por un token de acceso
async function getToken(code) {
    const data = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code: code
    });

    try {
        const response = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data
        });

        const result = await response.json();

        if (result.access_token) {
            console.log("Access Token:", result.access_token);
            localStorage.setItem("access_token", result.access_token);
            showLoggedInUser(); // Mostrar info del usuario
        } else {
            console.error("Error obteniendo el token:", result);
        }
    } catch (error) {
        console.error("Error en la petición de token:", error);
    }
}

// Función para cerrar sesión en Cognito
const logout = () => {
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}`;
    localStorage.removeItem("access_token");
    window.location.href = logoutUrl;
};

// Función para mostrar información del usuario autenticado
function showLoggedInUser() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Logged in successfully!</h2>
        <button id="logout-btn">Logout</button>
    `;

    document.getElementById("logout-btn").addEventListener("click", logout);
}

// Agregar eventos a los botones si existen en el HTML
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) loginBtn.addEventListener("click", login);
});
