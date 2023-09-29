// thp: titanhelperplus, dodatek pokazujący przydatne informacje o stanie postaci w walkach

// @ts-nocheck
/*
    TODO: osłona nadpisuje szadź
    TODO: lastheal bugs
    27213=95;161396=77;+swing;+oth_dmg=877, ,nijon(83%);legbon_lastheal=4720,Lady na tanku(58%);+oth_dmg=1003, ,Lady na tanku(58%);+oth_dmg=637, ,Kropky(92%);+dmg=1471;+acdmg=125;-endest=5,1;-dmg=1001"

    ** Titan Helper Plus by Priw8 **
    ** special edition **

    v 2.6a beta
    Zmiany:
    - pokazywanie jadowitego podmuchu
    - pokazywanie punktów kombiacji innych graczy
    - poprawki w liczeniu tur
    - naprawione pokazywanie użycia atmo
    - poprawki w wytrąceniu
    - dodany legbon_cleanse
    - dodany tenacity

    v 2.5a
    Zmiany:
    - pokazywanie wartości umek działających na gracza oprócz czasu trwania
    - zaśpiewy (te śmieszne itemki PvE) teraz ustawiają lenMin i lenMax na 10 bo znikały za szybko
    - poprawne pokazywanie ac.bonus, act.bonus, resfire.bonus i resfrost.bonus
    - pokazywanie ilości leków poj/grp w tipie postaci
    - pokazywanie profesji i lvla w kolejce tur na SI
    - pokazywanie wykorzystania OR

    v 2.4a
    Zmiany:
    - pokazywanie aktualnego pancerza/odpo jak silnik to wysle, jak nie to zniszczone tak jak bylo w poprzedniej wersji
    - naprawienie tipów w wersji NI 

    v 2.3b
    Zmiany: 
    - naprawiono pokazywanie piętna bestii (-spell-taken_dmg -> spell-taken_dmg)

    v 2.3a
    Zmiany:
    - dodano pokazywanie kolejki tur na SI
    - przesunięto titan helpera na NI

    v 2.2a
    Zmiany:
    - dodanie legbon_holytouch_heal do listy logów, których nie powinno liczyć jako turę
    - ujednolicenie errorów

    v 2.1a
    Zmiany:
    - liczenie nowego błogosławieństwa mieczy (aura-adddmg2_per-meele)
    - pokazywanie umek typu wyzyw

    v 2.0b
    Zmiany:
    - dodatek napisany od nowa, posiada wszystkie stare funkcje
    - pełne wsparcie dla obu interfejsów oraz angielskiej wersji gry
    - poprawne naliczanie tur przy ogłuszeniu
    - pokazywanie efektów umków w tipach postaci (wartości dla konkretnej postaci)
    - pokazywanie stunów, klątwy, oślepienia, ładowania ataku spec. w tipach postacci
    - liczenie znacznie większej ilości umków:
        - aura SA
        - szadź/wszystko co ma allslow_per
        - piętno bestii
        - antidotum
        - dziki zapał
        - tarcza słońca
        - porażająca tarcza
        - błogosławieństwo mieczy
        - aura ochrony
        - krytyczna potęga
        - śmiedzący pocisk
        - klątwa (ta umka u maga)
        - magiczna bariera
        - wewnętrzny spokój
        - emanująca strzała
        - śmierdzący ładunek
        - spaczenie
        - osłona tarczą
        - krwiożerczy szał
        - uderzenie zza tarczy
        - kamienna skóra
        - okrzyk bojowy
        - krytyczny szał
        - zamroczenie
        - krytyczne przyspieszenie
    - pokazywanie dotyku anioła
*/

