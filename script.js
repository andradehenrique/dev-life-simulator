document.addEventListener('DOMContentLoaded', function() {
    // Select all checkboxes and elements
    const work = document.getElementById('work');
    const money = document.getElementById('money');
    const sanity = document.getElementById('sanity');
    const message = document.querySelector('.message');
    const themeToggle = document.getElementById('theme-toggle');
    const languageSelector = document.getElementById('language-selector');
    const metaDescription = document.querySelector('meta[name="description"]');
    
    // Array to store the order of activated switches
    let activatedSwitches = [];
    let temporaryMessageTimeout;
    
    // Translations object
    const translations = {
        'pt-BR': {
            title: 'Simulador da Vida de um Desenvolvedor',
            work: 'Trabalhar com TI',
            money: 'Ganhar Dinheiro',
            sanity: 'Sanidade Mental',
            message1: 'Escolha sabiamente!',
            message2: 'Boa escolha, você está no caminho certo!',
            message3: 'Você está a um passo do sucesso!',
            message4: 'Ops, você falhou com sucesso, tente novamente!',
            footer: '© 2025 | A vida de um desenvolvedor em uma página',
            description: 'Você pode ter tudo? Um simulador simples mostrando o trilema do desenvolvedor: escolha entre trabalhar com TI, ganhar dinheiro e sanidade mental - mas você só pode escolher dois!'
        },
        'en': {
            title: 'Developer\'s Life Simulator',
            work: 'Work in IT',
            money: 'Make Money',
            sanity: 'Mental Sanity',
            message1: 'Choose wisely!',
            message2: 'Good choice, you\'re on the right path!',
            message3: 'You\'re one step away from success!',
            message4: 'Oops, you successfully failed, try again!',
            footer: '© 2025 | A developer\'s life in one page',
            description: 'Can you have it all? A simple simulator showing the developer\'s trilemma: choose between working in IT, making money, and mental sanity - but you can only pick two!'
        },
        'es': {
            title: 'Simulador de Vida de un Desarrollador',
            work: 'Trabajar en TI',
            money: 'Ganar Dinero',
            sanity: 'Salud Mental',
            message1: '¡Elige sabiamente!',
            message2: '¡Buena elección, estás en el camino correcto!',
            message3: '¡Estás a un paso del éxito!',
            message4: '¡Ups, fallaste con éxito, inténtalo de nuevo!',
            footer: '© 2025 | La vida de un desarrollador en una página',
            description: '¿Puedes tenerlo todo? Un simulador simple que muestra el trilema del desarrollador: elige entre trabajar en TI, ganar dinero y salud mental, ¡pero solo puedes elegir dos!'
        }
    };
    
    // Current language
    let currentLanguage = localStorage.getItem('language') || 'en';
    
    // Function to save activated switches to localStorage
    function saveActivatedSwitches() {
        localStorage.setItem('activatedSwitches', JSON.stringify(activatedSwitches));
    }
    
    // Function to update all text elements based on selected language
    function updateLanguage(lang) {
        document.querySelector('html').setAttribute('lang', lang);
        document.querySelector('h1').textContent = translations[lang].title;
        document.querySelectorAll('.switch-container p')[0].textContent = translations[lang].work;
        document.querySelectorAll('.switch-container p')[1].textContent = translations[lang].money;
        document.querySelectorAll('.switch-container p')[2].textContent = translations[lang].sanity;
        document.querySelector('footer p').textContent = translations[lang].footer;
        
        // Update the meta description
        metaDescription.setAttribute('content', translations[lang].description);
        
        // Update the document title to match the selected language
        document.title = translations[lang].title;
        
        // Update the current message
        updateMessage();
        
        // Update language selector
        languageSelector.value = lang;
        
        // Save preference
        localStorage.setItem('language', lang);
        currentLanguage = lang;
    }
    
    // Function to update message based on active switches
    function updateMessage(tempMessage = null) {
        if (tempMessage) {
            message.textContent = tempMessage;
            return;
        }
        
        if (activatedSwitches.length === 0) {
            message.textContent = translations[currentLanguage].message1;
        } else if (activatedSwitches.length === 1) {
            message.textContent = translations[currentLanguage].message2;
        } else if (activatedSwitches.length === 2) {
            message.textContent = translations[currentLanguage].message3;
        }
    }
    
    // Function to manage switch behavior
    function manageSwitch(currentSwitch, event) {
        if (event.target.checked) {
            // If the switch was activated
            activatedSwitches.push(currentSwitch);
            
            // If we have more than 2 switches activated
            if (activatedSwitches.length > 2) {
                // Show temporary message
                message.textContent = translations[currentLanguage].message4;
                
                // Clear any existing timeout
                if (temporaryMessageTimeout) {
                    clearTimeout(temporaryMessageTimeout);
                }
                
                // Deactivate the oldest one
                const oldest = activatedSwitches.shift();
                document.getElementById(oldest).checked = false;
                
                // Animate the deactivated switch
                const sliderElement = document.getElementById(oldest).nextElementSibling;
                sliderElement.classList.add('deactivated');
                setTimeout(() => {
                    sliderElement.classList.remove('deactivated');
                }, 500);
                
                // Reset message after 3 seconds
                temporaryMessageTimeout = setTimeout(() => {
                    updateMessage();
                }, 3000);
            } else {
                updateMessage();
            }
        } else {
            // If the switch was deactivated, remove it from the list
            const index = activatedSwitches.indexOf(currentSwitch);
            if (index !== -1) {
                activatedSwitches.splice(index, 1);
            }
            updateMessage();
        }
        
        // Save the current state to localStorage
        saveActivatedSwitches();
    }
    
    // Add event listeners to checkboxes
    work.addEventListener('change', (e) => manageSwitch('work', e));
    money.addEventListener('change', (e) => manageSwitch('money', e));
    sanity.addEventListener('change', (e) => manageSwitch('sanity', e));
    
    // Language selector event listener
    languageSelector.addEventListener('change', function() {
        updateLanguage(this.value);
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        themeToggle.checked = false;
        document.documentElement.removeAttribute('data-theme');
    } else {
        themeToggle.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Initialize switches based on saved state
    function initializeSwitches() {
        // Reset all switches first
        work.checked = false;
        money.checked = false;
        sanity.checked = false;
        
        // Try to load previously saved switches
        try {
            const savedSwitches = JSON.parse(localStorage.getItem('activatedSwitches')) || [];
            
            // Limit to maximum 2 switches
            activatedSwitches = savedSwitches.slice(0, 2);
            
            // Activate the saved switches
            activatedSwitches.forEach(switchId => {
                if (document.getElementById(switchId)) {
                    document.getElementById(switchId).checked = true;
                }
            });
            
            updateMessage();
        } catch (e) {
            console.error('Error loading saved switches:', e);
            activatedSwitches = [];
        }
    }
    
    // Initialize the language
    updateLanguage(currentLanguage);
    
    // Initialize switches
    initializeSwitches();
});