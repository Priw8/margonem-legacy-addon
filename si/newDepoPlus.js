// newDepoPlus - całkowita przebudowa interfejsu depozytu
// @ts-check
{
    // @ts-ignore
    const Engine = window.Engine, API = window.parseInt, CFG = window.CFG, $ = window.$;

    const isNewInterface = typeof Engine != "undefined" && typeof API != "undefined";
    const ipath = isNewInterface ? CFG.a_ipath : CFG.ipath;

    // This fixes a really weird freeze that I'm getting on chromium.
    // I don't know why it happens.
    let nextAllowedImgTS = 0;
    const imgLoadDelay = 20;
    /**
     * @param {HTMLImageElement} $img 
     * @param {string} src 
     */
    function delayedLoadImg($img, src) {
        const ts = new Date().getTime();
        if (nextAllowedImgTS < ts) {
            $img.src = src;
            nextAllowedImgTS = ts + imgLoadDelay;
        } else {
            setTimeout(() => {
                $img.src = src;
            }, nextAllowedImgTS - ts);
            nextAllowedImgTS += imgLoadDelay;
        }
    }

    /**
     * @param {HTMLElement} $el
     * @param {string} txt
     */
    function setTip($el, txt, ctip="") {
        if (isNewInterface) {
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

    /** @param {string} lockName */
    function addLock(lockName) {
        if (isNewInterface) {
            // TODO NI
        } else {
            // @ts-expect-error
            g.lock.add(lockName);
        }
    }

    /** @param {string} lockName */
    function removeLock(lockName) {
        if (isNewInterface) {
            // TODO NI
        } else {
            // @ts-expect-error
            g.lock.remove(lockName);
        }
    }

    /**
     * @param {HTMLElement} $el 
     * @param {function} predicate
     * @param {number} limit
     */
    function bubbleUpElement($el, predicate, limit) {
        while(limit--) {
            if (predicate($el))
                return true;
            $el = $el.parentElement;
        }
        return false;
    }

    const settings = new (function() {
        const path = "priw8-ndp/";
        //@ts-expect-error
        const Storage = isNewInterface ? API.Storage : margoStorage;
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

    const DepoTabWidth = 14;
    const DepoTabHeight = 8;
    const DepoSizeUnit = DepoTabWidth * DepoTabHeight;

    /**
     * @readonly
     * @enum {number}
     */
    const MargoItemClass = {
        NONE: 0,
        ONEHANDED: 1,
        TWOHANDED: 2,
        ONEANDAHALFHANDED: 3,
        RANGED: 4,
        SECONDARY: 5,
        WAND: 6,
        STAFF: 7,
        ARMOR: 8,
        HELMET: 9,
        BOOTS: 10,
        GLOVES: 11,
        RING: 12,
        NECKLACE: 13,
        SHIELD: 14,
        NEAUTRAL: 15,
        CONSUMABLE: 16,
        GOLD: 17,
        KEY: 18,
        QUEST: 19,
        RENEWABLE: 20,
        ARROW: 21,
        CHARM: 22,
        BOOK: 23,
        BAG: 24,
        BLESSING: 25,
        ENHANCEMENT: 26,
        RECIPE: 27,
        CURRENCY: 28,
        QUIVER: 29,
        OUTFIT: 30,
        PET: 31,
        TELEPORT: 32
    }

    /**
     * @readonly
     * @enum {string}
     */
    const MargoItemLocation = {
        DEPO: "d",
        INVENTORY: "g"
    }

    /**
     * @typedef MargoItem
     * @type {object}
     * @property {number} hid
     * @property {number} tpl 
     * @property {string} name
     * @property {string} icon
     * @property {MargoItemClass} cl
     * @property {number} pr
     * @property {string} prc
     * @property {MargoItemLocation} loc
     * @property {number} st
     * @property {number} own
     * @property {number} x
     * @property {number} y
     * @property {string} stat 
     * @property {boolean} del
     */


    /**
     * @typedef MargoDepoCost
     * @type {object}
     * @property {number | undefined} gold
     * @property {number | undefined} credits
     */

    /**
     * @typedef MargoDepoData
     * @type {object}
     * @property {number} gold
     * @property {number} expire
     * @property {number} size
     * @property {number} msize
     * @property {number} has_multi_items_at_zero_zero
     * @property {MargoDepoCost} cost_create
     * @property {MargoDepoCost} cost_prolong
     * @property {MargoDepoCost} cost_upgrade
     */

    /**
     * @typedef MargoItemData
     * @type {Object.<number, MargoItem>}
     */

    /**
     * @typedef MargoServerResponse
     * @type {object}
     * @property {MargoDepoData} depo
     * @property {MargoItemData} item
     */

    class Item {
        /** 
         * @param {number} id
         * @param {MargoItem} margoItem 
         */
        constructor(id, margoItem) {
            /** @type {number} */
            this.id = id;
            /** @type {MargoItem} */
            this.d = margoItem;
            /** @type {Object.<string, any>} */
            this.stat = null;

            /** @type {HTMLDivElement} */
            this.$ = this.createItemElement();
        }
        getElement() {
            return this.$;
        }
        /** @param {string} name */
        createIcon(name) {
            const $icon = document.createElement("div");
            $icon.classList.add("priw8-ndp-icon", `priw8-ndp-icon-${name}`);
            return $icon;
        }
        createItemElement() {
            const $el = document.createElement("div");
            $el.classList.add("priw8-ndp-item");
            $el.classList.add("priw8-ndp-item-rarity-" + this.getStat().rarity);
            $el.dataset[DepoDataset.ACTION] = DepoActionType.ITEM;
            $el.dataset[DepoDataset.ITEM] = this.id.toString();

            const $item = document.createElement("div");
            const $img = new Image();
            // $img.src = `${ipath}${this.d.icon}`;
            delayedLoadImg($img, `${ipath}${this.d.icon}`);
            $item.appendChild($img);
            $item.classList.add("item");
            
            const stat = this.getStat();
            const quantity = stat.ammo || stat.amount;
            if (quantity) {
                const $quantityLabel = document.createElement("div");
                $quantityLabel.classList.add("priw8-ndp-quantity");
                if (quantity > 1000000) {
                    $quantityLabel.innerText = `${Math.floor(quantity / 100000) / 10}m`;
                } else if (quantity > 10000) {
                    $quantityLabel.innerText = `${Math.floor(quantity / 100) / 10}k`;
                } else {
                    $quantityLabel.innerText = quantity
                };
                $el.appendChild($quantityLabel);
            }

            if (isNewInterface) {
                // TODO
            } else {
                // @ts-expect-error
                $item.setAttribute("tip", window.itemTip(this.d));
                $item.setAttribute("ctip", `t_item t_${this.getStat().rarity.substring(0, 3)}`);
            }

            const $itemName = document.createElement("div");
            $itemName.innerText = this.d.name;
            $itemName.classList.add("priw8-ndp-item-name");

            const $itemIconWrapper = document.createElement("div");
            $itemIconWrapper.classList.add("priw8-ndp-icon-wrapper");

            // TODO is unix_time on NI?
            // @ts-expect-error
            if (stat.expires && stat.expires - unix_time() < 0) {
                $itemIconWrapper.appendChild(this.createIcon("expired"));
            }

            if (stat.enhancement_upgrade_lvl && stat.enhancement_upgrade_lvl > 0) {
                $itemIconWrapper.appendChild(this.createIcon(`upgrade-${stat.enhancement_upgrade_lvl}`));
            }

            if (stat.soulbound) {
                $itemIconWrapper.appendChild(this.createIcon("bound"));
            } else if (stat.binds) {
                $itemIconWrapper.appendChild(this.createIcon("binds"));
            } else if (stat.permbound) {
                $itemIconWrapper.appendChild(this.createIcon("permbound"));
            }

            $el.appendChild($item);
            $el.appendChild($itemName);
            $el.appendChild($itemIconWrapper);

            return $el;
        }
        /** @returns {Object.<string, any>} */
        getStat() {
            if (this.stat)
                return this.stat;

            const stat = {};
            const spl = this.d.stat.split(";");
            for (const statEntry of spl) {
                const sides = statEntry.split("=");
                const lhs = sides[0], rhs = sides[1];
                stat[lhs] = typeof rhs != "undefined" ? rhs : true;
                if (lhs == "action") {
                    const actionType = rhs.split(",")[0];
                    stat[`_${actionType}`] = rhs.split(",")[1] || true;
                }
            }
            if (!stat.rarity) {
                stat.rarity = "common";
            }
            this.stat = stat;
            return stat;
        }
        isHealingItem() {
            const st = this.getStat();
            return (st.leczy && st.leczy > 0) || st.fullheal || (st.perheal && st.perheal > 0);
        }
        isPoisonItem() {
            const st = this.getStat();
            return (st.leczy && st.leczy < 0) || (st.perheal && st.perheal < 0);
        }
        isCustomTeleport() {
            return typeof this.getStat().custom_teleport != "undefined";
        }
        isSetCustomTeleport() {
            return this.isCustomTeleport() && this.getStat().custom_teleport !== true;
        }
        isUnsetCustomTeleport() {
            return this.isCustomTeleport() && this.getStat().custom_teleport === true;
        }
        /** @returns {string} */
        getTeleportDestination() {
            if (this.d.cl == MargoItemClass.TELEPORT) {
                const st = this.getStat();
                if (typeof st.teleport == "string") {
                    return st.teleport.split(",")[3];
                } else if (this.isSetCustomTeleport()) {
                    return st.custom_teleport.split(",")[3];
                }
            }
            return "";
        }
        /** @param {MargoItem} margoItem */
        update(margoItem) {
            this.d = margoItem;
            this.stat = null;
        }
        remove() {
            this.$.parentElement?.removeChild(this.$);
        }
    }

    /**
     * @callback DepoItemPredicate
     * @param {Item} item
     * @returns {boolean}
     */

    class DepoFilter {
        /** 
         * @param {string} name
         * @param {DepoItemPredicate} predicate
         */
        constructor(name, predicate) {
            /** @type {string} */
            this.name = name;

            /** @type {DepoItemPredicate} */
            this.predicate = predicate;

            /** @type {HTMLDivElement} */
            this.$ = document.createElement("div");
            this.$.classList.add("priw8-ndp-filter");
            this.$.innerText = name;
        }
        getElement() {
            return this.$;
        }
        /** @param {boolean} state */
        setActive(state) {
            this.$.classList[state ? "add" : "remove"]("priw8-ndp-filter-active");
        }
        /** @param {Item[]} items */
        filter(items) {
            return items.filter(this.predicate);
        }
    }

    /** 
     * @param {string} name
     * @param {DepoItemPredicate} predicate
     */
    function dp(name, predicate=()=>true) {
        return new DepoFilter(name, predicate);
    }

    const DepoDataset = {
        ACTION: "priw8depoaction",
        ITEM: "priw8depoitemid",
        FILTER: "priw8depofilterindex"
    }

    /** @enum {string} */
    const DepoActionType = {
        MAIN_FILTER: "mainfilter",
        SUB_FILTER: "subfilter",
        ITEM: "item"
    }

    class PrimaryDepoFilter {
        /**
         * @param {DepoFilter} mainFilter 
         * @param {DepoFilter[]} subFilters 
         */
        constructor(mainFilter, subFilters=[]) {
            subFilters.unshift(dp("Wszystko"));

            /** @type {DepoFilter} */
            this.mainFilter = mainFilter;
            /** @type {DepoFilter[]} */
            this.subFilters = subFilters;

            /** @type {DepoFilter} */
            this.currentSubFilter = null;

            /** @type {HTMLDivElement} */
            this.$subFilterWrapper = document.createElement("div");
            for (let i=0; i<subFilters.length; ++i) {
                const subFilter = subFilters[i];
                const dataset = subFilter.getElement().dataset;
                dataset[DepoDataset.ACTION] = DepoActionType.SUB_FILTER;
                dataset[DepoDataset.FILTER] = i.toString();
                this.$subFilterWrapper.appendChild(subFilter.getElement());
            }
        }
        /** @param {Item[]} items */
        filter(items) {
            const mainFiltered = this.mainFilter.filter(items);
            return this.currentSubFilter.filter(mainFiltered);
        }
        getMainElement() {
            return this.mainFilter.getElement();
        }
        getSubFilterElement() {
            return this.$subFilterWrapper;
        }
        /**
         * @param {number} filterIndex 
         */
        switchSubFilter(filterIndex) {
            const filter = this.subFilters[filterIndex];
            if (this.currentSubFilter) {
                this.currentSubFilter.setActive(false);
            }
            this.currentSubFilter = filter;
            this.currentSubFilter.setActive(true);
        }
    }

    const essenceNames = ["Okruchy przeciętności", "Ekstrakt unikalności", "Pryzmat heroicznej magii", "Płomień lepszej mocy", "Esencja sakryfikacji"];
    const eqClasses = [
        MargoItemClass.BOOTS, MargoItemClass.ARMOR, MargoItemClass.GLOVES, MargoItemClass.NECKLACE,
        MargoItemClass.RING, MargoItemClass.HELMET, MargoItemClass.ONEHANDED, 
        MargoItemClass.TWOHANDED, MargoItemClass.ONEANDAHALFHANDED, MargoItemClass.RANGED, 
        MargoItemClass.WAND, MargoItemClass.STAFF, MargoItemClass.SHIELD, MargoItemClass.SECONDARY, 
        /*MargoItemClass.ARROW*/ MargoItemClass.QUIVER
    ]
    const mainWeaponClasses = [
        MargoItemClass.ONEHANDED, MargoItemClass.TWOHANDED, MargoItemClass.ONEANDAHALFHANDED, 
        MargoItemClass.RANGED, MargoItemClass.WAND, MargoItemClass.STAFF,
        MargoItemClass.QUIVER
    ];

    // nice type bro
    /** @type {{[name: string]: {mainFilter: DepoItemPredicate, subFilters: {[name: string]: DepoItemPredicate}}}}} */
    const FilterData = {
        "Wszystko": {
            "mainFilter": () => true,
            "subFilters": {}
        },
        "Neutralne": {
            "mainFilter": item => item.d.cl == MargoItemClass.NEAUTRAL,
            "subFilters": {}
        },
        "Ekwipunek": {
            "mainFilter": item => eqClasses.includes(item.d.cl),
            "subFilters": {
                // TODO: same order as auction
                "Bronie": item => mainWeaponClasses.includes(item.d.cl),
                "Pomocnicze": item => item.d.cl == MargoItemClass.SECONDARY,
                "Tarcze": item => item.d.cl == MargoItemClass.SHIELD,
                "Strzały": item => item.d.cl == MargoItemClass.QUIVER,
                "Zbroje": item => item.d.cl == MargoItemClass.ARMOR,
                "Hełmy": item => item.d.cl == MargoItemClass.HELMET,
                "Rękawice": item => item.d.cl == MargoItemClass.GLOVES,
                "Buty": item => item.d.cl == MargoItemClass.BOOTS,
                "Pierścienie": item => item.d.cl == MargoItemClass.RING,
                "Naszyjniki": item => item.d.cl == MargoItemClass.NECKLACE
            }
        },
        "Konsumpcyjne": {
            "mainFilter": item => item.d.cl == MargoItemClass.CONSUMABLE,
            "subFilters": {
                // "Teleporty": item => {
                //     const stat = item.getStat();
                //     return stat.teleport || stat.custom_teleport;
                // },
                "Potki": item => item.isHealingItem(),
                "Trucizny": item => item.isPoisonItem(),
                "Przywołania": item => item.getStat().summonparty,
                "Wyczerpanie": item => item.getStat()._fatigue,
                "Respiacze": item => item.getStat().revive,
                "Wykrywacze": item => item.getStat()._nloc,
                "Poczta": item => item.getStat()._mail,
                "Sklep": item => item.getStat()._shop,
                "Leczenie w walce": item => item.getStat()._fightperheal,
                "Zaśpiewy": item => item.getStat().battlestats,
                // "Outfity": item => item.getStat().outfit || item.getStat().outfit_selector,
                // "Maskotki": item => item.getStat().pet,
            }
        },
        "Teleporty": {
            "mainFilter": item => item.d.cl == MargoItemClass.TELEPORT,
            "subFilters": {
                "Zwykłe": item => !item.isCustomTeleport(),
                "KCS/ZCS (ustawione)": item => item.isSetCustomTeleport(),
                "KCS/ZCS (nieustawione)": item => item.isUnsetCustomTeleport()
            }
        },
        "Outfity": {
            "mainFilter": item => item.d.cl == MargoItemClass.OUTFIT,
            "subFilters": {}
        },
        "Maskotki": {
            "mainFilter": item => item.d.cl == MargoItemClass.PET,
            "subFilters": {}
        },
        "Błogosławieństwa": {
            "mainFilter": item => item.d.cl == MargoItemClass.BLESSING,
            "subFilters": {
                "Loot": item => item.getStat().npc_lootbon,
                "Exp mobki": item => item.getStat().npc_expbon,
                "Exp questy": item => item.getStat().quest_expbon
            }
        },
        "Ulepszenia": {
            "mainFilter": item => {
                const stat = item.getStat();
                return item.d.cl == MargoItemClass.ENHANCEMENT || essenceNames.includes(item.d.name)
            },
            "subFilters": {
                "Punkty": item => item.getStat().enhancement_add_point || item.getStat().enhancement_add,
                "Esencja": item => essenceNames.includes(item.d.name),
                "Odnawianie": item => item.getStat().upgtimelimit,
                "Odwiązanie": item => item.getStat().unbind,
                "Obniżenie": item => item.getStat().lowreq,
            }
        },
        "Torby": {
            "mainFilter": item => item.d.cl == MargoItemClass.BAG,
            "subFilters": {}
        },
        "Klucze": {
            "mainFilter": item => item.d.cl == MargoItemClass.KEY,
            "subFilters": {}
        },
        "Talizmany": {
            "mainFilter": item => item.d.cl == MargoItemClass.CHARM,
            "subFilters": {}
        },
        "Recepty": {
            "mainFilter": item => item.d.cl == MargoItemClass.RECIPE,
            "subFilters": {}
        },
        "Książki": {
            "mainFilter": item => item.d.cl == MargoItemClass.BOOK,
            "subFilters": {}
        },
        "Waluta": {
            "mainFilter": item => item.d.cl == MargoItemClass.CURRENCY,
            "subFilters": {}
        },
        "Questowe": {
            "mainFilter": item => item.d.cl == MargoItemClass.QUEST,
            "subFilters": {}
        }
    }

    /** 
     * @callback DepoSortFunc
     * @param {Item} item1
     * @param {Item} item2
     * @returns {number}
     */

    /** @type {{[name: string]: {key: string, friendlyName: string, fun: DepoSortFunc}}} */
    const SortOrder = {
        "LAST": {
            "key": "LAST",
            "friendlyName": "Data dodania",
            "fun": (a, b) => {
                const tsA = settings.get(`item-ts/${a.id}`, 0);
                const tsB = settings.get(`item-ts/${b.id}`, 0);
                return tsB - tsA;
            }
        },
        "CREATED": {
            "key": "CREATED",
            "friendlyName": "Data utworzenia",
            "fun": (a, b) => {
                return b.id - a.id;
            }
        },
        "ABC": {
            "key": "ABC",
            "friendlyName": "Alfabetycznie",
            "fun": (a, b) => {
                return a.d.name.localeCompare(b.d.name);
            }
        }
    }
    const DefaultSortOrder = SortOrder.LAST.key;

    /** @enum {number} */
    const NdpMode = {
        DEPO: 0,
        ROOM: 1
    }

    class NewDepoPlus {
        constructor() {
            /** @type {NdpMode} */
            this.mode = NdpMode.DEPO;

            /** @type {boolean} */
            this.active = false;

            /** @type {MargoDepoData | null} */
            this.depoData = null;

            /** @type {number[]} */
            this.freeSpaceMatrix = [];

            /** @type {number} */
            this.freeSpaceCount = 0;

            /** @type {PrimaryDepoFilter} */
            this.currentFilter = null;

            /** @type {string} */
            this.currentSort = DefaultSortOrder;

            /** @type {PrimaryDepoFilter[]} */
            this.filters = [];
            for (const mainName in FilterData) {
                const mainFilter = FilterData[mainName];
                const subFilters = [];
                for (const subName in mainFilter.subFilters) {
                    subFilters.push(dp(subName, mainFilter.subFilters[subName]));
                }
                this.filters.push(new PrimaryDepoFilter(dp(mainName, mainFilter.mainFilter), subFilters));
            }
            
            /** @type {string} */
            this.currentSearch = "";

            /** @type {boolean} */
            this.currentSearchDesc = true;

            for (let i=0; i<this.filters.length; ++i) {
                const dataset =this.filters[i].getMainElement().dataset;
                dataset[DepoDataset.ACTION] = DepoActionType.MAIN_FILTER;
                dataset[DepoDataset.FILTER] = i.toString();
            }

            /** @type {Object.<number, Item>} */
            this.depoItems = {};

            /** @type {HTMLDivElement} */
            this.$ = this.createElement()

            this.createCSS();

            this.initInputParser();

            this.initListener();

            this.switchMainFilter(0);

            // this.show();
        }
        getItems() {
            if (this.mode == NdpMode.DEPO) {
                return this.depoItems;
            } else if (this.mode == NdpMode.ROOM) {

            }
        }
        /** @param {number} size */
        initFreeSpaceMatrix(size) {
            this.freeSpaceMatrix = [];
            const totalSpace = size * DepoSizeUnit;
            for (let i=0; i<totalSpace; ++i) {
                this.freeSpaceMatrix.push(1);
            }

            let freeSpace = this.depoData.size * DepoSizeUnit;
            const items = this.getItems();
            for (const id in items) {
                const item = items[id];
                const itemIndex = item.d.y + item.d.x * DepoTabHeight;
                this.freeSpaceMatrix[itemIndex] = 0;
                freeSpace -= 1;
            }
            this.setFreeSpaceCount(freeSpace);
        }
        /** @param {number} amount */
        setFreeSpaceCount(amount) {
            this.freeSpaceCount = amount;
            this.$.querySelector(".priw8-ndp-current-space").innerHTML = `${amount} / ${this.depoData.size * DepoSizeUnit}`;
        }
        /** 
         * @param {number} x
         * @param {number} y
         * @param {number} state
        */
        markSpace(x, y, state) {
            // if (x == 0)
            // console.log(`Mark ${x},${y} = ${state}`);
            const itemIndex = y + x * DepoTabHeight;
            this.freeSpaceMatrix[itemIndex] = state;

            this.setFreeSpaceCount(this.freeSpaceCount + (state ? 1 : -1));
        }
        /** @returns {{x: number, y: number}} */
        findFreeSpace() {
            const ind = this.freeSpaceMatrix.indexOf(1);
            if (ind == -1)
                return null;

            const x = Math.floor(ind / DepoTabHeight);
            const y = ind - x * DepoTabHeight;
            return {x: x, y: y};
        }
        /** @param {string} id */
        putDepoItem(id) {
            const pos = this.findFreeSpace();
            if (!pos) {
                // @ts-expect-error
                window.message("Brak miejsca w depozycie!");
            } else {
                console.log("putDepoItem", pos);
                // @ts-expect-error
                window._g(`depo&put=${id}&x=${pos.x}&y=${pos.y}`);
            }
        }
        /**
         * @param {number} filterIndex 
         */
        switchMainFilter(filterIndex) {
            const filter = this.filters[filterIndex];
            if (this.currentFilter) {
                this.currentFilter.mainFilter.setActive(false);
            }
            this.currentFilter = filter;
            filter.mainFilter.setActive(true);
            const $subfilters = this.$.querySelector(".priw8-ndp-subfilters");
            $subfilters.innerHTML = "";
            $subfilters.appendChild(filter.getSubFilterElement());
            this.switchSubFilter(0);
            this.updateItems();
        }
        /**
         * @param {number} filterIndex 
         */
        switchSubFilter(filterIndex) {
            this.currentFilter.switchSubFilter(filterIndex);
            this.updateItems();
        }
        /**
         * @param {number} itemID 
         */
        withdrawItem(itemID) {
            // TODO: check for full bags
            const item = this.getItems()[itemID];
            item.$.style.display = "none";
            // @ts-expect-error
            _g(`depo&get=${itemID}`, function() {
                if (this.items[itemID]) {
                    // depo get failure, rollback
                    item.$.style.display = "unset";
                }
            });
        }
        getItemWrapper() {
            return this.$.querySelector(".priw8-ndp-items");
        }
        /** @param {Item[]} allItems */
        filter(allItems) {
            const filteredItems = this.currentFilter.filter(allItems);
            const searchedItems = filteredItems.filter(item => {
                if (this.currentSearchDesc) {
                    const desc = item.getStat().opis;
                    if (desc && desc.toLowerCase().indexOf(this.currentSearch) > -1)
                        return true; 

                    const destination = item.getTeleportDestination();
                    if (destination && destination.toLowerCase().includes(this.currentSearch)) {
                        return true;
                    }
                }

                return item.d.name.toLowerCase().indexOf(this.currentSearch) != -1;
            });
            return searchedItems.sort(SortOrder[this.currentSort].fun);
        }
        updateItems() {
            /** @type {Item[]} */
            const allItems = Object.values(this.getItems());
            const filteredItems = this.filter(allItems);
            const $items = this.getItemWrapper();
            $items.innerHTML = "";
            for (const item of filteredItems) {
                $items.appendChild(item.$);
            }
        }
        /** @param {Event} e */
        updateSort(e) {
            // @ts-expect-error
            this.currentSort = e.target.value;
            this.updateItems();
        }
        initListener() {
            this.$.addEventListener("click", e => {
                if (e.target instanceof HTMLElement) {
                    return bubbleUpElement(e.target, this.tryElementClick.bind(this), 3);
                }
            });

            // init search inputs
            this.$.querySelector(".priw8-ndp-search").addEventListener("keyup", this.updateSearch.bind(this));
            this.$.querySelector(".priw8-ndp-search-check").addEventListener("change", this.updateSearchDesc.bind(this));

            this.$.querySelector(".priw8-ndp-sort").addEventListener("change", this.updateSort.bind(this));

            document.body.addEventListener("click", e => {
                if (this.active && e.target instanceof HTMLElement) {
                    return bubbleUpElement(e.target, this.tryItemClick.bind(this), 3);
                }
            });
        }
        /** @param {HTMLElement} el */
        tryItemClick(el) {
            if (el.classList.contains("item")) {
                if (isNewInterface) {

                } else {
                    const id = el.getAttribute("id")?.substring(4);
                    if (!isNaN(parseInt(id))) {
                        /** @type {MargoItem} */
                        // @ts-expect-error
                        const item = g.item[id];
                        if (item.loc == "g" && item.st == 0) {
                            this.putDepoItem(id);
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /** @param {Event} e */
        updateSearch(e) {
            // @ts-expect-error
            this.currentSearch = e.target.value.toLowerCase();
            this.updateItems();
        }
        /** @param {Event} e */
        updateSearchDesc(e) {
            // @ts-expect-error
            this.currentSearchDesc = e.target.checked;
            this.updateItems();
        }
        /** @param {HTMLElement} $el */
        tryElementClick($el) {
            const dataset = $el.dataset;
            const action = dataset[DepoDataset.ACTION];
            if (action == DepoActionType.MAIN_FILTER) {
                this.switchMainFilter(parseInt(dataset[DepoDataset.FILTER]));
                return true;
            } else if (action == DepoActionType.SUB_FILTER) {
                this.switchSubFilter(parseInt(dataset[DepoDataset.FILTER]));
                return true;
            } else if (action == DepoActionType.ITEM) {
                this.withdrawItem(parseInt(dataset[DepoDataset.ITEM]));
                return true;
            }
            return false;
        }
        show() {
            this.active = true;
            addLock("priw8-ndp");;
            if (!isNewInterface) {
                document.querySelector("#centerbox").appendChild(this.$);
            } else {

            }
        }
        hide() {
            this.active = false;
            removeLock("priw8-ndp");
            if (this.$.parentElement)
                this.$.parentElement.removeChild(this.$);

            if (!isNewInterface) {
                // @ts-expect-error
                depoHide();
            } else {
                // todo
            }
        }
        createCSS() {
            const css = `
                .priw8-ndp-window {
                    width: 512px;
                    height: 512px;
                    z-index: 350;
                    position: absolute;
                    background: rgb(0, 0, 50);
                    font-family: sans-serif;
                    color: #CCCCCC;
                    color-scheme: dark;
                }
                .priw8-ndp-window.priw8-ni {
                    border: 1px solid #333333;
                }
                .priw8-ndp-title {
                    height: 24px;
                    border-bottom: 1px solid #333333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgb(0, 0, 70);
                }
                .priw8-ndp-header {
                    padding-left: 10px;
                    color: #EEEEEE;
                }
                .priw8-ndp-close {
                    height: 100%;
                    line-height: 24px;
                    background: rgba(0, 0, 0, 0.5);
                    width: 32px;
                    text-align: center;
                    box-sizing: border-box;
                    cursor: pointer;
                }
                .priw8-ndp-close:hover {
                    background: rgba(128, 32, 32, 0.7);
                    color: white;
                }

                .priw8-ndp-topbar-wrapper {
                    display: flex;
                    height: 32px;
                    border-bottom: 1px solid #333333;
                    background: #111136;
                }

                .priw8-ndp-main-wrapper {
                    display: flex;
                    height: calc(100% - 58px);
                }

                .priw8-ndp-section {
                    flex: 1;
                }

                .priw8-ndp-section.priw8-ndp-middle {
                    border-left: 1px solid #333333;
                    border-right: 1px solid #333333;
                }

                .priw8-ndp-gold {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 135px;
                    position: absolute;
                    right: 0px;
                    bottom: 0px;
                    border-top: 1px solid #222233;
                }

                .priw8-ndp-gold-display {
                    text-align: center;
                    color: #dede96;
                    font-size: 12px;
                    padding-top: 2px;
                }

                .priw8-ndp-gold-controls {
                    display: flex;
                }
                .priw8-ndp-gold-controls > * {
                    height: 14px;
                    font-size: 10px;
                    box-sizing: border-box;
                }
                .priw8-ndp-gold-input {
                    width: 0px;
                    flex: 16;
                    border: 1px solid #222233;
                    background: #000000;
                    color: #dede96;
                    text-align: center;
                    cursor: text;
                }
                .priw8-ndp-goldout, .priw8-ndp-goldin {
                    flex: 1;
                    font-family: monospace;
                    line-height: 11px;
                }
                .priw8-ndp-button {
                    border: 1px solid #222233;
                    background: #222222;
                    cursor: pointer;
                }
                .priw8-ndp-button:hover {
                    background: #2A2A2A;
                }
                .priw8-ndp-goldout {
                    color: red;
                }
                .priw8-ndp-goldin {
                    color: green;
                }

                .priw8-ndp-filter {
                    text-align: center;
                    border-bottom: 1px solid #333333;
                    padding: 4px;
                    cursor: pointer;
                    font-size: 15px;
                }
                .priw8-ndp-filter:hover, .priw8-ndp-filter-active {
                    background: rgb(0, 0, 70);
                    color: white;
                }

                .priw8-ndp-items {
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                .priw8-ndp-item {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    padding-top: 2px;
                    padding-right: 2px;
                    cursor: pointer;
                    position: relative;
                }
                .priw8-ndp-item * {
                    cursor: pointer;
                }
                .priw8-ndp-item:hover {
                    filter: brightness(120%);
                }
                .priw8-ndp-item:hover .item, .priw8-ndp-item:hover .priw8-ndp-item-name {
                    transform: translateX(3px);
                    transition: transform .1s ease;
                }

                .priw8-ndp-item .item {
                    position: relative;
                }
                .priw8-ndp-item .item img {
                    width: 32px;
                    position: unset;
                }
                .priw8-ndp-item-rarity-common {
                    background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 100%);
                }
                .priw8-ndp-item-rarity-unique {
                    background: linear-gradient(90deg, rgb(255 235 0 / 39%) 0%, rgba(0,0,0,0) 100%);
                }
                .priw8-ndp-item-rarity-heroic {
                    background: linear-gradient(90deg, rgb(0 31 255 / 39%) 0%, rgba(0,0,0,0) 100%);
                }
                .priw8-ndp-item-rarity-upgraded {
                    background: linear-gradient(90deg, rgb(251 0 255 / 39%) 0%, rgba(0,0,0,0) 100%);
                }
                .priw8-ndp-item-rarity-legendary {
                    background: linear-gradient(90deg, rgb(245 158 0 / 39%) 0%, rgba(0,0,0,0) 100%);
                }
                .priw8-ndp-item-rarity-artefact {
                    background: linear-gradient(90deg, rgb(245 0 0 / 39%) 0%, rgba(0,0,0,0) 100%);
                }
                .priw8-ndp-quantity {
                    position: absolute;
                    bottom: 0px;
                    background: rgba(0,0,0,0.5);
                    padding-right: 1px;
                    padding-top: 1px;
                    z-index: 1;
                    font-size: 9px;
                }
                .priw8-ndp-wide {
                    flex: 1.8;
                }
                .priw8-ndp-search, .priw8-ndp-sort {
                    border: 1px solid #222233;
                    background: #000000;
                    height: 70%;
                    flex: 1;
                }
                .priw8-ndp-upper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .priw8-ndp-icon-wrapper {
                    margin-left: auto;
                    display: flex;
                    pointer-events: none;
                }
                .priw8-ndp-icon {
                    background-image: url(https://commons.margonem.pl/img/notyfikacje-sprite.png?v=3);
                    width: 20px;
                    height: 20px;
                }
                .priw8-ndp-icon-bound {
                    width: 16px;
                    background-position: -2px 0px;
                }
                .priw8-ndp-icon-binds {
                    width: 16px;
                    background-position: -22px 0px;
                }
                .priw8-ndp-icon-permbound {
                    width: 16px;
                    background-position: -122px -120px;
                }
                .priw8-ndp-icon-upgrade-1 {
                    width: 23px;
                    background-position: -140px -120px;
                }
                .priw8-ndp-icon-upgrade-2 {
                    width: 23px;
                    background-position: -163px -120px;
                }
                .priw8-ndp-icon-upgrade-3 {
                    width: 23px;
                    background-position: -186px -120px;
                }
                .priw8-ndp-icon-upgrade-4 {
                    width: 23px;
                    background-position: -209px -120px;
                }
                .priw8-ndp-icon-upgrade-5 {
                    width: 23px;
                    background-position: -232px -120px;
                }
                @keyframes priw8-ndp-hovering {
                    0% {
                        transform: translateY(-2px);
                    }
                    100% {
                        transform: translateY(2px);
                    }
                }
                .priw8-ndp-icon-expired {
                    width: 12px;
                    background-position: -390px 0px;
                    animation-name: priw8-ndp-hovering;
                    animation-duration: 0.5s;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                    animation-timing-function: ease-in-out;
                }
                .priw8-ndp-space {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin-left: auto;
                    padding-right: 5px;
                }
                .priw8-ndp-current-space {
                    padding-left: 8px;
                }
            `;
            const $style = document.createElement("style");
            $style.innerHTML = css;
            document.head.appendChild($style);
        }
        createElement() {
            const $el = document.createElement("div");
            $el.classList.add("priw8-ndp-window", isNewInterface ? "priw8-ni" : "priw8-si");

            $el.innerHTML = 
            `
                <div class="priw8-ndp-title">
                    <div class="priw8-ndp-header">newDepo+</div>
                    <div class="priw8-ndp-space">
                        <div class="priw8-ndp-expire"></div>
                        <div class="priw8-ndp-prolong"><button class="priw8-ndp-button" data-ndphandler="depoProlong">+</button></div>
                        <div class="priw8-ndp-current-space" data-ndptip="Wolne miejsca"></div>
                        <div class="priw8-ndp-expand"><button class="priw8-ndp-button" data-ndphandler="depoExpand">+</button></div>
                    </div>
                    <div class="priw8-ndp-close" data-ndphandler="hide">X</div>
                </div>
                <div class="priw8-ndp-topbar-wrapper">
                    <div class="priw8-ndp-section priw8-ndp-wide priw8-ndp-upper">
                        <input placeholder="Szukaj..." class="priw8-ndp-search"></input>
                        <input type="checkbox" class="priw8-ndp-search-check" data-ndptip="Szukaj w opisach" checked>
                    </div>
                    <div class="priw8-ndp-section priw8-ndp-middle priw8-ndp-upper">
                        <select class="priw8-ndp-sort" value="${DefaultSortOrder}">
                            ${Object.values(SortOrder).map(s => `<option value="${s.key}">${s.friendlyName}</option>`)}
                        </select>
                    </div>
                    <div class="priw8-ndp-section priw8-ndp-upper">

                    </div>
                </div>
                <div class="priw8-ndp-main-wrapper">
                    <div class="priw8-ndp-section priw8-ndp-items priw8-ndp-wide">

                    </div>
                    <div class="priw8-ndp-section priw8-ndp-middle">
                        <div class="priw8-ndp-primary-filters"></div>
                    </div>
                    <div class="priw8-ndp-section priw8-ndp-subfilters">

                    </div>
                    <div class="priw8-ndp-gold">
                        <div class="priw8-ndp-gold-display">Złoto: 0</div>
                            <div class="priw8-ndp-gold-controls">
                                <input class="priw8-ndp-gold-input" spellcheck="false">
                                <button class="priw8-ndp-button priw8-ndp-goldin" data-ndptip="Wpłać złoto" data-ndphandler="goldIn">+</button>
                                <button class="priw8-ndp-button priw8-ndp-goldout" data-ndptip="Wypłać złoto" data-ndphandler="goldOut">-</button>
                            </div>
                        </div>
                    </div>
            `;

            $el.addEventListener("click", e => {
                /** @type {HTMLElement} */
                // @ts-ignore
                const tar = e.target;
                if (tar.dataset.ndphandler) {
                    this[tar.dataset.ndphandler](tar.dataset, tar);
                }
            });

            const $tipElements = $el.querySelectorAll("[data-ndptip]");
            for (const $tipElement of $tipElements) {
                // @ts-ignore
                setTip($tipElement, $tipElement.dataset.ndptip);;
            }

            const $primaryFilters = $el.querySelector(".priw8-ndp-primary-filters");
            for (const filter of this.filters) {
                $primaryFilters.appendChild(filter.getMainElement());
            }

            return $el;
        }
        depoProlong() {
            // @ts-expect-error
            _g("depo&pay=z&time=1");
        }
        depoExpand() {
            if (!isNewInterface) {
                // @ts-expect-error
                mAlert(`Czy na pewno chcesz powiększyć depozyt? Koszt jednego ulepszenia to ${this.depoData.cost_upgrade.credits}SŁ.`, 2, [function(){_g('depo&upgrade=1')}])
            } else {
                // TODO NI confirm
            }
        }
        getAndClearGoldInput() {
            /** @type {HTMLInputElement} */
            const $inp = this.$.querySelector(".priw8-ndp-gold-input");
            const val = $inp.value;
            const res = this.parseGoldValue(val);
            if (res) {
                $inp.value = "";
            }
            return res;
        }
        /** @param {string} val */
        parseGoldValue(val) {
            const trimmed = val.trim();
            const lastCharacter = trimmed.charAt(trimmed.length - 1);
            const postfixValues = {
                "k": 1000,
                "m": 1000000,
                "g": 1000000000
            }
            const numVal = postfixValues[lastCharacter] ? trimmed.substring(0, trimmed.length - 1) : trimmed;
            const multiplier = postfixValues[lastCharacter] || 1;

            const res = parseFloat(numVal) * multiplier;

            if (isNaN(res)) {
                // @ts-expect-error
                message("Niepoprawna ilość złota!");
                return 0;
            }
            return res;
        }
        goldIn() {
            const amount = this.getAndClearGoldInput();
            // @ts-expect-error
            _g(`depo&goldin=${amount}`);
        }
        goldOut() {
            const amount = this.getAndClearGoldInput();
            // @ts-expect-error
            _g(`depo&goldout=${amount}`);
        }
        initInputParser() {
            const self = this;
            if (!isNewInterface) {
                // @ts-ignore
                const _pI = window.parseInput;
                /** @param {MargoServerResponse} data */
                // @ts-ignore
                window.parseInput = function(data) {
                    const isInitDepo = typeof data.depo != "undefined";
                    if (data.depo) {
                        self.onDepo(data.depo);
                        delete data.depo;
                    }
                    if (data.item) {
                        self.onItem(data.item, isInitDepo);
                    }
                    return _pI.apply(this, arguments);
                }
            } else {

            }
        }
        /** @param {number} num */
        formatNumber(num) {
            const strNum = num.toString();
            let res = "";
            let c = 0;
            for (let i=strNum.length-1; i>=0; --i) {
                res = strNum.charAt(i) + res;
                if (c == 2) {
                    res = " " + res;
                    c = 0;
                } else {
                    ++c;
                }
            }
            return res.trim();
        }
        /** @param {number} gold */
        setGold(gold) {
            this.$.querySelector(".priw8-ndp-gold-display").innerHTML = `Złoto: ${this.formatNumber(gold)}`;
        }
        /** @param {MargoDepoData} depoData */
        onDepo(depoData) {
            this.depoData = depoData;
            this.setGold(depoData.gold);
            this.setStateInfo(depoData);
            this.initFreeSpaceMatrix(depoData.size);
            this.show();
        }
        /** @param {MargoDepoData} depoData */
        setStateInfo(depoData) {
            /** @type {HTMLElement} */
            const $expire = this.$.querySelector(".priw8-ndp-expire");
            if (depoData.expire > 0) {
                const d = new Date(depoData.expire * 1000);
                $expire.innerHTML = d.toLocaleDateString();
                setTip($expire, `Opłacone do: ${d.toLocaleString()}`);
            } else {
                $expire.innerHTML = "Nieopłacone"
                setTip($expire, `Nie posiadasz wykupionego depozytu!`);
            }
            if (depoData.expire < new Date().getTime() / 1000) {
                $expire.style.color = "#ff6b6b";
            } else {
                $expire.style.color = "unset";
            }

            console.log(depoData);
            setTip(this.$.querySelector(".priw8-ndp-prolong"), `Przedłuż za ${this.formatNumber(depoData.cost_prolong.gold)} złota`);
            setTip(this.$.querySelector(".priw8-ndp-expand"), `Powiększ za ${this.formatNumber(depoData.cost_upgrade.credits)} SŁ`);
        }
        /** @param {MargoItemData} itemData */
        onItem(itemData, isInitDepo) {
            const items = this.getItems();
            const addedItems = [];
            for (const id in itemData) {
                const item = itemData[id];
                if (item.loc == MargoItemLocation.DEPO) {
                    if (!items[id])
                        this.markSpace(item.x, item.y, 0);
                    addedItems.push(this.addItem(parseInt(id), item));
                } else if (items[id]) {
                    const it = items[id].d;
                    this.markSpace(it.x, it.y, 1);
                    this.removeItem(parseInt(id));
                }
            }
            if (addedItems.length > 0) {
                if (!isInitDepo) {
                    for (const item of addedItems) {
                        settings.set(`item-ts/${item.id}`, new Date().getTime());
                    }
                }
                if (this.currentSort == SortOrder.LAST.key) {
                    const filteredItems = this.filter(addedItems);
                    const $items = this.getItemWrapper();
                    let $firstChild = $items.childNodes[0];
                    for (const item of filteredItems) {
                        if ($firstChild && !isInitDepo) {
                            $items.insertBefore(item.$, $firstChild);
                        } else {
                            $items.appendChild(item.$);
                            $firstChild = item.$;
                        }
                    }
                } else {
                    // TODO: keep the sorted items array somewhere and just add to it, then find where to append children
                    this.updateItems();
                }
            }
        }
        /** 
         * @param {number} id
         * @param {MargoItem} margoItem */
        addItem(id, margoItem) {
            const items = this.getItems();
            const existingItem = items[id];
            if (existingItem) {
                existingItem.update(margoItem);
            } else {
                items[id] = new Item(id, margoItem);
            }
            return items[id];
        }
        /** @param {number} id */
        removeItem(id) {
            const items = this.getItems();
            const existingItem = items[id];
            if (existingItem) {
                existingItem.remove();
                delete items[id];
            }
        }
    }

    // @ts-ignore
    window.__priw8_newDepoPlus = new NewDepoPlus();
}