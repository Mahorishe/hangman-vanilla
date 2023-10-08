export const toogleModeHanlde = () => {
    const themeSwitcher = document.querySelector('#toggleTheme');
    const htmlElement = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.classList.add('dark');
        themeSwitcher.checked = true;
    }

    themeSwitcher.addEventListener('input', () => {
        htmlElement.classList.toggle('dark');

        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'ligth');
        }
    });
};
