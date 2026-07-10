document.addEventListener("DOMContentLoaded", () => {
    const authOverlay = document.getElementById("auth-system-overlay");
    const dynamicArea = document.getElementById("auth-content-dynamic");
    const roleTabs = document.querySelectorAll(".tab-selector-item");

    const renderAuthFields = (role) => {
        let banner = "", fields = "", btnText = "";

        if (role === 'RECICLADOR') {
            banner = `
                <div class="context-info-banner" style="border: 1px solid #dcfce7; background: #f0fdf4; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                    <h4 style="color: #3f6212; font-size: 14px;">Acceso Técnico Reciclador</h4>
                    <p style="font-size: 12px; color: #475569;">Portal exclusivo para operadores ambientales autorizados para trazar rutas.</p>
                </div>`;
            fields = `
                <div class="form-input-group"><label>Nombres Completos</label><input type="text" placeholder="Ej. Carlos Mendoza"></div>
                <div class="form-double-row">
                    <div class="form-input-group"><label>Código de Reciclador</label><input type="text" placeholder="Ej. REC-2026-X"></div>
                    <div class="form-input-group"><label>Correo</label><input type="email" placeholder="nombre@correo.com"></div>
                </div>`;
            btnText = "Autenticar Operador";
        } else {
            // Default para otros roles
            banner = `<div class="context-info-banner"><h4>Acceso ${role}</h4><p>Ingresa tus credenciales.</p></div>`;
            fields = `<div class="form-input-group"><label>DNI</label><input type="text"></div>`;
            btnText = "Ingresar";
        }

        dynamicArea.innerHTML = `
            ${banner}
            <form class="auth-core-form">
                ${fields}
                <button type="submit" class="btn-submit-auth">${btnText}</button>
            </form>`;
    };

    roleTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            roleTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderAuthFields(tab.getAttribute("data-target-role"));
        });
    });

    // Abrir modal y render inicial
    document.getElementById("open-auth-btn").addEventListener("click", () => {
        authOverlay.classList.remove("hidden");
        renderAuthFields('CIUDADANO');
    });

    document.getElementById("close-auth-modal").addEventListener("click", () => authOverlay.classList.add("hidden"));
});