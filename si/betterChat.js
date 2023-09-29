// betterChat: Lepszy chat na SI

!function() {
    const version = "1.1.1";

    const interface = typeof Engine == "undefined" ? "old" : "new";

    const defaultSettings = {
        colors: {
            global: "#e2a7a7",
            local: "#ffffdd",
            trade: "#49cfe4",
            clan: "#ffa500",
            group: "#b554ff",
            privIncoming: "#ccff00",
            privOutgoing: "#ffcc00",

            global_nick: "#ffdbdb",
            local_nick: "#e7d798",
            trade_nick: "#9ef2ff",
            clan_nick: "#ffa500",
            group_nick: "#b554ff"
        },
        appearance: {
            smallTabs: true,
            hideSystemTab: true,
            hideLocalTab: false,
            hideGlobalTab: false,
        },
        general: {
            local: true,
            global: false,
            trade: false,
            group: true,
            clan: true,
            system: true,
            private: true
        }
    }

    const settings = new (function() {
        const path = "priw8-chat";
        const Storage = interface != "old" ? API.Storage : margoStorage;
        this.set = function(p, val) {
            Storage.set(path + p, val);
        };
        this.get = function(p) {
            const r = Storage.get(path + p);
            if (r != null) {
                return r;
            }
            let curr = defaultSettings;
            const spl = p.split("/");
            for (const entry of spl) {
                if (typeof curr == "undefined")
                    return null;

                if (entry == "")
                    continue;

                curr = curr[entry];
            }
            return curr;
        };
        this.remove = function(p) {
            try {
                Storage.remove(path + p);
            } catch (e) {};
        };
        this.exist = function() {
            return Storage.get(path) != null;
        };
    })();

    function chatTo(nick) {
        getEngine().chatController.getChatInputWrapper().setPrivateMessageProcedure(nick);
        document.querySelector("#bottombar").click();
    }

    const $style = document.createElement("style");
    document.head.appendChild($style);
    function reloadStyle() {
        let css = "";
        // apply main colors, this needs to override inline styles, hence the !important

        const colorKeys = Object.keys(defaultSettings.colors);
        for (const key of colorKeys) {
            const spl = key.split("_");
            const chan = spl[0];
            const isNick = spl[1] == "nick";
            const val = settings.get(`/colors/${key}`);
            let selector = `.chat-${chan.toUpperCase()}-message`;
            // I hate this so much
            if (key == "privIncoming") {
                selector = `.chat-PRIVATE-message[style*="color: rgb(204, 255, 0)"]`
            } else if (key == "privOutgoing") {
                selector = `.chat-PRIVATE-message[style*="color: rgb(255, 204, 0)"]`
            }
            if (isNick) {
                selector += ` .author-section`
            }
            css += `${selector} { color: ${val} !important; }\n`;
        }

        // Unconditional ungarbage
        css += `#chattabs .chat-channel-card.active { background: rgba(0,0,0,0.5) !important; }\n`;

        let chattabHeight = 64;
        if (settings.get("/appearance/hideSystemTab")) {
            chattabHeight = 40;
            css += `.chat-channel-card.SYSTEM-channel { display: none !important; }\n`;
        }
        if (settings.get("/appearance/hideGlobalTab")) {
            chattabHeight = 40;
            css += `.chat-channel-card.GLOBAL-channel { display: none !important; }\n`;
        }
        if (settings.get("/appearance/hideLocalTab")) {
            chattabHeight = 40;
            css += `.chat-channel-card.LOCAL-channel { display: none !important; }\n`;
        }

        if (settings.get("/appearance/smallTabs")) {
            chattabHeight = 16;
            css += `body > #chat .chat-channel-card-icon { display: none !important; }\n`;
            css += `body > #chat #chattabs { background-color: rgba(0,0,0,0.2) !important; background-image: unset !important; padding-left: 0px !important; margin: 5px 0 0 5px !important; }\n`;
            css += `body > #chat #chattabs .chat-channel-card { width: unset !important; }\n`;
            css += `body > #chat #chattabs { display: flex !important; }\n`;
            css += `body > #chat .chat-channel-card { flex-grow: 1; cursor: pointer; }\n`;

            css += `body > #chat .chat-channel-card { padding: 0px !important; margin: 0px !important; }\n`;
            css += `body > #chat .chat-channel-card.active::before { color: gold; }\n`;
            css += `body > #chat .chat-channel-card.GENERAL-channel::before  { font-size: 12px; content: "Ogólny" }\n`;
            css += `body > #chat .chat-channel-card.GLOBAL-channel::before  { font-size: 12px; content: "Global" }\n`;
            css += `body > #chat .chat-channel-card.LOCAL-channel::before   { font-size: 12px; content: "Local" }\n`;
            css += `body > #chat .chat-channel-card.TRADE-channel::before   { font-size: 12px; content: "Handel" }\n`;
            css += `body > #chat .chat-channel-card.GROUP-channel::before   { font-size: 12px; content: "Grupa" }\n`;
            css += `body > #chat .chat-channel-card.CLAN-channel::before    { font-size: 12px; content: "Klan" }\n`;
            css += `body > #chat .chat-channel-card.PRIVATE-channel::before { font-size: 12px; content: "Priv" }\n`;
            css += `body > #chat .chat-channel-card.SYSTEM-channel::before  { font-size: 12px; content: "System" }\n`;
        }

        // the body > is to make it not affect the small chat (which is in centerbox)
        css += `body > #chat #chattabs { height: ${chattabHeight}px !important; }\n`;
        if (chattabHeight != 64) {
            if (!settings.get("/appearance/smallTabs")) {
                css += `body > #chat #chattabs { border-bottom: 1px solid rgba(0,0,0,0.5); }\n`;
            }
            // -2 for some extra padding...
            css += `body > #chat #chattxt { height: ${460 + 64 - chattabHeight - 2}px !important; }\n`;
        }

        const togglableChatTypes = ["local", "global", "trade", "group", "clan", "system", "private"];
        for (const t of togglableChatTypes) {
            if (t != chat && !settings.get(`/general/${t}`)) {
                css += `.GENERAL-message-wrapper .chat-${t.toUpperCase()}-message { display: none; }\n`;
            }
        }

        // Dumb bug fix
        css += `#chatTxtContainer:not(:last-child) {display: none;}`;

        // console.log(`betterChat css: \n${css}`);
        $style.innerHTML = css;
    }
    function reloadSettings() {
        reloadStyle();
    }
    reloadSettings();

    // Reusing minimap+ code for settings
    const settingsUI = new (function(options) {
    var self = this;
    var {get, set, data, header, onSave} = options;
    var panels = {};
    var $currentPanel = false;
    var $activeLPanelEntry;
    var $rpanel;
    var $wrapper;
    var currentPanel = "";
    var shown = false;
    this.toggle = function() {
        var lock = interface == "new" ? Engine.lock : (interface == "old" ? g.lock : null);
        if (shown) {
            if (lock) lock.remove("ns-"+header);
            else global.dontmove = false;
            $wrapper.style["display"] = "none";
        } else {
            if (lock) lock.add("ns-"+header);
            else global.dontmove = true;
            $wrapper.style["display"] = "block";
        };
        shown = !shown;
    };
    this.initHTML = function() {
        $wrapper = document.createElement("div");
        $wrapper.classList.add("ns-wrapper");
        document.body.appendChild($wrapper);

        var $header = document.createElement("div");
        $header.innerHTML = header + " - ustawienia";
        $header.classList.add("ns-header");
        $wrapper.appendChild($header);

        var $close = document.createElement("div");
        $close.innerHTML = "X";
        $close.classList.add("ns-close");
        $close.addEventListener("click", this.toggle);
        $wrapper.appendChild($close);

        var $panels = document.createElement("div");
        $panels.classList.add("ns-panels");
        $wrapper.appendChild($panels);

        var $lpanel = document.createElement("div");
        $lpanel.addEventListener("click", this.lPanelClick);
        $lpanel.classList.add("ns-lpanel");
        $panels.appendChild($lpanel);

        $rpanel = document.createElement("div");
        $rpanel.classList.add("ns-rpanel");
        $rpanel.addEventListener("click", this.globalRpanelHandler);
        $panels.appendChild($rpanel);

        $lpanel.innerHTML = this.generateLpanelHtml();
        this.genereteRpanels();
    };
    this.lPanelClick = function(e) {
        if (e.target.dataset["name"]) {
            self.togglePanel(e.target.dataset["name"]);
            if ($activeLPanelEntry) $activeLPanelEntry.classList.remove("active");
            $activeLPanelEntry = e.target;
            $activeLPanelEntry.classList.add("active");
        };
    };
    this.globalRpanelHandler = function(e) {
        var tar = e.target;
        if (tar.dataset["listbtt"]) {
            var key = tar.dataset["listbtt"];
            var $content = document.querySelector(".ns-list-content[data-list='"+key+"']");
            var $input = document.querySelector("input[data-list='"+key+"']");
            self.addContentToList($content, $input);
            self.savePanel(currentPanel);
        } else if (tar.dataset["listitem"]) {
            tar.remove();
            self.savePanel(currentPanel);
        };
    };
    this.addContentToList = function($content, $input) {
        var val = $input.value;
        if (val == "") return;
        $input.value = "";
        var items = this.getContentItems($content);
        if (items.indexOf(val) > -1) return 
        var $div = document.createElement("div");
        $div.classList.add("ns-list-item");
        $div.dataset["listitem"] = "1";
        $div.innerText = val;
        $content.appendChild($div);
    };
    this.getContentItems = function($content) {
        var items = [];
        for (var i=0; i<$content.children.length; i++) {
            items.push($content.children[i].innerHTML);
        };
        return items;
    };
    this.togglePanel = function(name) {
        if ($currentPanel) $currentPanel.remove();
        $currentPanel = panels[name];
        currentPanel = name;
        $rpanel.appendChild($currentPanel);
        this.setAsyncPanelContent(name);
    };
    this.setAsyncPanelContent = function(name) {
        var entries = options.data[name];
        for (var i=0; i<entries.length; i++) {
            var entry = entries[i];
            if (entry.asyncid) {
                entry.fun(val => {
                    var el = document.getElementById(entry.asyncid);
                    if (el) el.innerHTML = val;
                });
            };
        };
    };
    this.genereteRpanels = function() {
        for (var name in data) {
            this.generateRpanel(name, data[name]);
        };
    };
    this.generateRpanel = function(name, content) {
        var $panel = document.createElement("div");
        $panel.classList.add("ns-rpanel-list");
        panels[name] = $panel;
        var html = "";
        for (var i=0; i<content.length; i++) {
            html += this.generateRpanelEntryHtml(content[i]);
        };
        $panel.innerHTML = html;
        var $btt = document.createElement("div");
        $btt.innerHTML = "Zapisz";
        $btt.classList.add("ns-save-button");
        $btt.addEventListener("click", () => this.savePanel(name));
        $panel.appendChild($btt);
    };
    this.generateRpanelEntryHtml = function(entry) {
        var {type, special} = this.getEntryType(entry.type);
        if (!special) {
            var input = "<input data-key='"+entry.key+"' type='"+type+"' value='"+get(entry.key)+"'></input>";
            return this.getRpanelEntry(entry.name, input, entry);
        } else {
            if (type == "range") {
                var input = "<input data-key='"+entry.key+"' type='"+type+"' value='"+get(entry.key)*100+"' min='"+entry.data[0]*100+"' max='"+entry.data[1]*100+"'></input>";
                return this.getRpanelEntry(entry.name, input, entry);
            } else if (type == "checkbox") {
                var input = "<input data-key='"+entry.key+"' type='"+type+"' "+(get(entry.key) ? "checked" : "")+"></input>";
                return this.getRpanelEntry(entry.name, input, entry);
            } else if (special == "char") {
                var input = "<input data-key='"+entry.key+"' type='"+type+"' value='"+String.fromCharCode(get(entry.key))+"' maxlength='1' style='width: 10px; text-align: center'></input>";
                return this.getRpanelEntry(entry.name, input, entry);
            } else if (special == "noinput") {
                if (type != "async") {
                    return this.getRpanelEntry(entry.t1, entry.t2, entry);
                } else {
                    var id = "NS-async-"+Math.random()*10;
                    entry.asyncid = id;
                    return this.getRpanelEntry(entry.t1, "<div id='"+id+"'>"+entry.placeholder+"</div>", entry);
                };
            } else if (type == "list") {
                return this.generateListInput(entry);
            };
        };
    };
    this.generateListInput = function(entry) {
        var list = get(entry.key);
        var html;
        html = "<div class='ns-list-wrapper'>";
            html += "<div class='ns-list-header'>"+entry.name+"</div>";
            html += "<div class='ns-list-content' data-list='"+entry.key+"'>";
            for (var i=0; i<list.length; i++) {
                html += "<div class='ns-list-item' data-listitem='1'>"+list[i]+"</div>";
            };
            html += "</div>";
            html += "<div class='ns-list-bottombar'>";
                html += "<div class='ns-list-input'><input data-list='"+entry.key+"' type='text'></div>";
                html += "<div class='ns-list-addbtt' data-listbtt='"+entry.key+"'>+</div>";
            html += "</div>";
        html += "</div>";
        return html;
    };
    this.getRpanelEntry = function(txt, input, entry) {
        let tip = entry.tip;
        let alert = entry.alert;
        if (interface == "old")
            return "<div "+(alert ? "onclick='mAlert(`"+alert+"`, null)'" : "")+" "+(tip ? "tip='"+tip+"'" : "")+" class='" + (alert ? "ns-clickable " : "") + "ns-rpanel-entry'><div class='ns-rpanel-entry-left'>"+txt+"</div><div class='ns-rpanel-entry-right'>"+input+"</div></div>";
        else
            return "<div "+(alert ? "onclick='mAlert(`"+alert+"`, null)'" : "")+" "+(tip ? "tip-id='"+getTipIdForTxt(tip)+"'" : "")+" class='" + (alert ? "ns-clickable " : "") + "ns-rpanel-entry'><div class='ns-rpanel-entry-left'>"+txt+"</div><div class='ns-rpanel-entry-right'>"+input+"</div></div>";
    };
    this.getEntryType = function(entrytype) {
        var special = false;
        switch (entrytype) {
            case "string":
                var type = "text";
                break;
            case "color":
                var type = "color";
                break;
            case "range":
                special = true;
                var type = "range";
                break;
            case "check":
                special = true;
                var type = "checkbox";
                break;
            case "char":
                special = "char";
                var type = "text";
                break;
            case "list":
                special = true;
                var type = "list";
                break;
            case "numstring":
                var type = "number";
                break;
            case "info-async":
                var type = "async";
                special = "noinput";
                break;
            default:
                special = "noinput";
        };
        return {
            type: type,
            special: special
        };
    }
    this.generateLpanelHtml = function() {
        var html = "";
        for (var name in data) {
            html += "<div class='ns-lpanel-entry' data-name='"+name+"'>"+name+"</div>";
        };
        return html;
    };
    this.savePanel = function(name) {
        var panel = data[name];
        for (var i=0; i<panel.length; i++) {
            this.savePanelEntry(panel[i]);
        };
        onSave();
    };
    this.savePanelEntry = function(entry) {
        var {type, special} = this.getEntryType(entry.type);
        if (!special) {
            var val = this.getEntryValue(entry.key);
            if (type == "number") {
                val = parseInt(val);
                if (isNaN(val)) return;
            };
            set(entry.key, val);
        } else {
            if (type == "range") {
                set(entry.key, this.getEntryValue(entry.key)/100);
            } else if (type == "checkbox") {
                set(entry.key, this.getCheckboxState(entry.key));
            } else if (special == "char") {
                var val = this.getEntryValue(entry.key).toUpperCase().charCodeAt(0);
                if (isNaN(val)) return;
                set(entry.key, val);
            } else if (type == "list") {
                var $content = document.querySelector(".ns-list-content[data-list='"+entry.key+"']");
                var items = this.getContentItems($content);
                set(entry.key, items);
            };
        };
    };
    this.getEntryValue = function(key) {
        return document.querySelector("input[data-key='"+key+"']").value;
    };
    this.getCheckboxState = function(key) {
        return document.querySelector("input[data-key='"+key+"']").checked;
    };
    this.initCss = function() {
        var css = `
            .ns-wrapper {
                width: 600px;
                height: 600px;
                background: rgba(0,0,0,.8);
                border: 2px solid #222222;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
                position: absolute;
                left: calc(50% - 300px);
                top: calc(50% - 300px);
                z-index: 499;
                color: white;
                display: none;
                ${interface == "superold" ? "transform: scale(0.8, 0.8);" : ""}
            }
            .ns-wrapper .ns-close {
                width: 39px;
                height: 39px;
                font-family: sans-serif;
                font-size: 20px;
                line-height: 39px;
                text-align: center;
                background: rgba(0,0,0,.6);
                transition: background .1s ease-in-out;
                position: absolute;
                top: 0px;
                right: 0px;
                cursor: pointer;
            }
            .ns-wrapper .ns-close:hover {
                background: rgba(20, 20, 20, .6);
            }
            .ns-wrapper .ns-header {
                border-bottom: 1px solid #333333;
                font-size: 26px;
                padding-left: 15px;
                color: white;
                height: 39px;
                line-height: 40px;
                background: rgba(50,50,50,.8);
            }
            .ns-wrapper .ns-panels {
                height: 560px;
            }
            .ns-wrapper .ns-panels .ns-lpanel {
                height: 560px;
                width: 200px;
                border-right: 1px solid #333333;
                float: left;
            }
            .ns-wrapper .ns-panels .ns-lpanel .ns-lpanel-entry {
                width: 75%;
                height: 30px;
                line-height: 30px;
                font-size: 19px;
                padding-left: 5px;
                background: linear-gradient(to right, rgba(100,100,100,0.45) , rgba(100,100,100,0));
                transition: all .15s ease-in-out;
                cursor: pointer;
                margin-bottom: 1px;
            }
            .ns-wrapper .ns-panels .ns-lpanel .ns-lpanel-entry.active {
                background: linear-gradient(to right, rgba(150,150,150,0.45) , rgba(150,150,150,0));
                width: 100%;
                padding-left: 13px;
            }
            .ns-wrapper .ns-panels .ns-lpanel .ns-lpanel-entry:hover {
                width: 100%;
                padding-left: 13px;
            }
            .ns-wrapper .ns-panels .ns-rpanel {
                height: 560px;
                width: 390px;
                float: left;
            }
            .ns-wrapper .ns-panels .ns-rpanel .ns-rpanel-entry {
                height: 30px;
                margin: 3px;
                line-height: 30px;
                background: rgba(50,50,50,0.5);
                display: flex;
            }
            .ns-panels .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-left {
                cursor: inherit;
                height: 30px;
                padding-left: 6px;
            }
            .ns-panels .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right {
                cursor: inherit;
                height: 30px;
                text-align: right;
                padding-right: 6px;
                flex-grow: 1;
            }
            .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='color'] {
                background: black;
                border: none;
                transition: background .15s ease-in-out;
                cursor: pointer;
            }
            .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='color']:hover {
                background: #282828;
            }
            .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='text'], .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='number'] {
                background: rgba(0,0,0,0.8);
                border: 1px solid black;
                width: 80px;
                color: #CCCCCC;
                text-align: right;
            }
            .ns-rpanel .ns-save-button {
                position: absolute;
                bottom: 10px;
                right: 10px;
                height: 30px;
                width: 70px;
                font-size: 20px;
                line-height: 30px;
                text-align: center;
                border: 1px solid #333333;
                font-family: sans-serif;
                padding: 3px;
                background: rgba(50,50,50,0.5);
                cursor: pointer;
                transition: background .1s ease-in-out;
            }
            .ns-rpanel .ns-save-button:hover {
                background: rgba(50,50,50,0.7);
            }
            .ns-rpanel .ns-rpanel-list {
                height: 500px;
                overflow: auto;
            }
            .ns-list-wrapper {
                background: rgba(50,50,50,0.5);
                width: 350px;
                margin: 10px;
                border: 1px solid #333333;
            }
            .ns-list-wrapper .ns-list-header {
                text-align: center;
                height: 20px;
                font-size: 15px;
                line-height: 20px;
            }
            .ns-list-wrapper .ns-list-content {
                min-height: 80px;
                max-height: 1700px;
                overflow-y: auto;
                border-top: 1px solid #333333;
                border-bottom: 1px solid #333333;
            }
            .ns-list-wrapper .ns-list-content .ns-list-item {
                cursor: pointer;
                margin: 1px;
                background: rgba(50,50,50,0.4);
                text-align: center;
                height: 15px;
                line-height: 15px;
                font-size: 12px;
            }
            .ns-list-wrapper .ns-list-bottombar {
                height: 20px;
            }
            .ns-list-wrapper .ns-list-bottombar .ns-list-input {
                float: left;
                width: 270px;
            }
            .ns-list-wrapper .ns-list-bottombar .ns-list-input input {
                background: rgba(0,0,0,0.8);
                border: 1px solid black;
                color: #CCCCCC;
                width: 320px;
            }
            .ns-list-wrapper .ns-list-bottombar .ns-list-addbtt {
                width: 20px;
                float: right;
                text-align: center;
                line-height: 20px;
                background: rgba(50,50,50,0.6);
                cursor: pointer;
            }
            .ns-list-wrapper .ns-list-bottombar .ns-list-addbtt:hover {
                background: rgba(50,50,50,0.9);	
            }
            .ns-clickable:hover {
                cursor: pointer;
                filter: brightness(120%);
            }
        `;
        var $style = document.createElement("style");
        $style.innerHTML = css;
        document.head.appendChild($style);
    };
    this.init = function() {
        this.initHTML();
        this.initCss();
    };
})({
    get: settings.get,
    set: settings.set,
    onSave: reloadSettings,
    header: "Chat",
    data: {
        "Kolory": [
            {
                key: "/colors/global",
                name: "Globalny",
                type: "color"
            },
            {
                key: "/colors/local",
                name: "Lokalny",
                type: "color"
            },
            {
                key: "/colors/trade",
                name: "Handlowy",
                type: "color"
            },
            {
                key: "/colors/group",
                name: "Grupowy",
                type: "color"
            },
            {
                key: "/colors/clan",
                name: "Klanowy",
                type: "color"
            },
            {
                key: "/colors/privIncoming",
                name: "Prywatny (odebrane)",
                type: "color"
            },
            {
                key: "/colors/privOutgoing",
                name: "Prywatny (wysłane)",
                type: "color"
            },
            {
                key: "/colors/global_nick",
                name: "Globalny (nick)",
                type: "color"
            },
            {
                key: "/colors/local_nick",
                name: "Lokalny (nick)",
                type: "color"
            },
            {
                key: "/colors/trade_nick",
                name: "Handlowy (nick)",
                type: "color"
            },
            {
                key: "/colors/group_nick",
                name: "Grupowy (nick)",
                type: "color"
            },
            {
                key: "/colors/clan_nick",
                name: "Klanowy (nick)",
                type: "color"
            }
        ],
        "Wygląd": [
            {
                key: "/appearance/smallTabs",
                name: "Mniejsze przełączniki kart chatu",
                type: "check"
            },
            {
                key: "/appearance/hideSystemTab",
                name: "Ukryj kartę Systemowy",
                type: "check"
            },
            {
                key: "/appearance/hideGlobalTab",
                name: "Ukryj kartę Globalny",
                type: "check"
            },
            {
                key: "/appearance/hideLocalTab",
                name: "Ukryj kartę Lokalny",
                type: "check"
            },
        ],
        "Chat ogólny": [
            {
                key: "/general/global",
                name: "Wiadomości z globalnego",
                type: "check"
            },
            {
                key: "/general/trade",
                name: "Wiadomości z handlowego",
                type: "check"
            },
            {
                key: "/general/group",
                name: "Wiadomości z grupowego",
                type: "check"
            },
            {
                key: "/general/clan",
                name: "Wiadomości z klanowego",
                type: "check"
            },
            {
                key: "/general/system",
                name: "Wiadomości z systemowego",
                type: "check"
            },
            {
                key: "/general/private",
                name: "Wiadomości z prywatnego",
                type: "check"
            },
        ],
        "Informacje": [
            {
                type: "info",
                t1: "Wersja",
                t2: version
            }
        ]
    }
});

    settingsUI.init();

    const $settingsBtt = document.createElement("div");
    $settingsBtt.innerHTML = `&#9881;`; // Unicode gear icon
    $settingsBtt.setAttribute("tip", "Ustawienia chatu");
    Object.assign($settingsBtt.style, {
        position: "absolute",
        top: "-10px",
        left: "-10px",
        fontSize: "26px",
        cursor: "pointer",
    });
    $settingsBtt.addEventListener("click", () => settingsUI.toggle());
    document.querySelector("#chattabs").appendChild($settingsBtt);
}();