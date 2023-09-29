// qtrack: quest tracking dla SI

// update: aktualizacja URL grafiki strzałki
// update: poprawy w trackingu NPC do zabicia (obsługa wildcardów *, nie branie pod uwagi wielkości liter)
// update: obsługa bbcode w nazwach celów trackingu

// rok 2021, dodatek znowu sie skopal jakis czas temu przez zmiany w wysylaniu danych questow
// chcialem sobie na aether pograc z quest trackingiem, wiec oczywiscie zamiast przelaczyc na NI
// jak normalny czlowiek, odkopalem ten stary dodatek i naprawilem... xD
// po raz kolejny dodatek powraca niczym boomerang
// nastepnym razem napisze chyba od nowa bo OJEZU TEN KOD XD
// bez kitu

// stary komentarz z roku 2019
// a więc było tak
// kiedyś zauważyłem, że na SI silnik wysyła dane quest trackingu. Tak więc zrobiłem ten dodatek
// potem silnik przestał to robić, więc dodatek się popsuł
// (kilka miesięcy później)
// wszedł już jakiś czas temu przełącznik interfejsu, robię sobię questa eventowego z 13. urodzin margonemków, ten śmieszny gdzie NPC każe na NI przełączyć żeby był tracking
// paczam a tu na SI mam tracking, bo tego dodatku nigdy nie odinstalowałem a najwyraźniej ożył przy wprowadzeniu przełącznika
// także zmieniłem grafikę przycisku, wywaliłem niepotrzebną kompatybilność z szybszym ładowaniem gry dareffula bo ten dodatek i tak się popsuł
// i tak oto dodatek powraca
SIQuestTrack = new (function(_parseInput, _newItem) {
    const self = this;
    const trackButtonTpl = document.createElement("div");
    trackButtonTpl.classList.add("qtrackbtt");
    trackButtonTpl.setAttribute("tip", "Uruchom/wyłącz tracking");

    window.parseInput = function(data) {
        if (isset(data.quests)) {
            if (isset(data.quests.data)) {
                // WHY
                data.quests.data = data.quests.data.replace(/<p data-quest-id=([0-9]+)>/g, "<p data-quest-id=$1><span class=qtrackbtt onclick='SIQuestTrack.startTracking($1, true)' tip='Uruchom/wyłącz tracking'></span>");
            }
        };
        let ret = _parseInput.apply(this, arguments);
        if (isset(data.quests)) {
            if (isset(data.quests.track)) {
                self.parseQtrack(data.quests.track);
            }
            if (isset(data.quests.set_track)) {
                self.startTracking(data.quests.set_track);
            }
        }
        return ret;
    };
    $(`<style>
        .qtrackbtt {
            width: 22px;
            height: 22px;
            background-image: url(https://i.imgur.com/JcjaSgI.png);
            display: block;
            position: absolute;
            right: 0px;
        }
        .qtrackbtt:hover {
            background-position: 0 -22px;
        }
    </style>`).appendTo("head");
    this.translateTask = {
        "TALK": "GOTO",
        "KILL": "NPC",
        "COLLECT": "ITEM"
    };
    this.trackList = [];
    this.parseQtrack = function(qtrack) {
        this.trackList = [];
        for (let i=0; i<qtrack.length; i++) {
            if (qtrack[i] == "*" || qtrack[i] == "") continue;
            let track = qtrack[i].split("|");
            let id = track[0];
            let task = this.translateTask[track[1]];
            let quantity = track[2];
            let name = track[3];
            let tmp = track[4].split(".");
            let gw = tmp[0];
            let coords = [tmp[1], tmp[2]];
            if (coords[0] != -1 && coords[1] != -1) {
                this.trackList.push({
                    id: id,
                    task: task,
                    quantity: quantity,
                    name: name,
                    gw: gw,
                    coords: coords,
                });
            }
        };
        this.updateQtrack();
        this.startTracking(getCookie("qtrack"+hero.id));
    };
    this.updateQtrack = function() {
        for (let i=0; i<this.trackList.length; i++) {
            let t = this.trackList[i];
            if (g.item.length !== 0) {
                t.taskcomplete = false;
                if (t.quantity == "0") {
                    t.quantityToShow = false;
                } else {
                    if (t.quantity.indexOf("/") == -1) {
                        let owned = 0;
                        for (let j in g.item) {
                            let item = g.item[j];
                            if (item.loc == "g" && item.name == t.name) {
                                owned++;
                            };
                        };
                        if (owned >= parseInt(t.quantity)) {
                            t.taskcomplete = true;
                        } else {
                            t.quantityToShow = owned + "/" + t.quantity;
                        };
                    } else {
                        t.quantityToShow = t.quantity;
                    };
                };
            };
        };
    };
    this.canBeTracked = function(id) {
        for (let i=0; i<this.trackList.length; ++i) {
            if (this.trackList[i].id == id)
                return true;
        }
        return false;
    }
    this.startTracking = function(id, manual) {
        const qtrackKey = "qtrack"+hero.id;

        if (id == "null")
            id = null;

        //co ciekawe jak ustawi się to cookie to margonem samo będzie pokazywać strzałki w dialogu ZPA przy mieście do którego trza się tp. Neat!
        let d = new Date();
        d.setTime(d.getTime() + 36000000 * 24 * 30 * 12);
        if (getCookie(qtrackKey) == id && manual) {
            this.startTracking(null);
            window.message("Tracking zresetowany");
            return;
        };
        setCookie(qtrackKey, id, d);
        
        if (manual) {
            if (!this.canBeTracked(id)) {
                window.message("Tracking wybranego questa nie jest dostepny przez brak danych: " + id);
            } else {
                window.message("Tracking ustawiony na quest: " + id);
            }
        }

        this.questTrack.reset();
        let first = true;
        for (let i=0; i<this.trackList.length; i++) {
            let track = this.trackList[i];
            if (track.id == id && !track.taskcomplete) {
                //if (track.task == "GOTO" && !first) break;
                let add = {
                    type: track.task,
                    name: track.name,
                    default: track.coords,
                };
                if (track.quantityToShow) add.quantity = track.quantityToShow;
                let gw = false;
                if (g.gwIds[track.gw]) {
                    gw = true;
                    add.type2 = add.type;
                    add.type = "GW";
                    add.gw = track.gw;
                };
                if (track.task != "GOTO" && !gw) add.placeholder = "Tutaj pojawi się "+track.name+".<br>Wróć później lub poszukaj gdzie indziej";
                this.questTrack.add(add);
                first = false;
            };
        };
    };
    newItem = function() {
        let ret = _newItem.apply(this, arguments);
        self.updateQtrack();
        return ret;
    };
    //to co w minimap+ tylko bardziej rozbudowane
    this.questTrack = new (function(_heroRun) {
        let self = this;
        this.update = function() {
            $(".gw").removeClass("myGwHighlight");
            for (let i=0; i<this.arrows.length; i++) {
                this.drawArrow(this.arrows[i]);
            };
        };
        this.drawArrow = function(objective) {
            let coords = false;
            let size = [32,32];
            let nameKey, obj, item, search;
            if (objective.type == "NPC") {
                nameKey = "nick";
                obj = g.npc;
                item = false;
                search = true;
            } else if (objective.type == "ITEM") { //item
                nameKey = "name";
                obj = g.item;
                item = true;
                search = true;
            } else if (objective.type == "GOTO") {
                search = false;
            } else if (objective.type == "GW") {
                search = true;
                if (objective.type2 == "NPC") {
                    obj = g.npc;
                    nameKey = "nick";
                    item = false;
                } else {
                    obj = g.item;
                    nameKey = "name";
                    item = true;
                };
            };

            

            let closest = Infinity;
            if (search) {
                let size = false;
                for (let i in obj) {
                    let entity = obj[i];
                    if (objective.regex.test(entity[nameKey]) && (!item || entity.loc == "m")) {
                        let x = Math.abs(hero.rx-entity.x);
                        let y = Math.abs(hero.ry-entity.y);
                        let dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                        if (dist < closest) {
                            closest = dist;
                            coords = [entity.x, entity.y];
                            size = item ? [32,32] : [entity.fw, entity.fh];
                        };
                    };
                };
            };
            let coordsToUse = coords || objective.default;
            if (coordsToUse) {
                let def = false;
                if (objective.default && !coords) {
                    def = true;
                    let x = Math.abs(hero.rx-coordsToUse[0]);
                    let y = Math.abs(hero.ry-coordsToUse[1]);
                    closest = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                };
                let cos = (coordsToUse[0] - hero.rx)/closest;
                let sin = (coordsToUse[1] - hero.ry)/closest;
                let heropos = $("#hero").position();
                let top = 150*sin;
                let left = 150*cos;
                let opacity = 1;
                if (closest < 9) {
                    top = top*Math.pow(closest/9, 1.8);
                    left = left*Math.pow(closest/9, 1.8);
                    opacity = Math.pow(closest/9, 2.1);
                };
                top+=20;
                left+=4;
                let angle;
                if ((cos >= 0 && sin >= 0) || (cos >= 0 && sin <= 0)) {
                    angle = Math.asin(sin) * 180 / Math.PI;
                } else {
                    angle = 180+Math.asin(0-sin) * 180 / Math.PI;
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

                let tip = "<center>" + htmlspecialchars(parseBasicBB(objective.name, false));
                if (objective.quantity) tip += " ("+objective.quantity+")";
                if (objective.type == "NPC" && def) {
                    tip += " (domyslny resp)";
                }
                tip += "<br>" + `${Math.round(closest)} kratek (${coordsToUse[0]},${coordsToUse[1]})</center>`;
                objective.$.attr("tip", tip);

                objective.$[0].dataset.x = coordsToUse[0];
                objective.$[0].dataset.y = coordsToUse[1];
                if (objective.type != "GW" || !def) {
                    objective.$highlight.css({
                        left: coordsToUse[0]*32 - 11,
                        top: coordsToUse[1]*32 + 14,
                        display: "block",
                        opacity: 1-opacity
                    });
                } else {
                    objective.$highlight.hide();
                    $(".gw[tip='"+g.townname[objective.gw]+"']").addClass("myGwHighlight");
                };
                if (def && objective.placeholder) {
                    objective.$placeholder.css({
                        display: "block",
                        left: coordsToUse[0]*32,
                        top: coordsToUse[1]*32
                    });
                } else {
                    objective.$placeholder.hide();
                };
            } else {
                objective.$.hide();
                objective.$highlight.hide();
                objective.$placeholder.hide();
            };
        };
        this.arrows = [];
        this.add = function(objective) {
            for (let i in this.arrows) {
                if (objective.type == this.arrows[i].type && objective.name == this.arrows[i].name) return;
            };
            objective.$ = this.arrowTemplate.clone().appendTo("#centerbox");
            if (isset(window.miniMapPlus) && window.miniMapPlus.heroGoTo) {
                // nowy poziom lenistwa
                objective.$.click(() => window.miniMapPlus.heroGoTo(parseInt(objective.$[0].dataset.x), parseInt(objective.$[0].dataset.y)));
                objective.$[0].style.cursor = "pointer";
            }
            objective.$highlight = this.highlightTemplate.clone().appendTo("#ground");
            objective.$placeholder = this.placeholderTemplate.clone().appendTo("#ground");
            objective.$placeholder.attr("tip", objective.placeholder);
            objective.index = this.arrows.push(objective) -1;
            objective.remove = function() {
                self.arrows.splice(this.index, 1);
                for (let i=this.index; i<self.arrows.length; i++) {
                    self.arrows[i].index--;
                };
                this.$.remove();
                this.$highlight.remove();
                this.$placeholder.remove();
            };
            // it shouldn't be case sensitive (quest #293 Pomóż Amrze odzyskać jej utracone przedmioty)
            // * - wildcard
            objective.regex = new RegExp(objective.name.replace(/\*/gi, ".*"));
            this.update();
        };
        this.remove = function(objective) {
            for (let i=0; i<this.arrows.length; i++) {
                if (this.arrows[i].name == objective.name && this.arrows[i].type == objective.type) this.arrows[i].remove();
            };
        };
        this.reset = function() {
            while (this.arrows.length) {
                this.arrows[0].remove();
            };
        };
        this.arrowTemplate = $("<div>").css({
            //background: "url(http://127.0.0.1:8080/SI-addon/mmp/img/qt-arrow.png)",
            background: "url(https://priw8.com/margo/SI-addon/mmp/img/qt-arrow.png)",
            width: 24,
            height: 24,
            zIndex: 250,
            position: "absolute",
            filter: "hue-rotate(180deg)"
        });
        this.highlightTemplate = $("<div>").css({
            background: "url(/img/glow-blue.png)",
             position: "absolute",
             width: 52,
             height: 24,
             zIndex: 1
        });
        this.placeholderTemplate = $("<div>").css({
            width: 32,
            height: 32,
            position: "absolute",
            zIndex: 2,
            backgroundImage: "url(/img/placeholder_npc_item.png)",
        });
        hero.run = function() {
            self.update();
            _heroRun.apply(this, arguments);
        };
        $("<style>.myGwHighlight {border-radius:4px; background-color:rgba(135,206,250,0.6);}</style>").appendTo("head");
    })(hero.run);
})(window.parseInput, window.newItem);
