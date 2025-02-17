// Inicializa el dataLayer si no existe
window.dataLayer = window.dataLayer || [];

// Función genérica para enviar eventos al dataLayer
const sendToDataLayer = (eventName, element, additionalData = {}) => {
    try {
        const defaultData = {
            event: eventName,
            activo: "sitio",
            nombreFlujo: "home",
            seccion: "home",
            elemento: element?.innerText?.toLowerCase() || element?.alt?.toLowerCase() || "ver más",
            urlDestino: element?.href || element?.closest('a')?.href,
        };

        dataLayer.push({ ...defaultData, ...additionalData });
        console.log("Evento enviado al dataLayer:", { ...defaultData, ...additionalData });
    } catch (error) {
        console.error("Error al enviar evento al dataLayer:", error);
    }
};

// Función para enviar el evento de pageview
const sendPageView = () => {
    const pageViewData = {
        event: "SEND_PAGEVIEW_SITIO_PRUEBA",
        activo: "sitio",
        nombreFlujo: "home",
        seccion: "home",
        path: window.location.pathname,
        titulo: document.title.toLowerCase(),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
    };

    dataLayer.push(pageViewData);
    console.log("Pageview enviado al dataLayer:", pageViewData);
};

// Función para agregar eventos a múltiples elementos
const addClickEvents = (selector, eventName, additionalDataCallback) => {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) {
        console.warn(`No se encontraron elementos para el selector: "${selector}"`);
        return;
    }

    elements.forEach((element) => {
        // Limpia listeners anteriores para evitar duplicados
        element.removeEventListener("click", handleClick);
        element.addEventListener("click", handleClick, { once: true });
    });

    // Función manejadora del evento click
    function handleClick(event) {
        event.preventDefault();

        try {
            const additionalData = additionalDataCallback ? additionalDataCallback(event.target) : {};
            sendToDataLayer(eventName, event.target, additionalData);
        } catch (error) {
            console.error(`Error en el evento click para el selector "${selector}":`, error);
        }
    }
};

// Objeto con los selectores y configuraciones de eventos
const eventConfigurations = [
    {
        selector: '.nav-link',
        eventName: 'SEND_MENU_SITIO_PRUEBA',
    },
    {
        selector: '[class*="banner-btn"]',
        eventName: 'SEND_BOTONES_SITIO_PRUEBA',
    },
    {
        selector: '[id*="btn-card"]',
        eventName: 'SEND_BOTONES_SITIO_PRUEBA',
        additionalDataCallback: (target) => {
            const card = target.closest('.card');
            if (!card) {
                console.warn("No se encontró el elemento .card para el botón:", target);
            }
            return {
                tituloCard: card ? card.querySelector('h3')?.innerText.toLowerCase() : "Sin título",
            };
        },
    },
    {
        selector: '[class*="banner-img"]',
        eventName: 'SEND_BANNERS_SITIO_PRUEBA',
        additionalDataCallback: (target) => ({
            elemento: target.alt?.toLowerCase() || "Sin alt",
        }),
    },
    {
        selector: '[id*="btn-articulo"]',
        eventName: 'SEND_LINKS_SITIO_PRUEBA',
        additionalDataCallback: (target) => {
            const article = target.closest('article');
            if (!article) {
                console.warn("No se encontró el elemento article para el botón:", target);
            }
            return {
                tituloCard: article ? article.querySelector('h2')?.innerText.toLowerCase() : "Sin título",
            };
        },
    },
    {
        selector: '.card-item',
        eventName: 'SEND_CARDS_SITIO_PRUEBA',
        additionalDataCallback: (target) => {
            const cardItem = target.closest('.card-item');
            if (!cardItem) {
                console.warn("No se encontró el elemento .card-item para el botón:", target);
            }
            return {
                tituloCard: cardItem ? cardItem.querySelector('h3')?.innerText.toLowerCase() : "Sin título",
            };
        },
    },
    {
        selector: '.link-section',
        eventName: 'SEND_LINKS_SITIO_PRUEBA',
        additionalDataCallback: (target) => {
            const section = target.closest('section');
            if (!section) {
                console.warn("No se encontró el elemento section para el enlace:", target);
            }
            return {
                elemento: target.innerText?.toLowerCase() || "Sin texto",
                ubicacion: section ? section.querySelector('h2')?.innerText.toLowerCase() : "Sin ubicación",
            };
        },
    },
];

// Envía el evento de pageview cuando la página se carga
document.addEventListener("DOMContentLoaded", () => {
    sendPageView();
});

// Agrega los eventos basados en la configuración
eventConfigurations.forEach((config) => {
    console.log(`Configurando eventos para el selector "${config.selector}"...`);
    addClickEvents(config.selector, config.eventName, config.additionalDataCallback);
});

console.log("Script cargado y configurado.");