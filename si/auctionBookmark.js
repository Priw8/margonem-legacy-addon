// AuctionBookmark, 2nd edition, v0.3
// by Priw8
// Enhance auctions by like, a lot

!function() {
    const css = 
`
    .auction-window .si-input input {
        border-radius: 0px;
    }
    .auction-window .auction-but {
        border-radius: 0px;
    }
    .auction-window .auction-but .label {
        padding-left: 0px;
        padding-right: 0px;
    }
    .auction-window .main-column-auction .all-auction-section .auction-table .auction-td, .auction-window .main-column-auction .all-auction-section .auction-table-header .auction-td {
        height: unset;
    }
    .auction-window .amount-of-auction {
        right: unset;
        top: unset;
        bottom: 0px;
        left: 0px;
        background: rgba(0, 0, 0, 0.4);
        padding: 5px;
        z-index: 1;
        width: 122px;
        box-sizing: border-box;
    }
    .auction-window .left-column-auction .all-categories-auction .one-category-auction {
        padding-bottom: 1px;
        box-sizing: border-box;
    }
    .auction-window .left-column-auction .all-categories-auction .one-category-auction:hover {
        padding-bottom: 0px;
    }
    .auction-window .left-column-auction .all-categories-auction {
        top: 95px;
    }
    .auction-window .divide-button .option .left.active,
    .auction-window .divide-button .option .left,
    .auction-window .divide-button .option .right-no-border,
    .auction-window .divide-button .option .right-no-border.active {
        border-image: unset;
        border: none;
        background: rgba(0, 0, 0, 0.6);
    }
    .auction-window .divide-button .option .left.active,
    .auction-window .divide-button .option .right-no-border.active {
        background: rgba(11, 88, 11, 0.6);
    }
    .auction-switch-wrapper .divide-button .option {
        line-height: 22px;
    }
    .auction-window .left-column-auction .cards-header-wrapper {
        top: 15px;
    }
    .auction-window .cards-header {
        transform: scaleY(0.9);
        transform-origin: top;
    }
    .SI-button.renew-all {
        width: 120px;
        position: absolute;
        right: 0px;
        bottom: 0px;
        z-index: 1;
    }
    .clear-cross::before {
        content: "\\274C";
    }
    .si-input .clear-cross {
        top: 7px;
        right: 0px;
    }
    .auction-window .main-column-auction .all-auction-section .auction-table .item-name-td {
        font-size: 14px;
    }
    .auction-cost-ceil .auction-cost-label {
        line-height: unset;
        min-height: unset;
        padding-top: 6px;
        padding-bottom: 4px;
    }
`;
    const $style = document.createElement("style");
    $style.innerHTML = css;
    document.head.appendChild($style);

    const KIND_OBSERVED = 3;

    function searchName(name) {
        // engine panicks when space is encountered in name currently
        name = name.split(" ").sort((a, b) => b.length - a.length)[0];
        document.querySelector(".auction-window .name-item-input input").value = name;
        document.querySelector(".auction-window .name-item-input .clear-cross").style.visibility = "visible";
        g.auctions.getAuctionRequest().mainAuctionRequest(1);
    }

    const AuctionManager = window.AuctionManager;
    window.AuctionManager = function() {
        const res = new AuctionManager();
        const init = res.init;
        res.init = function() {
            const res = init.apply(this, arguments);
            const wnd = document.querySelector(".auction-window");
            modifyAuctionWindow(wnd);
            return res;
        }
        const putAuctionOffItem = res.putAuctionOffItem;
        res.putAuctionOffItem = function(itemData) {
            if (res.getActualKindOfAuction() != AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) {
                searchName(itemData.name);
            } else {
                putAuctionOffItem.apply(this, arguments);
            }
        }
        return res;
    }

    let currentAuctionCards = null;
    const AuctionCards = window.AuctionCards;
    window.AuctionCards = function() {
        const res = new AuctionCards();
        currentAuctionCards = res;
        return res;
    }

    let currentAuctionWindow = null;
    const AuctionWindow = window.AuctionWindow;
    window.AuctionWindow = function() {
        const res = new AuctionWindow();
        currentAuctionWindow = res;
        res.checkTabWithActionTDByActualKindOfAuction = function(kind) {
            return kind != AuctionData.KIND_MY_AUCTION.MY_BID;
        }
        return res;
    }


    function modifyAuctionWindow(wnd) {
        fixRarityCase(wnd);
        fixProfCase(wnd);
        renameCats(wnd);
        addObserved(wnd);
        addRenewAllButton(wnd);
        fixInputs(wnd);
    }

    function fixInputs(wnd) {
        wnd.querySelectorAll("input[type='number']").forEach($el => {
            $el.setAttribute("type", "");
        });
    }

    function addRenewAllButton(wnd) {
        const $btt = createButton("Odnów wszystko", "renew-all", () => {
            // zepsuli to na SI xd
            // g.auctions.getAuctionRequest().renewAllAuctionRequest(168);
            _g(`ah&action=change_time_all&cat=0&filter=||||||0|1|0|1|&sort=1|1&time=168`);
        });
        wnd.appendChild($btt);
    }

    function fixRarityCase(wnd) {
        const select = wnd.querySelector(".item-rarity-wrapper select");
        select.childNodes.forEach(node => {
            node.innerHTML = node.innerHTML.charAt(0).toUpperCase() + node.innerHTML.substring(1);
        });
    }

    function fixProfCase(wnd) {
        const select = wnd.querySelector(".item-prof-wrapper select");
        select.childNodes.forEach(node => {
            node.innerHTML = node.innerHTML.charAt(0).toUpperCase() + node.innerHTML.substring(1);
        });
    }

    function renameCats(wnd) {
        const nameMap = {
            "Broń jednoręczna": "Jednoręczne",
            "Broń dystansowa": "Dystansowe",
            "Broń dwuręczna": "Dwuręczne",
            "Różdżki magiczne": "Różdżki",
            "Laski magiczne": "Laski",
            "Broń półtoraręczna": "Półtoraręczne",
            "Broń pomocnicza": "Pomocnicze"
        }
        const cats = wnd.querySelector(".all-categories-auction");
        cats.childNodes.forEach(cat => {
            const newName = nameMap[cat.innerHTML];
            if (newName)
                cat.innerHTML = newName;
        });
    }

    function addObserved(wnd) {
        const cats = $(wnd.querySelector(".cards-header"));
        currentAuctionCards.newCard(cats, "Obserwowane", () => {
            currentAuctionWindow.setCard(KIND_OBSERVED);
            var $renewBtn = $(wnd).find('.auction-renew-btn-wrapper');
            $renewBtn.css('display', "none");
            g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
        });
    }
    const OneOffer = window.OneOffer;
    window.OneOffer = function() {
        const res = new OneOffer();
        const kindNow = g.auctions.getActualKindOfAuction();
        if (kindNow == AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION) {
            const $hdr = document.querySelector(".auction-table-header tr");
            if ($hdr.childNodes.length < 6) {
                $(`<td class="header-auction-td center auction-action-td"><span>Akcja</span></td>`).appendTo($hdr);
            }
        }
        if (kindNow == AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) {
            document.querySelector(".SI-button.renew-all").style.display = "block";
        } else {
            document.querySelector(".SI-button.renew-all").style.display = "none";
        }
        const _init = res.init;
        res.init = function(d) {
            this._d = d;
            _init.apply(this, arguments);
            appendExtraOfferActions(res, kindNow);
        }
        const _updateOffer = res.updateOffer;
        res.updateOffer = function(d) {
            this._d = d;
            _updateOffer.apply(this, arguments);
            appendExtraOfferActions(res, kindNow);
        }

        return res;
    }

    function appendExtraOfferActions(offer, kind) {
        const $offer = offer.get$Offer()[0];
        const $offerActions = $offer.childNodes[5];
        
        if (kind == AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) {
            const $btt = createButton("&#8635;", "renew", () => {
                g.auctions.getAuctionRequest().renewAuctionRequest(offer._d.id, 168);
            });
            $btt.setAttribute("tip", "Odnów aukcję");
            $offerActions.appendChild($btt);
        } else if (kind != AuctionData.KIND_MY_AUCTION.MY_BID) {
            const isFollowed = offer._d.is_observed;
            const followButton = isFollowed ? "&#9733;" : "&#9734;";
            const $btt = createButton(followButton, "follow", () => {
                g.auctions.getAuctionRequest().observedRequest(isFollowed, offer._d.id, g.auctions.getAuctionPages().getCurrentPage());
            });
            $btt.setAttribute("tip", isFollowed ? "Nie obserwuj aukcji" : "Obserwuj aukcję");
            $offerActions.appendChild($btt);
        }
    }
}();
