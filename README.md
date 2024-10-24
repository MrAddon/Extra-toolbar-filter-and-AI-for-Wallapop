# Extra toolbar filter and AI for Wallapop website

## Descripción

`Extra toolbar filter and AI for Wallapop website` es un script desarrollado para la plataforma Wallapop, que permite filtrar los anuncios según un término de búsqueda. Además, ofrece la posibilidad de realizar búsquedas excluyentes, mostrando solo los anuncios que **no** contienen el término especificado. También incluye funcionalidades adicionales como comparar anuncios, mostrar las tres mejores oportunidades y permitir la integración con la API de OpenAI (ChatGPT).

![Extra-toolbar-filter-and-AI-for-Wallapop.png](Extra-toolbar-filter-and-AI-for-Wallapop.png)

## Instalación

1. Instala la extensión de Tampermonkey ( https://www.tampermonkey.net/ ) o cualquier otra extensión compatible con scripts de usuario en tu navegador.
2. Crea un nuevo script en Tampermonkey e inserta el código del script.
3. Guarda los cambios y accede a Wallapop para utilizar las nuevas funcionalidades.

## Funcionalidades

1. **Filtrar Anuncios**  
   Filtra los anuncios según un término específico. Los anuncios que contienen el término de búsqueda serán mostrados.

2. **Filtrar Excluyente**  
   Muestra solo los anuncios que **no** contienen el término especificado. Perfecto para eliminar de la vista anuncios no deseados.

3. **Resetear Filtro**  
   Restaura la visibilidad de todos los anuncios, eliminando cualquier filtro aplicado previamente.

4. **Configurar API Key ChatGPT**  
   Permite configurar una API Key para utilizar las funcionalidades que interactúan con ChatGPT, como comparar anuncios o mostrar las tres mejores oportunidades.

5. **Mostrar las 3 Mejores Oportunidades**  
   Obtiene, mediante la API de ChatGPT, un listado con las tres mejores oportunidades entre los anuncios filtrados.

6. **Comparar Anuncios**  
   Compara varios anuncios seleccionados mediante un informe generado por ChatGPT. Deben seleccionarse al menos dos anuncios.

7. **Marcar Anuncios**  
   Muestra un indicador visual en la parte superior de la página que informa sobre el término de búsqueda aplicado. Este indicador se actualiza automáticamente con el término actual o cuando se elimina el filtro.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

