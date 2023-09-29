// anyMobTimer.js - pokazywanie timera respu mobka na mapce

// @ts-check
(function() {
    /** @typedef {import("./MargoAddonLib/src/Types/margonem").MargoNpc} MargoNpc */

    /** @enum {number} */
    const MargoNPCType = {
        DIALOG: 0,
        VOID: 1,
        ATTACKABLE: 2,
        AGRESSIVE: 3,
        OBJECT: 4,
        MACHINE: 5,
        AUTO_DIALOG: 6,
        RENEWABLE: 7
    }    

    const isNewInterface = typeof window.Engine != "undefined";

    class Events {
        constructor() {
            /** @type {Record<string, function[]>} */
            this.eventHandlers = {};
            if (isNewInterface) {
                // @ts-expect-error
                window.API.priw.emmiter.on("game-response", this.update.bind(this));
            } else {
                const _parseInput = window.parseInput;
                const self = this;
                window.parseInput = function(data) {
                    self.update(data);
                    return _parseInput.apply(this, arguments);
                }
            }
        }
        /**
         * @param {string} name 
         * @param {function} clb 
         */
        add(name, clb) {
            if (!this.eventHandlers[name])
                this.eventHandlers[name] = [];
            this.eventHandlers[name].push(clb);
        }
        /**
         * @template T
         * @param {string} name 
         * @param {T} data 
         * @returns {T}
         */
        fire(name, data) {
            const handlers = this.eventHandlers[name];
            if (!handlers)
                return;

            for (const handler of handlers) {
                handler(data);
            }

            return data;
        }
        /**
         * @param {object} data 
         */
        update(data) {
            for (const key in data) {
                this.fire(key, data[key]);
            }
        }
    }

    const event = new Events();

    /** @type {import("./MargoAddonLib/src/Types/margonem").MargoMap} */
    let map = null;

    const storage = window.margoStorage ?? window.API.Storage;

    /**  @typedef {Record<number, {x: number, y: number, ts: number}>} OneMapData */

    /** 
     * @param {number} id 
     * @returns {OneMapData}
     */
    function getDataForMap(id) {
        return storage.get(`priw8/any-mob-timer/${id}`) ?? {};
    }

    /** 
     * @param {number} id 
     * @param {OneMapData} data
     */
    function setDataForMap(id, data) {
        storage.set(`priw8/any-mob-timer/${id}`, data);
    }

    /**
     * @typedef {object} MobTimer
     * @property {number} id
     * @property {number} spawnTimestamp
     * @property {number} x
     * @property {number} y
     * @property {HTMLDivElement} [$el] SI only
     */

    /** @type {MobTimer[]} */
    const currMapTimers = [];

    function resetCurrTimers() {
        for (const timer of currMapTimers) {
            timer.$el.remove();
        }
        currMapTimers.splice(0, currMapTimers.length);
    }

    function addSavedTimers() {
        const timers = getDataForMap(map.id);
        const ts = getUnixTS();
        for (const id in timers) {
            if (timers[id].ts > ts + 40) {
                const $el = isNewInterface ? null : document.createElement("div");
                currMapTimers.push({
                    id: parseInt(id),
                    spawnTimestamp: timers[id].ts,
                    x: timers[id].x,
                    y: timers[id].y,
                    $el: $el
                })
            } else {
                delete timers[id];
            }
        }
        if (!isNewInterface) {
            window.g.loadQueue.push({
                fun: SI_initTimers
            });
        }
    }

    function getUnixTS() {
        return Math.floor(new Date().getTime() / 1000);
    }

    /** @param {number} seconds */
    function getParsedTime(seconds) {
        const res = {
            s: 0,
            m: 0,
            isSpawning: false
        };

        if (seconds < 0) {
            res.isSpawning = true;
            return res;
        }

        res.m = Math.floor(seconds / 60);
        res.s = seconds % 60;        

        return res;
    }

    /** @param {number} n */
    function addLeadingZero(n) {
        let res = n.toString();
        if (res.length == 1)
            return "0" + res;
        
        return res;
    }

    /** @param {{s: number, m: number, isSpawning: boolean}} time */
    function getTimerString(time) {
        return `${time.m}:${addLeadingZero(time.s)}`
    }

    /** @param {{s: number, m: number, isSpawning: boolean}} time */
    function SI_getTimerHTML(time) {
        return `<span style="color: ${time.isSpawning ? "orange" : "white"}">${getTimerString(time)}</span>`
    }

    /** @param {MobTimer} timer */
    function SI_initTimer(timer) {
        const $ground = document.querySelector("#base");
        Object.assign(timer.$el.style, {
            position: "absolute",
            left: `${timer.x * 32}px`,
            top: `${timer.y * 32}px`,
            width: "32px",
            height: "32px",
            lineHeight: "32px",
            textAlign: "center",
            fontSize: "11px",
            fontFamily: "sans-serif",
            background: "rgba(0, 0, 0, 0.35)",
            pointerEvents: "none"
        });
        $ground.appendChild(timer.$el);
        
        const ts = getUnixTS();
        const diff = timer.spawnTimestamp - ts;
        const time = getParsedTime(diff);
        const html = SI_getTimerHTML(time);
        timer.$el.innerHTML = html;
    }

    function SI_initTimers() {
        for (const timer of currMapTimers) {
            SI_initTimer(timer);
        }
        SI_updateTimers();
    }

    function SI_updateTimers() {
        const ts = getUnixTS();
        for (let i=0; i<currMapTimers.length; ++i) {
            const timer = currMapTimers[i];
            const diff = timer.spawnTimestamp - ts;
            if (diff > -40) {
                const time = getParsedTime(diff);
                const html = SI_getTimerHTML(time);
                timer.$el.innerHTML = html;
            } else {
                currMapTimers.splice(i, 1);
                timer.$el.remove();
                --i;
            }
        }
    }

    /**
     * @param {string} id 
     * @param {MargoNpc} npc 
     */
    function addTimer(id, npc) {
        const ts = getSpawnTimestamp(npc.lvl);
        const $el = isNewInterface ? null : document.createElement("div");
        currMapTimers.push({
            id: parseInt(id),
            spawnTimestamp: ts,
            x: npc.x,
            y: npc.y,
            $el: $el
        });
        if (!isNewInterface)
            SI_initTimer(currMapTimers[currMapTimers.length -1]);

        const timers = getDataForMap(map.id);
        timers[parseInt(id)] = {
            ts: ts,
            x: npc.x,
            y: npc.y
        };
        setDataForMap(map.id, timers);
    }

    /** @param {number} lvl */
    function getSpawnTimestamp(lvl) {
        lvl = Math.min(lvl, 200);
        return getUnixTS() + Math.floor(60 * (0.7+0.18*lvl-0.00045*lvl*lvl));
    }

    /** 
     * @param {string} id
     * @param {MargoNpc} npc 
     */
    function onNpcRemoved(id, npc) {
        const hero = isNewInterface ? window.Engine.hero.d : window.hero;

        // check if was removed for non-kill reasons
        if (hero.stasis)
            return;

        if (map.visibility && (Math.abs(npc.x - hero.x) > map.visibility || Math.abs(npc.y - hero.y) > map.visibility))
            return;

        addTimer(id, npc);
    }

    if (!isNewInterface)
        setInterval(SI_updateTimers, 1000);

    event.add("town", town => {
        map = town;
        resetCurrTimers();
        addSavedTimers();
    });
    
    /** @type {Record<string, MargoNpc>} */
    const relevantNPCs = {};

    event.add("npc", 
    /** @param {Record<string, MargoNpc>} npcs */
    npcs => {
        const timers = getDataForMap(map.id);
        let written = false;
        for (const id in npcs) {
            const npc = npcs[id];
            // TODO: check if map is instance
            if (!npc.del && npc.wt < 30 && (npc.type == MargoNPCType.AGRESSIVE || npc.type == MargoNPCType.ATTACKABLE)) {
                if (timers[id]) {
                    delete timers[id];
                    const idN = parseInt(id);
                    written = true;
                    let index = -1;
                    const t = currMapTimers.find((timer, i) => timer.id == idN && (index = i, true));
                    if (t) {
                        if (!isNewInterface) {
                            t.$el.remove();
                        }
                        currMapTimers.splice(index, 1);
                    }
                }
                relevantNPCs[id] = npc;
            } else if (npc.del) {
                if (relevantNPCs[id]) {
                    onNpcRemoved(id, relevantNPCs[id]);
                    delete relevantNPCs[id];
                }
            }
        }
        if (written) {
            setDataForMap(map.id, timers);
        }
    })

})();