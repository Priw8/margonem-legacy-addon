// changeCharacter: zmienianie postaci

{
    const INTERFACE = typeof Engine == "undefined" ? "SI" : "NI";
    const APIURL = _l() == "pl"
        ? "https://public-api.margonem.pl/account/charlist"
        : "https://public-api.margonem.com/account/charlist";

    function setTip($el, txt, ctip="") {
        if (INTERFACE == "NI") {
            if (ctip)
                $($el).tip(txt, ctip);
            else
                $($el).tip(txt);
        } else {
            $el.setAttribute("tip", txt);
            if (ctip != "")
                $el.setAttribute("ctip", ctip);
        }
    }

    function getOPath() {
        if (INTERFACE == "SI")
            return window.CFG.opath;
        else
            return window.CFG.a_opath;
    }

    function getWorld() {
        if (INTERFACE == "SI")
            return g.worldConfig.getWorldName();
        else
            return Engine.worldConfig.getWorldName();
    }

    const settings = new (function() {
        const path = "priw8-change-character/";
        const Storage = INTERFACE == "NI" ? API.Storage : margoStorage;
        this.set = function(p, val) {
            Storage.set(path + p, val);
        };
        this.get = function(p, defaultValue) {
            return Storage.get(path + p) || defaultValue;
        };
        this.remove = function(p) {
            try {
                Storage.remove(path + p);
            } catch (e) {};
        };
    })();

    function initCSS() {
        const css =
`
.priw8-change-character-wrapper {
    display: flex;
${INTERFACE == "SI" ? `
    /* SI */
    position: absolute;
    top: -36px;
    left: 520px;
` : `
    /* NI */
    position: absolute;
    left: 342px;
    top: 12px;
    overflow: hidden;
    height: 40px;
    z-index: 1;
`}
}
.priw8-change-character-char {
    width: 32px;
    height: 48px;
    cursor: pointer;
    transition: .1s linear transform;
${INTERFACE == "NI" ? `
    position: relative;
    top: 8px;
` : ""}
}
.priw8-change-character-char:hover {
    transform: translateY(-8px);
}

${INTERFACE == "SI" ? `
#corners {
    /* SI fix */
    pointer-events: none;
}` : ""}

.priw8-change-character-settings {
    position: absolute;
    z-index: 500;
    background: rgba(0, 0, 0, 0.65);
    width: 386px;
    font-family: sans-serif;
    font-size: 14px;
    border: 1px solid #333333;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #CCCCCC;
}
.priw8-change-character-settings-title {
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid #333333;
}
.priw8-change-character-settings-content {
    padding: 5px;
}
.priw8-change-character-radios {
    padding-top: 5px;
    padding-bottom: 5px;
}
#priw8-change-character-custom-input {
    color: #CCCCCC;
    background: rgba(50, 50, 50, 0.7);
    border: 1px solid black;
}
#priw8-change-character-save {
    color: #CCCCCC;
    background: rgba(50, 50, 50, 0.7);
    border: 1px solid black;
    font-weight: bold;
    cursor: pointer;
    padding: 5px;
    margin: 5px;
}
#priw8-change-character-save:hover {
    background: rgba(70, 70, 70, 0.7);
}
`;
        const $style = document.createElement("style");
        $style.innerHTML = css;
        document.head.appendChild($style);
    }

    function getCharacterTip(char) {
        if (INTERFACE == "SI")
            return `<b>${char.nick}</b>Lvl: ${char.lvl}${char.prof}`;
        else
            return `
<div class="info-wrapper">
    <div class="nick">${char.nick} [${char.lvl}]</div>
    <div class="profs-icon ${char.prof}"></div>
</div>
`;
    }

    function getCurrentCharID() {
        if (INTERFACE == "SI") {
            return hero.id;
        } else {
            return Engine.hero.d.id;
        }
    }

    function getAID() {
        return getCookie("user_id");
    }

    function relog(id) {
        if (id != getCurrentCharID()) {
            if (INTERFACE == "SI") {
			    const d = new Date();
			    d.setTime(d.getTime()+3600000*24*30);
			    setCookie('mchar_id', id, d, '/', `margonem.${_l() == "pl" ? "pl" : "com"}`);
			    location.replace(location.href);
            } else {
                Engine.changePlayer.changePlayerRequest(id);
            }
		};
    }

    function onClick(e) {
        if (e.target.classList.contains("priw8-change-character-char")) {
            relog(e.target.dataset.id);
        }
    }

    function onContextMenu(e) {
        e.preventDefault();
        openSettings();
    }

    function getSettingsWindow() {
        return document.querySelector(".priw8-change-character-settings");
    }

    function saveSettings() {
        const $wnd = getSettingsWindow();
        if (!$wnd)
            return;

        const $selectedRadio = $wnd.querySelector("[name=\"priw8-change-character\"]:checked");
        if ($selectedRadio)
            settings.set("order", $selectedRadio.value);

        const $customOrder = $wnd.querySelector("#priw8-change-character-custom-input");
        const customChars = $customOrder.value.split(",");
        for (let i=0; i<customChars.length; ++i) {
            customChars[i] = customChars[i].trim();
        }
        settings.set("customOrder", customChars);

        reloadCharacters();

        $wnd.parentElement.removeChild($wnd);
    }

    function openSettings() {
        if (getSettingsWindow())
            return;

        const $settingWindow = document.createElement("div");
        $settingWindow.classList.add("priw8-change-character-settings");
        $settingWindow.innerHTML = `
<div class="priw8-change-character-settings-title">Change Character - ustawienia</div>
<div class="priw8-change-character-settings-content">
    Sortuj postacie według:
    <div class="priw8-change-character-radios">
        <div>
            <input type="radio" name="priw8-change-character" value="id" id="priw8-change-character-id">
            <label for="priw8-change-character-id">kolejności utworzenia</label>
        </div>
        <div>
            <input type="radio" name="priw8-change-character" value="lvlup" id="priw8-change-character-lvlup">
            <label for="priw8-change-character-lvlup">poziomu (rosnąco)</label>
        </div>
        <div>
            <input type="radio" name="priw8-change-character" value="lvldown" id="priw8-change-character-lvldown">
            <label for="priw8-change-character-lvldown">poziomu (malejąco)</label>
        </div>
        <div>
            <input type="radio" name="priw8-change-character" value="abc" id="priw8-change-character-abc">
            <label for="priw8-change-character-abc">alfabetycznie</label>
        </div>
        <div id="priw8-change-character-custom-tip">
            <input type="radio" name="priw8-change-character" value="custom" id="priw8-change-character-custom">
            <label for="priw8-change-character-custom">własna kolejność:</label>
            <input id="priw8-change-character-custom-input">
        </div>
    </div>
    <button id="priw8-change-character-save">Zapisz i zamknij</div>
</div>
`;
        setTip($settingWindow.querySelector("#priw8-change-character-custom-tip"),
            "Wpisz nicki postaci oddzielone przecinkami w takiej kolejności, w jakiej mają być wyświetlane.");
        $settingWindow.querySelector("#priw8-change-character-save").addEventListener("click", saveSettings);
        
        const sortOrder = settings.get("order", "id");
        const $selectedRadio = $settingWindow.querySelector("[name=\"priw8-change-character\"][value=\""+sortOrder+"\"]");
        if ($selectedRadio) {
            $selectedRadio.checked = true;
        }

        const customChars = settings.get("customOrder", []);
        const $customOrder = $settingWindow.querySelector("#priw8-change-character-custom-input");
        $customOrder.value = customChars.join(", ");
        
        document.body.appendChild($settingWindow);
    }

    async function getCharacterData() {
        const res = await fetch(`${APIURL}?hs3=${getCookie("hs3")}`, {
            credentials: "include"
        });
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (!Array.isArray(data)) {
                console.error("[ChangeCharacter] getCharacterData: bad API response", data);
                return getCharacterFallbackData();
            }
            if (data.length == 0) {
                console.error("[ChangeCharacter] getCharacterData: got empty array from API");
                return getCharacterFallbackData();
            }
            settings.set(`fallback/${getAID()}`, data);
            return data;
        } catch(e) {
            console.error("[ChangeCharacter] getCharacterData: bad json (invalid credentials?)", text);
            return getCharacterFallbackData();
        }
    }

    function getCharacterFallbackData() {
        return settings.get(`fallback/${getAID()}`, []);
    }

    function filterCharactersByWorld(chars, world) {
        return chars.filter(char => char.world == world);
    }

    function createCharacterWrapper() {
        const $existingWrapper = document.querySelector(".priw8-change-character-wrapper");
        if ($existingWrapper) {
            $existingWrapper.innerHTML = "";
            return $existingWrapper;
        }

        const $wrapper = document.createElement("div");
        if (INTERFACE == "SI") {
            document.querySelector("#centerbox2").appendChild($wrapper);
        } else {
            document.querySelector(".hud-container").appendChild($wrapper);
        }
        $wrapper.classList.add("priw8-change-character-wrapper");
        $wrapper.addEventListener("click", onClick);
        $wrapper.addEventListener("contextmenu", onContextMenu);
        return $wrapper;
    }

    function createCharacterElement(char) {
        const $char = document.createElement("div");
        setTip($char, getCharacterTip(char), "t_other");
        Object.assign($char.style, {
            "background-image": `url(${getOPath()}${char.icon})`,
        });
        $char.classList.add("priw8-change-character-char");
        $char.dataset.id = char.id;
        return $char;
    }

    function onGameLoad(clb) {
        if (INTERFACE == "SI") {
            g.loadQueue.push({
                fun: clb
            });
        } else {
            API.priw.emmiter.once("game-load", clb);
        }
    }

    async function reloadCharacters() {
        const chars = await getCharacterData();
        createAndFillWrapper(chars);
    }

    function sortCharacters(chars) {
        // console.log(chars);
        const sortMode = settings.get("order", "id");
        if (sortMode == "id") {
            chars.sort((a, b) => a.id - b.id);
        } else if (sortMode == "lvlup") {
            chars.sort((a, b) => a.lvl - b.lvl);
        } else if (sortMode == "lvldown") {
            chars.sort((a, b) => b.lvl - a.lvl);
        } else if (sortMode == "abc") {
            chars.sort((a, b) => a.nick.localeCompare(b.nick));
        } else if (sortMode == "custom") {
            const charWeights = {};
            const charOrder = settings.get("customOrder", []);
            for (let i=0; i<charOrder.length; ++i) {
                charWeights[charOrder[i].toLowerCase()] = i;
            }
            chars.sort((a, b) => {
                return charWeights[a.nick.toLowerCase()] - charWeights[b.nick.toLowerCase()];
            })
        }
    }

    function createAndFillWrapper(chars) {
        const charsOnThisWorld = filterCharactersByWorld(chars, getWorld());
        sortCharacters(charsOnThisWorld);

        const $wrapper = createCharacterWrapper();

        for (const char of charsOnThisWorld) {
            $wrapper.appendChild(createCharacterElement(char));
        }
    }

    async function init() {
        initCSS();
        if (INTERFACE == "SI") {
            const oldStorageKey = "CSpriv";
            // Remove old version data
            if (localStorage.getItem(oldStorageKey) != null) {
                localStorage.removeItem(oldStorageKey);
            }
        }

        const chars = await getCharacterData();
        onGameLoad(() => createAndFillWrapper(chars));
    }

    init();
}