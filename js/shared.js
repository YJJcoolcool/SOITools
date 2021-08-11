// Dark Mode
document.onreadystatechange = ()=>{
    if (document.readyState === "complete"){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            onDarkMode(true)
        }
    }
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    if (newColorScheme=='dark') onDarkMode(true)
    else onDarkMode(false);
});

function onDarkMode(on){
    if (on) {
        document.getElementById('body').classList.add("text-light","bg-dark");
    } else {
        document.getElementById('body').classList.remove("text-light","bg-dark");
    }
}