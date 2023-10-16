// mmp - minimapplus, wielofunkcyjna minimapa
// v3.8a
// - używanie wysyłanych przez serwer danych o respawnach herosów

// v3.7s.1 (NI)
// - poprawa wyskakiwania mapy podczas pisania na chacie

// v3.7s
// - poprawa relacji graczy

// v3.7r
// - update respów przewa, kostka, opka, smoka i dominy

// v3.7p
// - poprawka kolizji z antybotem?
// - kończą mi się literki do wersji

// v3.7o
// - update respów de pato i karma i respy .com

// v3.7n
// - update respów viviany

// v3.7m
// - update respów mulher ma i 1 resp kasima

// v3.7ł
// - update respów demonisa

// v3.7l
// - zaznaczono domki oraz jaskinie w których respi się heros młody smok

// v3.7k
// - zaktualizowano respy herosa obłąkany łowca orków 

// v3.7j
// - zaktualizowano respy herosa domina ecclesiae

// v3.7i
// - zaktualizowano respy herosa tepeyollotl

// v3.7h
// - w końcu zmieniono na używanie cdn do grafik
// - dodano wyszukiwanie mobków w grp

// v3.7g
// - naprawiono blad z pokazywaniem graczy wywolany przez niektore dodatki typu szybsze ladowanie gry na SI

// v3.7f
// - jedna z ostatnich aktualizacji chrome (a raczej chromium) powoduje brzydkie skalowanie background-image niektorych map,
//   więc dodałem ręczne skalowanie rysowaniem na canvasie

// v3.7e
// - poprawiono wyświetlanie npc z type=6
// - poprawiono niedokładność kwadratu mgły wojny
// - zmianiono MapObject na class
// - dodano małe API do dodawania respów dla innych dodatków

// v3.7d - transition zmieniony na linear

// v3.7c - http -> https dla ikonki questów, naprawiono wywalanie gry przy zmianie koloru mapy, zaktualizowane WSZYSTKIE respy

// v3.7b - zmieniono URL ikony ustawien, naprawiono blad przez ktory koordy mouseEventu na minimapie nie byly poprawnie rozpoznawane

// v3.7
// - respy herosów są teraz zaznaczane na mapie jako sprawdzone po podejściu wystarczająco blisko
// - poprawiono dziwnie wyglądający objSize na niektórych mapach
// - usunięto tipy kolizji
// - dodano opcjonalne pokazywanie koordynatów kursora
// - zmieniono glow trackingu na czerwony, żeby lepiej pasował do strzałki
// - autosave przy edytowaniu listy trackingu
// - tracking nie jest case sensitive
// - okienko z info o nowej wersji można otworzyć ponownie w ustawieniach
// - zaktualizowane respy itp

