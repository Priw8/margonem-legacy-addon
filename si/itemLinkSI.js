// itemLinkSI: linkowanie przedmiotów na SI

!function(){
    const colorConfig = {
        common: 'white',
        unique: 'gold',
        heroic: '#6ce4ff',
        upgraded: 'pink',
        legendary: 'orange',
        artefact: 'red',
    };

    const ctips = {
        common: "t_norm",
        unique: "t_uni",
        heroic: "t_her",
        upgraded: "t_upg",
        legendary: "t_leg",
        artefact: "t_artefact",
    }

    function getItemRarity(item) {
        const stat = window.parseItemStat(item.stat);
        if (stat.rarity)
            return stat.rarity;

        if (typeof stat.unique != "undefined") return "unique";
        if (typeof stat.heroic != "undefined") return "heroic";
        if (typeof stat.upgraded != "undefined") return "upgraded";
        if (typeof stat.legendary != "undefined") return "legendary";
        if (typeof stat.artefact != "undefined") return "artefact";

        return "common";
    }

    function getItemColor(item) {
        return colorConfig[getItemRarity(item)];
    }

    const css = `
.linked-chat-item {
    font-weight: bold;
    color: yellow;
}
`
    const $style = document.createElement("style");
    $style.innerHTML = css;
    document.head.appendChild($style);

    const _cLIS = window.createShortLinkedItemSpan;
    window.createShortLinkedItemSpan = function(kind, id, name) {
        const $span = _cLIS.apply(this, arguments)[0];
        $span.innerText = $span.innerText.replace(/&quot;/g, "");
        // console.log(arguments);

        const realID = kind + "#" + id;;

        $span.dataset.item = realID;
        $span.setAttribute("tip", "Wczytywanie...");
        $span.setAttribute("ctip", "t_item");

        setItemState(realID, ItemState.NONE);
        
        const it = findItem(kind, id);
        if (it) {
            setItemColor($span, getItemRarity(it));
        }

        return $span;
    }

    function findItem(kind, id) {
        const items = Object.values(g.item);
        if (kind == "TPL")
            return items.find(it => it.tpl == id);

        return items.find(it => it.hid == id);
    }

    const ItemState = {
        NONE: 0,
        PENDING: 1,
        FETCHED: 2
    }

    const chatItems = {};

    function getItemState(itemID) {
        const itemData = chatItems[itemID];
        if (!itemData)
            return ItemState.NONE;

        return itemData.state;
    }

    function getItemData(itemID) {
        if (getItemState(itemID) != ItemState.FETCHED) {
            return null;
        }
        return chatItems[itemID].data;
    }

    function setItemState(itemID, state, data=null) {
        // console.log("ITEMSTATE", itemID, state);
        chatItems[itemID] = {
            state: state,
            data: data
        }
    } 

    function fetchItem(itemID) {
        setItemState(itemID, ItemState.PENDING);
        _g(`chat&getContent=${itemID.replace("#", "%23")}`);
    }

    const _pI = window.parseInput;
    window.parseInput = function(data) {
        const res = _pI.apply(this, arguments);
        const clb = () => {
            if (typeof data.item != "undefined") {
                onItem(data.item);
            }
            if (typeof data.item_tpl != "undefined") {
                onItem(data.item_tpl, true);
            }
        }
        if (g.init != 5) {
            // Wait for chat messages to load
            g.loadQueue.push({fun: clb});
        } else {
            clb();
        }
        return res;
    }

    function onItem(items, isTpl=false) {
        for (const id in items) {
            const item = items[id];
            const realID = (!isTpl && `ITEM#${item.hid}` || `TPL#${item.id}`);
            if (chatItems[realID]) {
                handleItemColor(realID, item);
            }
            if (!isTpl) {
                const tplID = `TPL#${item.tpl}`;
                if (chatItems[tplID]) {
                    handleItemColor(tplID, item);
                }
            }
            if (item.loc == "C") {
                setItemState(realID, ItemState.FETCHED, item);
                handleItem(realID, item);
            }
        }
    }

    function handleItem(id, item) {
        const tip = itemTip(item);
        const itemSpansToHandle = document.querySelectorAll(`.linked-chat-item[data-item='${id}']`);
        for (const $span of itemSpansToHandle) {
            delete $span.dataset.item;
            $span.setAttribute("tip", tip);
        }
    }

    function handleItemColor(id, item) {
        const itemSpansToHandle = document.querySelectorAll(`.linked-chat-item[data-item='${id}']`);
        for (const $span of itemSpansToHandle) {
            setItemColor($span, getItemRarity(item));
        }
    }

    function setItemColor($item, rarity) {
        const color = colorConfig[rarity];
        const ctip = ctips[rarity];
        $item.style.color = color;
        $item.setAttribute("ctip", $item.getAttribute("ctip") + " " + ctip);
    }

    document.querySelector("#chattxt").addEventListener("pointerover", function(e) {
        if (typeof e.target.dataset.item != "undefined") {
            const itemID = e.target.dataset.item;
            const state = getItemState(itemID);
            if (state == ItemState.NONE)
                fetchItem(itemID);
            else if (state == ItemState.FETCHED) {
                handleItem(itemID, getItemData(itemID));
            }
        }
    });

    // Various enhancements for linking items in messages sent
    // TODO: is this broken after chat update?
    const _cS = window.chatSend;
    window.chatSend = function(txt) {
        const regex = /ITEM#[0-9]+(\.[^ ]+)?/g;
        const matches = txt.match(regex) || [];
        for (const match of matches) {
            const spl = match.split(".");
            if (spl.length > 1) {
                const worldName = g.worldConfig.getWorldName();
                const itemWorldName = spl[1];
                if (itemWorldName == worldName) {
                    // Remove the .world part from the message
                    txt = txt.replace(match, spl[0]);
                } else {
                    // Item cannot be linked
                    const itemWorldNameSafe = escapeHTML(itemWorldName);
                    // I assume the actual world name is safe to use
                    mAlert(
                        `Nie można linkować przedmiotów z innych światów - 
                        próbujesz zalinkować przedmiot ze świata ${itemWorldNameSafe}, a aktualny świat to ${worldName}.`
                    );
                    return;
                }
            }
        }
        return _cS(txt);
    }

    // Allow linking by dragging an item onto the chat input
    $("#inpchat").droppable({
        accept: ".item",
        drop: (e, ui) => {
            // weird hack I used in quickItem before (prevents the default item menu from showing up)
            const $item = ui.draggable;
			const oldStop = $item.draggable("option", "stop");
			$item.draggable("option", "stop", function() {
				g.lock.add("get rekt");
				const ret = oldStop.apply(this, arguments);
				g.lock.remove("get rekt");
				$item.draggable("option", "stop", oldStop);
				return ret;
			});
			linkItem($item[0]);
        }
    });

    function linkItem($item) {
        const id = $item.getAttribute("id").substring(4);
        const itemID = g.item[id]?.hid;
        if (itemID) {
            const $inpChat = document.querySelector("#inpchat");
            $inpChat.value = $inpChat.value + `ITEM#${itemID}`;
            $inpChat.focus();
        }
    }
}();
