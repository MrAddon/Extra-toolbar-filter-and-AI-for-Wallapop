// ==UserScript==
// @name         FiltrarAnunciosWallapop
// @namespace    http://tampermonkey.net/
// @version      2024-10-23
// @description  Filtrar anuncios por cualquier concepto, con opción de reset y soporte para anuncios dinámicos
// @author       You
// @match        https://es.wallapop.com/app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let ads = []; // Anuncios
    let currentFilter = ''; // Filtro actual
    let selectedAds = []; // Anuncios seleccionados
    let apiKey = ''; // API Key ChatGPT
    let isExclusiveSearch = false; // Estado de búsqueda excluyente

    // Verificar si el anuncio contiene el término de búsqueda
    async function checkIfContainsTerm(itemUrl, adElement, searchTerm) {
        try {
            const response = await fetch(itemUrl);
            const text = await response.text();
            const containsTerm = text.toLowerCase().includes(searchTerm.toLowerCase());
            adElement.style.display = (isExclusiveSearch ? !containsTerm : containsTerm) ? '' : 'none';
        } catch (error) {
            console.error("Error al verificar el anuncio:", error);
        }
    }

    // Filtrar anuncios por término de búsqueda
    function filterAds(searchTerm) {
        isExclusiveSearch = false; // Búsqueda normal
        currentFilter = searchTerm;
        ads.forEach(ad => ad.style.display = ''); // Mostrar todos antes de filtrar
        ads.forEach(ad => checkIfContainsTerm(ad.href, ad, searchTerm));
        updateFilterMarker(searchTerm);
    }

    // Buscar de manera excluyente (anuncios que NO contienen el término)
    function filterAdsExclusive(searchTerm) {
        isExclusiveSearch = true; // Búsqueda excluyente
        currentFilter = searchTerm;
        ads.forEach(ad => ad.style.display = ''); // Mostrar todos antes de filtrar
        ads.forEach(ad => checkIfContainsTerm(ad.href, ad, searchTerm));
        updateFilterMarker(searchTerm + ' (Excluyente)');
    }

    // Restaurar todos los anuncios y resetear filtro
    function resetAds() {
        currentFilter = '';
        isExclusiveSearch = false;
        ads.forEach(ad => {
            ad.style.display = '';
            const checkbox = ad.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false; // Solo si existe el checkbox
        });
        selectedAds = [];
        updateFilterMarker('');
    }

    // Crear botones y agregarlos al header
    function createButton(text, bgColor, callback) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style = `margin-right: 10px; padding: 10px; background-color: ${bgColor}; color: white; border: none; border-radius: 5px; cursor: pointer;`;
        button.addEventListener('click', callback);
        return button;
    }

    function addButtonsToHeader() {
        const header = document.createElement('div');
        Object.assign(header.style, {
            position: 'fixed',
            top: '0', right: '0', left: '0',
            padding: '10px', backgroundColor: '#f1f1f1',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: '9999'
        });

        const buttons = [
            { text: 'Filtrar anuncios', color: '#4CAF50', action: () => promptForSearchTerm(false) },
            { text: 'Filtrar excluyente', color: '#FF5722', action: () => promptForSearchTerm(true) },
            { text: 'Resetear filtro', color: '#f44336', action: resetAds },
            { text: 'Configurar API ChatGPT', color: '#008CBA', action: configureApiKey },
            { text: '3 Mejores Oportunidades', color: '#FFA500', action: getBestOpportunities },
            { text: 'Comparar Anuncios', color: '#9370DB', action: compareSelectedAds }
        ];

        buttons.forEach(btn => header.appendChild(createButton(btn.text, btn.color, btn.action)));
        document.body.appendChild(header);
        document.body.style.marginTop = '60px';
    }

    function promptForSearchTerm(isExclusive) {
        const searchTerm = prompt('Ingresa el término que quieres buscar en los anuncios:');
        if (searchTerm) {
            if (isExclusive) {
                filterAdsExclusive(searchTerm);
            } else {
                filterAds(searchTerm);
            }
        } else {
            alert('No ingresaste ningún término.');
        }
    }

    function configureApiKey() {
        apiKey = prompt('Ingresa tu API Key de ChatGPT:');
        alert(apiKey ? 'API Key configurada correctamente.' : 'No ingresaste una API Key.');
    }

    async function fetchFromChatGPT(prompt) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] })
            });
            const data = await response.json();
            return data.choices?.[0]?.message.content || 'No se pudo obtener resultados.';
        } catch (error) {
            console.error("Error al comunicarse con la API:", error);
            return 'Error al comunicarse con la API.';
        }
    }

    async function getBestOpportunities() {
        if (!apiKey) return alert('Primero debes configurar tu API Key.');
        const urls = ads.filter(ad => ad.style.display !== 'none').map(ad => ad.href).join('\n');
        const prompt = `Dame las 3 mejores oportunidades entre los siguientes anuncios:\n${urls}`;
        const result = await fetchFromChatGPT(prompt);
        alert(result);
    }

    async function compareSelectedAds() {
        if (!apiKey) return alert('Primero debes configurar tu API Key.');
        selectedAds = ads.filter(ad => ad.querySelector('input[type="checkbox"]').checked);
        if (selectedAds.length < 2) return alert('Selecciona al menos dos anuncios para comparar.');

        const urls = selectedAds.map(ad => ad.href).join('\n');
        const prompt = `Genera un informe comparativo de los siguientes anuncios:\n${urls}`;
        const result = await fetchFromChatGPT(prompt);
        alert(result);
    }

    function updateFilterMarker(searchTerm) {
        let marker = document.getElementById('filter-marker');
        if (!marker) {
            marker = document.createElement('div');
            marker.id = 'filter-marker';
            Object.assign(marker.style, {
                position: 'fixed', top: '60px', right: '10px',
                padding: '10px', backgroundColor: '#f0ad4e', color: 'white',
                borderRadius: '5px', zIndex: '9999'
            });
            document.body.appendChild(marker);
        }
        marker.textContent = searchTerm ? `Filtrando por: "${searchTerm}"` : '';
        marker.style.display = searchTerm ? '' : 'none';
    }

    function storeAds() {
        ads = Array.from(document.querySelectorAll('a.ItemCardList__item'));
    }

    function addCheckboxesToAds() {
        ads.forEach(ad => {
            // Verificar si ya existe un checkbox para no duplicar
            if (!ad.querySelector('input[type="checkbox"]')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.marginRight = '5px';
                ad.prepend(checkbox);
            }
        });
    }

    function observeDomChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('a.ItemCardList__item')) {
                        ads.push(node);
                        addCheckboxesToAds(); // Solo se añade si es un nuevo anuncio
                        if (currentFilter) checkIfContainsTerm(node.href, node, currentFilter);
                    }
                });
            });
        });

        const container = document.querySelector('.ItemCardList');
        if (container) observer.observe(container, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            storeAds();
            addButtonsToHeader();
            addCheckboxesToAds();
            observeDomChanges();
        }, 2000);
    });

})();
