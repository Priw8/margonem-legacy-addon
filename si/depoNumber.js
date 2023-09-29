// depoNumber: drobna poprawa wyświetlania się licznika złota w depozycie 

{
    const _depoShow = window.depoShow;
    window.depoShow = function(depoData) {
        const res = _depoShow.apply(this, arguments);
        if (typeof depoData.gold != "undefined")
            document.querySelector("#depo-balance b").innerHTML = depoData.gold.toLocaleString();

        return res;
    }

    const css = "#depo-balance { padding: 3px; background: rgba(0, 0, 0, 0.6); }";
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
}