async function getStream() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/stream', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error fetching stream');
        }
        const stream = await response.json();
        renderStream(stream);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        document.querySelector('.postStream').innerHTML = `
        <div class="error-message">
            <h2>¡Ups! Algo salió mal</h2>
            <p>No pudimos cargar el hilo en este momento. Esto podría deberse a un problema con el servidor o la conexión a internet.</p>
            <p><strong>Por favor, intenta nuevamente más tarde.</strong></p>
            <p>Si el problema persiste, contacta al soporte técnico.</p>
        </div>
    `;
    }
}

const renderStream = (stream) => {
    const container = document.querySelector('.postStream');
    container.innerHTML = '';
    const posts = stream.posts || [];  
    if (Array.isArray(posts)) {
        if (posts.length === 0) {
            container.innerHTML = '<p>No hay publicaciones aún.</p>';
            return;
        }
        posts.forEach(post => {  
            const streamElement = document.createElement('div');
            streamElement.classList.add('stream');
            streamElement.classList.add('post');
            streamElement.innerHTML = `
                <div class="post." id=${post.id}>
                    <div class="post-header">
                        <div class="post-user-icon">
                            <img src="usuario.png" />
                        
                        </div>
                        <strong>${post.namename}</strong>
                    </div>
                    <div class="post-message">
                        ${post.message}
                    </div>
                    <div class="post-footer">
                        <button class="like-button" id=${post.id} onclick="toggleLike(this)">
                            <img src="copas.png" />
                        </button>
                        <span class="like-count">${post.likes}</span>
                    </div>
                </div>
                
            `;
            container.appendChild(streamElement);
        });
    } else {
        console.error('Se esperaba un array de publicaciones, pero se obtuvo:', typeof posts);
        container.innerHTML = '<p>No se pudieron cargar las publicaciones. Por favor, inténtalo de nuevo más tarde.</p>';
    }
};

async function toggleLike(button) {
    const postId = button.id;
    console.log(postId);
    try {
        const response = await fetch(`http://localhost:8080/api/v1/posts/like/${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }); 

        if (!response.ok) {
            throw new Error("Error al dar like");
        }
        getStream();

    } catch (error) {
        console.error("Error al dar like:", error);
    }
}


async function sendPost() {
    const content = document.getElementById("postContent").value;
    const postData = {
        message: content
    };
    try {
        const response = await fetch("http://localhost:8080/api/v1/stream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        const stream = await response.json();
        if (response.ok) {
            renderStream(stream);
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        document.querySelector('.postStream').innerHTML = `
        <div class="error-message">
            <h2>¡Ups! Algo salió mal</h2>
            <p>No pudimos cargar el hilo en este momento. Esto podría deberse a un problema con el servidor o la conexión a internet.</p>
            <p><strong>Por favor, intenta nuevamente más tarde.</strong></p>
            <p>Si el problema persiste, contacta al soporte técnico.</p>
        </div>
    `;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const postInput = document.getElementById("postContent");
    const postStream = document.querySelector(".postStream");

    postInput.addEventListener("input", function () {
        if (postInput.value.length > 140) {
            showAlert("⚠️ El mensaje es muy largo. Máximo 140 caracteres.");
            postInput.value = postInput.value.substring(0, 140); 
        }
    });
    getStream();  
});
