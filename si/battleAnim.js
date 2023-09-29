// battleAnim - implementuje animacje z walki dostępne tylko na NI do starego interfejsu

!async function() {
    // TODO: support animation positioning

    const settings = new (function() {
        const path = "priw8-battle-anim/";
        const Storage = margoStorage;
        this.set = function(p, val) {
            Storage.set(path + p, val);
        };
        this.get = function(p, defaultValue) {
            const res = Storage.get(path + p);
            return res != null ? res : defaultValue;
        };
        this.remove = function(p) {
            try {
                Storage.remove(path + p);
            } catch (e) {};
        };
    })();

    // SI does not get skillId
    const skillMap = {
        w: {"Kontratak":20,"Ogłuszający cios":22,"Niszczycielski cios":23,"Wytrzymałość":24,"Odbicie ciosu":27,"Twarda głowa":29,"Berserk":30,"Krwawa jatka":31,"Ciężka rana":32,"Kamienna skóra":34,"Celny cios":36,"Wytrącenie z równowagi":37,"Uderzenie zza tarczy":39,"Ostatnie uderzenie":42,"Krwiożerczy szał":43,"Wrodzona szybkość":61,"Okaleczenie":72,"Przemożenie zmęczenia":73,"Przetrwanie":106,"Wampiryzm":109,"Paraliżujący cios":110,"Trwałość mocy":119,"Wzmocniony pancerz":120,"Krwawa szarża":130,"Cios krytyczny":168,"Krytyczne spowolnienie":183,"Adaptacja":184,"Wyzywający okrzyk":188,"Agresywny atak":203,"Błyskawiczny atak":204,"Żądza krwi":205,"Osłona tarczą":206,"Potężne uderzenie":207,"Mocarna ochrona":208,"Wzmocnienie energii":234,"Sprawność fizyczna":263,"Strach":267,"Końskie zdrowie":268,"Płatnerstwo":269,"Źródło potęgi":270,"Okrzyk bojowy":271,"Zmiażdżenie":278},
        p: {"Krytyczne uderzenie":18,"Prowokujący okrzyk":25,"Przeszywające uderzenie":33,"Szybki atak":38,"Strażnik boskich mocy":44,"Uderzenie tarczą":45,"Wrodzona szybkość":61,"Aura ochrony":76,"Aura szybkości":77,"Pchnięcie mrozu":86,"Tarcza słońca":92,"Gorące uderzenie":99,"Przetrwanie":106,"Gniew bogów":108,"Porażający cios":112,"Trwałość mocy":119,"Wzmocniony pancerz":120,"Cios krytyczny":168,"Moc sprawiedliwych":185,"Skupienie na celu":186,"Błogosławiona ochrona":187,"Parowanie":189,"Stabilność mocy":190,"Srebrzysty blask":191,"Witalność":196,"Rozpraszający cios":197,"Hart ducha":198,"Fala leczenia":199,"Splot odporności":200,"Błogosławieństwo mieczy":201,"Porażająca tarcza":202,"Odnowa mocy":249,"Krytyczna moc ognia":250,"Krytyczna moc błyskawic":251,"Krytyczna moc zimna":252,"Sprawność fizyczna":263,"Strach":267,"Końskie zdrowie":268,"Płatnerstwo":269,"Źródło potęgi":270,"Kula światłości":273,"Aura życia":276},
        h: {"Zdradziecki grot":8,"Rozpraszająca strzała":41,"Wrodzona szybkość":61,"Zwinność":62,"Przebijanie pancerza":64,"Łatwy cel":67,"Wzmocnienie wigoru":71,"Wilczy instynkt":75,"Bandażowanie ran":81,"Błyskawiczny strzał":85,"Jadowy grot":87,"Odzyskiwanie strzał":88,"Deszcz strzał":96,"Podwójny strzał":97,"Bolesne uderzenie":98,"Przetrwanie":106,"Krytyczne wzmocnienie":113,"Trwałość mocy":119,"Wzmocniony pancerz":120,"Cios krytyczny":168,"Zranienie":173,"Diamentowa strzała":178,"Remedium":179,"Lekki naciąg":180,"Szkoła przetrwania":181,"Dziki zapał":217,"Wyswobodzenie":218,"Wyniszczające rany":220,"Zatruta strzała":232,"Naturalny unik":235,"Oczyszczenie":238,"Toksyczny wstrząs":241,"Rozdzierająca strzała":245,"Krytyczny strzał":253,"Strzał w stopę":256,"Sprawność fizyczna":263,"Piętno bestii":264,"Destrukcyjne strzały":265,"Strach":267,"Końskie zdrowie":268,"Płatnerstwo":269,"Źródło potęgi":270},
        t: {"Lodowa strzała":14,"Krytyczne trafienie":15,"Płonąca strzała":26,"Wrodzona szybkość":61,"Porażająca strzała":68,"Podwójny dech":89,"Wzmocnienie absorpcji":90,"Strzała z niespodzianką":95,"Śmierdzący ładunek":102,"Energetyzujący wstrząs":103,"Emanująca strzała":105,"Przetrwanie":106,"Trwałość mocy":119,"Wzmocniony pancerz":120,"Cios krytyczny":168,"Niewrażliwość na zimno":174,"Przywracanie mocy":192,"Strzelecka moc ognia":193,"Strzelecka moc błyskawic":194,"Strzelecka moc zimna":195,"Swobodny unik":215,"Znieczulica":226,"Wycieńczająca strzała":231,"Kruszący grot":233,"Podwójne trafienie":239,"Wygodne stroje":240,"Mistyczny strzał":242,"Skupienie mocy":243,"Grad strzał":244,"Kojące ochłodzenie":248,"Gwałtowny strzał":254,"Odzyskiwanie bełtów":255,"Wzmożony ostrzał":257,"Niewrażliwość na ogień":260,"Niewrażliwość na błyskawice":261,"Sprawność fizyczna":263,"Strach":267,"Końskie zdrowie":268,"Płatnerstwo":269,"Źródło potęgi":270,"Rytuał ochrony żywiołów":274,"Zaklinanie przedmiotów":275},
        b: {"Wrodzona szybkość":61,"Krytyczne cięcie":65,"Zdradzieckie cięcie":66,"Trujące pchnięcie":82,"Przenikliwa rana":84,"Potrójne uderzenie":94,"Mistrzostwo mieczy":100,"Przetrwanie":106,"Płynność ruchów":111,"Trwałość mocy":119,"Wzmocniony pancerz":120,"Krytyczne przyspieszenie":125,"Wirujące ostrze":127,"Podstępne uderzenie":129,"Cios krytyczny":168,"Błyskawiczny cios":209,"Zadziorny atak":210,"Precyzyjny cios":211,"Furia":212,"Poprawa kondycji":213,"Wrodzony unik":214,"Zew krwi":216,"Jadowity podmuch":219,"Zabójcze uderzenie":221,"Rozjuszenie":222,"Rozpraszający okrzyk":223,"Zamroczenie":224,"Bolesny cios":225,"Adrenalina":227,"Wściekłość":228,"Czarna krew":229,"Gruboskórność":230,"Toksyczne opary":236,"Opatrywanie ran":237,"Uporczywość":259,"Sprawność fizyczna":263,"Strach":267,"Końskie zdrowie":268,"Płatnerstwo":269,"Źródło potęgi":270,"Amok":272,"Poszarpane ostrze":279},
        m: {"Potęga błyskawic":7,"Potęga zimna":9,"Koncentracja many":11,"Zwiększenie absorpcji":12,"Kula ognia":21,"Odporność na ogień":46,"Tarcza odporności":47,"Odporność na błyskawice":49,"Magiczna bariera":50,"Łańcuch piorunów":53,"Apogeum":54,"Ściana ognia":55,"Klątwa":56,"Lodowy pocisk":58,"Potęga ognia":59,"Wrodzona szybkość":61,"Chwila skupienia":69,"Porażenie":70,"Leczenie ran":78,"Zdrowa atmosfera":79,"Magiczna osłona":101,"Przetrwanie":106,"Moc leczenia":107,"Trwałość mocy":119,"Wzmocniony pancerz":120,"Szadź":123,"Determinacja":131,"Osłabienie":166,"Spowalniające uderzenie":167,"Cios krytyczny":168,"Krytyczna potęga":182,"Fuzja żywiołów":246,"Duszący pocisk":247,"Śmierdzący pocisk":258,"Odporność na zimno":262,"Sprawność fizyczna":263,"Wewnętrzny spokój":266,"Strach":267,"Końskie zdrowie":268,"Płatnerstwo":269,"Źródło potęgi":270,"Rytualne szaty":277}
    
    }

    const skillMapAll = Object.assign({}, skillMap.w, skillMap.p, skillMap.h, skillMap.t, skillMap.b, skillMap.m);

    // Generated locally with a script
    const animDurations = {"evade_3_test3_64px.gif":2.42,"14_lodowa-strzala.gif":2.90,"21_kula-ognia.gif":2.10,"22_ogluszajacy-cios.gif":2.38,"23_niszczycielski-cios.gif":2.62,"26_plonaca-strzala.gif":1.12,"38_szybki-atak.gif":2.18,"39-zdruzgotanie.gif":2.68,"58_lodowy-pocisk.gif":2.46,"68_porazajaca-strzala.gif":2.75,"70_porazenie.gif":2.55,"77_aura-szybkosci.gif":1.98,"78_leczenie-ran.gif":1.10,"79_zdrowa-atmosfera.gif":1.10,"81_bandazowanie-ran.gif":1.10,"82_trujace-pchniecie.gif":2.44,"85_blyskawiczny-strzal.gif":2.22,"86_pchniecie-mrozu.gif":2.82,"89_podwojny-dech.gif":1.98,"95_strzala-z-niespodzianka.gif":2.58,"97_podwojny-strzal.gif":2.42,"99_gorace-uderzenie.gif":2.70,"108_gniew-bogow.gif":2.86,"112_porazajacy-cios.gif":2.90,"123_szadz.gif":3.08,"129_podstepne-uderzenie.gif":2.22,"191_srebrzysty-blask.gif":1.10,"199_fala-leczenia.gif":1.10,"203_agresywny-atak.gif":1.00,"204_blyskawiczny-atak.gif":2.18,"209_blyskawiczny-cios.gif":2.18,"210_zadziorny-atak.gif":2.62,"220_wyniszczajce-rany.gif":3.22,"222_stlamszenie.gif":2.94,"223_rozpraszajacy-atak.gif":2.16,"231_wycienczajaca-strzala.gif":2.26,"232_zatruta-strzala.gif":2.39,"237_opatrywanie-ran.gif":1.10,"239_podwojne-trafienie.gif":2.42,"246_fuzja-zywiolow.gif":2.58,"248_kojace-ochlodzenie.gif":1.10};
    
    /**
     * @typedef {object} SkillEffectData
     * @property {SkillDefinitionData[]} skillDefinitions
     */

    /**
     * @typedef {object} SkillDefinitionData
     * @property {string} name
     * @property {string} [data]
     * @property {SkillProperties} [d]
     */

    /**
     * @typedef {object} SkillProperties
     * @property {SkillConfig[]} skillConfig
     * @property {SkillConfig[]} overrideSkillConfig
     * @property {SkillBlock} block
     * @property {string} [name]
     */

    /** 
     * @typedef {object} SkillConfig 
     * @property {SkillEffectType} effect
     * @property {SkillTargetType} target
     * @property {SkillSpecificTargetType} specificTarget
     * @property {object} params
     * @property {string} [soundUrl]
     * @property {boolean} [isOverride]
     */

    /**
     * @typedef {object} SkillBlock
     * @property {boolean} [all]
     * @property {string[]} [exceptions]
     * @property {string} selfName
     */

    /** 
     * @typedef {object} ParsedBattleMessage
     * @property {number} casterID
     * @property {number} targetID
     * @property {number} [casterHP]
     * @property {number} [targetHP]
     * @property {Object.<string, any>} stat
     */

    /**
     * @typedef {object} SkillEffectDataProcessed
     * @property {Object.<string, SkillProperties>} skillids
     * @property {Object.<string, SkillProperties>} stats
     * @property {SkillProperties} normalAttack
     */

    /**
     * @typedef {object} EffectsToApply
     * @property {SkillProperties[]} effs
     * @property {number} casterID
     * @property {number} targetID
     */

    /** @enum {string} */
    const SkillEffectType = {
        SHAKE: "SHAKE",
        TINT: "TINT",
        ANIMATION: "ANIMATION",
        SOUND: "SOUND"
    }

    /** @enum {string} */
    const SkillTargetType = {
        CHARACTER: "CHARACTER"
    }

    /** @enum {string} */
    const SkillSpecificTargetType = {
        SKILL_TARGET: "SKILL_TARGET",
        SKILL_CASTER_GROUP: "SKILL_CASTER_GROUP",
        SKILL_TARGET_GROUP: "SKILL_TARGET_GROUP"
    }

    const css = `
@keyframes battleAnim-shake {
    from {transform: translateX(-3px);}
    to {tranform: translateX(3px);}
}

.battleAnim-shake {
    animation-name: battleAnim-shake;
    animation-duration: 0.05s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
}

.troop {
    transition-property: filter;
    transition-timing-function: ease-out;
    transition-duration: .2s;
    filter: drop-shadow(0px 0px 0px rgba(0,0,0,0));
}

.battleAnim-gifWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100%;
    width: 100%;
    pointer-events: none;
}
.battleAnim-gifWrapper * {
    pointer-events: none;
}

#battleAnim-config-wrapper {
    padding: 5px;
}
.battleAnim-setting {
    display: flex;
    justify-content: space-between;
    user-select: none;
}

`;

    const $style = document.createElement("style");
    $style.innerHTML = css;
    document.head.appendChild($style);

    const IS_DEV_MODE = settings.get("isDevMode", true);
    const USE_SOUND = settings.get("useSound", true);
    const effectDataUrl = `https://micc.garmory-cdn.cloud/obrazki/skillEffects/${/*window._l()*/"pl"}/${IS_DEV_MODE ? "dev" : location.host.split(".")[0]}.json`;
    const animationUrl = "https://mwcr.garmory-cdn.cloud/battleEffects/gif/";
    const soundUrl = "https://mwcr.garmory-cdn.cloud/battleEffects/sound/";

    /** @returns {Promise<SkillEffectData>} */
    async function loadEffectData(url) {
        const res = await fetch(url);
        const text = await res.text();
        try {
            /** @type {SkillEffectData} */
            const parsed = JSON.parse(text);
            const defs = parsed.skillDefinitions;
            for (const def of defs) {
                def.d = JSON.parse(def.data);
                def.d.name = def.name;
                if (def.d.block)
                    def.d.block.selfName = def.name;

                delete def.data;
            }
            return parsed;
        } catch(e) {
            console.error(`Couldn't parse skill data from ${url}`);
            console.error(e);
            return {
                skillDefinitions: []
            };
        }
    }

    /**
     * @param {SkillEffectData} effectData
     * @returns {SkillEffectDataProcessed}
     */
    function processEffectData(effectData) {
        /** @type {SkillEffectDataProcessed} */
        const res = {
            skillids: {},
            stats: {},
            normalAttack: null
        };

        for (const def of effectData.skillDefinitions) {
            const name = def.name;
            if (def.d.overrideSkillConfig) {
                for (const cfg of def.d.overrideSkillConfig) {
                    cfg.isOverride = true;
                }
            }
            let match = null;
            if (match = name.match(/skillId-([0-9]+)/)) {
                res.skillids[match[1]] = def.d;
            } else if (name == "normalAttack") {
                res.normalAttack = def.d;
            } else {
                res.stats[name] = def.d;
            }
        }

        return res;
    }

    const effectData = await loadEffectData(effectDataUrl);
    const effectDataProcessed = processEffectData(effectData);

    /** @type {SkillEffectDataProcessed} /
    const extensions = {
        stats: {
            "+legbon_verycrit": {
                skillConfig: [
                    {
                        effect: SkillEffectType.ANIMATION,
                        target: SkillTargetType.CHARACTER,
                        specificTarget: SkillSpecificTargetType.SKILL_TARGET,
                        soundUrl: "",
                        isExternalSound: true,
                        params: {
                            gifUrl: 
                        }
                    }
                ]
            }
        }
    }*/

    //console.log(effectDataProcessed);
    //console.log(effectData.skillDefinitions.map(def => def.d.skillConfig.map(cfg => cfg.specificTarget)));
    //console.log(effectData.skillDefinitions.map(def => def.d.block));
    /*console.log(Object.values(effectData.skillDefinitions).map(def => {
        const props = def.d;
        for (const p of props.skillConfig) {
            if (p.effect == SkillEffectType.ANIMATION) {
                return p.params.gifUrl || p.params.url;
            }
        }
        return "";
    }).join(" "));*/

    // Okay so this gif garbage is unbelievably stupid but IT WORKS
    // so basically I need to be able to play the animation gif from the beginning when I need to
    // there's obviously no API do to so, though... NI renders the gif manually to be able to do that,
    // but I ain't gonna mess with that garbage lmao
    // So my jank trick is to load the gifs from a slightly different data url, which still has the same data
    // but will load a new gif, which will start from the beginning. Wowie!
    // How to modify the data url? Simple, add a space after "data:". So every time I need to play the gif from beginning,
    // I add another space.
    // Yes, this is absolutely horrendous. Yes, I am proud of myself that this abomination works.
    // So one thing that you're probably wondering after reading this - doesn't this cause a memory leak?
    // And the answer is... hard to tell? If it does, it's basically negligible.
    // Well, at least in chrome. I should probably check if this actually works in firefox.
    /** @type {Object.<string, string>} */
    const loadedGifs = {};
    function loadAnimationGifs() {
        for (const def of effectData.skillDefinitions) {
            for (const key of ["skillConfig", "overrideSkillConfig"]) {
                if (!def.d[key])
                    continue;

                for (const cfg of def.d[key]) {
                    if (cfg.effect == SkillEffectType.ANIMATION) {
                        const gifUrl = cfg.params.gifUrl || cfg.params.url;
                        if (!gifUrl) {
                            console.log("where's the gif url", cfg);
                            continue;
                        }
                        const url = animationUrl + gifUrl;
                        fetch(url).then(async res => {
                            // https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
                            const buff = await res.arrayBuffer();
                            let bin = "";
                            let arr = new Uint8Array(buff);
                            for (let i=0; i<arr.byteLength; ++i) {
                                bin += String.fromCharCode(arr[i]);
                            }
                            const base64 = window.btoa(bin);
                            loadedGifs[gifUrl] = base64;
                        });
                    }
                }
            }
        }
    }

    /** @type {Object.<string, string>} */
    const gifPrefixes = {};
    function getAnimationGifUrl(gifUrl) {
        if (!loadedGifs[gifUrl]) {
            // fallback
            return animationUrl + gifUrl;
        }
        if (typeof gifPrefixes[gifUrl] == "undefined") {
            gifPrefixes[gifUrl] = "";
        } else {
            gifPrefixes[gifUrl] += " ";
        }
        return "data:" + gifPrefixes[gifUrl] + "image/gif;base64," + loadedGifs[gifUrl];
    }

    loadAnimationGifs();

    /** @type {Object.<string, HTMLAudioElement>} */
    const sounds = {};
    function loadSounds() {
        if (!USE_SOUND)
            return;

        for (const def of effectData.skillDefinitions) {
            for (const key of ["skillConfig", "overrideSkillConfig"]) {
                if (!def.d[key])
                    continue;

                for (const cfg of def.d[key]) {
                    if (cfg.soundUrl) {
                        sounds[cfg.soundUrl] = new Audio(soundUrl + cfg.soundUrl);
                    }
                }
            }
        }
    }

    /** @param {string[]} soundsToPlay */
    function playSounds(soundsToPlay) {
        if (!USE_SOUND)
            return;

        for (const sound of soundsToPlay) {
            const audio = sounds[sound];
            if (audio.readyState == 4) {
                audio.currentTime = 0;
                audio.play();
            }
        }
    }

    loadSounds();

    let isAutoFight = false;

    const _pI = window.parseInput;
    window.parseInput = function(data) {
        if (typeof data.f != "undefined") {
            if (!data.f.init && data.f.m) {
                processBattleEffects(data.f.m, data.f.w);
            }
            if (data.f.init) {
                isAutoFight = false;
            }
            if (data.f.auto && data.f.auto != "0") {
                isAutoFight = true;
            }
        }
        return _pI.apply(this, arguments);
    }

    const __g = window._g;
    window._g = function(q) {
        if (q == "fight&a=f")
            isAutoFight = true;
        
        return __g.apply(this, arguments);
    }

    /** 
     * @param {string} msgString
     * @returns {ParsedBattleMessage}
     */
    function parseBattleMessage(msgString) {
        /** @type {ParsedBattleMessage} */
        const res = {};
        const spl = msgString.split(";");
        const [casterData, targetData] = spl.splice(0, 2);
        const casterSpl = casterData.split("=");
        const targetSpl = targetData.split("=");
        if (casterSpl.length > 1)
            res.casterHP = parseInt(casterSpl[1]);

        if (targetSpl.length > 1)
            res.targetHP = parseInt(targetSpl[1]);

        res.casterID = casterSpl[0];
        res.targetID = targetSpl[0];

        res.stat = {};

        for (const entry of spl) {
            const lhsAndRhs = entry.split("=");
            if (lhsAndRhs.length == 1)
                lhsAndRhs.push(true);

            res.stat[lhsAndRhs[0]] = lhsAndRhs[1];
        }

        return res;
    }

    /** @param {string} tspell */
    function getEffFromTSpell(tspell) {
        return effectDataProcessed.skillids[skillMapAll[tspell]];
    }

    /** @param {number} id */
    function getEffById(id) {
        return effectDataProcessed.skillids[id];
    }

    /** @param {string} stat */
    function getEffFromStat(stat) {
        return effectDataProcessed.stats[stat];
    }

    function getWarriorHPP(id) {
        return g.battle?.f[id]?.hpp;
    }

    function getWarriorTeam(id) {
        return g.battle?.f[id]?.team;
    }

    function getWarriorsInTeam(team) {
        const res = [];
        if (g.battle) {
            for (const id in g.battle.f) {
                const w = g.battle.f[id];
                if (w.team == team)
                    res.push(id);
            }
        }
        return res;
    }

    function getAliveWarriorsInTeam(team) {
        const allWarriorsInTeam = getWarriorsInTeam(team);
        const res = [];
        for (const id of allWarriorsInTeam) {
            const w = g.battle.f[id];
            if (w.hpp > 0)
                res.push(id);
        }
        return res;
    }

    function getIsBattleSinglePlayer() {
        const t = getWarriorTeam(hero.id);
        return getWarriorsInTeam(t).length == 1;
    }

    /** 
     * @param {string[]} msgs 
     * @param {object} warriorUpdateData
     */
    function processBattleEffects(msgs, warriorUpdateData) {
        /** @type {EffectsToApply[]} */
        const allEffsToApply = [];

        /** @type {SkillBlock[]} */
        const effBlocks = [];

        for (const id in warriorUpdateData) {
            const w = warriorUpdateData[id];
            if (w.hpp < getWarriorHPP(id)) {
                allEffsToApply.push({
                    casterID: id,
                    targetID: id,
                    effs: [effectDataProcessed.normalAttack]
                });
            }
        }

        for (const msg of msgs) {
            const parsed = parseBattleMessage(msg);
            /** @type {EffectsToApply} */
            const effsToApply = {
                casterID: parsed.casterID,
                targetID: parsed.targetID,
                effs: []
            };

            let tspellEff = null;
            if (parsed.stat.tspell && (tspellEff = getEffFromTSpell(parsed.stat.tspell)) || parsed.stat.spellId && (tspellEff = getEffById(parsed.stat.spellId))) {
                if (tspellEff.block.all) {
                    effBlocks.push(tspellEff.block);
                } 
                effsToApply.effs.push(tspellEff);
            }

            for (let stat in parsed.stat) {
                const statEff = getEffFromStat(stat);
                if (statEff) {
                    if (statEff.block.all) {
                        effBlocks.push(statEff.block);
                    } 
                    effsToApply.effs.push(statEff);
                }
            }

            allEffsToApply.push(effsToApply);
        }

        for (const block of effBlocks) {
            if (block.all) {
                const except = block.exceptions || [];
                for (const effsToApply of allEffsToApply) {
                    for (let i=0; i<effsToApply.effs.length; ++i) {
                        const eff = effsToApply.effs[i];
                        if (!except.includes(eff.name) && eff.name != block.selfName) {
                            effsToApply.effs.splice(i, 1);
                            --i;
                        }
                    }
                }
            }
        }

        /** @type {Object.<number, SkillConfig[]>} */
        const effsByWarrior = {};
        for (const effsToApply of allEffsToApply) {
            for (const eff of effsToApply.effs) {
                assignEffsFromSkillConfig(effsByWarrior, effsToApply, eff.skillConfig);
            }
        }
        for (const effsToApply of allEffsToApply) {
            for (const eff of effsToApply.effs) {
                if (eff.overrideSkillConfig)
                    assignEffsFromSkillConfig(effsByWarrior, effsToApply, eff.overrideSkillConfig);
            }
        }

        for (const id in effsByWarrior) {
            const cfgs = effsByWarrior[id];
            const [reduced, sounds] = reduceEffsByWarrior(cfgs);
            applyEffectsToWarrior(id, reduced);
            if (!isAutoFight || !getIsBattleSinglePlayer())
                playSounds(sounds);
        }
    }

    /**
     * @param {number} id 
     * @param {Object.<string, SkillConfig>} effects 
     */
    function applyEffectsToWarrior(id, effects) {
        const $warrior = document.querySelector(`#troop${id}`);
        if (effects[SkillEffectType.SHAKE]) {
            applyShakeEffect($warrior, effects[SkillEffectType.SHAKE]);
        }
        if (effects[SkillEffectType.TINT]) {
            applyTintEffect($warrior, effects[SkillEffectType.TINT]);
        }
        if (effects[SkillEffectType.ANIMATION]) {
            applyAnimationEffect($warrior, effects[SkillEffectType.ANIMATION]);
        }
    }

    /**
     * @param {HTMLDivElement} $warrior 
     * @param {SkillConfig} cfg 
     */
    function applyShakeEffect($warrior, cfg) {
        if ($warrior.dataset.anim_shake_timeout) {
            clearTimeout($warrior.dataset.anim_shake_timeout);
            $warrior.classList.remove("battleAnim-shake");
        }
        function beginShake() {
            $warrior.classList.add("battleAnim-shake");
            $warrior.dataset.anim_shake_timeout = setTimeout(() => {
                $warrior.classList.remove("battleAnim-shake");
                $warrior.dataset.anim_shake_timeout = "";
            }, cfg.params.duration * 1000);
        }
        if (cfg.params.delay) {
            $warrior.dataset.anim_shake_timeout = setTimeout(beginShake, cfg.params.delay * 1000);
        } else {
            beginShake();
        }
    }

    /**
     * @param {HTMLDivElement} $warrior 
     * @param {SkillConfig} cfg 
     */
    function applyTintEffect($warrior, cfg) {
        if ($warrior.dataset.anim_tint_timeout) {
            clearTimeout($warrior.dataset.anim_tint_timeout);
            $warrior.style.filter = "drop-shadow(0px 0px 0px rgba(0,0,0,0))";
        }
        function beginTint() {
            $warrior.style.filter = `drop-shadow(0px 0px 5px rgb(${cfg.params.color}))`;
            $warrior.dataset.anim_tint_timeout = setTimeout(() => {
                $warrior.style.filter = "drop-shadow(0px 0px 0px rgba(0,0,0,0))";
                $warrior.dataset.anim_tint_timeout = "";
            }, cfg.params.duration * 1000);
        }
        if (cfg.params.delay) {
            $warrior.dataset.anim_tint_timeout = setTimeout(beginTint, cfg.params.delay * 1000);
        } else {
            beginTint();
        }
    }

    /**
     * @param {HTMLDivElement} $warrior 
     * @param {SkillConfig} cfg 
     */
    function applyAnimationEffect($warrior, cfg) {
        // TODO: load gif as a new one from data:image?
        const $anim = document.createElement("div");
        $anim.classList.add("battleAnim-gifWrapper");
        $anim.innerHTML = `<img src="${getAnimationGifUrl(cfg.params.gifUrl || cfg.params.url)}">`;
        //$anim.style.height = $warrior.style.height;
        //$anim.style.width = $warrior.style.width;

        function beginAnimation() {
            $warrior.appendChild($anim);

            setTimeout(() => {
                $warrior.removeChild($anim);
            }, animDurations[cfg.params.gifUrl || cfg.params.url] * 1000);
        }

        if (cfg.params.delay) {
            setTimeout(beginAnimation, cfg.params.delay * 1000);
        } else {
            beginAnimation();
        }
    }

    /**
     * @param {SkillConfig[]} cfgs
     * @returns {[Object.<string, SkillConfig>, string[]]}
     */
    function reduceEffsByWarrior(cfgs) {
        /** @type {Object.<string, SkillConfig>} */
        const res = {};
        const sounds = [];
        for (const cfg of cfgs) {
            const type = cfg.effect;
            if (!res[type]) {
                if (!cfg.isOverride)
                    res[type] = $.extend(true, {}, cfg);
            } else {
                Object.assign(res[type].params, cfg.params);
            }
            if (cfg.soundUrl)
                sounds.push(cfg.soundUrl);
        }
        return [res, sounds];
    }

    /**
     * @param {Object.<number, SkillConfig[]>} effsByWarrior 
     * @param {EffectsToApply} effsToApply
     * @param {SkillConfig[]} skillConfig 
     */
    function assignEffsFromSkillConfig(effsByWarrior, effsToApply, skillConfig) {
        for (const cfg of skillConfig) {
            if (cfg.target == SkillTargetType.CHARACTER) {
                if (cfg.specificTarget == SkillSpecificTargetType.SKILL_TARGET) {
                    const skillTarget = effsToApply.targetID;
                    if (skillTarget != 0) {
                        effsByWarrior[skillTarget] = effsByWarrior[skillTarget] || [];
                        effsByWarrior[skillTarget].push(cfg);
                    } else {
                        console.error("BattleAnim: skillTarget not specified");
                    }
                } else if (cfg.specificTarget == SkillSpecificTargetType.SKILL_CASTER_GROUP) {
                    const casterID = effsToApply.casterID;
                    if (casterID != 0) {
                        const team = getWarriorTeam(casterID);
                        const allInTeam = getAliveWarriorsInTeam(team);
                        for (const id of allInTeam) {
                            effsByWarrior[id] = effsByWarrior[id] || [];
                            effsByWarrior[id].push(cfg);
                        }
                    } else {
                        console.error("BattleAnim: casterID for SKILL_CASTER_GROUP is missing");
                    }
                } else if (cfg.specificTarget == SkillSpecificTargetType.SKILL_TARGET_GROUP) {
                    const targetID = effsToApply.targetID;
                    if (targetID != 0) {
                        const team = getWarriorTeam(targetID);
                        const allInTeam = getAliveWarriorsInTeam(team);
                        for (const id of allInTeam) {
                            effsByWarrior[id] = effsByWarrior[id] || [];
                            effsByWarrior[id].push(cfg);
                        }
                    } else {
                        console.error("BattleAnim: targetID for SKILL_TARGET_GROUP is missing");
                    }
                } else {
                    console.error("BattleAnim: unknnown SkillSpecificTargetType: " + cfg.specificTarget);
                }
            } else {
                console.error("BattleAnim: unknown SkillTargetType: " + cfg.target);
            }
        }
    }

    const $config = document.createElement("div");
    $config.innerHTML = 
`
<div class="battleAnim-setting">
    <label for="battleAnim-use-dev">Użyj paczki efektów z dev/experimentala</label>
    <input type="checkbox" id="battleAnim-use-dev" ${IS_DEV_MODE ? "checked" : ""}>
</div>
<div class="battleAnim-setting">
    <label for="battleAnim-use-sound">Włącz efekty dźwiękowe</label>
    <input type="checkbox" id="battleAnim-use-sound" ${USE_SOUND ? "checked" : ""}>
</div>
<i style="font-size: 85%">Zmiany widoczne po odświeżeniu</i>
`;
    $config.querySelector("#battleAnim-use-dev").addEventListener("change", e => {
        settings.set("isDevMode", e.target.checked);
    });
    $config.querySelector("#battleAnim-use-sound").addEventListener("change", e => {
        settings.set("useSound", e.target.checked);
    });
    function showConfig() {
        window.showEnWindow("BattleAnim - konfiguracja", "<div id='battleAnim-config-wrapper'></div>");
        document.querySelector("#battleAnim-config-wrapper").appendChild($config);
    }

    const $cfgBtt = window.drawSIButton("BattleAnim");
    $cfgBtt.click(() => {
        showConfig();
    }).css({
        width: "80px",
        position: "absolute",
        right: "7px",
        top: "35px",
    });
    $("#config").append($cfgBtt);
}();
