// All our dark mode logic is separated here.

export const getInitialTheme = () => {
    const storedMode = localStorage.getItem('theme');
    if (storedMode) {
        return storedMode === 'dark';
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
};

export const toggleTheme = () => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newIsDark = !currentIsDark;

    if (newIsDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    return newIsDark;
};

