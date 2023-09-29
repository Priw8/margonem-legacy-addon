// partyStats: wyświetlanie przydatnych informacji o aktualej grupie

// PartyStats by Priw8
// v1.1b
// naprawiono błędny wygląd okna grupy

// v1.1a
// this code turned into a bit of a spaghetti mess at some point, whoops

// Namings used:
// - member - structure that's within the party object sent by the engine
// - info - object containing level and profession of a member

!function() {
    const isNewInterface = typeof Engine != "undefined" && typeof API != "undefined";
    if (isNewInterface) {
        document.body.classList.add("priw-new-interface");
    }

    function setTip($el, tip) {
        if (isNewInterface)
            $($el).tip(tip);
        else
            $el.setAttribute("tip", tip);
    }

    function getHero() {
        return isNewInterface ? Engine.hero.d : window.hero;
    }

    function chatInput(msgString) {
        if (!isNewInterface) {
            const $chat = document.querySelector("#inpchat");
            $chat.value = msgString;
            setTimeout(() => $chat.focus(), 20); // Unsure why this doesn't work without the timeout
        } else {
            const $input = Engine.chat.$[0].querySelector("input");
            $input.value = msgString;
            Engine.chat.focus();
        }
    }

    function appendToGroup($el) {
        if (isNewInterface) {
            // doing this on party is a bit of a janky hack, but it works
            API.priw.emmiter.on("party", () => {
                if (Engine.party) {
                    const $parent = Engine.party.get$Wnd()[0];
                    $parent.insertBefore($el, $parent.lastChild);
                }   
            })
        } else {
            const $parent = document.querySelector("#party");
            $parent.insertBefore($el, $parent.querySelector("img") ?? $parent.lastChild);    
        }
    }

    const profList = ["w", "p", "b", "m", "h", "t"];

    const profNames = {
        "p": "Paladyn",
        "w": "Wojownik",
        "h": "Łowca",
        "m": "Mag",
        "b": "Tancerz ostrzy",
        "t": "Tropiciel"
    };

    const outfitDirs = {
        "pal": "p",
        "trop": "t",
        "woj": "w",
        "mage": "m",
        "hun": "h",
        "bd": "b"
    };

    class Events {
        constructor() {
            this.eventHandlers = {};
            if (isNewInterface) {
                API.priw.emmiter.on("game-response", this.update.bind(this));
            } else {
                const _parseInput = window.parseInput;
                const self = this;
                window.parseInput = function(data) {
                    self.update(data);
                    return _parseInput.apply(this, arguments);
                }
            }
        }
        add(name, clb) {
            if (!this.eventHandlers[name])
                this.eventHandlers[name] = [];
            this.eventHandlers[name].push(clb);
        }
        fire(name, data) {
            const handlers = this.eventHandlers[name];
            if (!handlers)
                return;

            for (const handler of handlers) {
                handler(data);
            }

            return data;
        }
        update(data) {
            for (const key in data) {
                this.fire(key, data[key]);
            }
        }
    }

    const event = new Events();

    class ProfDisplayManager {
        constructor() {
            this.counters = {};
            this.profCounts = {};
            this.$ = document.createElement("div");
            this.$.classList.add("priw-PartyStats-profs");
            for (const prof of profList)
                this.createCounter(prof);
            
            this.createCounter("?");

            this.appendSelf();
            this.createStyle();
            this.createListener();
        }
        createListener() {
            this.$.addEventListener("click", e => {
                const msgString = `/g Profesje w grupie: ${this.getProfListString()}`;
                chatInput(msgString);
            });
        }
        getProfListString() {
            let res = "";
            let first = true;
            for (const prof of profList) {
                const cnt = this.getProfCount(prof);
                if (cnt > 0) {
                    if (!first) {
                        res += ", ";
                    }
                    first = false;
                    res += `${cnt}${prof}`;
                }
            }
            return res;
        }
        appendSelf() {
            appendToGroup(this.$);
        }
        createStyle() {
            const style = 
`
.priw-new-interface .priw-PartyStats-profs, .priw-new-interface .priw-partyStats-font {
    color: white;
}
.priw-PartyStats-profs {
    display: flex;
    justify-content: space-evenly;
    padding-left: 4px;
    cursor: pointer;
}
.priw-PartyStats-counter {
    padding: 2px;
    flex-grow: 1;
    text-align: center;
}
.priw-partyStats-font {
    font-size: 10px;
    cursor: pointer;
}
.priw-partyStats-font * {
    cursor: pointer;
}
`;
            const $style = document.createElement("style");
            $style.innerHTML = style;
            document.head.appendChild($style);
        }
        createCounter(prof) {
            const $el = document.createElement("div");
            $el.classList.add("priw-PartyStats-counter", "priw-partyStats-font");
            this.counters[prof] = $el;
            this.$.appendChild($el);
            return $el;
        }
        getProfCount(prof) {
            return this.profCounts[prof] ? this.profCounts[prof] : 0;
        }
        updateCounter(prof, val, tip=false) {
            this.profCounts[prof] = val;
            const $el = this.counters[prof];
            if (!$el) {
                console.warn(`PartyStats: invalid prof: ${prof}`);
            } else {
                if (val == 0) {
                    $el.style.display = "none";
                } else {
                    $el.style.display = "block";
                    $el.innerText = `${val}${prof}`;
                    if (tip) {
                        setTip($el, tip);
                    }
                }
            }
        }
    }

    class MinMaxLvlDisplayManager {
        constructor() {
            this.$ = document.createElement("div");
            this.$.classList.add("priw-partyStats-font");
            this.$.innerHTML = `<center><span class="priw-partyStats-min-lvl">Min lvl: ?</span> / <span class="priw-partyStats-max-lvl">Max lvl: ?</span></center>`;
            this.minLvl = "?";
            this.maxLvl = "?";
            appendToGroup(this.$);
            this.createListener();
        }
        generateMinMaxTip(minMaxLvl, kind) {
            let tip = "<center>";

            if (kind == "min") {
                tip += `Max z tym w grp: ${this.maxLvlInGroup(minMaxLvl.lvl)}lvl`;
            } else {
                tip += `Min z tym w grp: ${this.minLvlInGroup(minMaxLvl.lvl)}lvl`;
            }

            tip += "<br>";

            for (let i=0; i<minMaxLvl.members.length; ++i) {
                const member = minMaxLvl.members[i];
                if (i != 0) {
                    tip += ", ";
                }
                const info = getInfo(member);
                // info SHOULD be guaranteed here, because the member otherwise wouldn't be in this array.
                // but... I like being 1 step ahead of dumb things my future self might do
                tip += `${member.nick} (${info ? info.lvl + info.prof : "?"})`;
            }

            tip += "</center>";
            return tip;
        }
        maxLvlInGroup(minLvl) {
            // TODO: how to determine priv world?
            return Math.max(14 + minLvl, Math.ceil(minLvl * 1.2 + 4));
        }
        minLvlInGroup(maxLvl) {
            return Math.min(maxLvl - 14, Math.floor((maxLvl - 4) / 1.2));
        }
        isDifferenceTooLarge() {
            return this.maxLvlInGroup(this.minLvl) < this.maxLvl;
        }
        createListener() {
            this.$.addEventListener("click", e => {
                const msgString = `/g Najniższy lvl w grupie: ${this.minLvl}, najwyższy: ${this.maxLvl}`;
                chatInput(msgString);
            });
        }
        update(minLvl, maxLvl) {
            let minTip = this.generateMinMaxTip(minLvl, "min");
            let maxTip = this.generateMinMaxTip(maxLvl, "max");
            
            const $minLvl = this.$.querySelector(".priw-partyStats-min-lvl");
            const $maxLvl = this.$.querySelector(".priw-partyStats-max-lvl");

            $minLvl.innerText = `Min lvl: ${minLvl.lvl}`;
            $maxLvl.innerText = `Max lvl: ${maxLvl.lvl}`;

            this.maxLvl = maxLvl.lvl;
            this.minLvl = minLvl.lvl;

            setTip($minLvl, minTip);
            setTip($maxLvl, maxTip);

            if (this.isDifferenceTooLarge()) {
                this.$.style.color = "red";
                this.$.style.fontWeight = "bold";
            } else {
                this.$.style.color = "white";
                this.$.style.fontWeight = "inherit";
            }
        }
    }

    const profDisplayManager = new ProfDisplayManager();
    const minMaxLvlDisplayManager = new MinMaxLvlDisplayManager();

    function loadProfCache() {
        const storedData = localStorage.getItem("priw-PartyStats-infoCache");
        if (storedData) {
            try {
                const profCache = JSON.parse(storedData);
                // Remove old entries (3 days)
                const minTs = new Date().getTime() - 3 * 24 * 60 * 60 * 1000;
                for (const id in profCache) {
                    if (!profCache[id].ts || profCache[id].ts < minTs) {
                        delete profCache[id];
                    }
                }
                return profCache;
            } catch(e) {
                console.warn("PartyStats: malformed infoCache, resetting");
                return {};
            }
        }
        return {};
    }
    function storeProfCache(cache) {
        localStorage.setItem("priw-PartyStats-infoCache", JSON.stringify(cache));
    }

    let partyMemberCache = null;
    const profCache = loadProfCache();

    function isPartyMember(id) {
        return partyMemberCache && partyMemberCache[id];
    }

    function updatePartyProfs(ids) {
        let needUpdate = false;
        for (const id of ids) {
            if (isPartyMember(id)) {
                needUpdate = true;
                break;
            }
        }

        if (!partyMemberCache || !needUpdate)
            return;

        const profs = {
            "p": 0,
            "w": 0,
            "h": 0,
            "m": 0,
            "b": 0,
            "t": 0,
            "?": 0
        }

        const tips = {
            "p": "Paladyni: ",
            "w": "Wojownicy: ",
            "h": "Łowcy: ",
            "m": "Magowie: ",
            "b": "Tancerze ostrzy: ",
            "t": "Tropiciele: ",
            "?": "Osoby, których profesji dodatek nie mógł ustalić: "
        }

        let minLvl = {
            members: [],
            lvl: '?'
        };
        let maxLvl = {
            members: [],
            lvl: '?'
        };
        for (const id in partyMemberCache) {
            const member = partyMemberCache[id];

            const info = getInfo(member);
            if ((minLvl.lvl == '?' || minLvl.lvl > info.lvl) && info.lvl) {
                minLvl = {
                    members: [member],
                    lvl: info.lvl
                }
            } else if (minLvl.lvl == info.lvl) {
                minLvl.members.push(member);
            }

            if ((maxLvl.lvl == '?' || maxLvl.lvl < info.lvl) && info.lvl) {
                maxLvl = {
                    members: [member],
                    lvl: info.lvl
                }
            } else if (maxLvl.lvl == info.lvl) {
                maxLvl.members.push(member);
            }

            profs[info.prof] += 1;
            tips[info.prof] += `<br>- ${member.nick} (${info.lvl ? info.lvl : "? "}lvl)`;
        }
        for (const key in profs) {
            profDisplayManager.updateCounter(key, profs[key], tips[key]);
        }

        minMaxLvlDisplayManager.update(minLvl, maxLvl);
    }

    event.add("party", party => {
        partyMemberCache = party.members;
        if (party.members) {
            updatePartyProfs(Object.keys(partyMemberCache));
        }
    });

    event.add("other", others => {
        let updatedProfCache = [];
        for (const id in others) {
            const other = others[id];
            if (typeof other.prof != "undefined" && typeof other.lvl != "undefined" && (!profCache[id] || profCache[id].prof != other.prof || profCache[id].lvl != other.lvl)) {
                profCache[id] = {prof: other.prof, lvl: other.lvl, ts: new Date().getTime()};
                updatedProfCache.push(id);
            }
        }

        if (updatedProfCache.length > 0) {
            storeProfCache(profCache);
            updatePartyProfs(updatedProfCache);
        }
    });

    function tryToGuessProfFromOutfit(outfit) {
        const split = outfit.split("/").slice(1);
        const dir = split[0];
        if (dir == "crimson" || dir == "noob") {
            return split[1].charAt(0);
        }
        if (outfitDirs[dir])
            return outfitDirs[dir];

        return "?";
    }

    function getInfo(member) {
        const hero = getHero();
        if (member.id == hero.id)
            return {prof: hero.prof, lvl: hero.lvl};

        if (profCache[member.id])
            return profCache[member.id];

        const prof = tryToGuessProfFromOutfit(member.icon);
        return {prof: prof};
    }
}();