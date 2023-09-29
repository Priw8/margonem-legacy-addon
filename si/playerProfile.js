// playerProfile: dodaje do menu kontekstowego gracza możliwość pokazania profilu

// using g.loadQueue because I'm aware of some addons that overwrite showMenu without any concern for others
window.g.loadQueue.push({
    fun: () => {
        window.__priw8_show_profile = function(id) {
            if (_l() == "pl")
                window.open(`https://www.margonem.pl/profile/view,${id}`);
            else
                window.open(`https://www.margonem.com/profile/view,${id}`);
        }
        const _sM = window.showMenu;
        window.showMenu = function(e, menu, force) {
            if (e.target.classList?.contains("other")) {
                const id = e.target.getAttribute("id")?.substring(5);
                const other = g.other[id];
                if (other)
                    menu.push(["Pokaż profil", `__priw8_show_profile(${other.account})`]);
            }
            return _sM.apply(this, arguments);
        }
    }
});