//3.6d - dodane nowe respy mrocznego patryka (dzieki Joan)
//3.6c - mały update respów, teraz można kliknąć na strzałkę trackingu żeby iść do koordów które wskazuje
//3.6b - update ksiecia kasima
//3.6 - dodano ustawienia warstw, rozdzielono niektóre kolory, lekko zmieniono css ustawień, wyszukiwarka zrobiona od nowa
//3.5c - dodane respy złodzieja
//3.5b -  dodane respy, naprawiony obrazek strzalki trackingu
//3.5 - naprawienie tipów na NI, zaktualizowanie pathfindera na SI, jakieś tam respy dodane
//3.4 - changelog był sobie w linii 53
//3.3.1 - dodanie przycisku otwierania mapy na konsoli PS4 (Mozilla/5.0 (PlayStation 4 7.00) AppleWebKit/605.1.15 (KHTML, like Gecko))
//3.3 - naprawiony bug z nieładowaniem postaci gracza po wejściu na nową mapę do momentu zrobienia kroku, dodano "mas/exit-h64c.gif" to listy grafik npc-drzwi, dodano pokazywanie "mgły wojny"
//3.2
//-(SI) ppm na gracza na minimapie -> menu takie jakie by się otworzyło po kliknięciu na mapie
//-kompatybilność z dodatkiem ccarderra pokazującym graczy z innych światów
//-naprawiony bug z grobami
//3.1.9b - nowe respy
//3.1.9 - oczywiście że 3.1.8 coś popsuło :^)
//3.1.8 - uzupełniono elity do questa dziennego na .com
//3.1.7 - czemu każdą aktualizacją coś psuję
//3.1.6 - to coś z cookie __mExts i kompatybilność z jedną rzeczą którą robię (w wersji 2.x była ale zapomniałem robiąc 3.0)
//3.1.5 - wersja na stary silnik xd
//3.1.4 - ciągle coś psuję
//3.1.3 - ._.' warto używać isset
//3.1.2 - zmiany w chodzeniu postaci po kliknięciu punktu na mapie (teraz moze iść gdziekolwiek sie kliknie), optymalizacje dla urządzeń mobilnych (toucheventy mają mniejsze opóźnienie)
//3.1.1 - naprawa głupiego błędu prezez który minimapa psuła grę
//3.1 - pokazywanie qm przy npc na minimapie, poprawione wartości przy których elementy dolnego paska są chowane, licznik instalacji (przez dislike niepublicznego dodatku)
//3.0 - dodatek napisany od nowa
window.miniMapPlus = new (function() {
    const SocietyData = {
        "RELATION": {
            "NONE": 1,
            "FRIEND": 2,
            "ENEMY": 3,
            "CLAN": 4,
            "CLAN_ALLY": 5,
            "CLAN_ENEMY": 6,
            "FRACTION_ALLY": 7,
            "FRACTION_ENEMY": 8
        },
        "TIP": {
            2: "fr",
            3: "en",
            4: "cl",
            5: "cl-fr",
            6: "cl-en",
            7: "fr-fr",
            8: "fr-en"
        }
    }

    var interface = (function() {
        if (typeof API != "undefined" && typeof Engine != "undefined" && typeof margoStorage == "undefined") {
            return "new"; //NI
        } else if (typeof dbget == "undefined" && typeof proceed == "undefined") {
            return "old"; //SI
        } else {
            return "superold"; //Stary silnik
        };
    })();
    var self = this;
    const mmp = this;
    var masks = ["obj/cos.gif", "mas/nic32x32.gif", "mas/nic64x64.gif"];
    var gws = ["mas/exit-ith.gif", "mas/exit-ith1.gif", "mas/exit.gif", "mas/drzwi.gif", "obj/drzwi.gif", "mas/exit-h64c.gif"];
    var oldPos = {x: -1, y: -1};
    var otherRanks = ["Administrator", "Super Mistrz Gry", "Mistrz Gry", "Moderator Chatu", "Super Moderator Chatu"];
    var $map,
        $wrapper,
        $info,
        $search,
        $userStyle,
        objScale,
        objSize,
        $chatInput,
        $coordText,
        $searchTxt;
    var manualMode = false;
    var innerDotKeys = ["friend", "enemy", "clan", "ally"];
    this.version = "3.7";
    this.updateString = 
`
<div style="height: 400px; overflow: auto;">
<b>miniMap+ - wersja v${this.version}</b><br><br>
Zmiany:
<ul>
    <li>- respy herosów są teraz zaznaczane na mapie jako sprawdzone po podejściu wystarczająco blisko - kolor jakimi są oznaczane można zmienić w ustawieniach</li>
    <li>- poprawiono błędny rozmiar obiektów na niektórych mapach (bywało o 1px za mało)</li>
    <li>- usunięto tipy kolizji (kolizje pokazywane są jeśli jest to włączone w ustawieniach)</li>
    <li>- dodano pokazywane koordynatów kursora w lewym dolnym rogu minimapy (można to wyłączyć w ustawieniach jak przeszkadza). Na urządzeniach mobilnych funkcja ta zawsze jest wyłączona, ponieważ nie działa zbyt dobrze.</li>
    <li>- zmieniono podświetlenie herosów/NPC z trackingu z niebieskego na czerwony, żeby lepiej pasowało do koloru strzałki</li>
    <li>- tracking teraz automatycznie zapisuje zmiany przy dodawaniu/usuwaniu NPC/przedmiotu z listy</li>
    <li>- tracking teraz nie zwraca uwagi na wielkość liter w nazwie NPC/przedmiotu</li>
    <li>- okienko z informacjami o nowej wersji można powownie otworzyć w ustawieniach (zakładka "inne")</li>
</ul>
<br>
Ewentualne błędy proszę zgłaszać w <a href="https://www.margonem.pl/?task=forum&show=posts&id=488564" target="_blank">temacie na forum</a>.
</div>
`;

    function getPath(path, defaultValue) {
        if (interface == "old") {
            return CFG[path] || defaultValue;
        } else if (interface == "new") {
            return CFG["a_"+path] || defaultValue;
        }
        return defaultValue;
    }

    function setTip($el, txt, ctip="") {
        if (interface == "new") {
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
    
    function getTip($el) {
        if (interface == "new") {
            return $($el).getTipData();
        } else {
            return $el.getAttribute("tip");
        }
    }

    /* Weird hack */
    function getTipIdForTxt(txt) {
        const tmpDiv = document.createElement("div");
        $(tmpDiv).tip(txt);
        return tmpDiv.getAttribute("tip-id");
    }

    var settings = new (function() {
        var path = "mmp";
        var Storage = interface != "old" ? API.Storage : margoStorage;
        this.set = function(p, val) {
            Storage.set(path + p, val);
        };
        this.get = function(p) {
            return Storage.get(path + p);
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

    let mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let consoleDevice = (/PlayStation 4/i).test(navigator.userAgent) || settings.get("/forceMobileMode"); // TODO: add more consoles

    const $visibility = (function() {
        let $div = document.createElement("div");
        $div.classList.add("mmp-visibility");
        return $div;
    })();

    this.initSettings = function() {
        if (!settings.exist()) {
            this.setDefaultSettings();
        } else {
            this.fixSettings();
        };
    };

    this.fixSettings = function() {
        var loaded = settings.get("");
        var def = this.getDefaultSettings();
        if (this.fixSettingsObject(loaded, def))
            settings.set("", loaded);
    };
    
    this.fixSettingsObject = function(loaded, def) {
        let overwrite = false;
        for (let key in def) {
            if (!isset(loaded[key])) {
                loaded[key] = def[key];
                overwrite = true;
            } else {
                if (typeof def[key] == "object") {
                    const res = this.fixSettingsObject(loaded[key], def[key]);
                    if (res)
                        overwrite = true;
                }
            }
        }
        return overwrite;
    }

    this.setDefaultSettings = function() {
        settings.set("", this.getDefaultSettings());
    };

    this.convertOldSettings = function(json) {
        var sett = JSON.parse(json);
        sett.darkmode = false;
        sett.altmobilebtt = false;
        sett.mapsize = 1;
        sett.minlvl = parseInt(sett.minlvl);
        sett.opacity = 1 - sett.opacity;
        if (isNaN(sett.minlvl)) sett.minlvl = 1;
        localStorage.removeItem("miniMapPlus");
        return sett;
    };

    this.getDefaultSettings = function() {
        var oldVersion = localStorage.getItem("miniMapPlus");
        if (oldVersion) return this.convertOldSettings(oldVersion);
        return {
            show: 82,
            minlvl: "1",
            colors: {
                hero: "#FF0000",
                other: "#FFFFFF",
                rip: "#FFFFFF",
                friend: "#08ad00",
                enemy: "#FF0000",
                clan: "#08ad00",
                ally: "#9eff91",
                npc: "#ddff00",
                mob: "#222222",
                elite: "#00ffe9",
                elite2: "#039689",
                elite3: "#007500",
                heros: "#c6ba35",
                titan: "#809912",
                item: "#f56bff",
                gw: "#0000FF",
                "heros-resp": "#c6ba35",
                "heros-mark": "#64ffe9",
                col: "#400040"
            },
            layers: {
                hero: 100,
                other: 140,
                rip: 90,
                npc: 110,
                mob: 110,
                elite: 120,
                elite2: 130,
                elite3: 130,
                heros: 160,
                titan: 150,
                item: 80,
                gw: 70,
                "heros-resp": 150,
                col: 0
            },
            trackedNpcs: [],
            trackedItems: [],
            maxlvl: 13,
            mapsize: 1,
            opacity: 1,
            interpolerate: true,
            darkmode: false,
            showqm: true,
            showcol: false,
            showcoords: true,
            // chromium scaling is ugly
            manualDownscale: typeof(window.chrome) != "undefined",
            //showevonetwork: true
        };
    };

    this.getInstallSource = function() {
        if (interface != "old") return "addon";
        var panelAddons = getCookie("__mExts");
        if (panelAddons == null) return "addon";
        var srcs = {
            p: "panel dodatków (pub.)",
            d: "dev",
            v: "panel dodatków"
        };
        for (var i in srcs) {
            if (panelAddons.indexOf(i+"64196") > -1) return srcs[i];
        };
        return "addon";
    };

    this.initHTML = function() {
        $wrapper = document.createElement("div");
        $wrapper.classList.add("mmpWrapper");

        $map = document.createElement("div");
        $map.classList.add("mmpMap");
        if (!mobileDevice) $map.addEventListener("click", this.goTo);
        else $map.addEventListener("touchstart", this.goTo);
        $map.addEventListener("contextmenu", this.rclick);

        $coordText = document.createElement("div");
        $coordText.classList.add("mmpCoordText");
        $coordText.innerText = "(0,0)";
        $map.appendChild($coordText);
        $map.addEventListener("mousemove", e => {
            const coords = this.getCoordsFromEvent(e);
            if (coords) {
                $coordText.innerText = `(${coords.x},${coords.y})`;
            } else {
                // console.log(e.target);
            }
        });

        var $bottombar = document.createElement("div");
        $bottombar.classList.add("mmpBottombar");
        $info = document.createElement("span");
        $info.innerHTML = "miniMapPlus by <a href='https://www.margonem.pl/?task=profile&id=3779166' target='_blank'>Priweejt</a> |&nbsp;";
        $bottombar.appendChild($info);
        $searchTxt = document.createElement("span");
        $searchTxt.innerHTML = "Szukaj:&nbsp;";
        $bottombar.appendChild($searchTxt);
        $search = document.createElement("input");
        $search.addEventListener("keyup", this.searchBarHandler);
        $bottombar.appendChild($search);
        var $settings = document.createElement("img");
        $settings.src = "https://priw8-margonem-addon.herokuapp.com/SI-addon/mmp/img/config.png";
        $settings.classList.add("mmpSettingIcon");
        $settings.addEventListener("click", niceSettings.toggle);
        setTip($settings, "Ustawienia");
        $bottombar.appendChild($settings);

        $wrapper.appendChild($map);
        $wrapper.appendChild($bottombar);

        if (interface == "new") document.querySelector(".game-window-positioner").appendChild($wrapper);
        else if (interface == "old") document.querySelector("#centerbox2").appendChild($wrapper);
        else document.querySelector("body").appendChild($wrapper);

        this.appendMainStyles();
        this.initEventListener();
    };

    this.appendMobileButton = function() {
        if (interface == "old" && (mobileDevice || consoleDevice)) {
            //przycisk otwierania mapy dla urządzeń mobilnych/konsol
            var $btt = document.createElement("div");
            $btt.innerHTML = "MM+";
            $btt.classList.add("mmpMobileButton");
            $btt.addEventListener(mobileDevice ? "touchstart" : "click", event => {
                self.toggleView();
                event.preventDefault();
            });
            document.getElementById("centerbox2").appendChild($btt);
        };
    };

    this.initEventListener = function() {
        document.addEventListener("keydown", function(e) {
            if (e.target.tagName != "MAGIC_INPUT" && e.target.tagName != "INPUT" && e.target.tagName != "TEXTAREA" && e.keyCode == settings.get("/show")) {
                self.toggleView();
            };
        }, false);
    };

    this.appendMainStyles = function() {
        var $style = document.createElement("style");
        var css = `
            .mmpMobileButton {
                z-index: 390;
                border: 1px solid black;
                opacity: 0.7;
                background: white;
                position: absolute;
                top: 240px;
                left: -1px;
                width: 32px;
                height: 32px;
                color: gray;
                text-align: center;
                line-height: 32px;
                font-size: 80%;
                border-radius: 3px;
                border-top-right-radius: 8px;
            }
            .mmpWrapper {
                position: absolute;
                z-index: 380;
                border: 3px solid black;
                border-radius: 5px;
                border-bottom-left-radius: 20px;
                overflow: hidden;
                display: none;
            }
            .mmpWrapper .mmpMap {
                overflow: hidden;
                background-size: 100%;
                position: relative;
            }
            .mmpWrapper .mmpBottombar {
                height: 19px;
                background: #CCCCCC;
                border-top: 1px solid black;
                color: #232323;
                padding-left: 8px;
                line-height: 19px;
            }
            .mmpWrapper .mmpBottombar input {
                height: 11px;
                width: 130px;
            }
            .mmpWrapper .mmpBottombar .mmpSettingIcon {
                height: 15px;
                width: 15px;
                float: right;
                background: rgba(100,100,100,.8);
                border-radius: 5px;
                cursor: pointer;
                margin-top: 2px;
            }
            .mmpMapObject {
                position: absolute;
                z-index: 1;
                box-sizing: border-box;
            }
            .mmpMapObject.hidden {
                display: none;
            }
            .mmpMapObject.hiddenBySearch {
                display: none;
            }
            .mmpMapObject .innerDot{
                position: absolute;
            }
            .mmp-visibility {
                pointer-events: none;
                border: 1px solid yellow;
                box-sizing: border-box;
            }
            .mmpCoordText {
                font-size: 12px;
                position: absolute;
                bottom: 0px;
                left: 0px;
                padding: 2px;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                pointer-events: none;
                color: white;
            }
        `;
        $style.innerHTML = css;
        document.head.appendChild($style);
    };

    this.onSettingsUpdate = function() {
        self.appendUserStyles();
        self.objectMgr.manageDisplay();
        self.resetQtrack();
        message("[color=white]Zapisano[/color]");
    };

    this.appendUserStyles = function() {
        if (!$userStyle) {
            $userStyle = document.createElement("style");
            document.head.appendChild($userStyle);
        };
        $userStyle.innerHTML = this.generateUserCss();
    };

    this.generateUserCss = function() {
        var css = "";
        var colors = settings.get("/colors");
        for (var name in colors) {
            css += this.getSingleColorCssLine(name, colors[name]);
        };
        const layers = settings.get("/layers");
        for (const name in layers) {
            css += this.getSingleLayerCssLine(name, layers[name]);
        }
        css += ".mmpWrapper { opacity: "+settings.get("/opacity")+"; }\n"
        if (settings.get("/interpolerate")) css += ".mmpMapObject { transition: all .5s linear; }\n";
        if (settings.get("/darkmode")) {
            css += ".mmpWrapper .mmpBottombar { background: #222222; color: #CCCCCC; }\n";
            css += ".mmpWrapper .mmpBottombar input {background: black; border: 1px solid #333333; color: white;}\n";
            css += ".mmpWrapper .mmpBottombar a {color: #009c9c;}\n"
            css += ".mmpMobileButton {background: #222222; color: #CCCCCC;}\n"
        };
        if (settings.get("/altmobilebtt")) {
            css += ".mmpMobileButton { top: 470px; left: 665px; }\n";
        };
        if (!settings.get("/showqm")) {
            css += ".mmpQM { display: none; }\n";
        } else {
            css += ".mmpQM { display: block; position: absolute; top: -200%;}\n";
        };
        if (settings.get("/novisibility")) {
            css += ".mmp-visibility { display: none }";
        }

        if (!settings.get("/showcoords") || mobileDevice || consoleDevice) {
            css += ".mmpCoordText {display: none}";
        }

        return css;
    };

    this.getSingleColorCssLine = function(name, val) {
        if (innerDotKeys.indexOf(name) > -1) {
            return ".mmpMapObject .innerDot.mmp-"+name+" { background: "+val+";}\n";
        } else {
            return ".mmpMapObject.mmp-"+name+" { background: "+val+";}\n";
        };
    };

    this.getSingleLayerCssLine = function(name, val) {
        return `.mmpMapObject.mmp-${name} { z-index: ${val}; }\n`
    }

    //functionality
    this.rclick = function(e) {
        if (interface != "old") return; //TODO: support other interfaces
        var tar = false
        if (e.target.classList.contains("mmp-other")) tar = e.target;
        else if (e.target.parentElement.classList.contains("mmp-other")) tar = e.target.parentElement; //for others with innerdot 
        if (tar) {
            var obj = self.objectMgr.getByElem(tar);
            if (obj.d.evoNetwork) return;
            var id = obj.d.id;
            id = id.split("-")[1]; //id = OTHER-rid, where rid = char id of the other player
            var $other = document.querySelector("#other"+id);
            //hacky solution
            var sm = window.showMenu;
            var otherMenu = false;
            window.showMenu = function(e, menu) {
                otherMenu = menu;
                window.showMenu = sm;
            };
            $other.click();
            if (otherMenu) {
                for (var i in otherMenu) {
                    //idk it doesn't hide automatically for whatever reason (I mean it does, but only after it has been clicked 2 times)
                    otherMenu[i][1] += ";hideMenu();";
                };
                window.showMenu(e, otherMenu, true);
            };
            e.preventDefault();
        };
    };

    this.goTo = function(e) {
        if (e.type == "touchstart") {
            var offsets = self.getOffsets(e.target);
            e.offsetX = e.touches[0].pageX - offsets[0];     
            e.offsetY = e.touches[0].pageY - offsets[1];
            e.stopPropagation();
        };

        var coords = self.getCoordsFromEvent(e);
        if (coords) {
            self.heroGoTo(coords.x, coords.y);
        }
    };

    this.heroGoTo = function(x, y) {
        if (interface == "new") {
            Engine.hero.autoGoTo({x: x, y: y});
        } else if (interface == "old") {
            // self.searchPath.call(window.hero, x,y);
            window.hero.searchPath(x, y);
        } else {
            self.oldMargoGoTo(x, y);
        };
    }

    this.oldMargoGoTo = function(x, y) {
        //window,hero.setMousePos(x*32,y*32);
        window.hero.mx = x;
        window.hero.my = y;
        window.global.movebymouse = true;
        this.cancelMouseMovement = true;
    };

    this.getCoordsFromEvent = function(e) {
        if (e.target == $map) {
            return {
                x: Math.round(e.offsetX/(objScale*32)),
                y: Math.round(e.offsetY/(objScale*32))
            };
        } else {
            var obj = this.objectMgr.getByElem(e.target);
            if (obj) {
                return {
                    x: obj.d.x,
                    y: obj.d.y
                };
            } else {
                return null;
            }
        };
    };

    this.getOffsets = function($el, offs) {
        var offsets = offs ? offs : [0,0];
        offsets[0] += $el.offsetLeft;
        offsets[1] += $el.offsetTop;
        if ($el.parentElement != null) {
            this.getOffsets($el.parentElement, offsets);
        };
        return offsets;
    };

    this.searchBarHandler = function(e) {
        //keyup event handler
        var input = $search.value;

        const query = self.parseSearchQuery(input);
        self.objectMgr.performSearch(query);
    };
    const TOKEN = {
        ILLEGAL: 0,
        TEXT: 1,
        COMMA: 2,
        LBRACKET: 3,
        RBRACKET: 4,
        COMPARISON: 5
    }
    const tokens = [
        {
            // ignore whitespace
            regex: /^[ \n\t]+/,
            ignore: true
        },
        {
            regex: /^([^\[\]\(\)\*,=<>\n\t]+)/,
            type: TOKEN.TEXT
        },
        {
            regex: /^,/,
            type: TOKEN.COMMA
        },
        {
            regex: /^\[/,
            type: TOKEN.LBRACKET
        },
        {
            regex: /^\]/,
            type: TOKEN.RBRACKET
        },
        {
            regex: /^(<=)/,
            type: TOKEN.COMPARISON
        },
        {
            regex: /^(>=)/,
            type: TOKEN.COMPARISON
        },{
            regex: /^(\==)/,
            type: TOKEN.COMPARISON
        },
        {
            regex: /^(=|<|>)/,
            type: TOKEN.COMPARISON
        },
        {
            regex: /^./,
            type: TOKEN.ILLEGAL
        }
    ]
    const words = [
        {
            syntax: [TOKEN.LBRACKET, TOKEN.TEXT, TOKEN.COMPARISON, TOKEN.TEXT], // RBRACKET nie jest wymagany, żeby w trakcie pisania już podświetlało.
            handler: (key, comparison, value) => {
                return {
                    action: "filter",
                    key: key,
                    comparison: comparison,
                    value: value.toLowerCase()
                }
            }
        },
        {
            syntax: [TOKEN.LBRACKET, TOKEN.TEXT, TOKEN.RBRACKET],
            handler: (key) => {
                return {
                    action: "filter",
                    key: key,
                    comparison: "?"
                }
            }
        },
        {
            syntax: [TOKEN.TEXT, TOKEN.COMMA, TOKEN.TEXT],
            handler: (textX, textY) => {
                let x = parseInt(textX),
                    y = parseInt(textY);
                
                if (isNaN(x) || isNaN(y))
                    return null;

                return {
                    action: "highlight",
                    coords: [x, y]
                }
            }
        },
        {
            syntax: [TOKEN.TEXT],
            handler: (value) => {
                return {
                    action: "filter",
                    key: "name",
                    comparison: "=",
                    value: value.toLowerCase()
                }
            }
        }
    ]
    this.parseSearchQuery = function(str) {
        const tokenList = [];
        while(str.length) {
            for (let i=0; i<tokens.length; ++i) {
                const match = str.match(tokens[i].regex);
                if (match) {
                    if (!tokens[i].ignore) {
                        tokenList.push({
                            type: tokens[i].type,
                            match: match
                        });
                    }
                    str = str.substring(match[0].length);
                    break;
                }
            }
        }

        // match the tokens to words, also collect the args
        let tokenIndex = 0;
        const actions = [];
        while(tokenIndex < tokenList.length) {
            let matched = false;
            for (let i=0; i<words.length; ++i) {
                const word = words[i];
                let wordMatched = true;
                let args = [];
                for (let j=0; j<word.syntax.length; ++j) {
                    if (tokenList.length <= tokenIndex + j || word.syntax[j] != tokenList[tokenIndex + j].type) {
                        wordMatched = false;
                        break;
                    }
                    if (tokenList[tokenIndex + j].match.length > 1)
                        args.push(tokenList[tokenIndex + j].match[1].trim());
                }
                if (wordMatched) {
                    let action = word.handler.apply(null, args);
                    if (action) {
                        actions.push(action);
                        tokenIndex += word.syntax.length;
                        matched = true; 
                        break;
                    }
                }
            }
            if (!matched)
                tokenIndex += 1;
        }

        return actions;
    }

    this.makeTip = function(data) {
        var tip = data.nocenter ? "" : "<center>";
        tip += data.txt+"<div style='text-align: center;color: gray'>("+data.x+","+data.y+")</div>";
        return tip + (data.nocenter ? "" : "</center>");
    };

    this.toggleView = function() {
        $wrapper.style["display"] = $wrapper.style["display"] == "block" ? "none" : "block";
    };

    this.initResponseParser = function() {
        if (interface == "new") {
            API.priw.emmiter.on("before-game-response", data => {
                if (!manualMode) this.parseInput(data);
            })
        } else if (interface == "old") {
            var _parseInput = parseInput;
            parseInput =  function(data) {
                if (!manualMode) self.parseInput(data);
                return _parseInput.apply(this, arguments);
            };
        } else {
            API.emmiter.on("response", data => {
                if (!manualMode) self.parseInput(self.parseOldMargonemData(data));
            })
        };
    };

    self.arr2obj = function(arr) {
        var ret = {};
        for (var i=0; i<arr.length; i++) {
            ret[arr[i].id] = arr[i];
        };
        return ret;
    };

    self.parseOldMargonemData = function(data) {
        //data.gw2 = [];
        //data.townname = {};
        /*if (data.elements) {
            if (data.elements.npc) Object.assign(data.npc, this.arr2obj(data.elements.npc));
            if (data.elements.other) Object.assign(data.other, this.arr2obj(data.elements.other));
        }
        if (data.delete) {
            if (data.delete.npc) Object.assign(data.npc, this.arr2obj(data.delete.npc));
            if (data.delete.other) Object.assign(data.other, this.arr2obj(data.delete.other));
        }
        if (data.othermove) {
            Object.assign(data.other, this.arr2obj(data.othermove));	
            console.log(data.othermove);
        };*/
        return data;
    };

    this.enableManualMode = function() { //tryb w którym ignoruje wszystkie dane z silnika gry; na potrzeby mojego dodatku klanowego
        manualMode = true;
    };
    this.disableManualMode = function() { 
        manualMode = false;
    };

    this.parseInput = function(data) {
        for (var i in data) {
            if (typeof this.eventHandlers[i] == "function") this.eventHandlers[i](data[i], data);
        };
        if (data.townname) this.eventHandlers.gateways(data.gw2, data.townname);
    };

    this.eventHandlers = {
        town: function(town, full) {
            // town gets sent on map pvp mode change, not only map change
            if (typeof town.file != "undefined") {
                self.loadMap(town);
            }
            if (typeof town.visibility != "undefined") {
                self.updateVisibility(town.visibility, objScale);
            }
            if (typeof full.cl != "undefined") {
                self.loadCols(full);
            }
        },
        npc: function(npc) {
            self.parseNpc(npc);
        },
        gateways: function(gws, townname) {
            self.parseGws(gws, townname);
        },
        other: function(others) {
            self.parseOther(others);
        },
        item: function(items) {
            self.parseItem(items);
        },
        rip: function(rip) {
            self.parseRip(rip);
        },
        handheld_minimap: function(minimapData) {
            if (minimapData.hero_localizations && minimapData.hero_localizations.length) {
                self.addServersideSpawnsToMap(minimapData.hero_localizations);
            }
        }
    };

    
    
    this.loadCols = function(data) {
        if (!settings.get("/showcol"))
            return;
        
        if (typeof data.cl == "undefined") {
            console.error("mmp: collision data missing from town");
            return;
        }

        /* Dekompresja kolizji (mocno oparta o kod SI) */
        let index = 0;
        const cols = [];
        for (let i=0; i<data.cl.length; ++i) {
            let code = data.cl.charCodeAt(i);
            if (code > 95 && code < 123) {
                /* Wypełnij (code-95)*6 miejsc zerami */
                for (let j=95; j<code; ++j) {
                    for (let k=0; k<6; ++k) 
                        cols[index++] = 0;
                }
            } else {
                /* W tym wupadku (code-32) to 6-bitowa liczba w której każdy bit odpowiada za kolejną kolizję */
                code -= 32;
                for (let j=0; j<6; ++j) 
                    cols[index++] = (code & (1 << j)) ? 1 : 0;
            }
        }

        const townData = data.town;
        for (let x=0; x<townData.x; ++x) {
            for (let y=0; y<townData.y; ++y) {
                if (cols[y*townData.x + x]) {
                    this.objectMgr.updateObject({
                        id: `col-${x}-${y}`,
                        x: x,
                        y: y,
                        type: "col",
                        filterData: {
                            name: `Kolizja ${x} ${y}`,
                            typ: "kolizja"
                        }
                    });
                }
            }
        }
    }

    this.resetQtrack = function() {
        qTrack.reset();
        var npc = settings.get("/trackedNpcs");
        for (var i=0; i<npc.length; i++) {
            qTrack.add({
                type: "NPC",
                name: npc[i]
            });
        };
        var item = settings.get("/trackedItems");
        for (i=0; i<item.length; i++) {
            qTrack.add({
                type: "ITEM",
                name: item[i]
            });
        };
    };

    this.loadMap = function(town) {
        if (interface == "superold") town.file = town.img;
        this.resetQtrack();
        this.objectMgr.deleteAll();
        var mapsize = interface == "new" ? 700 : 440;
        mapsize = mapsize*settings.get("/mapsize");
        if (town.x > town.y) {
            var height = Math.floor(town.y/town.x * mapsize);
            var width = mapsize;
        } else {
            var width = Math.floor(town.x/town.y * mapsize);
            var height = mapsize;
        };
        objScale = width/(town.x*32);
        objSize = Math.ceil(objScale*32);

        var left = 0;
        var top = 0;
        if (interface != "new") {
            top = -30;
            left = -144;
        };

        Object.assign($wrapper.style, {
            //$map will stretch the $wrapper
            //width: width + "px", 
            //height: (height+20) + "px",
            left: "calc(50% - "+(width/2 - left)+"px)",
            top: "calc(50% - "+(height/2 - top)+"px)"
        });
        Object.assign($map.style, {
            width: width + "px",
            height: height + "px",
        });
        if (width < 385) $info.style["display"] = "none";
        else $info.style["display"] = "inline-block";
        if (width < 210) $searchTxt.style["display"] = "none";
        else $searchTxt.style["display"] = "inline-block";

        this.loadMapImg(town.file, width, height);
        if (interface != "superold") {
            this.herosCheckedRespManager.reset();
            this.addSpawnsToMap(herosDB, true, town.name, town.id);
            this.addSpawnsToMap(eliteDB, false, town.name, town.id);
        };
        this.updateHero(true);
    };

    this.updateVisibility = function(n, scale) {
        if (n) {
             let size = (n*2 + 1)*scale*32;
            Object.assign($visibility.style, {
                width: size + "px",
                height: size + "px",
                "margin-top": (size/-2) + (scale*16) + "px",
                "margin-left": (size/-2) + (scale*16) + "px",
                opacity: 1
            });
        } else {
            $visibility.style.opacity = 0;
        }
    }

    this.loadMapImg = function(file, w, h) {
        $map.style["background-image"] = "";
        $map.style["background"] = "#444444";
        var miniMapImg = new Image();
        miniMapImg.crossOrigin = "anonymous";
        if (file.indexOf("http") == -1) {
            var mpath = getPath("mpath", "/obrazki/miasta/");
            miniMapImg.src = (interface == "superold" ? "http://oldmargonem.pl" : "") + mpath + file;
        } else {
            miniMapImg.src = file;
        };
        miniMapImg.onload = function() {
            if (settings.get("/manualDownscale")) {
                // "Hacky" downscale that manages to produce a pretty solid quality
                // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = miniMapImg.width;
                canvas.height = miniMapImg.height;
                ctx.drawImage(miniMapImg, 0, 0);
                let loops = Math.ceil(Math.log(miniMapImg.width / w) / Math.log(2)) - 1;
                let currentWidth = miniMapImg.width;
                let currentHeight = miniMapImg.height;
                while(loops-- > 0) {
                    currentWidth *= 0.5;
                    currentHeight *= 0.5;
                    ctx.drawImage(canvas, 0, 0, 0.5 * miniMapImg.width, 0.5 * miniMapImg.height);
                }

                const finalCanvas = document.createElement("canvas");
                finalCanvas.width = currentWidth;
                finalCanvas.height = currentHeight;
                const fctx = finalCanvas.getContext("2d");
                fctx.drawImage(canvas, 0, 0, currentWidth, currentHeight, 0, 0, currentWidth, currentHeight);

                $map.style["background"] = "";
                $map.style["background-image"] = `url(${finalCanvas.toDataURL()})`;
            } else {
                $map.style["background"] = "";
                $map.style["background-image"] = "url("+miniMapImg.src+")";
            }
        };
    };

    this.parseNpc = function(npcs) {
        for (var id in npcs) {
            var npc = npcs[id];
            if (!npc.del) {
                this.addNewNpcToMap(npc, id);
            } else {
                this.objectMgr.updateObject({
                    id: "NPC-"+id,
                    del: 1
                });
                if (npcTrack[id]) {
                    qTrack.remove({
                        type: "NPC",
                        nick: npcTrack[id].nick
                    });
                    delete npcTrack[id];
                };
            };
        };
    };
    this.addNewNpcToMap = function(npc, id) {
        var {type, flash} = this.getNpcType(npc, id);
        if (type == undefined) return;
        var {tip, ctip} = this.getNpcTip(npc, type, flash);
        var data = {
            id: "NPC-"+id,
            type: type,
            flash: flash,
            tip: tip,
            ctip: ctip,
            x: npc.x,
            y: npc.y,
            qm: npc.qm || (npc.actions && npc.actions & 128)
        };
        data.filterData = {
            name: npc.nick,
            typ: this.getNpcFriendlyType(type)
        }
        if (npc.qm || (npc.actions && npc.actions & 128)) {
            data.filterData.quest = true;
        }
        if (type != "npc" && type != "gw" && type != "item") {
            data.lvl = npc.lvl;
            data.filterData.lvl = npc.lvl;
        };
        if (npc.grp != 0) {
            data.filterData.grp = true;
            data.filterData.grupa = true;
        }

        
        this.objectMgr.updateObject(data)
    };
    this.getNpcTip = function(npc, type, important) {
        var tip = "";
        var mask = false;
        for (var i=0; i<masks.length; i++) {
            if (masks[i].indexOf(npc.icon) > -1) mask = true;
        };
        if (!mask) tip += "<img src='"+this.npcIconHTML(npc.icon)+"'>";
        var ctip = "t_npc";
        if (type == "gw") {
            ctip = false;
            tip = this.makeTip({
                txt: npc.nick + "<br>",
                x: npc.x,
                y: npc.y
            })
        } else if (type == "item") {
            ctip = "t_item";
            tip = this.makeTip({
                x: npc.x,
                y: npc.y,
                txt: tip + "<br>" + npc.nick
            })
        } else {
            tip = this.normalNpcTip(npc, type, important, tip);
        };
        return {
            tip: tip,
            ctip: ctip
        }
    };
    this.npcIconHTML = function(icon) {
        if (icon.indexOf("://") > -1 || icon.indexOf("obrazki/") > -1) return icon; //zapomniałem o kompatybilności z jedną rzeczą którą robię xd
        else if (interface == "superold") return "http://oldmargonem.pl/obrazki/npc/"+icon;
        else return getPath("npath", "/obrazki/npc") + icon;
    };
    this.oldNpcTip = function(npc, type, eve) {
        var icon = npc.icon;
        npc.icon = "kappa";
        if (type == "elite2" && !eve) {
            npc.wt = 30;
        };

        if (!g.tips.npc) newNpc();
        var tip = g.tips.npc(npc);

        if (type == "elite2") {
            if (!eve) {
                npc.wt = 20;
                tip = tip.replace("elita III", "elita II");
            } else {
                tip = tip.replace("elita", "specjalna elita");
            };
        };
        npc.icon = icon;
        return typeof tip == "string" ? tip : "";
    };
    this.newNpcTip = function(npc, type, eve) {
        var nick = "<div><strong>"+npc.nick+"</strong></div>";
        switch (type) {
            case "titan":
                var type = "<i>tytan</i>";
                break;
            case "heros":
                var type = "<i>heros</i>";
                break;
            case "elite3":
                var type = "<i>elita III</i>";
                break;
            case "elite2":
                if (eve) {
                    var type = "<i>specjalna elita</i>";
                } else {
                    var type = "<i>elita II</i>";
                }
                break;
            case "elite":
                var type = "<i>elita</i>";
                break;
            default:
                var type = "";
                break;
        };
        var lvl = npc.lvl ? npc.lvl + " lvl" : "";
        var grp = npc.grp ? " grp" : "";
        var lvlgrp = "<span>"+lvl+grp+"</span>";
        return nick + type + lvlgrp;
    };
    this.oldMargoNpcTip = function(npc, type, eve) {
        var nick = "<b style='color:orange;'>"+npc.nick+"</b>";
        switch (type) {
            case "titan":
                var type = "<i>tytan</i><br>";
                break;
            case "heros":
                var type = "<i>heros</i><br>";
                break;
            case "elite3":
                var type = "<i>elita III</i><br>";
                break;
            case "elite2":
                if (eve) {
                    var type = "<i>specjalna elita</i><br>";
                } else {
                    var type = "<i>elita II</i><br>";
                }
                break;
            case "elite":
                var type = "<i>elita</i><br>";
                break;
            default:
                var type = "";
                break;
        };
        var lvl = npc.lvl ? "Lvl: "+npc.lvl : "";
        var grp = npc.grp ? " grp" : "";
        var lvlgrp = "<span>"+lvl+grp+"</span>";
        return nick + type + lvlgrp;
    };
    this.normalNpcTip = function(npc, type, important, before) {
        if (interface == "old") {
            var tip = this.oldNpcTip(npc, type, important).replace("<span ></span><br>", "").replace("<span ></span>", "");
        } else if (interface == "new") {
            var tip = this.newNpcTip(npc, type, important);
        } else {
            var tip = this.oldMargoNpcTip(npc, type, important);
        };
        if (npc.lvl > 0) tip += "<br>";
        return this.makeTip({
            txt: before+tip,
            x: npc.x,
            y: npc.y
        });
    };
    var npcTrack = {};
    this.addNpcToTrack = function(npc, id, heros) {
        npcTrack[id] = npc;
        qTrack.add({
            type: "NPC",
            name: npc.nick
        });
        if (interface != "superold") this.checkForUnknownResp(npc, heros);
    };
    this.checkForUnknownResp = function(npc, heros) {
        var map = interface == "new" ? Engine.map.d : window.map;
        var db = heros ? herosDB : eliteDB;
        if (db[npc.nick] && db[npc.nick].spawns) {
            var spawns = db[npc.nick].spawns;
            if (spawns[map.name] || spawns[map.id]) {
                var spawnsOnMap = spawns[map.name] ? spawns[map.name] : spawns[map.id];
                if (spawns[map.name]) this.unknownMapId(map.name, map.id, heros);
                if (!this.coordsExistInSpawns(spawnsOnMap, npc.x, npc.y)) this.unknownResp(npc, map, heros);
            };
        };
    };
    this.coordsExistInSpawns = function(spawns, x, y) {
        for (var i=0; i<spawns.length; i++) {
            if (spawns[i][0] == x && spawns[i][1] == y) return true;
        };
        return false;
    };
    this.unknownResp = function(npc, map, heros) {
        // Disabling it because it my API has issues on NI currently
        // var log = interface == "new" ? API.priw.console.log : window.log;
        // log("<hr>"+(heros ? "Heros" : "Elita")+" znajduje się na respie, który nie jest w bazie danych minimapy.",1);
        // log("Prosiłbym o zamieszczenie poniższej informacji w <a style='color: gold' href='https://www.margonem.pl/?task=forum&show=posts&id=488564' target='_blank'>tym temacie</a><br><br>miniMap+ - Nieznany resp: "+npc.nick+", "+map.name+"(ID: "+map.id+")("+npc.x+","+npc.y+")<br><hr>");
    };
    this.unknownMapId = function(name, id, heros) {
        // var log = interface == "new" ? API.priw.console.log : window.log;
        // log("<hr>"+"Mapa, na której "+(heros ? "zrespił się heros" : "zrespiła się elita")+", nie jest zapisana w bazie danych po ID.",1);
        // log("Prosiłbym o zamieszczenie poniższej informacji w <a style='color: gold' href='https://www.margonem.pl/?task=forum&show=posts&id=488564' target='_blank'>tym temacie</a><br><br>miniMap+ - nieznane ID mapy - '"+name+"'="+id+"<br><hr>");
    };
    this.getNpcType = function(npc, id) {
        if (npc.type == 2 || npc.type == 3) {
            var flash = false;
            if (npc.wt > 99) {
                //tytan
                var type = "titan";
            } else if (npc.wt > 79) {
                //heros
                var type = "heros";
                this.addNpcToTrack(npc, id, true);
                flash = true;
            } else if (eliteDB[npc.nick]) {
                //specjalna elita
                var type = "elite2";
                this.addNpcToTrack(npc, id, false);
                flash = true;
            } else if (npc.wt > 29) {
                //e3
                var type = "elite3";
            } else if (npc.wt > 19) {
                //e2
                var type = "elite2";
            } else if (npc.wt > 9) {
                //e
                var type = "elite";
            } else {
                //nub
                var type = "mob";
            };
        } else if (npc.type == 0 || npc.type == 5 || npc.type == 6) {
            if (gws.indexOf(npc.icon) == -1) {
                var type = "npc";
            } else {
                var type = "gw";
            };
        } else if (_l() == "en" && npc.type == 7) {
            var type = "item";
        };
        return {
            type: type,
            flash: flash
        };	
    };
    this.getNpcFriendlyType = function(type) {
        return ({
            titan: "potwór: tytan",
            heros: "potwór: heros",
            elite2: "potwór: elita 2",
            elite3: "potwór: elita 3",
            elite: "potwór: elita",
            mob: "potwór: zwykły",
            npc: "npc",
            gw: "przejście",
            item: "przedmiot"
        })[type];
    }

    this.initHeroUpdating = function() {
        if (interface != "new") {
            var _run = hero.run;
            hero.run = function() {
                self.updateHero();
                var ret = _run.apply(this, arguments);
                if (interface == "superold" && self.cancelMouseMovement) {
                    self.cancelMouseMovement = false;
                    window.global.movebymouse = false;
                }
                return ret;
            };
        } else if (interface == "new") {
            var _draw = Engine.map.draw;
            Engine.map.draw = function() {
                self.updateHero();
                return _draw.apply(this, arguments);
            };
        };
    };

    this.updateHero = function(ignore) {
        qTrack.update();
        if (interface == "new") var hero = Engine.hero.d;
        else var hero = window.hero;
        if (!ignore && oldPos.x == hero.x && oldPos.y == hero.y) return;
        this.objectMgr.updateObject({
            id: "HERO",
            x: hero.x,
            y: hero.y,
            tip: "Moja postać",
            type: "hero",
            children: [$visibility]
        });
        this.herosCheckedRespManager.update(hero);
        oldPos.x = hero.x;
        oldPos.y = hero.y;
    };

    this.parseGws = function(gws, townname) {
        for (var i=0; i<gws.length; i+=5) {
            var tip = townname[gws[i]];
            if (gws[i+3]) {
                if (gws[i+3] == 2) {
                    tip += interface != "superold" ? "<br>("+_t("require_key", null , "gtw")+")" : "<br>(wymaga klucza)";
                };
            };
            if (gws[i+4]) {
                var min = (parseInt(gws[i+4]) & 65535);
                var max = ((parseInt(gws[i+4]) >> 16) & 65535);
                tip += "<br>" + _t("gateway_availavle", null , "gtw");
                tip += min ? _t("from_lvl %lvl%", {"%lvl%": min }, "gtw") : "";
                tip += max >= 1000 ? "" : _t("to_lvl %lvl%", { "%lvl%": max }, "gtw") + _t("lvl_lvl", null , "gtw");
            };
            this.objectMgr.updateObject({
                tip: this.makeTip({
                    txt: tip + "<br>",
                    x: gws[i+1],
                    y: gws[i+2]
                }),
                type: "gw",
                x: gws[i+1],
                y: gws[i+2],
                id: "GW-"+gws[i]+"-"+i,
                filterData: {
                    name: townname[gws[i]],
                    typ: "przejście"
                }
            });
        };
    };

    this.parseOther = function(others) {
        for (var id in others) {
            var other = others[id];
            if (!other.del) {
                if (!this.objectMgr.objectExists(`OTHER-${id}`)) {
                    // Failsafe for weird cases caused by certain SI addons
                    if (typeof other.nick != "undefined")
                        this.addNewOtherToMap(other, id);
                } else {
                    this.updateOther(other, id);
                };
            } else {
                this.objectMgr.updateObject({
                    id: "OTHER-"+id,
                    del: 1
                });
            };
        }
    };
    this.updateOther = function(other, id) {
        var evoNetwork = this.checkIfOtherFromEvoNetwork(id);
        var data = {};
        var canLoadImgFromCache = !other.icon;
        var previousData = interface == "new" ? Engine.others.getById(id).d : g.other[id];
        var other = Object.assign({}, previousData, other);
        if (isset(other.x)) data.x = other.x;
        if (isset(other.y)) data.y = other.y;
        var {tip, ctip} = this.getOtherTip(other, evoNetwork);
        if (canLoadImgFromCache && this.otherImgCache[id]) {
            var img = this.otherImgCache[id];
            tip = '<center><div style="background-image: url('+img.src+'); width: '+(img.width/4)+'px; height: '+(img.height/4)+'px"></div></center>' + tip;
        } else {
            this.loadOtherImg(other, id, tip);
        }
        data.tip = tip;
        data.ctip = ctip;
        data.id = "OTHER-"+id;
        this.objectMgr.updateObject(data);
    };
    this.otherImgCache = {};
    this.checkIfOtherFromEvoNetwork = function(id) {
        //rozpoznawanie postaci z innych światów dodawanych przez dodatek ccarederra
        return String(id).split("_")[1] == "wsync";
    };
    this.addNewOtherToMap = function(other, id) {
        var type;
        var evoNetwork = this.checkIfOtherFromEvoNetwork(id);
        if (evoNetwork && !settings.get("/showevonetwork")) return;
        switch (other.relation) {
            case SocietyData.RELATION.NONE: //obcy
                type = "other";
                break;
            case SocietyData.RELATION.CLAN_ALLY: //sojusznik
            case SocietyData.RELATION.FRACTION_ALLY: //fraction friend
                type = "ally";
                break;
            case SocietyData.RELATION.CLAN: //klanowicz
                type = "clan";
                break;
            case SocietyData.RELATION.FRIEND: //znajomy
                type = "friend";
                break;
            case SocietyData.RELATION.ENEMY: //wróg
            case SocietyData.RELATION.CLAN_ENEMY: //wrogi klan
            case SocietyData.RELATION.FRACTION_ENEMY: //fraction enemy
                type = "enemy";
                break;
            default:
                type = "other";
                break;
        };
        if (evoNetwork) type = "evoNetwork";
        var {tip, ctip} = this.getOtherTip(other, evoNetwork);
        this.objectMgr.updateObject({
            tip: tip,
            ctip: ctip,
            type: "other",
            type2: type,
            x: other.x,
            y: other.y,
            id: "OTHER-"+id,
            evoNetwork: evoNetwork,
            filterData: {
                name: other.nick,
                klan: typeof other.clan == "object" ? other.clan.name : "",
                lvl: other.lvl,
                typ: "gracz"
            },
            click: function() {
                if (evoNetwork) return; //gdy ccarderr zrobi jakieś kanały prywatne w swoim chacie to kliknięcie gracza będzie taki otwierać
                if (interface != "old") {
                    $chatInput.value = "@" + other.nick.replace(/ /g, "_") + " ";
                    $chatInput.focus();
                    if (interface == "superold") {
                        //switch from eq to chat
                        if (window.chat.style.display == "none") {
                            var btt = document.querySelector("#eqbutton");
                            btt.click();
                            btt.style["background-position"] = "";
                        };
                    };
                } else if (interface == "old") {
                    chatTo(other.nick);
                };
            }
        });
        this.loadOtherImg(other, id, tip);
    };
    this.loadOtherImg = function(other, id, tip) {
        var img = new Image();
        img.src = (interface == "superold" ? "http://oldmargonem.pl" : "") + getPath("opath", "/obrazki/postacie/") + other.icon;
        img.onload = function() {
            self.otherImgCache[id] = img;
            tip = '<center><div style="background-image: url('+img.src+'); width: '+(img.width/4)+'px; height: '+(img.height/4)+'px"></div></center>' + tip;
            self.objectMgr.updateObject({
                tip: tip,
                id: "OTHER-"+id
            });
        };
    }
    this.getOtherTip = function(other, evoNetwork) {
        if (interface == "old") {
            var tip = this.oldOtherTip(other);
        } else if (interface == "new") {
            var tip = this.newOtherTip(other);
        } else {
            var tip = this.oldMargoOtherTip(other);
        };
        if (evoNetwork) {
            tip += "<i>Postać z dodatku World Sync</i>";
        };
        return {
            tip: this.makeTip({
                txt: tip + (evoNetwork ? "" : "<br>"),
                x: other.x,
                y: other.y
            }),
            ctip: "t_other" + (other.relation != SocietyData.RELATION.NONE && interface != "new" ? " t_"+SocietyData.TIP[other.relation] : "")
        };
    };
    this.oldOtherTip = function(other) {
        if (!g.tips.other) newOther({0:{}});newOther({0:{del:1}});
        var tip = g.tips.other(other); 
        return tip.replace(/'/g, "&apos;")
    };
    this.newOtherTip = function(other) {
        //pre-wrapper
        if (other.rights) {
            var rank;
            if (other.rights & 1) rank = 0;
            else if (other.rights & 16) rank = 1;
            else if (other.rights & 2) rank = 2;
            else if (other.rights & 4) rank = 4;
            else rank = 3;
            rank = "<div class='rank'>"+otherRanks[rank]+"</div>";
        } else {
            var rank = "";
        };
        var guest = isset(other.guest) ? "<div class='rank'>Zastępca</div>" : "";
        var preWrapper = rank + guest;
        //wrapper
        var nick = "<div class='nick'>" + other.nick + "</div>";
        var prof = "<div class='profs-icon "+other.prof+"'></div>";
        var bless = isset(other.ble) ? "<div class='bless'></div>" : "";
        var infoWrapper = "<div class='info-wrapper'>" + nick + bless + prof + "</div>";
        //post-wrapper
        var wanted = isset(other.wanted) ? "<div class='wanted'></div>" : "";
        var clan = (isset(other.clan) && other.clan.name != "") ? "<div class='clan-in-tip'>"+other.clan.name+"</div><div class='line'></div>" : "";
        var lvl = isset(other.lvl) ? "<div class='lvl'>"+other.lvl+" lvl</div>" : "";
        var mute = (other.attr & 1) ? "<div class='mute'></div>" : "";
        var postWrapper = wanted + clan + lvl + mute;

        return preWrapper + infoWrapper + postWrapper;
    };
    this.oldMargoOtherTip = function(other) {
        var tip = "<b style='color:yellow'>"+other.nick+"</b>";
        if (other.clan) tip += "<span style='color:#fd9;'>["+g.clanname[other.clan]+"]</span><br>";
        tip += "Lvl: "+other.lvl+other.prof;
        return tip;

    };

    this.parseItem = function(items) {
        for (var id in items) {
            var item = items[id];
            if (item.loc == "m") {
                this.addNewItemToMap(item, id);
            } else {
                var previousData = interface == "new" ? Engine.items.getItemById(id) : g.item[id];
                if (interface == "new" && previousData) previousData = previousData.d;
                if (previousData && previousData.loc == "m") {
                    this.objectMgr.updateObject({
                        id: "ITEM-"+id,
                        del: 1
                    });
                };
            }
        }
    };
    this.addNewItemToMap = function(item, id) {
        var tip = this.getItemTip(item);
        this.objectMgr.updateObject({
            id: "ITEM-"+id,
            tip: tip,
            ctip: "t_item",
            x: item.x,
            y: item.y,
            type: "item",
            filterData: {
                name: item.name,
                typ: "przedmiot"
            }
        });
    };
    this.oldMargoItemTip = function(item) {
        return "<b>"+item.name+"</b>"+item.stats;
    };
    this.getItemTip = function(item) {
        var nocenter = true;
        var tip = interface == "new" ? MargoTipsParser.getTip(item) : (interface == "old" ? itemTip(item) : this.oldMargoItemTip(item));
        if (interface == "old" && tip.indexOf("tip-section") == -1) { //kompatybilność z moim dodatkiem na nowe tipy
            tip = "<img src='"+(interface == "superold" ? "http://oldmargonem.pl" : "") + getPath("ipath", "/obrazki/itemy/") + item.icon + "'>" + tip;
            nocenter = false;
        };
        return this.makeTip({
            txt: tip,
            x: item.x,
            y: item.y,
            nocenter: nocenter
        });
    };
    var ripCount = 0;
    this.parseRip = function(rips) {
        for (var i=0; i<rips.length; i+=8) {
            this.addNewRipToMap({
                nick: rips[i],
                lvl: rips[i+1],
                prof: rips[i+2],
                x: parseInt(rips[i+3]),
                y: parseInt(rips[i+4]),
                ts: parseInt(rips[i+5]),
                desc1: rips[i+6],
                desc2: rips[i+7]
            });
            ripCount++;
        };
    };
    this.addNewRipToMap = function(rip) {
        var isHerosRip = false;
        var timeToDisappear = 300 + rip.ts - unix_time();
        if (timeToDisappear <= 0) return;
        var tip = "<b>" + _t("rip_prefix") + " " + htmlspecialchars(rip.nick) + "</b>Lvl: " + rip.lvl + rip.prof + "<i>" + htmlspecialchars(rip.desc1) + "</i><i>" + htmlspecialchars(rip.desc2) + "</i>";
        this.objectMgr.updateObject({
            tip: this.makeTip({
                txt: tip,
                x: rip.x,
                y: rip.y
            }),
            type: "rip",
            x: rip.x,
            y: rip.y,
            circle: true,
            border: true,
            id: "RIP-"+ripCount,
            ctip: "t_rip",
            filterData: {
                name: `Grób ${rip.nick}`,
                typ: "grób",
                lvl: rip.lvl
            }
        });
        var id = "RIP-"+ripCount;
        var nick;
        if (nick = this.checkHerosRip(rip.desc1)) {
            qTrack.add({type: "COORDS", name: "Grób gracza zabitego przez herosa "+nick+"<br>Możliwe, że heros tam stoi!", coords: [rip.x, rip.y] });
            isHerosRip = true;
            message("Na mapie znajduje się grób gracza zabitego przez herosa "+nick);
        };
        setTimeout(() => {
            self.objectMgr.updateObject({
                id: id,
                del: 1
            });
            if (isHerosRip) qTrack.remove({type: "COORDS", name: "Grób gracza zabitego przez herosa "+nick+"<br>Możliwe, że heros tam stoi!"});
        }, timeToDisappear*1000);
    };
    this.checkHerosRip = function(desc) {
        for (var nick in herosDB) {
            var needle = nick + "(" + herosDB[nick].lvl + herosDB[nick].prof + ")";
            if (desc.indexOf(needle) > -1) {
                return nick;
            };
        };
        return false;
    };

    this.objectMgr = new (function() {
        var self = this;
        var mgr = this;
        var objs = {};
        var flashables = [];
        class MapObject {
            constructor(data) {
                this.d = data;
                this.currentColor = settings.get("/colors")[this.d.type];

                if (data.flash)
                    flashables.push(this);

                this.initHTML();
                this.initEventListener();
                this.manageDisplay();
            }

            initHTML() {
                const data = this.d;
                this.$ = document.createElement("div");
                this.$.classList.add("mmpMapObject", "mmp-"+data.type);
                if (innerDotKeys.indexOf(data.type2) != -1) {
                    var $dot = document.createElement("div");
                    $dot.classList.add("innerDot", "mmp-"+data.type2);
                    Object.assign($dot.style, {
                        left: objSize/4 + "px",
                        top: objSize/4 + "px",
                        width: objSize/2 + "px",
                        height: objSize/2 + "px"
                    });
                    this.$.appendChild($dot);
                } else if (data.type2 == "evoNetwork") {
                    this.$.classList.add("evoNetwork");
                };
                if (data.children) {
                    // append extra children to the object
                    for (let i=0; i<data.children.length; i++) {
                        this.$.appendChild(data.children[i]);
                    }
                }
                var left = data.x * objScale * 32;
                var top = data.y * objScale * 32;
                Object.assign(this.$.style, {
                    top: top + "px",
                    left: left + "px",
                    width: objSize + "px",
                    height: objSize + "px",
                    opacity: "0"
                });
                setTimeout(() => this.$.style.opacity = "1.0", 1);

                if (typeof data.tip != "undefined")
                    setTip(this.$, data.tip, data.ctip ? data.ctip : "");

                if (data.circle) {
                    this.$.style["border-radius"] = objScale*18 + "px";
                };
                if (data.border) {
                    this.$.style["border"] = typeof data.border == "boolean" ? "1px solid black" : data.border;
                };
                if (data.qm) {
                    this.$.innerHTML = "<img class='mmpQM' width='"+objSize+"' height='"+objSize*2+"' src='https://jaruna.margonem.pl/img/quest-mark.gif'>";
                };
                $map.appendChild(this.$);
            }

            initEventListener() {
                if (this.d.click) {
                    var type = mobileDevice ? "touchstart" : "click";
                    this.$.addEventListener(type, e => {
                        this.d.click(e);
                        e.stopPropagation();
                    });
                };// else {
                    //this.$.addEventListener("click", this.goTo);
                //}
            };

            invertColor() {
                var c = this.currentColor;
                var c1 = (255 - parseInt("0x"+c.substring(1,3))).toString(16);
                var c2 = (255 - parseInt("0x"+c.substring(3,5))).toString(16);
                var c3 = (255 - parseInt("0x"+c.substring(5,7))).toString(16);
                if (c1.length < 2) c1 = "0" + c1;
                if (c2.length < 2) c2 = "0" + c2;
                if (c3.length < 2) c3 = "0" + c3;
                this.currentColor = "#"+c1+c2+c3;
                this.$.style.background = this.currentColor;
            }

            remove() {
                if (this.d.flash) 
                    flashables.splice(flashables.indexOf(this), 1);
    
                this.$.style["opacity"] = "0";

                if (settings.get("/interpolerate"))
                    setTimeout(() => this.$.remove(), 500);
                else
                    this.$.remove();
            }

            update(data) {
                Object.assign(this.d, data);
                if (typeof data.x != "undefined") {
                    this.$.style["left"] = data.x * objScale * 32 + "px";
                };
                if (typeof data.y != "undefined") {
                    this.$.style["top"] = data.y * objScale * 32 + "px";
                };
                if (data.tip) {
                    setTip(this.$, data.tip);
                };
                if (data.invertColor) {
                    this.invertColor();
                };
                if (typeof data.border != "undefined") {
                    if (typeof data.border == "boolean") {
                        this.$.style.border = data.border ? "1px solid black" : "";
                    } else {
                        this.$.style.border = data.border;
                    }
                }
            }

            manageDisplay() {
                if (!this.d.flash && isset(this.d.lvl) && this.d.lvl < settings.get("/minlvl")) {
                    this.$.classList.add("hidden");
                } else {
                    this.$.classList.remove("hidden");
                };
            }

            filter(filters) {
                this.$.classList.remove("hiddenBySearch");
                if (!this.d.filterData || this.d.filterData._alwaysShow)
                    return;
                
                let show = true;
                for (let i=0; i<filters.length; ++i) {
                    let filter = filters[i];
                    let res = false;
                    let val = this.d.filterData[filter.key];
                    if (val) {
                        let sval = String(val).toLowerCase();
                        let nval = Number(val);
                        if (filter.comparison == "==") {
                            res = sval == filter.value;
                        } else if (filter.comparison == "<") {
                            res = nval < filter.value;
                        } else if (filter.comparison == ">") {
                            res = nval > filter.value;
                        } else if (filter.comparison == ">=") {
                            res = nval >= filter.value;
                        } else if (filter.comparison == "<=") {
                            res = nval <= filter.value;
                        } else if (filter.comparison == "=") {
                            res = sval.indexOf(filter.value) > -1;
                        } else if (filter.comparison == "?") {
                            res = true;
                        }
                    }
                    if (!res) {
                        show = false;
                        break;
                    }
                }

                if (!show) {
                    this.$.classList.add("hiddenBySearch");
                }
            }
        }

        this.objectExists = function(id) {
            return typeof objs[id] != "undefined";
        }

        this.getByElem = function($el) {
            for (var i in objs) {
                // parentElement check is for innerDot specifically
                if (objs[i].$ == $el || objs[i].$ == $el.parentElement) return objs[i];
            };
        };
        this.deleteAll = function() {
            for (var i in objs) {
                objs[i].remove();
                delete objs[i];
            };
        };
        this.updateObject = function(data) {
            if (!objs[data.id] && !data.del) {
                if (!data.dontCreate) objs[data.id] = new MapObject(data);
            } else if (data.del) {
                if (objs[data.id]) {
                    objs[data.id].remove();
                    delete objs[data.id];
                    return null;
                };
            } else {
                objs[data.id].update(data);
            }

            if (objs[data.id]) {
                objs[data.id].filter(this.currentFilters);
            }

            return objs[data.id];
        };
        this.currentFilters = [];
        this.performSearch = function(actions) {
            this.removeCoordMarkers();
            this.currentFilters.splice(0, this.currentFilters.length);
            for (let i=0; i<actions.length; ++i) {
                const action = actions[i];
                if (action.action == "highlight") {
                    this.createCoordMarker(action.coords[0], action.coords[1]);
                } else if (action.action == "filter") {
                    this.currentFilters.push(action);
                }
            }
            this.runFiltersForAllObjects();
        };
        this.runFiltersForAllObjects = function() {
            for (const id in objs) {
                objs[id].filter(this.currentFilters);
            }
        };
        this.removeCoordMarkers = function() {
            const toDelete = [];
            for (const id in objs) {
                if (id.substring(0, 6) == "COORDS") {
                    toDelete.push(id);
                }
            }
            for (let i=0; i<toDelete.length; ++i) {
                this.updateObject({
                    id: toDelete[i],
                    del: 1
                });
            }
        };
        this.createCoordMarker = function(x, y) {
            this.updateObject({
                id: `COORDS-${x}-${y}`,
                x: x,
                y: y,
                tip: "koordy "+x+","+y,
                circle: true,
                type: "hero",
                flash: true,
                filterData: {
                    _alwaysShow: true
                }
            })
        };
        this.manageDisplay = function() {
            for (var id in objs) {
                objs[id].manageDisplay();
            };
        };
        this.invertFlashables = function() {
            for (var i=0; i<flashables.length; i++) {
                flashables[i].update({
                    invertColor: true
                });
            };
        };
        setInterval(this.invertFlashables, 500);
    })();

    this.herosCheckedRespManager = new (function() {
        const currentResps = [];
        this.reset = function() {
            currentResps.splice(0, currentResps.length);
        }
        this.addResp = function(obj) {
            currentResps.push(obj);
        }
        this.update = function(coords) {
            // My research shows that the distance from player must be <12 for a heros to show up
            let dist = 12*12;
            for (let i=0; i<currentResps.length; ++i) {
                const resp = currentResps[i];
                if (resp.d.id.indexOf("(") > -1) {
                    // Temporary hack
                    currentResps.splice(i, 1);
                    --i;
                    continue;
                }
                const dx = resp.d.x - coords.x;
                const dy = resp.d.y - coords.y;
                let currDist = dx*dx + dy*dy;
                if (currDist < dist) {
                    dist = currDist;
                    closest = resp;
                    
                    resp.update({
                        border: `${Math.ceil(objScale*4)}px solid ${settings.get("/colors/heros-mark")}`
                    });
                    currentResps.splice(i, 1);
                    --i;
                }
            }
        }
    })();

    this.addSpawnsToMap = function(db, heros, map, mapId) {
        map = map.toLowerCase();
        var maxlvl = settings.get("/maxlvl");
        var hero = interface == "new" ? Engine.hero.d : window.hero;
        for (var i in db) {
            var mob = db[i];
            if (mob.ver && mob.ver != _l()) continue;
            var minlvl = Math.max(mob.lvl/2, mob.lvl-50);
            if ((maxlvl+mob.lvl >= hero.lvl && minlvl <= hero.lvl) || mob.lvl >= 242 || mob.lvl == -1) {
                for (var loc in mob.spawns) {
                    if (loc.toLowerCase() == map || loc == mapId) {
                        var spawns = mob.spawns[loc];
                        for (var j=0; j<spawns.length; j++) {
                            var x = spawns[j][0];
                            var y = spawns[j][1];
                            const respObj = this.objectMgr.updateObject({
                                id: "SPAWN-"+i+"-"+j,
                                tip: this.makeTip({
                                    txt: "Resp " + (heros ? "herosa " : "elity ") + i,
                                    x: x,
                                    y: y
                                }),
                                x: x,
                                y: y,
                                type: "heros-resp",
                                circle: true,
                                filterData: {
                                    name: "Resp " + (heros ? "herosa " : "elity ") + i,
                                    typ: "resp",
                                    lvl: mob.lvl
                                }
                            });
                            this.herosCheckedRespManager.addResp(respObj);
                        };
                    };
                };
            };
        };
    };

    /** @param {{kind: string, lvl: number, name: string, resp: number, wtype: number, pos: [number,number][]}[]} heroLocalizations */
    this.addServersideSpawnsToMap = function(heroLocalizations) {
        for (const hero of heroLocalizations) {
            for (const [x, y] of hero.pos) {
                const spawnId = `SPAWN-${hero.name}-${x}-${y}`;
                const spawnName = `Resp herosa ${hero.name} (${hero.lvl}lvl)`;
                const respObj = this.objectMgr.updateObject({
                    id: spawnId,
                    tip: this.makeTip({
                        txt: spawnName,
                        x: x,
                        y: y
                    }),
                    x: x,
                    y: y,
                    type: "heros-resp",
                    circle: true,
                    filterData: {
                        name: spawnName,
                        typ: "resp",
                        lvl: hero.lvl
                    }
                });
                this.herosCheckedRespManager.addResp(respObj);
            }
        }
    }

    this.showNewVersionMsg = function() {
        window.mAlert(this.updateString, null);
    }
    
    this.checkNewVersionMsg = function() {
        if (settings.get("/prevver") != null) {
            const prevver = settings.get("/prevver");
            if (prevver < this.version)
                this.showNewVersionMsg();
        }
        settings.set("/prevver", this.version);
    }

    this.init = function() {
        this.initSettings();
        this.initHTML();
        this.appendUserStyles();
        this.initResponseParser();
        this.initHeroUpdating();
        this.appendMobileButton();
        this.installationCounter.count();
        this.checkNewVersionMsg();
        /* if (interface == "old") {
            /* Mam pytanie: dlaczego cały czas jest to badziewie co zmienia nazwę funkcji hero.searchPath na losową? xD
             * Chodzi mi oczywiście o to: https://cdn.discordapp.com/attachments/522835675201142784/742399669774188615/unknown.png
             * Raczej mało to daje biorąc pod uwagę, że można zrobić... Dokładnie to co ja robię tutaj, czyli po prostu skopiowanie funkcji z player.js /
            this.searchPath=function (dx,dy) {
                if(this.isBlockedSearchPath()) return this.blockedInfoSearchPath();
                var startPoint = map.nodes.getNode(hero.x, hero.y);
                var endPoint = map.nodes.getNode(dx, dy);
                if (!startPoint.hasSameGroup(endPoint)) {
                  map.nodes.clearAllNodes();
                  startPoint.setScore(0, map.hce8(endPoint, startPoint));
                  endPoint =  map.nodeSetLoop(endPoint, startPoint, map.findStep);
                }
                map.nodes.clearAllNodes();
                startPoint.setScore(0, map.hce(startPoint, endPoint));
                map.nodeSetLoop(startPoint, endPoint, map.mapStep);
                var checkPoint = endPoint;
                road = [];
                while (checkPoint !== null && checkPoint.id != startPoint.id) {
                  road.push({
                    x: checkPoint.x,
                    y: checkPoint.y
                  });
                  checkPoint = checkPoint.from;
                }
                if(checkPoint !== null) {
                  road.push({x: checkPoint.x, y:checkPoint.y});
                }
                if(road.length>1 && g.playerCatcher.follow == null)
                    $('#target').stop().css({
                        left:road[0].x*32,
                        top:road[0].y*32,
                        display:'block',
                        opacity:1,
                        'z-index':1
                    }).fadeOut(1000);
              };
        }*/
        $chatInput = interface == "new" ? document.querySelector("[data-section='chat'] .input-wrapper input") : (interface == "superold" ? document.querySelector("#chatIn") : null);
    };

    //questtrack (fuzja kodu z wersji minimapy na SI i NI więc wygląda jak wygląda)
    var qTrack = new (function() {
        var self = this;
        var hero = interface == "new" ? Engine.hero : window.hero;
        var $hero = interface == "old" ? $("#hero") : (interface == "superold" ? document.querySelector("#oHero") : null);
        var $canvas = interface == "new" ? $("#GAME_CANVAS") : null;
        if (interface == "new") {
            this.npcs = {};
            API.addCallbackToEvent("newNpc", function(npc) {
                if (npc) self.npcs[npc.d.id] = npc.d;
            });
            API.addCallbackToEvent("removeNpc", function(npc) {
                if (npc) delete self.npcs[npc.d.id];
            });
        };
        this.getOldMargoHeroPos = function() {
            return {
                left: $hero.offsetLeft,
                top: $hero.offsetTop
            };
        };
        this.getHeroPos = function() {
            if (interface == "old") return $hero.position();
            if (interface == "superold") return this.getOldMargoHeroPos();
            if (!Engine.map.size) return {x: 0, y: 0};
            var tilesX = $canvas.width()/32;
            var tilesY = $canvas.height()/32;
            var pos = {
                x: Engine.hero.rx,
                y: Engine.hero.ry
            };
            var actualPos = {};
            if (pos.x < tilesX/2) {
                actualPos.x = pos.x*32;
            } else if (Engine.map.size.x - pos.x < tilesX/2) {
                actualPos.x = (pos.x - (Engine.map.size.x - tilesX/2) + tilesX/2)*32;
            } else {
                actualPos.x = (tilesX/2)*32;
            };
            if (pos.y < tilesY/2) {
                actualPos.y = pos.y*32;
            } else if (Engine.map.size.y - pos.y < tilesY/2) {
                actualPos.y = (pos.y - (Engine.map.size.y - tilesY/2) + tilesY/2)*32;
            } else {
                actualPos.y = (tilesY/2)*32;
            };
            var canvasOffset = $canvas.offset();
            return {
                left: actualPos.x + canvasOffset.left,
                top: actualPos.y + canvasOffset.top
            };
        };
        this.update = function() {
            for (var i=0; i<this.arrows.length; i++) {
                this.drawArrow(this.arrows[i]);
            };
        };
        this.drawArrow = function(objective) {
            if (objective.type == "NPC") {
                var nameKey = "nick";
                var obj = interface == "new" ? this.npcs : g.npc;
                var item = false;
            } else if (objective.type == "ITEM") { //item
                var nameKey = "name";
                if (interface == "new") {
                    var itemArr = Engine.items.fetchLocationItems("m");
                    var obj = {};
                    for (var i in itemArr) {
                        var it = itemArr[i];
                        if (it.id) obj[it.id] = it;
                        else obj[it.hid] = it;
                    };
                } else {
                    var obj = g.item;
                };
                var item = true;
            } else if (objective.type == "COORDS") { //coords
                var coords = objective.coords;
                var size = [32, 32];
                var x = Math.abs(hero.rx-coords[0]);
                var y = Math.abs(hero.ry-coords[1]);
                var closest = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
            };
            let closestName = objective.name;
            if (objective.type != "COORDS") {
                var closest = Infinity;
                var coords = false;
                var size = false;
                const objectiveNameLower = objective.name.toLowerCase();
                for (var i in obj) {
                    var entity = obj[i];
                    let entityName = entity[nameKey] ? entity[nameKey].toLowerCase() : "";
                    if (entityName == objectiveNameLower && (!item || entity.loc == "m")) {
                        var x = Math.abs(hero.rx-entity.x);
                        var y = Math.abs(hero.ry-entity.y);
                        var dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                        if (dist < closest) {
                            closest = dist;
                            coords = [entity.x, entity.y];
                            closestName = entity[nameKey];
                            size = item ? [32,32] : [entity.fw, entity.fh];
                        };
                    };
                };
            };
            if (coords) {
                var cos = (coords[0] - hero.rx)/closest;
                var sin = (coords[1] - hero.ry)/closest;
                var heropos = this.getHeroPos();
                var top = 150*sin;
                var left = 150*cos;
                var opacity = 1;
                if (closest < 9) {
                    top = top*Math.pow(closest/9, 1.8);
                    left = left*Math.pow(closest/9, 1.8);
                    opacity = Math.pow(closest/9, 2.1);
                };
                if (interface != "new") top+=20;
                left += (interface == "new") ? -12 : 4;
                if ((cos >= 0 && sin >= 0) || (cos >= 0 && sin <= 0)) {
                    var angle = Math.asin(sin) * 180 / Math.PI;
                } else {
                    var angle = 180+Math.asin(0-sin) * 180 / Math.PI;
                };
                objective.$.css({
                    top: top + heropos.top,
                    left: left + heropos.left,
                    display: opacity > 0.09 ? "block" : "none",
                    "-ms-transform": "rotate("+angle+"deg)",
                    "-webkit-transform": "rotate("+angle+"deg)",
                    transform: "rotate("+angle+"deg)",
                    opacity: opacity
                });
                if (interface == "old") {
                    objective.$highlight.css({
                        left: coords[0]*32 - 11,
                        top: coords[1]*32 + 14,
                        display: "block",
                        opacity: 1-opacity
                    });
                };
                objective.$[0].dataset.x = coords[0];
                objective.$[0].dataset.y = coords[1];
                setTip(objective.$[0],
                    `<center>${closestName}</center>`+
                    `${Math.round(closest)} kratek (${coords[0]},${coords[1]})`
                );
            } else {
                objective.$.hide();
                if (interface == "old") objective.$highlight.hide();
            };
        };
        this.arrows = [];
        this.add = function(objective) {
            for (var i in this.arrows) {
                if (objective.type == this.arrows[i].type && objective.name == this.arrows[i].name) return;
            };

            objective.$ = this.arrowTemplate.clone()
                .appendTo(interface == "old" ? "#base" : (interface == "new" ? ".game-window-positioner" : "#oMap"))
                .click(() => mmp.heroGoTo(parseInt(objective.$[0].dataset.x), parseInt(objective.$[0].dataset.y)));

            if (interface == "old")
                objective.$highlight = this.highlightTemplate.clone().appendTo(interface == "old" ? "#ground" : "#oMap");

            objective.index = this.arrows.push(objective) -1;
            objective.remove = function() {
                self.arrows.splice(this.index, 1);
                for (var i=this.index; i<self.arrows.length; i++) {
                    self.arrows[i].index--;
                };
                this.$.remove();
                if (interface == "old") this.$highlight.remove();
            };
            this.update();
        };
        this.remove = function(objective) {
            for (var i=0; i<this.arrows.length; i++) {
                if (this.arrows[i].name == objective.name && this.arrows[i].type == objective.type) this.arrows[i].remove();
            };
        };
        this.reset = function() {
            while (this.arrows.length) {
                this.arrows[0].remove();
            };	
        };
        this.arrowTemplate = $("<div>").css({
            background: "url(https://priw8-margonem-addon.herokuapp.com/SI-addon/mmp/img/qt-arrow.png)",
            //background: "url(http://127.0.0.1:8080/SI-addon/mmp/img/qt-arrow.png)",
            width: 24,
            height: 24,
            zIndex: 250,
            position: "absolute",
            cursor: "pointer"
        });
        this.highlightTemplate = $("<div>").css({
            background: "url(/img/glow-52.png)", // Dlaczego glow-52?
              position: "absolute",
              width: 52,
              height: 24,
              zIndex: 1
        });
    })();

    this.installationCounter = new (function() {
        var self = this;
        var id = 87771;
        
        this.count = function() {
            if (interface == "superold") return;
            if (!settings.get("/counted")) {
                //extManager.toggleLike(id, 'unlike')
                $.ajax({
                    url: "/tools/addons.php?task=details&id="+id,
                    type: "POST",
                    data: {like: "unlike"}
                });
                settings.set("/counted", true);
            };
        };
        this.get = function(clb) {
            if (interface == "superold") return clb("<span tip='Niedostępne dla oldmargonem'>-</span>");
            $.ajax({
                url: "/tools/addons.php?task=details&id="+id,
                datatype: "json",
                success: function(r) {
                    clb(-r.addon.points);
                }
            });
        };
    })();

    // databases
    // for support of certain legacy scripts and location hints, this object still exists
    // and can be extended using extendHerosDB.
    var herosDB = {
        "Złodziej (parter i 1. piętro)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"33":[[51,57]]}
        },
        "Złodziej (parter i piwnica)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"33":[[47,23]]}
        },
        "Złodziej (pracownia i 2. piętro)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"33":[[57,39]]}
        },
        "Złodziej (parter)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"33":[[3,5],[31,11]],"4151":[[49,8]]}
        },
        "Złodziej (przyziemie i 1. piętro)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"33":[[41,32]]}
        },
        "Złodziej (parter, p.2, p.4, p.5)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"244":[[24,72]]}
        },
        "Złodziej (1. piętro)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"33":[[41,39]]}
        },
        "Złodziej (sala 1, sala 2, sala 3)":{
            "lvl":50,
            "ver": "pl",
            "spawns":{"244":[[60,82]]}
        },
        "Młody smok (1. piętro)": {
            "lvl": 282,
            "ver": "pl",
            "prof":"m",
            "spawns": {
                "3315": [[25,72]]
            }
        },
        "Młody smok (parter)": {
            "lvl": 282,
            "ver": "pl",
            "prof":"m",
            "spawns": {
                "3315": [[33,47]],
                "3325": [[47,70],[33,56]]
            }
        },
        "Młody smok (1. i 2. piętro)": {
            "lvl": 282,
            "ver": "pl",
            "prof":"m",
            "spawns": {
                "3315": [[53,33]]
            }
        },
        "Młody smok (sala 1)": {
            "lvl": 282,
            "ver": "pl",
            "prof":"m",
            "spawns": {
                "3325": [[11,81]]
            }
        },
        "Młody smok (przedsionek)": {
            "lvl": 282,
            "ver": "pl",
            "prof":"m",
            "spawns": {
                "3325": [[40,11]]
            }
        },
        "Młody smok (obie jaskinie)": {
            "lvl": 282,
            "ver": "pl",
            "prof":"m",
            "spawns": {
                "3326": [[60,46]]
            }
        },
    };

    var eliteDB = {
        //elity do dziennego questa w margonem.com
        "Masked Blaise": {
            lvl: -1,
            ver: "en",
            //spawns: {196:[[8,5]]} w sumie to ich na całą mapę ładuje więc bez sensu
        },
        "Cula Joshua": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Mola Nito": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Toto Acirfa": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Masked Roman": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Possessed Fissit": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Soda": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Molybdenum Matityahu": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Hummopapa": {
            lvl: -1,
            ver: "en",
            spawns: {}
        },
        "Shponder":{
            lvl: -1,
            ver:"en",
            spawns:{}
        },
        "Mobile Jeecus":{
            lvl: -1,
            ver:"en",
            spawns:{}
        }
    };

    this.getHerosDB = function() {
        return herosDB;
    };

    this.fireEvent = function() {
        const ev = new CustomEvent("miniMapPlusLoad", {detail: this});
        document.dispatchEvent(ev);
    }

    this.extendHerosDB = function(data) {
        for (const herosName in data) {
            const newData = data[herosName];
            if (newData === null || newData === false) {
                delete herosDB[herosName];
            } else if (!herosDB[herosName]) {
                if (typeof newData.lvl == "undefined")
                    newData.lvl = -1;
                
                herosDB[herosName] = newData;
            } else {
                const existingData = herosDB[herosName];
                if (typeof newData.lvl != "undefined")
                    existingData.lvl = newData.lvl;

                if (typeof newData.ver != "undefined")
                    existingData.ver = newData.ver;

                for (const mapKey in newData.spawns) {
                    const mapData = newData.spawns[mapKey];
                    if (mapData === null || mapData === false) {
                        delete existingData.spawns[mapKey];
                    } else if (typeof existingData.spawns[mapKey] == "undefined") {
                        existingData.spawns[mapKey] = mapData;
                    } else {
                        const existingMapData = existingData.spawns[mapKey];
                        // TODO: prevent duplicates
                        existingMapData.push(...mapData);
                    }
                }
            }
        }
    }

    var niceSettings = new (function(options) {
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
    onSave: this.onSettingsUpdate,
    header: "miniMapPlus",
    data: {
        "Kolory": [
            {
                key: "/colors/hero",
                name: "Twoja postać",
                type: "color"
            },
            {
                key: "/colors/other",
                name: "Inni gracze",
                type: "color"
            },
            {
                key: "/colors/friend",
                name: "Znajomi",
                type: "color"
            },
            {
                key: "/colors/enemy",
                name: "Wrogowie",
                type: "color"
            },
            {
                key: "/colors/clan",
                name: "Klanowicze",
                type: "color"
            },
            {
                key: "/colors/ally",
                name: "Sojusznicy",
                type: "color"
            },
            {
                key: "/colors/npc",
                name: "Zwykły NPC",
                type: "color"
            },
            {
                key: "/colors/mob",
                name: "Zwykły mob",
                type: "color"
            },
            {
                key: "/colors/elite",
                name: "Elita",
                type: "color"
            },
            {
                key: "/colors/elite2",
                name: "Elita II/eventowa",
                type: "color"
            },
            {
                key: "/colors/elite3",
                name: "Elita III",
                type: "color"
            },
            {
                key: "/colors/heros",
                name: "Heros",
                type: "color"
            },
            {
                key: "/colors/heros-resp",
                name: "Miejsce respu herosa",
                type: "color"
            },
            {
                key: "/colors/heros-mark",
                name: "Oznaczenie sprawdzonego respu herosa",
                type: "color",
                tip: "Po podejściu na tyle blisko do respu żeby heros został wykryty, resp na mapie zostanie oznaczony tym kolorem."
            },
            {
                key: "/colors/titan",
                name: "Tytan",
                type: "color"
            },
            {
                key: "/colors/item",
                name: "Przedmiot",
                type: "color"
            },
            {
                key: "/colors/gw",
                name: "Przejście",
                type: "color"
            },
            {
                key: "/colors/rip",
                name: "Groby",
                type: "color"
            },
            {
                key: "/colors/col",
                name: "Kolizja",
                type: "color",
                tip: "Kolizje pokazywane są tylko jeżeli jest to włączone w ustawieniach (zakładka \"inne\")."
            }
        ],
        "Warstwy": [
            {
                type: "info",
                t1: "Warstwy obiektów na mapie",
                t2: "(?)",
                tip: "Obiekty na minimapie będą sortowane według wartości wpisanych niżej. Przykładowo, obiekty z wartością 100 zawsze będą pokazywane nad tymi z 90." +
                     "<br>" +
                     "W przypadku gry 2 obiekty mają tą samą wartość, kolejność jest niezdefiniowana i będzie zależeć od kolejności ładowania." +
                     "<br>" +
                     "Starałem się dobrać domyślne wartości w miarę sensownie, ale jak komuś się nie podoba, to można zmienić :)"
            },
            {
                key: "/layers/hero",
                name: "Twoja postać",
                type: "numstring"
            },
            {
                key: "/layers/other",
                name: "Inni gracze",
                type: "numstring"
            },
            {
                key: "/layers/npc",
                name: "Zwykły NPC",
                type: "numstring"
            },
            {
                key: "/layers/mob",
                name: "Zwykły mob",
                type: "numstring"
            },
            {
                key: "/layers/elite",
                name: "Elita",
                type: "numstring"
            },
            {
                key: "/layers/elite2",
                name: "Elita II/eventowa",
                type: "numstring"
            },
            {
                key: "/layers/elite3",
                name: "Elita III",
                type: "numstring"
            },
            {
                key: "/layers/heros",
                name: "Heros",
                type: "numstring"
            },
            {
                key: "/layers/heros-resp",
                name: "Miejsce respu herosa",
                type: "numstring"
            },
            {
                key: "/layers/titan",
                name: "Tytan",
                type: "numstring"
            },
            {
                key: "/layers/item",
                name: "Przedmiot",
                type: "numstring"
            },
            {
                key: "/layers/gw",
                name: "Przejście",
                type: "numstring"
            },
            {
                key: "/layers/rip",
                name: "Groby",
                type: "numstring"
            },
            {
                key: "/layers/col",
                name: "Kolizja",
                type: "numstring",
                tip: "Kolizje pokazywane są tylko jeżeli jest to włączone w ustawieniach (zakładka \"inne\")."
            }
        ],
        "Wygląd mapy": [
            {
                key: "/mapsize",
                name: "Rozmiar mapy",
                type: "range",
                tip: "Zmiany widoczne po odświeżeniu gry",
                data: [0.6, 1.4]
            },
            {
                key: "/opacity",
                name: "Widoczność mapy",
                type: "range",
                data: [0.5, 1]
            },
            {
                key: "/darkmode",
                name: "Motyw ciemny",
                type: "check"
            },
            {
                key: "/manualDownscale",
                name: "Ręczne skalowanie obrazka mapy",
                type: "check",
                tip: "Domyślnie włączone dla przeglądarek opartych o Chromium - skalowanie background-image wygląda na nich brzydko, ta opcja pozwala na włączenie ręcznego skalowania przez rysowanie obrazka mapy na elemencie canvas.",
            }
        ],
        "Tracking": [
            {
                type: "info",
                t1: "Co to jest?",
                t2: "",
                tip: "Tracking (tropienie) to alternatywna opcja wyszukiwania NPC/itemów na mapie. Polega na tym, że gdy na mapie pojawi się coś z poniższej listy, w oknie gry ukaże się strzałka, która będzie wzkazywała drogę do tej rzeczy.<br>Dodatkowo gdy na mapie pojawia się heros, automatycznie uruchamia się tracking na niego, co jest przydatne np. w podchodzeniu do herosów eventowych.<br>Wielkość liter w nazwie NPC/przedmiotu nie ma znaczenia."
            },
            {
                key: "/trackedNpcs",
                name: "Tracking NPC",
                type: "list"
            },
            {
                key: "/trackedItems",
                name: "Tracking itemów",
                type: "list"
            }

        ],
        "Inne": [
            {
                key: "/minlvl",
                name: "Min. lvl potworków",
                type: "numstring"
            },
            {
                key: "/maxlvl",
                name: "Max. przewaga",
                tip: "Maksymalna różnica poziomów między Tobą a potworkiem przy której nie niszczy się loot na świecie na którym grasz. Jeśli nie wiesz co to, zostaw 13.",
                type: "numstring"
            },
            {
                key: "/show",
                name: "Hotkey",
                type: "char"
            },
            {
                key: "/altmobilebtt",
                name: "Przesuń przycisk mobilny",
                type: "check",
                tip: "Przesuwa przycisk widoczny na urządzeniach mobilnych pomiędzy torby"
            },
            {
                key: "/forceMobileMode",
                name: "Wymuś przycisk mobilny",
                type: "check",
                tip: "Pokazuje przycisk mobilny nawet, jeśli nie jest się na odpowiednim urządzeniu"
            },
            {
                key: "/interpolerate",
                name: "Animacje na mapie",
                type: "check"
            },
            {
                key: "/showqm",
                name: "Zaznaczaj questy",
                type: "check"
            },
            {
                key: "/novisibility",
                name: "Nie pokazuj \"mgły wojny\"",
                type: "check",
                tip: "Wyłącza pokazywanie widzianego obszaru na czerwonych mapach.<br>Nie pozdrawiam klanu Game Over (Jaruna), który utrudniał testowanie tej funkcjonalności dedając mnie bez powodu."
            },
            {
                key: "/showcol",
                name: "Pokazuj kolizje",
                type: "check",
                tip: "Zmiany widoczne są po odświeżeniu gry"
            },
            {
                key: "/showcoords",
                name: "Pokazuj pozycję kursora",
                type: "check",
            },
            /*,
            {
                key: "/showevonetwork",
                name: "Pokazuj postacie z WSync",
                tip: "World Sync to dodatek stworzony przez CcarderRa, który pozwala widzieć graczy z innych światów. Jest częścią Evolution Managera, którego można znaleźć na forum w dziale Dodatki do gry.",
                type: "check"
            }*/
        ],
        "Pomoc": [
            {
                type: "info",
                t1: "Instrukcja wyszukiwarki",
                t2: "[otwórz]",
                alert: 
`
<b>Instrukcja wyszukiwarki miniMap+</b><br>
<div style="height: 400px; overflow: auto;">
Podstawową funkcją wyszukiwarki jest szukanie po nazwie. Robi się to po prostu wpisując to, co chce się wyszukać w pole "szukaj".
Obiekty, które nie mają w nazwie wpisanego tekstu zostaną ukryte (oprócz gracza). Wielkość liter nie ma znaczenia.
<br><br>
<b>Podświetlanie koordynatów</b><br>
Wpisanie koordynatów w formacie <i>x,y</i> w pole szukania wyświetli je na mapie. Jest to o tyle fajne, że można bezpośrednio wkleić listę respów z forum i powinna działać.
<br><br>
<b>Zaawansowane szukanie</b><br>
Istnieje również możliwość bardziej zaawansowanego filtrowania obiektów.
Przykładowo, wpisanie:
<br><i>[lvl < 70]</i><br>
pokaże tylko te obiekty, których poziom jest mniejszy od 70.
Takich filtrów można umieścić kilka, poniższy:<br>
<i>[lvl <= 110] [lvl >= 70] [typ=gracz]</i><br>
wyświetli tylko graczy od poziomu 70 do 110 włącznie. Dostępne są następujące porównania:<br>
- < - dana wartość numeryczna obiektu musi być mniejsza od podanej wartości.<br>
- > - dana wartość numeryczna obiektu musi być większa od podanej wartości.<br>
- <= - dana wartość numeryczna obiektu musi być mniejsza lub równa podanej wartości.<br>
- >= - dana wartość numeryczna obiektu musi być większa lub równa podanej wartości.<br>
- = - dana wartość tekstowa lub numeryczna obiektu musi zawierać podaną wartość (wielkość liter nie ma znaczenia).<br>
- == - dana wartość tekstowa lub numeryczna obiektu musi być taka, jak podana wartość (wielkość liter nie ma znaczenia).<br>
Dodatkowo, wpisanie <i>[lvl]</i> wyświetli tylko te obiekty, które w ogóle posiadają poziom.<br>
Co do wartości, które można filtrować: dostępne są następujące:<br>
- <i>lvl</i> - wartość numeryczna, poziom potwora lub gracza.<br>
- <i>typ</i> - wartość tekstowa, zależna od typu obiektu. Może to być: kolizja, resp, grób, przedmiot, gracz, przejście, potwór: tytan, potwór: heros, potwór: elita 2, potwór: elita 3, potwór: elita, potwór: zwykły, npc<br>
- <i>klan</i> - wartość tekstowa, klan, do którego należy gracz.<br>
- <i>quest</i> - wartość logiczna (można sprawdzić tylko przez <i>[quest]</i>), ustawiona jeżeli u danego NPC dostępny jest quest.<br>
- <i>grp</i> - wartość logiczna (można sprawdzić tylko przez <i>[grp]</i>), ustawiona jeżeli dany NPC posiada grupę.
</div>
`
            }
        ],
        "Informacje": [
            {
                type: "info",
                t1: "Wersja",
                t2: "v"+this.version+(interface == "new" ? " NI" : (interface == "old" ? " SI" : " OM")),
                tip: "Kliknij aby pokazać zmiany w tej wersji",
                alert: mmp.updateString
            },
            {
                type: "info",
                t1: "Źródło instalacji",
                t2: this.getInstallSource()
            },
            {
                type: "info-async",
                t1: "Licznik instalacji",
                placeholder: "wczytywanie...",
                tip: "Liczy od wersji 3.1 minimapy",
                fun: this.installationCounter.get
            }
        ]
    }
});
    this.init();
    niceSettings.init();
    this.fireEvent();
})();