!function() {
    const VER = "2.5";
    const UPDATE = {
        "main": "Wersja 2.5a, 2021.02.23. W przypadku występowania jakichś błędów, prosiłbym o zgłoszenie ich w <a href='https://www.margonem.pl/?task=forum&show=posts&id=488564&ps=0' target='_blank'>temacie na forum</a>.",
        "log": [
            "SI: kolejka tur zawiera info o profesji i poziomie",
            "wartości działających umek są teraz pokazywanme oprócz czasu trwania, przykładowo pokaże 1|1 (12|12) przy rzuceniu dwóch aur SA 12% w tej samej turze.",
            "poprawne pokazywanie bonusów pancerza/odporności (ac.bonus, act.bonus, resfire.bonus, resfrost.bonus i reslight.bonus)",
            "niektóre zaśpiewy (itemki PvE) mają teraz przypisane konkretne czasy trwania, więc będzie je pokazywało poprawnie",
            "pokazywanie w tipie postaci ile razy został użyty lek poj i lek grp",
            "pokazywanie w tipie postaci informacji o wykorzystanym ostatnim ratunku",
        ]
    }

    const CSS = `

.priw-thp-display {
    z-index: 380;
    position: absolute;
    font-family: monospace;
    font-size: 11px;
    color: #efefef;
    pointer-events: none;
}
.priw-thp-display.new {
    top: 50px;
}

.priw-thp-display-list {
    float: left;
    background: rgba(0,0,0,0.7);
    pointer-events: all;
}

.priw-thp-warrior-turns {
    float: left;
    width: 32px;
    pointer-events: all;
}

.priw-thp-warrior-turns-list {
    max-height: 96px;
    overflow: hidden;
}
.expand .priw-thp-warrior-turns-list {
    max-height: unset;
}

.priw-thp-warriors-list-btt {
    width: 32px;
    height: 24px;
    background: rgba(50, 50, 50, 0.7);
    color: white;
    cursor: pointer;
    line-height: 24px;
    text-align: center;
    font-size: 21px;
}

.priw-thp-warrior-turns-warrior {
    box-sizing: border-box;
    border-right: 1px solid #403838;
    border-bottom: 1px solid #403838;
    width: 32px;
    height: 32px;
}

.priw-thp-warrior-turns-warrior div {
    width: 100%;
    height: 100%;
}

.priw-thp-warrior-turns-warrior.hero {
    background: rgba(0, 128, 0, 0.7);
}
.priw-thp-warrior-turns-warrior.ally {
    background: rgba(0, 0, 128, 0.7);
}
.priw-thp-warrior-turns-warrior.enemy {
    background: rgba(128, 0, 0, 0.7);
}

.priw-thp-display.alt-display {
    position: initial;
}

.priw-thp-display-element {
    padding: 2px;
}

titanHelperPlus {
    display: inline-block;
    width: 100%;
    margin-top: 5px;
    text-align: center;
}
titanHelperPlus .combo-wrapper .combo-point {
    float: unset;
}

.priw-thp-update-header {
    text-align: center;
}

.priw-thp-update-list {
    text-align: left;
    margin-left: 6px;
}
.priw-thp-update-list.new {
    margin-left: 12px;
}
.priw-thp-update-list span::before {
    content: "\\2022\\00a0";
    margin-left: -10px;
}
.priw-thp-update-list.new span::before {
    margin-left: -7px;
}

    `;
    const BUFF_NAMES = {
        // team buffs
        "aura-sa_per": "Aura SA",
        // "perdmg-blesswords": "Błogosław. mieczy",
        "aura-adddmg2_per-meele": "Błogosław. mieczy",
        "aura-ac_per": "Aura ochrony fiz.",
        "aura-resall": "Aura ochrony mag.",
        "critmval-allies": "Siła kryt. mag.",
        "critval-allies": "Siła kryt. fiz.",

        // team debuffs
        "allslow_per": "Spowolnienie",
        "alllowdmg": "Emanująca strzała",
        "critmval-enemies": "Siła kryt. mag. wrogów",
        "critval-enemies": "Siła kryt. fiz. wrogów",
        "lowheal_per-enemies": "Jadowity podmuch",

        // single buffs
        "antidote": "Odp. na truciznę",
        "resfire_per": "Odp. na ogień",
        "resfrost_per": "Odp. na zimno",
        "reslight_per": "Odp. na błyskawice",
        "self-aura-sa": "Dziki zapał",
        "sunshield_per": "Tarcza słońca",
        "lightshield": "Porażajka/mag. bariera",
        "mcurse": "Możliwość klątwy z umki",
        "immunity_to_dmg": "Nieśmiertelność",
        "shield_buff": "Osłona tarczą",
        "rage": "Krwiożerczy szał",
        "w_attbuff": "Uderz. zza tarczy (+atak)",
        "rampage": "Krwawa szarża",
        "achpp_per": "Wzmoc. pancerza",
        "ooga_booga": "Okrzyk bojowy",
        "b_vamp_time_per": "Amok",

        // onhit selfbuffs
        "+legbon_holytouch": "Dotyk anioła",
        "+critsa_per": "Kryt. przyspiesz.",

        // single debuffs
        "spell-taken_dmg": "Zwiększ. otrzym. obrażeń",
        "stinkbomb": "Smierdzący pocisk",
        "-spell-distortion": "Spaczenie",
        "energyout": "Zamroczenie"
    };
    const BUFFS = {
        "_color": "lime",
        "aura-sa_per": {
            lenMin: 6,
            lenMax: 8
        },
        /*"perdmg-blesswords": {
            lenMin: 5,
            lenMax: 5
        },*/
        "aura-adddmg2_per-meele": {
            lenMin: 5,
            lenMax: 5
        },
        "aura-ac_per": {
            getLenMin: (msgs) => {
                if (msgs.tcustom === "Werble ochronne")
                    return 10;
                
                return 6;
            },
            getLenMax: (msgs) => {
                if (msgs.tcustom === "Werble ochronne")
                    return 10;
                
                return 6;
            }
        },
        "aura-resall": {
            getLenMin: (msgs) => {
                if (msgs.tcustom === "Werble ochronne")
                    return 10;
                
                return 6;
            },
            getLenMax: (msgs) => {
                if (msgs.tcustom === "Werble ochronne")
                    return 10;
                
                return 6;
            }
        },
        "critmval-allies": {
            getLenMin: (msgs) => {
                if (msgs.tcustom === "Diabelskie struny")
                    return 10;
                
                return 7;
            },
            getLenMax: (msgs) => {
                if (msgs.tcustom === "Diabelskie struny")
                    return 10;
                
                return 7;
            }
        },
        "critval-allies": {
            getLenMin: (msgs) => {
                if (msgs.tcustom === "Diabelskie struny")
                    return 10;
                
                return 7;
            },
            getLenMax: (msgs) => {
                if (msgs.tcustom === "Diabelskie struny")
                    return 10;
                
                return 7;
            }
        }
    };
    const SINGLE_BUFFS = {
        "_color": "lime",
        "antidote": {
            lenMin: 5, // hunter's skill
            lenMax: 7 // mage's skill
        },
        "resfire_per": {
            lenMin: 7,
            lenMax: 7
        },
        "resfrost_per": {
            lenMin: 7,
            lenMax: 7
        },
        "reslight_per": {
            lenMin: 7,
            lenMax: 7
        },
        "self-aura-sa": {
            lenMin: 7,
            lenMax: 7
        },
        "sunshield_per": {
            lenMin: 5,
            lenMax: 5
        },
        "lightshield": {
            lenMin: 7,
            lenMax: 7
        },
        "mcurse": {
            lenMin: 7,
            lenMax: 7
        },
        "immunity_to_dmg": {
            lenMin: 2,
            lenMax: 2
        },
        "shield_buff": {
            lenMin: 1,
            lenMax: 1
        },
        "rage": {
            lenMin: 5, // healing is 5 turns
            lenMax: 6 // redstun is 6 turns
        },
        "w_attbuff": {
            lenMin: 3,
            lenMax: 3
        },
        "rampage": {
            lenMin: 6,
            lenMax: 15
        },
        "achpp_per": {
            lenMin: 7,
            lenMax: 7
        },
        "ooga_booga": {
            lenMin: 7,
            lenMax: 7
        },
        "b_vamp_time_per": {
            lenMin: 5,
            lenMax: 5
        }
    };
    const ONHIT_SELFBUFFS = {
        "_color": "lime",
        "+legbon_holytouch": {
            lenMin: 3,
            lenMax: 3,
            nostack: true
        },
        "+critsa_per": {
            lenMin: 3,
            lenMax: 3,
            nostack: true
        }
    };
    const DEBUFFS = {
        "_color": "#ff8383",
        "allslow_per": {
            lenMin: 6,
            lenMax: 8
        },
        "alllowdmg": {
            lenMin: 5,
            lenMax: 5
        },
        "critmval-enemies": {
            lenMin: 7,
            lenMax: 7,
            // overrideColor: "lime"
        },
        "critval-enemies": {
            lenMin: 7,
            lenMax: 7,
            // overrideColor: "lime"	
        },
        "lowheal_per-enemies": {
            lenMin: 5,
            lenMax: 5,
        },
    };
    const SINGLE_DEBUFFS = {
        "_color": "#ff8383",
        "spell-taken_dmg": {
            lenMin: 4,
            lenMax: 4
        },
        "stinkbomb": {
            lenMin: 7,
            lenMax: 7
        },
        "-spell-distortion": {
            lenMin: 1,
            lenMax: 1
        },
        "energyout": {
            lenMin: 4,
            lenMax: 4
        }
    };
    const SINGLE_BUFFS_FROM_TSPELL = { // some buffs can only be read directly from tspell name
        "Dziki zapał": "self-aura-sa",
        "Fluid Motions": "self-aura-sa",

        "Klątwa": "mcurse",
        "Curse": "mcurse",

        "Wewnętrzny spokój": "immunity_to_dmg",
        "Inner Calm": "immunity_to_dmg",

        "Osłona tarczą": "shield_buff",
        "Świetlista osłona": "shield_buff",
        "Shield Master": "shield_buff", // someone made both warrior's and paladin's skills have the same name in .com

        "Krwiożerczy szał": "rage",
        "Tactical Hit": "rage", // yes, that's how it's actually called

        "Uderzenie zza tarczy": "w_attbuff",
        "Wide Swing": "w_attbuff", // I feel like nobody cares about updating spell names there...

        "Krwawa szarża": "rampage",
        "Onslaught": "rampage",

        "Okrzyk bojowy": "ooga_booga",
        "Rage": "ooga_booga", // epic translations

        "Amok": "b_vamp_time_per" // actually has the same name on .com
    };

    const ACTIVE_SKILL_COMBO_ADD = [
        "Niszczycielski cios", "Błyskawiczny atak", // w
        "Pchnięcie mrozu", "Gorące uderzenie", "Porażający cios", "Rozpraszający cios", // p
        "Kula ognia", "Lodowy pocisk", "Porażenie", "Duszący pocisk", // m
        "Trujące pchnięcie", "Błyskawiczny cios", "Rozpraszający okrzyk", "Zadziorny atak", // b
        "Lodowa strzała", "Płonąca strzała", "Porażająca strzała", "Gwałtowny strzał", // t
        "Zatruta strzała", // h
    ]
    const ACTIVE_SKILL_COMBO_RESET = [
        "Ogłuszający cios", "Uderzenie zza tarczy", // w
        "Gniew bogów", "Uderzenie tarczą", // p
        "Fuzja żywiołów", // m
        "Podstępne uderzenie", "Rozjuszenie", // b
        "Strzała z niespodzianką", "Wycieńczająca strzała", // t
        "Błyskawiczny strzał", "Wyniszczające rany", // h
    ]
    const PASSIVE_OFFENSIVE_SKILL_COMBO_ADD = {
        "w": [],
        "p": [],
        "m": [],
        "b": [],
        "t": [],
        "h": ["+pierce", "+wound"]
    }
    const PASSIVE_DEFENSIVE_SKILL_COMBO_ADD = {
        "w": [],
        "p": ["-blok"],
        "m": [],
        "b": [],
        "t": [],
        "h": []
    }

    const WARRIOR_IGNORE = ["img", "resize", "$"]; // ignore these keys when cloning a warrior object, as they are 1. not needed, 2. circular
    const DBL_TURN_SKILLS = ["Podwójny strzał", "Podwójne trafienie"];
    const INTERFACE = (typeof API != "undefined" && typeof Engine != "undefined" && typeof margoStorage == "undefined") ? "new" : "old";
    const LANG = window._l();
    const TIP = INTERFACE == "old" ? "tip" : "data-tip"; // property of html elements that contains the tip
    const DISP_TPL = {
        "turns": {
            txt: "Wykonane tury: {n}/{max}",
            tip : "Tyle osób zrobiło turę, od kiedy Ty ją ostatnio miałeś/aś."
        },
        "prepare": {
            txt: "Spec: {tspell}",
            tip : "Ładowany przez przeciwnika cios specjalny."
        },
        "buff": {
            txt: "{buff}",
            tip: "Już tyle tur jest w działaniu {name}."
        }
    };
    const ELEMENTS = ["F", "C", "L"]; // fire, cold, lightning
    const NL = "<br>";
    const TIP_REGEX = (/<titanHelperPlus>([\s\S]*?)<\/titanHelperPlus>/g);

    const STUN_REGEX = LANG == "pl" ? (/(.*?) - utrata tury \(redukcja ogłuszenia (.*?)%\)/) : (/(.*?) - lost a turn \(stun reduction (.*?)%\)/);
    const TURN_LOST = LANG == "pl" ? "utrata tury" : "lost a turn";
    const REDSTUN = LANG == "pl" ? "redukcja ogłuszenia" : "stun reduction";
    const DISTRACT = LANG == "pl" ? "wytrącenie z równowagi" : "daze"; // TODO: verify the string for lang=en

    const POWERSTUNS = ["", "-f", "-c", "-l", "-d"]; // postfixes of "stun2"
    const STUNS = ["stun", "freeze"];
    /** @type {Warrior[]} */
    let warriors = [];
    let myTeam, $display, $displayElementTemplate, displays, globalBuffs, antiFastFight;
    let ongoingBattle = false;
    let Storage = INTERFACE == "old" ? window.margoStorage : window.API.Storage;

    function error(txt) {
        window.log(`<span style='color:yellow'><strong>Titan Helper+</strong> - ${txt}</span>. Zgłoś błąd w <a style='color: lightgreen' href='https://www.margonem.pl/?task=forum&show=posts&id=488564' target='_blank'>tym temacie</a>.`, 1);
    }

    function setTip($el, txt) {
        if (INTERFACE == "new") {
            $($el).tip(txt);
        } else {
            $el.setAttribute("tip", txt);
        }
    }

    function getTip($el) {
        if (INTERFACE == "new") {
            return $($el).getTipData();
        } else {
            return $el.getAttribute("tip");
        }
    }

    function init() {
        initDataParsing();
        initAntiFastfight();
        initCss();
        initNews();
        initDisplay();
        fightReset();
        if (INTERFACE == "new") initNI();
        // window._thpTest = () => antiFastFight;
        window._thpFight = onFight;
    };

    function initNI() {
        let API = window.API.priw;
        API.settings.add({
            txt: LANG == "pl" ? "Pokazuj TitanHelperPlus'a pod torbami" : "Show the TitanHelperPlus addon in the area under the bags",
            id: "priw-thp-alt-display-type",
            default: false
        });
        API.emmiter.on("toggle-addon-priw-thp-alt-display-type", () => message(LANG == "pl" ? "Zmiany będą widoczne po odświeżeniu gry" : "Changes will come into effect once the game has been reloaded"));
    };

    function initNews() {
        if (INTERFACE == "old") {
            window.g.loadQueue.push({
                fun: showNews
            });
        } else {
            window.API.priw.emmiter.on("interface-load", showNews);
        };
    };

    function showNews() {
        let prevVer = Storage.get("titanHelperPlus/lastver");
        if (prevVer == null || prevVer < VER) {
            Storage.set("titanHelperPlus/lastver", VER);
            let txt = generateUpdateMessageContent();
            if (INTERFACE == "old") window.mAlert(txt, null);
            else new window.API.priw.Window({
                "txt": txt, 
                "header":"TitanHelper+",
                "css": {
                    "max-width": "450px"
                }
            });
        };
    };

    function generateUpdateMessageContent() {
        let html = "<h3 class='priw-thp-update-header'>TitanHelper+ - aktualizacja v"+VER+"</h3>"+NL+"<hr>"+NL;
        html += UPDATE.main + NL + NL;
        html += "<div class='priw-thp-update-list "+INTERFACE+"'>";
        html += "<b>Zmiany:</b>";
        for (let i=0; i<UPDATE.log.length; i++) {
            html += NL + "<span>" + UPDATE.log[i] + "</span>";
        };
        html += "</div>";
        return html;
    };

    function initAntiFastfight() {
        let __g = window._g;
        window._g = function(query, arg2) {
            if (ongoingBattle && query == "fight&a=f" && antiFastFight) {
                antiFastFightAsk();
            } else return __g.apply(this, arguments);
        };
    };

    function antiFastFightAsk() {
        let yesClb = function() {
            antiFastFight = false;
            window._g("fight&a=f");
            return true;
        };
        let noClb = function() {
            if (INTERFACE == "old") {
                g.battle.nobut = false;
                window.$("#autobattleButton").stop().fadeIn();
            } else {
                document.querySelector(".auto-fight-btn").style.display = "block";
            };
            return true;
        };
        if (INTERFACE == "old") mAlert("Czy na pewno chcesz dać F?", 2, [yesClb, noClb]);
        else mAlert("Czy na pewno chcesz dać F?", [
            {
                "txt": "Na pewno",
                "callback": yesClb
            },
            {
                "txt": "Nieeeee",
                "callback": noClb
            }
        ]);
    };

    function initCss() {
        let $style = document.createElement("style");
        $style.innerHTML = CSS;
        document.head.appendChild($style);
    };

    function initDisplay() {
        $display = createDisplay();
        if (INTERFACE == "old") {
            let $parent = document.querySelector("#centerbox2");
            $parent.appendChild($display);
        } else initDisplayNI($display);

        $displayElementTemplate = document.createElement("div");
        $displayElementTemplate.classList.add("priw-thp-display-element");
    };

    function initDisplayNI($display) {
        let API = window.API.priw;
        if (API.settings.get("priw-thp-alt-display-type")) {
            $display.classList.add("alt-display");
            API.addonDisplay.add({
                element: $display,
                name: "TitanHelper+",
                id: "priw-thp",
                icon: "http://addons2.margonem.pl/uploaded/71/71328.png",
                noForcedWndHeight: true
            });
        } else {
            API.emmiter.once("f", () => {
                let $parent = document.querySelector(":not([data-template]) > .battle-area");
                $parent.appendChild($display);
            });
        };
    };

    function toggleWarriorList() {
        const $el = $display.querySelector(".priw-thp-warrior-turns");
        $el.classList.toggle("expand");
        Storage.set("titanHelperPlus/expandWarriorList", $el.classList.contains("expand"));
    }

    function createDisplay() {
        const $display = document.createElement("div");
        $display.classList.add("priw-thp-display", INTERFACE);

        const $warriors = document.createElement("div");
        $warriors.classList.add("priw-thp-warrior-turns");
        if (Storage.get("titanHelperPlus/expandWarriorList"))
            $warriors.classList.add("expand");
        
        const $warriorList = document.createElement("div");
        $warriorList.classList.add("priw-thp-warrior-turns-list");
        const $warriorBtt = document.createElement("div");
        $warriorBtt.classList.add("priw-thp-warriors-list-btt");
        $warriorBtt.addEventListener("click", toggleWarriorList);
        $warriorBtt.innerHTML = "&#9660;";
        $warriorBtt.setAttribute(TIP, "Kliknij, aby zwiększyć/zmiejszyć listę");

        $warriors.appendChild($warriorList);
        $warriors.appendChild($warriorBtt);

        const $list = document.createElement("div");
        $list.classList.add("priw-thp-display-list");
        
        $display.appendChild($warriors);
        $display.appendChild($list);

        return $display;
    };

    function initDataParsing() {
        if (INTERFACE == "old") {
            let _pI = window.parseInput;
            window.parseInput = function(data) {
                let ret = _pI.apply(this, arguments);
                parseData(data);
                return ret;
            };
        } else {
            window.API.priw.emmiter.on("game-response", parseData);
        };
    };

    function parseData(data) {
        if (data.f) onFight(data.f);
    };

    function heroId() {
        return INTERFACE == "old" ? window.hero.id : window.Engine.hero.d.id;
    };

    function onFight(f) {
        if (f.close) {
            fightReset();
            return;
        }
        if (f.init) fightInit(f);
        if (f.m) fightParseMessage(f.m);
        if (f.w && !f.init) fightUpdateWarriors(f);
        if (f.m) {
            fightUpdateGlobalBuffs(1);
            fightUpdateGlobalBuffs(2);
        };
        if (f.turns_warriors) fightWarriorTurns(f.turns_warriors);
        if (f.init) fightTipInit();
    };
    
    function fightWarriorTurns(warriorTurns) {
        let html = "";
        for (let ind in warriorTurns) {
            const id = warriorTurns[ind];
            const warrior = warriors[id];
            html += `<div class="warrior-${id} priw-thp-warrior-turns-warrior ${id == heroId() ? "hero" : (warrior.d.team == myTeam ? "ally" : "enemy")}">`;
                html += `<div style="background: url(${warrior.d.icon}); background-size: ${id >= 0 ? "400" : "100"}%; background-repeat: no-repeat;"></div>`;
            html += `</div>`;
        }
        $display.querySelector(".priw-thp-warrior-turns-list").innerHTML = html;
        for (let ind in warriorTurns) {
            const id = warriorTurns[ind];
            for (const $el of $display.querySelectorAll(`.priw-thp-warrior-turns-list .warrior-${id}`)) {
                setTip($el, getTip(warriors[id].$));
                $el.setAttribute("ctip", warriors[id].$.getAttribute("ctip"));
            }
        }
    }

    function fightReset() {
        for (let id in displays) {
            displays[id].delete();
        };
        displays = {};
        warriors = {};
        globalBuffs = [
            null,
            [],
            []
        ];
        ongoingBattle = false;
        $display.querySelector(".priw-thp-warrior-turns").style.display = "none";
    };

    function fightInit(f) {
        fightReset();
        let myId = heroId();
        for (let id in f.w) {
            let warrior = f.w[id];
            if (id == myId) myTeam = warrior.team;
            warriors[id] = new Warrior(warrior);
        };
        let max = getOthersAliveInTeam(myTeam, myId).length;
        updateTurnDisplay(0, max);
        antiFastFight = determineAntiFastfightState();
        // antiFastFight = true;
        ongoingBattle = true;
        if (INTERFACE == "old")
            $display.querySelector(".priw-thp-warrior-turns").style.display = "block";
    };

    function determineAntiFastfightState() {
        let myWarriors = selectWarriors([
            {
                "key": "team",
                "type": "==",
                "cmp": myTeam
            }
        ]);
        let enemyWarriors = selectWarriors([
            {
                "key": "team",
                "type": "!=",
                "cmp": myTeam
            }
        ]);

        let isGroupPvp = enemyWarriors[0].id >= 0 && myWarriors.length > 1 && enemyWarriors.length > 1; // mobs have id < 0
        let playerHasParty = myWarriors.length > 1;
        let isTitanBattle = determineTitanBattle(enemyWarriors[0]);

        return (isGroupPvp || (playerHasParty && isTitanBattle));
    };

    function determineTitanBattle(warrior) {
        // check by entity name, because colossi have different NPC ids and warrior ids (instances are weird)
        let npcList = INTERFACE == "old" ? window.g.npc : window.Engine.npcs.check();
        for (let id in npcList) {
            let npc = INTERFACE == "old" ? npcList[id] : npcList[id].d;
            if (npc.nick == warrior.d.nick && npc.d.wt >= 100) return true; 
        };
        return false;
    };

    function fightTipInit() {
        for (let id in warriors) warriors[id].updateTip();
    };

    function fightUpdateWarriors(f) {
        for (let id in f.w) {
            let warrior = warriors[id];
            warrior.update(f.w[id]);
        };
    };

    function fightParseMessage(msgs) {
        for (let i=0; i<msgs.length; i++) {
            let msg = parseOneMessage(msgs[i]);
            interpretOneMessage(msg);
        };
    };

    function parseOneMessage(query) {
        let spl = query.split(";");
        let msgs = {};
        let len = 0;
        let attacker = false;
        let team = false;
        let target = false;
        for (let i=0; i<spl.length; i++) {
            let msg = spl[i].split("=");
            if (!isNaN(msg[0]) && msg[0] != 0) {
                //msg[0] to indentyfikator gracza
                if (i == 0) {
                    attacker = msg[0];
                    team = warriors[attacker].d.team;
                } else {
                    target = msg[0];
                };
            };
            msgs[msg[0]] = typeof msg[1] == "undefined" ? true : msg[1];
            if (isNaN(msg[0])) {
                len++; //nie liczy identyfikatorów graczy/potworów
            };
        };

        // TODO: detect turn on weird tspells (when a titan uses a tspell and len == 1, it will require making a list of such tspells because there's no other way of detecting it)
        // faktyczna tura jest jeśli w wiadomości nie występują rzeczy typu "xx obrażeń z trucizny" (nazywam to status log), LUB występuje tspell i nie jest to jedyna rzecz (u gracza/potwora), LUB zrobiony jest krok do przodu, LUB ładowany jest spec
        // TODO NEXT MAJOR GAME UPDATE: tspell comes with spellId, so for players "neutral length" is 2. Also, how to handle truedamage in tspell + hit on the same turn?
        let isTurn = (msgIsNotStatusLog(msgs) || (msgs.tspell && len > 1) || msgs.step || msgs.prepare); 
        
        return {msgs: msgs, length: len, attacker: attacker, target: target, team: team, isTurn: isTurn};
    };

    function getBuffLenMin(buf, msg) {
        if (typeof buf.lenMin != "undefined")
            return buf.lenMin;
        else if (typeof buf.getLenMin != "undefined")
            return buf.getLenMin(msg);
        else {
            error("bad buff data: " + JSON.stringify(buf));
            return 0;
        }
    }

    function getBuffLenMax(buf, msg) {
        if (typeof buf.lenMax != "undefined")
            return buf.lenMax;
        else if (typeof buf.getLenMax != "undefined")
            return buf.getLenMax(msg);
        else {
            error("bad buff data: " + JSON.stringify(buf));
            return 0;
        }
    }

    function interpretOneMessage(data) {
        let msgs = data.msgs;
        let attacker = data.attacker ? warriors[data.attacker] : null;
        let target = data.target ? warriors[data.target] : null;
        let turns = 1;

        const tenacity = msgs["-tenacity"];

        if (attacker && data.isTurn) attacker.turn(turns);

        if (msgs.txt) interpretMsgTxt(msgs.txt);

        if (msgs.tspell) attacker.setLastTSpell(msgs.tspell);

        if (msgs["-contra"]) target.nextTurnIsCounter();

        if (msgs.prepare) attacker.prepareTSpell(msgs.prepare);
        if (attacker?.prepare && !msgs.prepare && data.isTurn) attacker.stopPrepareTSpell();
        if (msgs["+dispel"]) target.stopPrepareTSpell();

        if ((msgs["+legbon_curse"] || msgs["+mcurse"]) && !tenacity) target.toggleCurse(true);

        if (msgs["-legbon_glare"] && !tenacity) attacker.toggleGlare(true);

        if (msgs["legbon_lastheal"]) target.lastHeal();

        if (msgs["+distract"] && !msgs["-evade"] && !tenacity) target.addDistract();

        if (!tenacity) {
            for (let i=0; i<STUNS.length; i++) {
                let stun = "+" + STUNS[i];
                if (msgs[stun]) target.applyStun(1);
            };

            for (let i=0; i<POWERSTUNS.length; i++) {
                let stun = "+stun2" + POWERSTUNS[i];
                if (msgs[stun]) target.applyStun(2);
            };
        }

        if (msgs["-legbon_cleanse"]) {
            target.removeStun();
            target.removeBuff("allslow_per");
        }

        if (msgs["removestun-allies"]) {
            let team = getOthersAliveInTeam(attacker.d.team, attacker.d.id);
            for (let i=0; i<team.length; i++) team[i].removeStun();
        };

        if (msgs["+acdmg"]) target.lowerAc += parseInt(msgs["+acdmg"]);

        if (msgs["heal_target"]) attacker.healTarget();

        if (msgs["healall_per"]) attacker.healAll();

        if (msgs["+resdmg"]) {
            target.lowerResF += parseInt(msgs["+resdmg"]);
            target.lowerResC += parseInt(msgs["+resdmg"]);
            target.lowerResL += parseInt(msgs["+resdmg"]);
        };
        ELEMENTS.forEach(up => {
            let low = up.toLowerCase();
            if (msgs["+resdmg"+low]) target["lowerRes"+up] += parseInt(msgs["+resdmg"+low]);
        });
        if (msgs["+actdmg"]) target["lowerResP"] += parseInt(msgs["+actdmg"]);

        if (msgs["shout"]) attacker.shout(msgs["shout"], target);

        for (let id in BUFFS) {
            if (msgs[id])
                attacker.castTeamBuff(id, msgs[id], getBuffLenMin(BUFFS[id], msgs), getBuffLenMax(BUFFS[id], msgs));
        };

        let buffTarget = target ? target : attacker;
        for (let id in SINGLE_BUFFS) {
            if (msgs[id])
                buffTarget.buff(id, msgs[id], getBuffLenMin(SINGLE_BUFFS[id], msgs), getBuffLenMax(SINGLE_BUFFS[id], msgs));
        };

        for (let id in ONHIT_SELFBUFFS) {
            if (msgs[id])
                attacker.buff(id, msgs[id], getBuffLenMin(ONHIT_SELFBUFFS[id], msgs), getBuffLenMax(ONHIT_SELFBUFFS[id], msgs));
        };

        for (let name in SINGLE_BUFFS_FROM_TSPELL) {
            let id = SINGLE_BUFFS_FROM_TSPELL[name];
            if (msgs["tspell"] == name)
                attacker.buff(id, false, getBuffLenMin(SINGLE_BUFFS[id], msgs), getBuffLenMax(SINGLE_BUFFS[id], msgs));
        };

        for (let id in DEBUFFS) {
            if (msgs[id])
                attacker.castTeamDebuff(id, msgs[id], getBuffLenMin(DEBUFFS[id], msgs), getBuffLenMax(DEBUFFS[id], msgs));
        };

        for (let id in SINGLE_DEBUFFS) {
            if (msgs[id])
                target.buff(id, msgs[id], getBuffLenMin(SINGLE_DEBUFFS[id], msgs), getBuffLenMax(SINGLE_DEBUFFS[id], msgs));
        };

        const attackerPossiblePassiveCombo = attacker ? PASSIVE_OFFENSIVE_SKILL_COMBO_ADD[attacker.d.prof] : [];
        const targetPossiblePassiveCombo = target ? PASSIVE_DEFENSIVE_SKILL_COMBO_ADD[target.d.prof] : [];
        for (const msg of attackerPossiblePassiveCombo) {
            if (msgs[msg])
                attacker.comboAdd();
        }
        for (const msg of targetPossiblePassiveCombo) {
            if (msgs[msg])
                target.comboAdd();
        }

        if (msgs["tspell"] && attacker) {
            const t = msgs["tspell"];
            if (ACTIVE_SKILL_COMBO_ADD.indexOf(t) > -1)
                attacker.comboAdd();
    
            if (ACTIVE_SKILL_COMBO_RESET.indexOf(t) > -1)
                attacker.comboReset();
        }
    };

    function interpretMsgTxt(txt) {
        if (txt.indexOf(TURN_LOST) != -1 || txt.indexOf(DISTRACT)) { // LANG!!!
            let nick = txt.split("-")[0].trim();
            for (let id in warriors) {
                if (warriors[id].d.name == nick) interpretTurnLost(txt, warriors[id]);
            };
        };
    };

    function interpretTurnLost(txt, warrior) {
        let turns = 1;
        if (warrior.prepare) warrior.stopPrepareTSpell();
        warrior.turn(turns);
    };

    function msgIsNotStatusLog(msgs) {
        let logStats = ["heal", "legbon_holytouch_heal", "poison", "wound", "fire", "critwound", "injure", "light", "frost", "tspell", "winner", "loser", "txt", "tcustom"];
        for (let i=0; i<logStats.length; i++) {
            if (msgs[logStats[i]]) return false;
        };
        return true;
    };

    function fightUpdateGlobalBuffs(team) {
        let isMyTeam = team == myTeam;
        let allowedBuffs = isMyTeam ? BUFFS : DEBUFFS;

        // get simplified form of buffs of each warrior in team for comparison purposes
        let warriorBuffs = {};
        let buffIds = [];
        for (let id in warriors) {
            let warrior = warriors[id];
            if (warrior.d.team != team || warrior.d.hpp == 0) continue;
            warriorBuffs[id] = {};
            let buffs = warrior.getActiveBuffs(true);
            for (let buffId in buffs) {
                if (allowedBuffs[buffId]) {
                    if (buffIds.indexOf(buffId) == -1) buffIds.push(buffId);
                    let b1 = buffs[buffId][0];
                    let b2 = buffs[buffId][1];
                    let total = (warrior.currentTurn - b1.turnApplied) + (b2 ? (warrior.currentTurn - b2.turnApplied) : 999999);
                    warriorBuffs[id][buffId] = total;
                };
            };
        };

        // determine which warriors should be used to display the buff information in the top left corner
        let warriorForBuff = {};
        for (let i=0; i<buffIds.length; i++) {
            let buffId = buffIds[i];
            let highest = -1;
            let highestId = 0;
            let buffDoesntAffectAll = false;
            for (let id in warriorBuffs) {
                if (typeof warriorBuffs[id][buffId] == "undefined") {
                    buffDoesntAffectAll = true;
                    break;
                } else if (warriorBuffs[id][buffId] > highest) {
                    highest = warriorBuffs[id][buffId];
                    highestId = id;
                };
            };
            if (!buffDoesntAffectAll) warriorForBuff[buffId] = highestId;
            else buffIds.splice(buffIds.indexOf(buffId), 1);
        };

        // display the information in the top left corner using the warriors determined earlier
        for (let buffId in warriorForBuff) {
            let id = warriorForBuff[buffId];
            let warrior = warriors[id];
            let active = warrior.getActiveBuffs(true);
            let buffs = active[buffId];
            let str = warrior.getBuffTimeString(buffs, buffId);
            let name = BUFF_NAMES[buffId];
            updateDisplay("buff@"+buffId, {
                buff: str,
                name: name
            });
        };

        // delete buffs that don't exist anymore from top left corner
        for (let i=0; i<globalBuffs[team].length; i++) {
            let buffId = globalBuffs[team][i];
            if (buffIds.indexOf(buffId) == -1) deleteDisplay("buff@"+buffId);
        };

        // set which buffs exist now, to check whether they should be deleted next time the function runs
        globalBuffs[team] = buffIds;
    };

    function getOthersAliveInTeam(team, id) {
        return selectWarriors([
            {
                key: "hpp",
                type: ">",
                cmp: 0
            },
            {
                key: "team",
                type: "==",
                cmp: team
            },
            {
                key: "id",
                type: "!=",
                cmp: id
            }
        ]);
    };

    function selectWarriors(filters) {
        let ret = Object.values(warriors);
        for (let i=0; i<filters.length; i++) {
            let filter = filters[i];
            for (let j=0; j<ret.length; j++) {
                let w = ret[j].d;
                let val = w[filter.key];
                let type = filter.type;
                let cmp = filter.cmp;
                let res = compare(val, type, cmp);
                if (!res) {
                    ret.splice(j, 1);
                    j--;
                };
            };
        };
        return ret;
    };

    function compare(val1, type, val2) {
        switch (type) {
            case "==":
                return val1 == val2;
            case "!=":
                return val1 != val2;
            case "<":
                return val1 < val2;
            case ">":
                return val1 > val2;
            default:
                error("nieprawidłowe porównanie (ten błąd nigdy nie powinien wystąpić)");
                return true;
        };
    };

    function cloneData(data, ignore) {
        if (typeof data != "object") return data;
        let ret = Array.isArray(data) ? [] : {};
        for (let key in data) {
            if (ignore.indexOf(key) != -1) continue;
            if (typeof data[key] == "object") ret[key] = cloneData(data[key], ignore);
            else ret[key] = data[key];
        };
        return ret;
    };

    function getDisplayTemplate() {
        return $displayElementTemplate.cloneNode(true);
    };

    function updateDisplay(id, disp, rgb) {
        if (!displays[id]) {
            let tplId = id.split("@")[0];
            let tpl = DISP_TPL[tplId];
            let display = new DisplayElement(tpl.txt, tpl.tip, disp, rgb, id);
            displays[id] = display;
        } else {
            let display = displays[id];
            display.update(disp, rgb);
        };
    };

    function deleteDisplay(id) {
        let display = displays[id];
        if (display) {
            display.delete();
            delete displays[id];
        };
    };

    function updateTurnDisplay(n, max) {
        if (max) {
            if (n > max) n = max;
            updateDisplay("turns", {
                "n": n,
                "max": max
            });
        } else deleteDisplay("turns");
    };

    class DisplayElement {
        constructor(template, tip, disp, rgb, id) {
            this.$ = getDisplayTemplate();
            this.template = template;
            this.tip = tip;
            this.id = id;
            this.update(disp, rgb);
            $display.querySelector(".priw-thp-display-list").appendChild(this.$);
        }
        update(disp, rgb) {
            this.updateText(disp);
            if (rgb) this.updateRgb(rgb);
        }
        updateRgb(rgb) {
            this.$.style.background = "rgba("+rgb+", 0.5)";
        }
        updateText(disp) {
            let txt = this.template;
            let tip = this.tip;
            for (let key in disp) {
                txt = txt.replace("{"+key+"}", disp[key]);
                tip = tip.replace("{"+key+"}", disp[key]);
            };
            this.setHTML(txt);
            this.setTip(tip);
        }
        setHTML(html) {
            this.$.innerHTML = html;
        }
        setTip(html) {
            /* Some confusing function names, huh? */
            setTip(this.$, html);
        }
        delete() {
            $display.querySelector(".priw-thp-display-list").removeChild(this.$);
        }
    }

    class Warrior {
        constructor(data) {
            this.d = cloneData(data, WARRIOR_IGNORE);
            this.currentTurn = 0;
            this.teammateTurns = 0;
            this.lowerAc = 0;
            this.lowerResF = 0; // fire
            this.lowerResC = 0; // cold (frost)
            this.lowerResL = 0; // lightning
            this.lowerResP = 0; // poison
            this.tspell = "";
            this.counter = false;
            this.prepare = false;
            this.curse = false;
            this.glare = false;
            this.distract = false;
            this.stun = 0;
            this.shoutTimer = 0;
            this.shoutTarget = null;
            this.targetHealCount = 0;
            this.allHealCount = 0;
            this.wasLastHeal = false;
            this.combo = 0;
            this.buffs = {};
            this.$ = this.getMyElement();
        }
        getMyElement() {
            if (INTERFACE == "old") {
                return document.querySelector("#troop"+this.d.id);
            } else {
                return window.Engine.battle.warriorsList[this.d.id].$[0]?.querySelector(".canvas-warrior-icon");
            };
        }
        update(data) {
            for (let key in data) {
                this.d[key] = cloneData(data[key], WARRIOR_IGNORE);
            };
            this.updateTip();
        }
        turn(num) {
            let last = this.getLastTSpell();
            let skip = DBL_TURN_SKILLS.indexOf(last) > -1 || this.counter;
            if (skip) {
                this.setLastTSpell("");
                this.counter = false;
            } else {
                this.currentTurn += num;
                this.teammateTurns = 0;
                let team = getOthersAliveInTeam(this.d.team, this.d.id);

                for (let i=0; i<team.length; i++) team[i].teammateTurn();

                if (this.d.id == heroId()) updateTurnDisplay(0, team.length)

                this.removeOldBuffs();

                this.advanceStuns();

                this.advanceShout();
            };
        }
        advanceStuns() {
            if (this.stun) this.stun--;
            else if (this.distract) this.subtractDistract();
            else if (this.glare) this.toggleGlare(false);
            else if (this.curse) this.toggleCurse(false);
        }
        applyStun(n) {
            if (this.stun < n) this.stun = n;
        }
        removeStun() {
            this.stun = 0;
            this.updateTip();
        }
        teammateTurn() {
            this.teammateTurns++;
            if (this.d.id == heroId()) updateTurnDisplay(this.teammateTurns, getOthersAliveInTeam(this.d.team, this.d.id).length);
        }
        setLastTSpell(tspell) {
            this.tspell = tspell;
        }
        getLastTSpell() {
            return this.tspell;
        }
        nextTurnIsCounter() {
            this.counter = true;
        }
        prepareTSpell(tspell) {
            this.prepare = tspell;
            updateDisplay("prepare", {
                "tspell": tspell
            }, "255, 0, 0");
        }
        stopPrepareTSpell() {
            deleteDisplay("prepare");
            this.prepare = false;
        }
        toggleCurse(state) {
            this.curse = state;
            if (state && this.prepare) this.stopPrepareTSpell();
        }
        addDistract() {
            this.distract += 1;
            if (this.prepare) this.stopPrepareTSpell();
        }
        subtractDistract() {
            this.distract -= 1;
        }
        toggleGlare(state) {
            this.glare = state;
        }
        shout(targetsStr, target) {
            // the problem here is, what if there are 2 or more warriors with the same name?
            // only the one the spell was casted on directly was SURELY affected
            // others... who knows
            let targets = targetsStr.split(", ");
            let shoutedIds = {};
            let ind = targets.indexOf(target.d.name);
            targets.splice(ind, 1); // to avoid "shouting" 2 times at the same warrior
            target.shouted(this);
            shoutedIds[target.d.name] = [target.d.id];
            for (let i=0; i<targets.length; i++) {
                let name = targets[i];
                let query = [
                    {
                        key: "team",
                        type: "==",
                        cmp: target.d.team
                    },
                    {
                        key: "name",
                        type: "==",
                        cmp: name
                    }
                ];
                // making selectWarriors wasn't pointless after all!
                if (shoutedIds[name]) {
                    for (let j=0; j<shoutedIds[name].length; j++) {
                        let id = shoutedIds[name][j];
                        query.push({
                            key: "id",
                            type: "!=",
                            cmp: id
                        });
                    }
                } else shoutedIds[name] = [];
                log(JSON.stringify(query));
                let warrior = selectWarriors(query)[0];
                if (typeof warrior == "undefined") error("niewytłumaczalny błąd przy wyznaczaniu celu wyzywa");
                else {
                    warrior.shouted(this);
                    warrior.updateTip();
                    shoutedIds[warrior.d.name].push(warrior.d.id);
                }
            }
        }
        shouted(shoutTarget) {
            this.shoutTimer = 2;
            this.shoutTarget = shoutTarget;
        }
        advanceShout() {
            if (this.shoutTimer) {
                this.shoutTimer--;
                if (!this.shoutTimer) {
                    this.shoutTarget = null;
                }
            }
        }
        healTarget() {
            this.targetHealCount += 1;
        }
        healAll() {
            this.allHealCount += 1;
        }
        lastHeal() {
            this.wasLastHeal = true;
        }
        comboAdd() {
            this.combo += 1;
        }
        comboReset() {
            this.combo = 0;
        }
        castTeamBuff(id, val, lenMin, lenMax) {
            let team = getOthersAliveInTeam(this.d.team, this.d.id);
            for (let i=0; i<team.length; i++) {
                team[i].buff(id, val, lenMin, lenMax);
            };
            this.buff(id, val, lenMin, lenMax);
        }
        buff(id, val, lenMin, lenMax) {
            let buff = {
                id: id,
                val: val,
                lenMin: lenMin,
                lenMax: lenMax,
                turnApplied: this.currentTurn
            };
            if (!this.buffs[id]) this.buffs[id] = [];
            this.buffs[id].push(buff);
            this.updateTip();
        }
        castTeamDebuff(id, val, lenMin, lenMax) {
            let otherTeam = this.d.team == 1 ? 2 : 1;
            let team = getOthersAliveInTeam(otherTeam, -1);
            for (let i=0; i<team.length; i++) {
                team[i].buff(id, val, lenMin, lenMax);
            };
        }
        removeOldBuffs() {
            for (let id in this.buffs) {
                let buffs = this.buffs[id];
                for (let i=0; i<buffs.length; i++) {
                    let buff = buffs[i];
                    if (buff.turnApplied + buff.lenMax <= this.currentTurn) {
                        buffs.splice(i, 1);
                        i--;
                    };
                };
                if (!buffs.length) delete this.buffs[id];
            };
        }
        removeBuff(name) {
            delete this.buffs[name];
        }
        getActiveBuffs(forGlobal) {
            let active = {};
            for (let id in this.buffs) {
                let buffs = this.buffs[id];
                let buffList = this.getBuffPropListForId(id);
                let nostack = buffList[id].nostack;
                let maxlen = nostack ? 1 : 2;
                let current = [];
                for (let i=0; i<buffs.length; i++) {
                    let buff = buffs[i];
                    if (current.length == maxlen) {
                        let add = false;
                        let val = buff.val;
                        let turn = buff.turnApplied;
                        let {ind, smaller} = this.getSmallerOfTwoBuffs(current, forGlobal);

                        // global display shows last used buffs rather than buffs that are actually working to avoid confusion
                        if (forGlobal) {
                            if (buff.turnApplied > smaller.turnApplied) current[ind] = buff;
                        } else {
                            if (buff.val >= smaller.val) current[ind] = buff;
                        };

                    } else {
                        current.push(buff);
                    };
                };
                active[id] = current;
            };
            return active;
        }
        getSmallerOfTwoBuffs(buffs, forGlobal) {
            // when getting for global buff display, compare by time, else compare by value
            if (buffs.length == 1) return {ind: 0, smaller: buffs[0]};
            if (forGlobal) {
                if (buffs[0].turnApplied <= buffs[1].turnApplied) return {ind: 0, smaller: buffs[0]};
                else return {ind: 1, smaller: buffs[1]};
            } else {
                if (buffs[0].val <= buffs[1].val) return {ind: 0, smaller: buffs[0]};
                else return {ind: 1, smaller: buffs[1]};
            };
        }
        hasResInfo() {
            return this.d.resfire && this.d.reslight && this.d.resfrost && this.d.act;
        }
        hasAcInfo() {
            return typeof this.d.ac != "undefined";
        }
        getAcResString(acres) {
            return `${acres.cur}${acres.bonus == 0 ? "" : "+" + acres.bonus}`;
        }
        getAcCurrentTip() {
            let str = "";
            if (this.hasAcInfo()) {
                str += `Pancerz: ${this.getAcResString(this.d.ac)}` + NL;
            }
            return str;
        }
        getResCurrentTip() {
            let str = "";
            if (this.hasResInfo()) {
                str += "Odp.: ";
                str += `<span style='color:red'>${this.getAcResString(this.d.resfire)}</span>/`;
                str += `<span style='color:yellow'>${this.getAcResString(this.d.reslight)}</span>/`;
                str += `<span style='color:cyan'>${this.getAcResString(this.d.resfrost)}</span>/`;
                str += `<span style='color:lime'>${this.getAcResString(this.d.act)}</span>`;
                str += NL;
            }
            return str;
        }
        getAcDestroyedTip() {
            return this.lowerAc > 0 ? "Zniszcz. panc.: "+this.lowerAc + NL : "";
        }
        getResDestroyedTip() {
            if (this.lowerResF == 0 && this.lowerResL == 0 && this.lowerResC == 0 && this.lowerResP == 0)
                return "";
            
            let str = "";
            str += "Obniż. odp.: ";
            str += "<span style='color:red'>"+this.lowerResF+"</span>/";
            str += "<span style='color:yellow'>"+this.lowerResL+"</span>/";
            str += "<span style='color:cyan'>"+this.lowerResC+"</span>/";
            str += "<span style='color:lime'>"+this.lowerResP+"</span>";
            str += NL;
            return str;
        }
        generateExtraTipContent() {
            let str = "";

            if (this.hasAcInfo()) {
                /* New interface shows this by itself... */
                if (INTERFACE != "new")
                    str += this.getAcCurrentTip();
            } else {
                str += this.getAcDestroyedTip();
            }

            if (this.hasResInfo()) {
                if (INTERFACE != "new")
                    str += this.getResCurrentTip();
            } else {
                str += this.getResDestroyedTip();
            }

            if (this.targetHealCount) str += `<span>Użycia lek poj.: ${this.targetHealCount}</span>` + NL;
            if (this.allHealCount) str += `<span>Użycia lek grp: ${this.allHealCount}</span>` + NL;

            let active = this.getActiveBuffs();
            for (let id in active) {
                let buffs = active[id];
                const buffPair = this.getActiveBuffPair(buffs);
                let buffTime = this.getBuffTimeString(buffPair, id);
                let buffVal = this.getBuffValString(buffPair);
                let buffPropList = this.getBuffPropListForId(id);
                let color = buffPropList[id].overrideColor ? buffPropList[id].overrideColor : buffPropList._color;
                str += `<span style='color:${color}'>${buffTime}${buffVal}</span>` + NL;
            };
            if (this.prepare) str += "<span style='color:red'>"+this.prepare+"</span>"+NL;
            if (this.curse) str += "<span style='color:#ff8383'>Klątwa</span>" + NL;
            if (this.distract) str += `<span style='color:#ff8383'>Wytrącenie z równowagi (${this.distract})</span>` + NL;
            if (this.stun) str += "<span style='color:#ff8383'>Stun: "+this.stun+"</span>" + NL;
            if (this.shoutTimer) str += "<span style='color:#ff8383'>Wyzyw: "+this.shoutTimer+" tur"+(this.shoutTimer == 1 ? "a" : "y")+", "+this.shoutTarget.d.name+"</span>" + NL;
            if (this.wasLastHeal) str += "<span style='color:#ff8383'>Ostatni ratunek wykorzystany</span>" + NL;
            if (!this.d.npc) {
                str += `<div class="combo-wrapper">
                    <div class="combo-point left ${this.combo >= 1 ? "active" : ""}"></div>
                    <div class="combo-point middle ${this.combo >= 2 ? "active" : ""}"></div>
                    <div class="combo-point right ${this.combo >= 3 ? "active" : ""}"></div>
                </div>`;
            }
            return str;
        }
        getBuffPropListForId(id) {
            if (BUFFS[id]) return BUFFS;
            if (SINGLE_BUFFS[id]) return SINGLE_BUFFS;
            if (ONHIT_SELFBUFFS[id]) return ONHIT_SELFBUFFS;
            if (DEBUFFS[id]) return DEBUFFS;
            if (SINGLE_DEBUFFS[id]) return SINGLE_DEBUFFS;
            error("nieprawidłowy buff id="+id);
            return BUFFS; 
        }
        getActiveBuffPair(buffs) {
            let b1 = buffs[0];
            let b2 = buffs[1] ? buffs[1] : null;
            if (b2) {
                if (b2.turnApplied < b1.turnApplied) {
                    let tmp = b2;
                    b2 = b1;
                    b1 = tmp;
                };
            };
            return [b1, b2];
        }
        getBuffTimeString(buffPair, id) {
            let buffText = BUFF_NAMES[id];

            let v1 = this.getOneBuffTimeString(buffPair[0]);
            let v2 = buffPair[1] ? this.getOneBuffTimeString(buffPair[1]) : false;

            let str = v1;
            if (v2 !== false) str += "|" + v2;

            return buffText + ": " + str;
        }
        getBuffValString(buffPair) {
            if (isNaN(parseInt(buffPair[0].val)))
                return "";
            if (buffPair[1] && isNaN(parseInt(buffPair[1].val)))
                return "";

            let valText = " (";
        
            valText += buffPair[0].val;
            if (buffPair[1]) valText += "|" + buffPair[1].val;

            valText += ")";
            return valText;
        }
        getOneBuffTimeString(buff) {
            let time = Math.floor(this.currentTurn - buff.turnApplied);
            if (buff.turnApplied + buff.lenMin <= this.currentTurn) {
                return "<span style='color:orange'>"+time+"</span>";
            } else {
                return time;
            };
        }
        updateTip() {
            let txt = this.generateExtraTipContent();
            let tip = getTip(this.$) ?? "";
            tip = tip.replace(TIP_REGEX, "");
            if (txt != "") tip = tip + "<titanHelperPlus>"+txt+"</titanHelperPlus>";
            console.log(this.$, tip);
            setTip(this.$, tip);
        }
    };

    init();
}();