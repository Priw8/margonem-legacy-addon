// npcEmo - wyświetlanie ikonek nad NPC na SI (tylko standardowych)

// v1.1: Dodana obsługa npc.killSeconds

!function() {
    const NpcEmoType = {
        NONE: 0,
        NPC_TALK: 1,
        DAILY_QUEST: 2,
        NORMAL_QUEST: 3,
        AGGRESSIVE: 4,
        BATTLE: 5,
        AUCTION: 6,
        MAIL: 7,
        SHOP: 8,
        HEAL: 9,
        DEPO: 10,
        DEPO_CLAN: 11,
        INKEEPER: 12,
        KILL_TIMER: 13
    }

    const NpcEmoUrl = {
        [NpcEmoType.NPC_TALK]: "talking_mark.gif",
        [NpcEmoType.DAILY_QUEST]: "daily_quest_mark.gif",
        [NpcEmoType.NORMAL_QUEST]: "quest_mark.gif",
        [NpcEmoType.AGGRESSIVE]: "angry-demon.gif",
        [NpcEmoType.BATTLE]: "battle.gif",
        [NpcEmoType.AUCTION]: "auctions_mark.gif",
        [NpcEmoType.MAIL]: "mail_mark.gif",
        [NpcEmoType.SHOP]: "shop_mark.gif",
        [NpcEmoType.HEAL]: "heal_mark.gif",
        [NpcEmoType.DEPO]: "depo_mark.gif",
        [NpcEmoType.DEPO_CLAN]: "depo_mark.gif",
        [NpcEmoType.INKEEPER]: "inn_mark.gif"
    }

    const npcEmoHandlers = {
        [NpcEmoType.KILL_TIMER]: function(npc) {
            if (!npc)
                return "";

            const killTS = Math.floor(new Date().getTime() / 1000) + npc.killSeconds;
            return `
                <div class="priw8-npc-emo-kill-timer" data-killts="${killTS}">
                    ${formatTimeLeft(killTS)}
                </div>
            `
        }
    }

    const NpcEmoPriority = {
        [NpcEmoType.MAIL]: 1,
        [NpcEmoType.INKEEPER]: 2,
        [NpcEmoType.DEPO_CLAN]: 3,
        [NpcEmoType.AUCTION]: 4,
        [NpcEmoType.DEPO]: 5,
        [NpcEmoType.SHOP]: 6,
        [NpcEmoType.HEAL]: 7,
        [NpcEmoType.DAILY_QUEST]: 8,
        [NpcEmoType.NORMAL_QUEST]: 9,
        [NpcEmoType.NPC_TALK]: 10,
        [NpcEmoType.AGGRESSIVE]: 11,
        [NpcEmoType.BATTLE]: 12,
        [NpcEmoType.KILL_TIMER]: 13
    }

    const NpcEmoFlags = {
        [1 << 0]: NpcEmoType.INKEEPER,
        [1 << 1]: NpcEmoType.AUCTION,
        [1 << 2]: NpcEmoType.MAIL,
        [1 << 3]: NpcEmoType.DEPO,
        [1 << 4]: NpcEmoType.DEPO_CLAN,
        [1 << 5]: NpcEmoType.SHOP,
        [1 << 6]: NpcEmoType.DAILY_QUEST,
        [1 << 7]: NpcEmoType.NORMAL_QUEST,
        [1 << 8]: NpcEmoType.HEAL
    }

    const NpcEmoNoBubble = {
        [NpcEmoType.AGGRESSIVE]: true,
        [NpcEmoType.BATTLE]: true,
        [NpcEmoType.KILL_TIMER]: true
    }

    const SpeechBubbleUrl = "speech_bubble.gif";

    function getFullUrl(filename) {
        return CFG.epath + filename;
    }

    const css = 
`
/* Disable original emos */
.npc > img, .dialogCloud, .npc > .qm {
    display: none;
}

.npc {
    display: flex;
    justify-content: center;
}

.priw8-npc-emo-wrapper {
    width: 24px;
    height: 24px;
    background: url(${getFullUrl(SpeechBubbleUrl)});
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -24px;
    pointer-events: none;
}
.priw8-npc-emo-wrapper.priw8-npc-emo-wrapper-no-bg {
    background: none;
}
.priw8-npc-emo-wrapper img {
    position: unset;
}
.priw8-npc-emo-kill-timer {
    background: rgba(0, 0, 0, 0.6);
    font-size: 11px;
    padding: 3px;
    line-height: 11px;
    height: 10px;
}
`;
    const $style = document.createElement("style");
    $style.innerHTML = css;
    document.head.appendChild($style);

    const _pI = window.parseInput;
    window.parseInput = function(data) {
        const res = _pI.apply(this, arguments);
        if (data.npc) {
            onNpc(data.npc);
        }
        if (data.d) {
            onDialog(data.d);
        }
        if (data.emo) {
            onEmo(data.emo);
        }
        return res;
    }

    setInterval(() => {
        const killTimers = document.querySelectorAll(".priw8-npc-emo-kill-timer");
        for (const timer of killTimers) {
            const killTs = parseInt(timer.dataset.killts);
            timer.innerHTML = formatTimeLeft(killTs);
        }
    }, 1000);

    function formatTimeLeft(expireTS) {
        const diff = Math.max(0, expireTS - Math.floor(new Date().getTime() / 1000));
        const seconds = diff % 60;
        const minutes = Math.floor(diff / 60) % 60;
        const hours = Math.floor(diff / 3600);
        return `${toDoubleDigitNumber(hours)}:${toDoubleDigitNumber(minutes)}:${toDoubleDigitNumber(seconds)}`;
    }

    function toDoubleDigitNumber(n) {
        const s = n.toString();
        return s.length > 1 ? s : "0" + s;
    }

    /** @param {Set<number>} emos */
    function getHighestPriorityEmo(emos) {
        let highest = 0;
        let highestEmo = NpcEmoType.NONE;
        for (const emo of emos.values()) {
            if (NpcEmoPriority[emo] > highest) {
                highest = NpcEmoPriority[emo];
                highestEmo = emo;
            }
        }
        return highestEmo;
    }

    function parseNpcEmos(id, npc) {
        const emos = [];
        for (const actionFlag in NpcEmoFlags) {
            if (npc.actions & actionFlag) {
                emos.push(NpcEmoFlags[actionFlag]);
            }
        }

        // Agressive attack npcs
        if (npc.type == 3 && hero.lvl - 1 <= npc.lvl) {
            emos.push(NpcEmoType.AGGRESSIVE);
        }

        // debug
        //npc.killSeconds = 200;
        if (npc.killSeconds && npc.killSeconds > 0) {
            emos.push(NpcEmoType.KILL_TIMER);
        }

        return emos;
    }

    function queueSetNpcDisplayEmo(id, emo) {
        g.loadQueue.push({
            fun: () => {
                const $npc = document.querySelector(`#npc${id}`);
                if ($npc) {
                    setNpcDisplayEmo($npc, emo, id);
                }
            },
            data: ""
        })
    }

    function getNpcEmoWrapper($npc) {
        const existingWrapper = $npc.querySelector(".priw8-npc-emo-wrapper");
        if (existingWrapper)
            return existingWrapper;

        const $wrapper = document.createElement("div");
        $wrapper.classList.add("priw8-npc-emo-wrapper");

        $npc.appendChild($wrapper);
        return $wrapper;
    }

    function removeNpcEmoWrapper($npc) {
        const $wrapper = $npc.querySelector(".priw8-npc-emo-wrapper");
        if ($wrapper)
            $npc.removeChild($wrapper);
    }

    function setNpcDisplayEmo($npc, emo, id) {
        if (emo == NpcEmoType.NONE) {
            removeNpcEmoWrapper($npc);
            return;
        }

        const $wrapper = getNpcEmoWrapper($npc);

        if (NpcEmoNoBubble[emo]) {
            $wrapper.classList.add("priw8-npc-emo-wrapper-no-bg");
        } else {
            $wrapper.classList.remove("priw8-npc-emo-wrapper-no-bg");
        }
        
        if (NpcEmoUrl[emo]) {
            const url = getFullUrl(NpcEmoUrl[emo]);
            $wrapper.innerHTML = `<img src="${url}">`;
        } else if (npcEmoHandlers[emo]) {
            $wrapper.innerHTML = npcEmoHandlers[emo](g.npc[id]);
        }
    }

    /** @type {Record<string, Set<number>>} */
    const npcEmos = {};
    /** 
     * @param {string} id 
     * @param {number[]} emos
     */
    function addNpcEmos(id, emos, fullReset=false) {
        if (!npcEmos[id] || fullReset) {
            npcEmos[id] = new Set();
        }
        const emoSet = npcEmos[id];

        for (const emo of emos) {
            emoSet.add(emo);
        }

        const emo = getHighestPriorityEmo(emoSet);

        queueSetNpcDisplayEmo(id, emo);
    }

    /** 
     * @param {string} id 
     * @param {number[]} emos
     */
     function removeNpcEmos(id, emos) {
        if (npcEmos[id]) {
            const emoSet = npcEmos[id];
            for (const emo of emos) {
                emoSet.delete(emo);
            }

            const emo = getHighestPriorityEmo(emoSet);
            queueSetNpcDisplayEmo(id, emo);
        }
    }

    function onNpc(npcs) {
        for (const id in npcs) {
            const npc = npcs[id];
            if (!npc.del) {
                const emos = parseNpcEmos(id, npc);
                addNpcEmos(id, emos, true);
            } else {
                delete npcEmos[id];
            }
        }
    }

    let currentTalkNpc = "0";
    function onDialog(dialog) {
        const dialogNpcId = dialog[2];
        if (dialog[0] == 4 || dialogNpcId != currentTalkNpc) {
            removeNpcEmos(currentTalkNpc, [NpcEmoType.NPC_TALK]);
            currentTalkNpc = "0";
        }
        if (dialog[0] == 0) {
            currentTalkNpc = dialogNpcId;
            addNpcEmos(dialogNpcId, [NpcEmoType.NPC_TALK]);
        }
    }

    function onEmo(emoData) {
        for (const emo of emoData) {
            if (emo.source_type == 2) {
                if (emo.name == "battle") {
                    addNpcEmos(emo.source_id, [NpcEmoType.BATTLE]);
                } else if (emo.name == "noemo") {
                    removeNpcEmos(emo.source_id, [NpcEmoType.BATTLE]);
                }
            }
        }
    }
}();