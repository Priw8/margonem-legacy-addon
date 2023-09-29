// alchemyHelper - pomocnik do smoczej alchemii

!function() {
    const interfaceType = (typeof API != "undefined" && typeof Engine != "undefined") ? "new" : "old";

    class Events {
        constructor() {
            this.eventHandlers = {};
            if (interfaceType == "new") {
                API.priw.emmiter.on("game-response", this.update.bind(this));
            } else {
                const _parseInput = window.parseInput;
                const self = this;
                window.parseInput = function(data) {
                    self.update(data);
                    return _parseInput.apply(this, arguments);
                }
            }
        }
        add(name, clb) {
            if (!this.eventHandlers[name])
                this.eventHandlers[name] = [];
            this.eventHandlers[name].push(clb);
        }
        fire(name, data) {
            const handlers = this.eventHandlers[name];
            if (!handlers)
                return;

            for (const handler of handlers) {
                handler(data);
            }

            return data;
        }
        update(data) {
            for (const key in data) {
                this.fire(key, data[key]);
            }
        }
    }

    const event = new Events();

    const ItemData = {
        "34859": {
          "id": 34859,
          "name": "Zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/zestaw-alchem.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Podstawowa aparatura do przeprowadzania eksperymentów. Znajdź alchemika, który pomoże ci wymieszać reagenty.;rarity=common",
          "pr": 10000,
          "prc": "zl"
        },
        "34984": {
          "id": 34984,
          "name": "Kolba destylacyjna",
          "loc": "c",
          "icon": "neu/kolba-dest.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników Zestawu alchemicznego.;permbound;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34985": {
          "id": 34985,
          "name": "Oleje chemiczne",
          "loc": "c",
          "icon": "neu/oleje-chem.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników Zestawu alchemicznego.;permbound;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34986": {
          "id": 34986,
          "name": "Podstawy alchemii",
          "loc": "c",
          "icon": "neu/podstawy-alch.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników Zestawu alchemicznego.;permbound;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34987": {
          "id": 34987,
          "name": "Probówki w statywie",
          "loc": "c",
          "icon": "neu/prob-w-stat.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników Zestawu alchemicznego.;permbound;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34988": {
          "id": 34988,
          "name": "Proch alchemiczny",
          "loc": "c",
          "icon": "neu/proch-alchem.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników Zestawu alchemicznego.;permbound;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34989": {
          "id": 34989,
          "name": "Retorta laboratoryjna",
          "loc": "c",
          "icon": "neu/retorta_labor.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników Zestawu alchemicznego.;permbound;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34991": {
          "id": 34991,
          "name": "Żywe mięso",
          "loc": "f",
          "icon": "neu/zywe-mieso.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34992": {
          "id": 34992,
          "name": "Ceramiczny kieł",
          "loc": "f",
          "icon": "neu/ceram-kiel.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34993": {
          "id": 34993,
          "name": "Fiolka ropy kwasowej",
          "loc": "f",
          "icon": "neu/fiol-rop-kw.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34994": {
          "id": 34994,
          "name": "Fragment worka jadowego",
          "loc": "f",
          "icon": "neu/frag-wor-jad.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34995": {
          "id": 34995,
          "name": "Płynny szpik kostny",
          "loc": "f",
          "icon": "neu/plyn-szp-kos.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34996": {
          "id": 34996,
          "name": "Roztwór gadziej hemoglobiny",
          "loc": "f",
          "icon": "neu/roz-gad-hemo.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34997": {
          "id": 34997,
          "name": "Sproszkowane organy",
          "loc": "f",
          "icon": "neu/sproszk-org.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34998": {
          "id": 34998,
          "name": "Utarta skóra bazyliszka",
          "loc": "f",
          "icon": "neu/uta-sk-bazy.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru mutującego.;rarity=common",
          "pr": 1000,
          "prc": "zl"
        },
        "34999": {
          "id": 34999,
          "name": "Koncentrat jadu warana",
          "loc": "f",
          "icon": "neu/konc-jad-war.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35000": {
          "id": 35000,
          "name": "Lewa nerka hodowlana",
          "loc": "f",
          "icon": "neu/lew-nerka-hodow.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35001": {
          "id": 35001,
          "name": "Odłamek kości hydroksyapatytowej",
          "loc": "f",
          "icon": "neu/odla-kos-hydrok.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35002": {
          "id": 35002,
          "name": "Rozcieńczona smoła żołądkowa",
          "loc": "f",
          "icon": "neu/rozci-smo-zoladk.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35003": {
          "id": 35003,
          "name": "Spreparowana skóra smoka",
          "loc": "f",
          "icon": "neu/sprep-sko-sm.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35004": {
          "id": 35004,
          "name": "Sztuczny pazur ogniomiota",
          "loc": "f",
          "icon": "neu/sztuc-paz-ognio.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35005": {
          "id": 35005,
          "name": "Żółć destylowana",
          "loc": "f",
          "icon": "neu/zolc-desty.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Wywaru przemiany.;rarity=unique",
          "pr": 15000,
          "prc": "zl"
        },
        "35006": {
          "id": 35006,
          "name": "Esencja metamorfozy",
          "loc": "f",
          "icon": "neu/esen-metam.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35007": {
          "id": 35007,
          "name": "Fabrykowana trzustka żmijowca",
          "loc": "f",
          "icon": "neu/fabryk-zmij.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35008": {
          "id": 35008,
          "name": "Pomniejszone serce smoka",
          "loc": "f",
          "icon": "neu/pomn-smoka.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35009": {
          "id": 35009,
          "name": "Prawa nerka hodowlana",
          "loc": "f",
          "icon": "neu/praw-hodow.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35010": {
          "id": 35010,
          "name": "Róg siarkokeratynowy",
          "loc": "f",
          "icon": "neu/rog-siarko.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35011": {
          "id": 35011,
          "name": "Rozcieńczona syntetyczna krew",
          "loc": "f",
          "icon": "neu/rozcien-synt.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35012": {
          "id": 35012,
          "name": "Wątroba łuskowa",
          "loc": "f",
          "icon": "neu/watr-lusk.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Hydrolizowanej smoczej krwi.;rarity=heroic",
          "pr": 30000,
          "prc": "zl"
        },
        "35013": {
          "id": 35013,
          "name": "Syntetyczna smocza krew",
          "loc": "f",
          "icon": "neu/syn-smocz-krew.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35070": {
          "id": 35070,
          "name": "Oranżowy zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/pomar-za.gif",
          "cl": 16,
          "stat": "amount=1;animation=1;canpreview;cansplit=1;capacity=100;lootbox2=1426;permbound;rarity=unique",
          "pr": 10000,
          "prc": "zl"
        },
        "35071": {
          "id": 35071,
          "name": "Fioletowy zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/fiol-za.gif",
          "cl": 16,
          "stat": "amount=1;animation=1;canpreview;cansplit=1;capacity=100;lootbox2=1427;permbound;rarity=heroic",
          "pr": 10000,
          "prc": "zl"
        },
        "35072": {
          "id": 35072,
          "name": "Czerwony zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/czerw-za.gif",
          "cl": 16,
          "stat": "amount=1;animation=1;canpreview;cansplit=1;capacity=100;lootbox2=1420;permbound;rarity=common",
          "pr": 10000,
          "prc": "zl"
        },
        "35079": {
          "id": 35079,
          "name": "Bryłki ołowiu",
          "loc": "f",
          "icon": "sur/olow.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;rarity=common",
          "pr": 15000,
          "prc": "zl"
        },
        "35080": {
          "id": 35080,
          "name": "Płynny ogień",
          "loc": "f",
          "icon": "neu/plynny-ogien.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Dolej ten płyn do czerwonego zestawu alchemicznego, aby go ulepszyć.;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35081": {
          "id": 35081,
          "name": "Butelka fioletu chemicznego",
          "loc": "f",
          "icon": "neu/but-fiol-chem.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Dolej ten płyn do oranżowego zestawu alchemicznego, aby go ulepszyć.;rarity=heroic",
          "pr": 1,
          "prc": "zl"
        },
        "35083": {
          "id": 35083,
          "name": "Aktywna biomasa",
          "loc": "f",
          "icon": "neu/aktyw-biom.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35084": {
          "id": 35084,
          "name": "Esencja syntetycznego osocza",
          "loc": "f",
          "icon": "neu/ese-synt-oso.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35085": {
          "id": 35085,
          "name": "Gadzie ucho",
          "loc": "f",
          "icon": "neu/gad-ucho.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35086": {
          "id": 35086,
          "name": "Gruczoł ziejący",
          "loc": "f",
          "icon": "neu/gru-zie.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35087": {
          "id": 35087,
          "name": "Rozcieńczona krew jednorożca",
          "loc": "f",
          "icon": "neu/krew-jedn.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35088": {
          "id": 35088,
          "name": "Ognioodporny język",
          "loc": "f",
          "icon": "neu/ognio-jez.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35089": {
          "id": 35089,
          "name": "Szklane oko smoka",
          "loc": "f",
          "icon": "neu/szkl-oko-sm.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Jeden ze składników potrzebnych do stworzenia Eliksiru smoczej krwi.;rarity=legendary",
          "pr": 100000,
          "prc": "zl"
        },
        "35090": {
          "id": 35090,
          "name": "Kwasowy eliksir mutujący",
          "loc": "f",
          "icon": "kon/kwas-elik-mut.gif",
          "cl": 16,
          "stat": "opis=A więc to tak czują się mutanci Shaiharrud...;outfit=0,paid/smocz-mutant-m.gif;permbound;rarity=common;timelimit=1",
          "pr": 9,
          "prc": "zl"
        },
        "35091": {
          "id": 35091,
          "name": "Zasadowy eliksir mutujący",
          "loc": "f",
          "icon": "kon/zasa-eli-mut.gif",
          "cl": 16,
          "stat": "opis=A więc to tak czują się mutanci Shaiharrud...;outfit=0,paid/smocz-mutant-k.gif;permbound;rarity=common;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35092": {
          "id": 35092,
          "name": "Kwasowy wywar przemiany",
          "loc": "f",
          "icon": "kon/kwas-wy-prze.gif",
          "cl": 16,
          "stat": "opis=Pół-człowiek, pół-smok - nowa, silniejsza rasa.;outfit=0,paid/us-bazowy-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35093": {
          "id": 35093,
          "name": "Zasadowy wywar przemiany",
          "loc": "f",
          "icon": "kon/zasa-wy-prze.gif",
          "cl": 16,
          "stat": "opis=Pół-człowiek, pół-smok - nowa, silniejsza rasa.;outfit=0,paid/us-bazowy-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35094": {
          "id": 35094,
          "name": "Kwasowy destylat magiczny",
          "loc": "f",
          "icon": "kon/kwas-dest-mag.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-mag-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35095": {
          "id": 35095,
          "name": "Zasadowy destylat magiczny",
          "loc": "f",
          "icon": "kon/zasa-dest-mag.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-mag-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35096": {
          "id": 35096,
          "name": "Kwasowy ekstrakt mrozu",
          "loc": "f",
          "icon": "kon/kwa-eks-mro.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-trop-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35097": {
          "id": 35097,
          "name": "Zasadowy ekstrakt mrozu",
          "loc": "f",
          "icon": "kon/zasa-eks-mr.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-trop-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35098": {
          "id": 35098,
          "name": "Kwasowy ekstrakt sprytu",
          "loc": "f",
          "icon": "kon/kwas-eks-spr.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-tanc-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35099": {
          "id": 35099,
          "name": "Zasadowy ekstrakt sprytu",
          "loc": "f",
          "icon": "kon/zasad-eks-spr.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-tanc-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35100": {
          "id": 35100,
          "name": "Kwasowy jad syntetyczny",
          "loc": "f",
          "icon": "kon/kwas-jad-synt.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-low-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35101": {
          "id": 35101,
          "name": "Zasadowy jad syntetyczny",
          "loc": "f",
          "icon": "kon/zasa-jad-synt.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-low-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35102": {
          "id": 35102,
          "name": "Kwasowa plazma słoneczna",
          "loc": "f",
          "icon": "kon/kwas-pla-slone.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-pal-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35103": {
          "id": 35103,
          "name": "Zasadowa plazma słoneczna",
          "loc": "f",
          "icon": "kon/zasa-pla-slon.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-pal-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35104": {
          "id": 35104,
          "name": "Kwasowy wywar agresji",
          "loc": "f",
          "icon": "kon/kwas-wy-agr.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-woj-m.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35105": {
          "id": 35105,
          "name": "Zasadowy wywar agresji",
          "loc": "f",
          "icon": "kon/zasa-wy-agre.gif",
          "cl": 16,
          "stat": "opis=Wzmocniony wywar przemiany dodaje ci smoczych instynktów.;outfit=0,paid/us-woj-k.gif;permbound;rarity=unique;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35106": {
          "id": 35106,
          "name": "Hydrolizowana krew smoka",
          "loc": "f",
          "icon": "neu/hydr-kr-sm.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/hero-bazowy-meski.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35107": {
          "id": 35107,
          "name": "Hydrolizowana krew smoczycy",
          "loc": "f",
          "icon": "kon/hydro-kr-smoc.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/hero-bazowy-damski.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35108": {
          "id": 35108,
          "name": "Czasza półkrwi jadowitego smoka",
          "loc": "f",
          "icon": "kon/cza-smo-jado.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/h-jadowity-m.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35109": {
          "id": 35109,
          "name": "Czasza półkrwi jadowitej smoczycy",
          "loc": "f",
          "icon": "kon/cza-smoc-jado.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/h-jadowity-d.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35110": {
          "id": 35110,
          "name": "Czasza półkrwi lodowego smoka",
          "loc": "f",
          "icon": "kon/cza-smo-lodo.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/h-lodowy-m.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35111": {
          "id": 35111,
          "name": "Czasza półkrwi lodowej smoczycy",
          "loc": "f",
          "icon": "kon/cza-smoc-lod.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/h-lodowy-d.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35112": {
          "id": 35112,
          "name": "Czasza półkrwi magmowego smoka",
          "loc": "f",
          "icon": "kon/cza-smok-magm.gif",
          "cl": 16,
          "stat": "opis=Smocza krew i magia kryształów przyjemnie palą twoje ciało. Czujesz ogień wnętrza ziemi w swoim sercu.;outfit=0,paid/h-magmowy-m.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35113": {
          "id": 35113,
          "name": "Czasza półkrwi magmowej smoczycy",
          "loc": "f",
          "icon": "kon/cza-smoc-magmj.gif",
          "cl": 16,
          "stat": "opis=Smocza krew i magia kryształów przyjemnie palą twoje ciało. Czujesz ogień wnętrza ziemi w swoim sercu.;outfit=0,paid/h-magmowy-d.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35114": {
          "id": 35114,
          "name": "Czasza półkrwi kryształowej smoczycy",
          "loc": "f",
          "icon": "kon/cza-smoc-kryszt.gif",
          "cl": 16,
          "stat": "opis=Smocza krew i magia kryształów przyjemnie palą twoje ciało. Twe oczy rozświetla kryształowy blask.;outfit=0,paid/h-krysztalowy-d.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35115": {
          "id": 35115,
          "name": "Czasza półkrwi kryształowego smoka",
          "loc": "f",
          "icon": "kon/cza-smo-kryszt.gif",
          "cl": 16,
          "stat": "opis=Smocza krew i magia kryształów przyjemnie palą twoje ciało. Twe oczy rozświetla kryształowy blask.;outfit=0,paid/h-krysztalowy-m.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35116": {
          "id": 35116,
          "name": "Eliksir smoczej krwi",
          "loc": "f",
          "icon": "kon/elik-smo-kr.gif",
          "cl": 16,
          "stat": "opis=Udało się! Skopiowałeś starożytną formułę z syntetycznych organów i krwi smoka. Wypicie tego eliksiru odmieni cię na zawsze. Czy Hebrehoth osądzi cię za ten czyn?;outfit=0,paid/s_alchem_smo.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35117": {
          "id": 35117,
          "name": "Łza jadowitego smoka",
          "loc": "f",
          "icon": "kon/lza-jado-smo.gif",
          "cl": 16,
          "stat": "opis=Legendarny klejnot z zamierzchłych czasów, który przemienił cię w nową istotę.;outfit=0,paid/smok-jadowity.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35118": {
          "id": 35118,
          "name": "Łza lodowego smoka",
          "loc": "f",
          "icon": "kon/lza-lod-smo.gif",
          "cl": 16,
          "stat": "opis=Legendarny klejnot z zamierzchłych czasów, który przemienił cię w nową istotę.;outfit=0,paid/smok-lodowy.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35119": {
          "id": 35119,
          "name": "Łza łuskowego smoka",
          "loc": "f",
          "icon": "kon/lza-lusk-smo.gif",
          "cl": 16,
          "stat": "opis=Legendarny klejnot z zamierzchłych czasów, który przemienił cię w nową istotę.;outfit=0,paid/smok-luskowy.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35120": {
          "id": 35120,
          "name": "Łza magmowego smoka",
          "loc": "f",
          "icon": "kon/lza-magm-smo.gif",
          "cl": 16,
          "stat": "opis=Legendarny klejnot z zamierzchłych czasów, który przemienił cię w nową istotę. Pulsuje wewnętrznym ogniem. Czy słyszysz już głos boskiego Hebrehotha, Ojca Smoków?;outfit=0,paid/smok-magmowy-optl.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35121": {
          "id": 35121,
          "name": "Łza kryształowego smoka",
          "loc": "f",
          "icon": "kon/lza-krysz-smo.gif",
          "cl": 16,
          "stat": "opis=Legendarny klejnot z zamierzchłych czasów, który przemienił cię w nową istotę. Kryształ rozświetla wewnętrzny blask. Czy słyszysz już głos boskiego Hebrehotha, Ojca Smoków?;outfit=0,paid/smok-krysztal-optl.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35122": {
          "id": 35122,
          "name": "Łza złotego smoka",
          "loc": "f",
          "icon": "kon/lza-zlot-smo.gif",
          "cl": 16,
          "stat": "opis=Legendarny klejnot z zamierzchłych czasów, który przemienił cię w nową istotę. Czujesz mrowienie bijącej zeń elektryczności. Czy słyszysz już głos boskiego Hebrehotha, Ojca Smoków?;outfit=0,paid/smok-zloty-optl.gif;permbound;rarity=legendary;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35123": {
          "id": 35123,
          "name": "Magiczna ropa",
          "loc": "f",
          "icon": "neu/magiczna-ropa.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Wywaru przemiany.;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35124": {
          "id": 35124,
          "name": "Wyciąg mrozowy",
          "loc": "f",
          "icon": "neu/wyciag-mrozowy.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Wywaru przemiany.;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35125": {
          "id": 35125,
          "name": "Ekstrakt sprytu",
          "loc": "f",
          "icon": "neu/ekstrakt-sprytu.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Wywaru przemiany.;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35126": {
          "id": 35126,
          "name": "Syntetyczny jad",
          "loc": "f",
          "icon": "neu/syntetyczny-jad.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Wywaru przemiany.;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35127": {
          "id": 35127,
          "name": "Słoneczna plazma",
          "loc": "f",
          "icon": "neu/sloneczna-plazma.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Wywaru przemiany.;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35128": {
          "id": 35128,
          "name": "Esencja agresji",
          "loc": "f",
          "icon": "neu/esencja-agresji.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Wywaru przemiany.;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35129": {
          "id": 35129,
          "name": "Sproszkowany klejnot jadowy",
          "loc": "f",
          "icon": "neu/sprosz-klejn.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Hydrolizowanej krwi smoka.;permbound;rarity=heroic",
          "pr": 1,
          "prc": "zl"
        },
        "35130": {
          "id": 35130,
          "name": "Pył lodowcowy",
          "loc": "f",
          "icon": "neu/pyl-lodo.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Hydrolizowanej krwi smoka.;permbound;rarity=heroic",
          "pr": 1,
          "prc": "zl"
        },
        "35131": {
          "id": 35131,
          "name": "Popiół wulkaniczny",
          "loc": "f",
          "icon": "neu/popiol-wulk.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Hydrolizowanej krwi smoka.;permbound;rarity=heroic",
          "pr": 1,
          "prc": "zl"
        },
        "35132": {
          "id": 35132,
          "name": "Proch kryształowy",
          "loc": "f",
          "icon": "neu/proch-krys.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Jeden z ulepszaczy Hydrolizowanej krwi smoka.;permbound;rarity=heroic",
          "pr": 1,
          "prc": "zl"
        },
        "35133": {
          "id": 35133,
          "name": "Esencja duszy jadowitego smoka",
          "loc": "f",
          "icon": "neu/ese-jadowit.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Czyżby alchemik dokonał niemożliwego? Czy udało mu się stworzyć sztuczną duszę? Jakież to konsekwencje dla filozofów...[br][br]Jeden ulepszaczy Eliksiru smoczej krwi.;permbound;rarity=legendary",
          "pr": 1,
          "prc": "zl"
        },
        "35134": {
          "id": 35134,
          "name": "Esencja duszy lodowego smoka",
          "loc": "f",
          "icon": "neu/ese-lodo.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Czyżby alchemik dokonał niemożliwego? Czy udało mu się stworzyć sztuczną duszę? Jakież to konsekwencje dla filozofów...[br][br]Jeden ulepszaczy Eliksiru smoczej krwi.;permbound;rarity=legendary",
          "pr": 1,
          "prc": "zl"
        },
        "35135": {
          "id": 35135,
          "name": "Esencja duszy łuskowego smoka",
          "loc": "f",
          "icon": "neu/ese-duszy-lusko.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Czyżby alchemik dokonał niemożliwego? Czy udało mu się stworzyć sztuczną duszę? Jakież to konsekwencje dla filozofów...[br][br]Jeden ulepszaczy Eliksiru smoczej krwi.;permbound;rarity=legendary",
          "pr": 2250,
          "prc": "zl"
        },
        "35136": {
          "id": 35136,
          "name": "Esencja duszy magmowego smoka",
          "loc": "f",
          "icon": "neu/ese-magm.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Czyżby alchemik dokonał niemożliwego? Czy udało mu się stworzyć sztuczną duszę? Jakież to konsekwencje dla filozofów...[br][br]Jeden ulepszaczy Eliksiru smoczej krwi.;permbound;rarity=legendary",
          "pr": 1,
          "prc": "zl"
        },
        "35137": {
          "id": 35137,
          "name": "Esencja duszy kryształowego smoka",
          "loc": "f",
          "icon": "neu/ese-krysztal.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Czyżby alchemik dokonał niemożliwego? Czy udało mu się stworzyć sztuczną duszę? Jakież to konsekwencje dla filozofów...[br][br]Jeden ulepszaczy Eliksiru smoczej krwi.;permbound;rarity=legendary",
          "pr": 1,
          "prc": "zl"
        },
        "35138": {
          "id": 35138,
          "name": "Esencja duszy złotego smoka",
          "loc": "f",
          "icon": "neu/ese-zlotego.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=10;opis=Czyżby alchemik dokonał niemożliwego? Czy udało mu się stworzyć sztuczną duszę? Jakież to konsekwencje dla filozofów...[br][br]Jeden ulepszaczy Eliksiru smoczej krwi.;permbound;rarity=legendary",
          "pr": 3750,
          "prc": "zl"
        },
        "35143": {
          "id": 35143,
          "name": "Czasza półkrwi łuskowego smoka",
          "loc": "f",
          "icon": "kon/cza-smok-lusk.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/h-luskowy-m.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35144": {
          "id": 35144,
          "name": "Czasza półkrwi łuskowej smoczycy",
          "loc": "f",
          "icon": "kon/cza-smoc-lusk.gif",
          "cl": 16,
          "stat": "opis=Pożegnaj się z człowieczeństwem.;outfit=0,paid/h-luskowy-d.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35145": {
          "id": 35145,
          "name": "Czasza półkrwi złotego smoka",
          "loc": "f",
          "icon": "kon/cza-smok-zlot.gif",
          "cl": 16,
          "stat": "opis=Smocza krew i magia kryształów przyjemnie palą twoje ciało. Czujesz elektryzującą moc przebiegającą po swym łuskowym ciele.;outfit=0,paid/h-zloty-m.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35146": {
          "id": 35146,
          "name": "Czasza półkrwi złotej smoczycy",
          "loc": "f",
          "icon": "kon/cza-smoc-zlot.gif",
          "cl": 16,
          "stat": "opis=Smocza krew i magia kryształów przyjemnie palą twoje ciało. Czujesz elektryzującą moc przebiegającą po swym łuskowym ciele.;outfit=0,paid/h-zloty-d.gif;permbound;rarity=heroic;timelimit=1",
          "pr": 1,
          "prc": "zl"
        },
        "35147": {
          "id": 35147,
          "name": "Elektroproch",
          "loc": "f",
          "icon": "neu/elektroproszek.gif",
          "cl": 15,
          "stat": "opis=Jeden z ulepszaczy Hydrolizowanej krwi smoka.;permbound;rarity=heroic",
          "pr": 1500,
          "prc": "zl"
        },
        "35148": {
          "id": 35148,
          "name": "Sproszkowana smocza łuska",
          "loc": "f",
          "icon": "neu/sprosz-smo-lus.gif",
          "cl": 15,
          "stat": "opis=Jeden z ulepszaczy Hydrolizowanej krwi smoka.;permbound;rarity=heroic",
          "pr": 750,
          "prc": "zl"
        },
        "35314": {
          "id": 35314,
          "name": "Spopielona biomasa",
          "loc": "f",
          "icon": "kon/biomas-zw.gif",
          "cl": 16,
          "stat": "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=1441;rarity=common",
          "pr": 9,
          "prc": "zl"
        },
        "35315": {
          "id": 35315,
          "name": "Zasuszona biomasa",
          "loc": "f",
          "icon": "kon/biomas-unik.gif",
          "cl": 16,
          "stat": "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=1442;rarity=unique",
          "pr": 13,
          "prc": "zl"
        },
        "35316": {
          "id": 35316,
          "name": "Stara biomasa",
          "loc": "f",
          "icon": "kon/biomas-her.gif",
          "cl": 16,
          "stat": "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=1443;rarity=heroic",
          "pr": 16,
          "prc": "zl"
        },
        "35317": {
          "id": 35317,
          "name": "Świeża biomasa",
          "loc": "f",
          "icon": "kon/biomas-leg.gif",
          "cl": 16,
          "stat": "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=1444;rarity=legendary",
          "pr": 19,
          "prc": "zl"
        },
        "35013": {
          "id": 35013,
          "name": "Syntetyczna smocza krew",
          "loc": "f",
          "icon": "neu/syn-smocz-krew.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;permbound;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },

        // Eder barter
        "35073": {
          "id": 35073,
          "name": "Niebieski zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/nieb-za.gif",
          "cl": 16,
          "stat": "amount=1;animation=1;canpreview;cansplit=1;capacity=100;lootbox2=1428;permbound;rarity=common",
          "pr": 10000,
          "prc": "zl"
        },
        "35074": {
          "id": 35074,
          "name": "Zielony zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/ziel-za.gif",
          "cl": 16,
          "stat": "amount=1;animation=1;canpreview;cansplit=1;capacity=100;lootbox2=1430;permbound;rarity=unique",
          "pr": 10000,
          "prc": "zl"
        },
        "35075": {
          "id": 35075,
          "name": "Czarny zestaw alchemiczny",
          "loc": "f",
          "icon": "neu/czar-za.gif",
          "cl": 16,
          "stat": "amount=1;animation=1;canpreview;cansplit=1;capacity=100;lootbox2=1429;permbound;rarity=heroic",
          "pr": 10000,
          "prc": "zl"
        },
        "35076": {
          "id": 35076,
          "name": "Ekstrakt ziołowy",
          "loc": "f",
          "icon": "neu/ekstrakt-ziolowy.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Dolej ten płyn do niebieskiego zestawu alchemicznego, aby go ulepszyć.;rarity=unique",
          "pr": 1,
          "prc": "zl"
        },
        "35077": {
          "id": 35077,
          "name": "Butla oczyszczonej ropy",
          "loc": "f",
          "icon": "neu/but-ropy-oczys.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;opis=Dolej ten płyn do zielonego zestawu alchemicznego, aby go ulepszyć.;rarity=heroic",
          "pr": 1,
          "prc": "zl"
        },
        "35078": {
          "id": 35078,
          "name": "Niebieski fosfor",
          "loc": "f",
          "icon": "neu/niebieski-fosfor.gif",
          "cl": 15,
          "stat": "amount=1;cansplit=1;capacity=100;rarity=common",
          "pr": 12000,
          "prc": "zl"
        },
    };

    const Recipes = {
        // Basic
        "35090": {
            "target": 35090,
            "required": [34991, 34992, 34993, 34994, 34995, 34996, 34997, 34998]
        },
        "35091": {
            "target": 35091,
            "required": [34991, 34992, 34993, 34994, 34995, 34996, 34997, 34998]
        },
        "35092": {
            "target": 35092,
            "required": [35090, 34999, 35000, 35001, 35002, 35003, 35004, 35005]
        },
        "35093": {
            "target": 35093,
            "required": [35091, 34999, 35000, 35001, 35002, 35003, 35004, 35005]
        },
        "35106": {
            "target": 35106,
            "required": [35092, 35006, 35007, 35008, 35009, 35010, 35011, 35012]
        },
        "35107": {
            "target": 35107,
            "required": [35093, 35006, 35007, 35008, 35009, 35010, 35011, 35012]
        },
        "35116": {
            "target": 35116,
            "required": [35106, 35083, 35084, 35085, 35086, 35087, 35088, 35089]
        },
        "35116_alt": {
            "target": 35116,
            "required": [35107, 35083, 35084, 35085, 35086, 35087, 35088, 35089]
        },

        // Unique variants (male)
        "35104": {
            "target": 35104,
            "required": [35092, 35128]
        },
        "35102": {
            "target": 35102,
            "required": [35092, 35127]
        },
        "35100": {
            "target": 35100,
            "required": [35092, 35126]
        },
        "35098": {
            "target": 35098,
            "required": [35092, 35125]
        },
        "35096": {
            "target": 35096,
            "required": [35092, 35124]
        },
        "35094": {
            "target": 35094,
            "required": [35092, 35123]
        },

        // Unique variants (female)
        "35105": {
            "target": 35105,
            "required": [35093, 35128]
        },
        "35103": {
            "target": 35103,
            "required": [35093, 35127]
        },
        "35101": {
            "target": 35101,
            "required": [35093, 35126]
        },
        "35099": {
            "target": 35099,
            "required": [35093, 35125]
        },
        "35097": {
            "target": 35097,
            "required": [35093, 35124]
        },
        "35095": {
            "target": 35095,
            "required": [35093, 35123]
        },

        // Heroic variants (male) (lv1)
        "35108": {
            "target": 35108,
            "required": [35106, 35129]
        },
        "35110": {
            "target": 35110,
            "required": [35106, 35130]
        },
        "35143": {
            "target": 35143,
            "required": [35106, 35148]
        },

        // Heroic variants (male) (lv2)
        "35112": {
            "target": 35112,
            "required": [35108, 35131]
        },
        "35115": {
            "target": 35115,
            "required": [35110, 35132]
        },
        "35145": {
            "target": 35145,
            "required": [35143, 35147]
        },


        // Heroic variants (female) (lv1)
        "35109": {
            "target": 35109,
            "required": [35107, 35129]
        },
        "35111": {
            "target": 35111,
            "required": [35107, 35130]
        },
        "35144": {
            "target": 35144,
            "required": [35107, 35148]
        },

        // Heroic variants (female) (lv2)
        "35113": {
            "target": 35113,
            "required": [35109, 35131]
        },
        "35114": {
            "target": 35114,
            "required": [35111, 35132]
        },
        "35146": {
            "target": 35146,
            "required": [35144, 35147]
        },

        // Legendary variants (lv1)
        "35117": {
            "target": 35117,
            "required": [35116, 35133]
        },
        "35118": {
            "target": 35118,
            "required": [35116, 35134]
        },
        "35119": {
            "target": 35119,
            "required": [35116, 35135]
        },

        // Legendary variants (lv2)
        "35120": {
            "target": 35120,
            "required": [35117, 35136]
        },
        "35121": {
            "target": 35121,
            "required": [35118, 35137]
        },
        "35122": {
            "target": 35122,
            "required": [35119, 35138]
        },

        // Zestaw alchemiczny
        "34859": {
            "target": 34859,
            "required": [34984, 34985, 34986, 34987, 34988, 34989]
        },

        // Czerwony zestaw
        "35072": {
            "target": 35072,
            "required": [34859, 35079]
        },
        // Czerwony+1
        "35070": {
            "target": 35070,
            "required": [35072, 35080]
        },
        // Czerwony+2
        "35071": {
            "target": 35071,
            "required": [35070, 35081]
        },
        // Niebieski zestaw
        "35073": {
            "target": 35073,
            "required": [34859, 35078]
        },
        // Niebieski+1
        "35074": {
            "target": 35074,
            "required": [35073, 35076]
        },
        // Niebieski+2
        "35075": {
            "target": 35075,
            "required": [35074, 35077]
        },

        "34984": {
            "target": 34984,
            "required": [],
            "note": "Do zdobycia z toreb alchemika."
        },
        "34985": {
            "target": 34985,
            "required": [],
            "note": "Do zdobycia z toreb alchemika."
        },
        "34986": {
            "target": 34986,
            "required": [],
            "note": "Do zdobycia z toreb alchemika."
        },
        "34987": {
            "target": 34987,
            "required": [],
            "note": "Do zdobycia z toreb alchemika."
        },
        "34988": {
            "target": 34988,
            "required": [],
            "note": "Do zdobycia z toreb alchemika."
        },
        "34989": {
            "target": 34989,
            "required": [],
            "note": "Do zdobycia z toreb alchemika."
        },

        "35079": {
            "target": 35079,
            "required": [],
            "note": "Sklep Przemytnik Maktor - Jaskinia przemytników (18,7). Dojście: Karka-han → Przedmieścia Karka-han → Lokum krasnoludów → Lokum krasnoludów - piwnica p.1 → Lokum krasnoludów - piwnica p.2 → Jaskinia przemytników."
        },
        "35078": {
            "target": 35078,
            "required": [],
            "note": "Sklep Przemytnik Maktor - Jaskinia przemytników (18,7). Dojście: Karka-han → Przedmieścia Karka-han → Lokum krasnoludów → Lokum krasnoludów - piwnica p.1 → Lokum krasnoludów - piwnica p.2 → Jaskinia przemytników."
        },

        "35013": {
            "target": 35013,
            "required": [],
            "note": "Można uzyskać u Valthara Białego w zamian za podstawowe części strojów."
        },

        "35148": {
            "target": 35148,
            "required": [],
            "note": "Do kupienia za SŁ u Nikolaia Płomyczka."
        },
        "35147": {
            "target": 35147,
            "required": [],
            "note": "Do kupienia za SŁ u Nikolaia Płomyczka."
        },
        "35135": {
            "target": 35135,
            "required": [],
            "note": "Do kupienia za SŁ u Nikolaia Płomyczka."
        },
        "35138": {
            "target": 35138,
            "required": [],
            "note": "Do kupienia za SŁ u Nikolaia Płomyczka."
        }
    }

    const blueAlchemyItems = [35080,35081,35123,35124,35125,35126,35127,35128,35129,35130,35131,35132,35133,35134,35136,35137,35139,35140,35141,35142];
    const redAlchemyItems = [34991,34992,34993,34994,34995,34996,34997,34998,34999,35000,35001,35002,35003,35004,35005,35006,35007,35008,35009,35010,35011,35012,35076,35077,35083,35084,35085,35086,35087,35088,35089];

    const blueAlchemyLootboxes = [35075, 35074, 35073];
    const redAlchemyLootboxes = [35071, 35070, 35072];

    const sliceIndicesByRarity = {
        "common": 2,
        "unique": 1,
        "heroic": 0,
        "legendary": 0
    }

    const css = 
`
.priw8-alchemy-icon {
    background: url(https://micc.garmory-cdn.cloud/obrazki/itemy/kon/elik-smo-kr.gif);
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 400;
}

.priw8-alchemy-window {
    width: 386px;
    height: 300px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.priw8-alchemy-item {
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.15);
    margin: 2px;
}
.priw8-alchemy-item * {
    cursor: pointer;
}
.priw8-alchemy-main-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    font-weight: bold;
}
.priw8-alchemy-item-name {
    margin-bottom: 5px;
}
.priw8-alchemy-header {
    font-weight: bold;
}
.priw8-alchemy-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 5px;
    min-height: 36px;
    flex-wrap: wrap;
}
.priw8-alchemy-outfit-preview {
    width: 32px;
}
.priw8-alchemy-wnd-on-top {
    z-index: 500;
}
`;
    const $style = document.createElement("style");;
    $style.innerHTML = css;
    document.head.appendChild($style);

    const templateData = {
        "priw8-alchemy-icon": 
            `<div style="position: absolute;" class="priw8-alchemy-icon" tip="<b>Pomocnik alchemika</b>Kliknij, aby otworzyć"></div>`,
        
        "en-window":
        `<div class="en-window-wrapper" style="display: block; position: absolute;">
        <div class="header-wrapper">
            <div class="right-border"></div>
            <div class="left-border"></div>
            <div class="content">
                <div class="header-text-wrapper"><span class="gfont" name=""></span></div>
            </div>
            <div class="close-button"></div>
        </div>
        <div class="content-wrapper">
            <div class="background-wrapper">
                <div class="border top"></div>
                <div class="border bottom"></div>
                <div class="border left"></div>
                <div class="border right"></div>
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="background"></div>
            </div>
            <div class="content-inner"></div>
        </div>
    </div>`,

        "priw8-alchemy-window":
            `<div class="priw8-alchemy-window">
                <div class="priw8-alchemy-main-item">
                    <div class="priw8-alchemy-item-name">Kliknij na przedmiot dowolny z alchemii...</div>
                    <div class="priw8-alchemy-item"></div>
                    <div class="priw8-alchemy-outfit-preview"></div>
                </div>
                <div class="priw8-alchemy-ingredients">
                    <div class="priw8-alchemy-header">Przedmiot można stworzyć używając:</div>
                    <div class="priw8-alchemy-items">-</div>
                </div>
                <div class="priw8-alchemy-ingredient-of">
                    <div class="priw8-alchemy-header">Przedmiot wykorzystywany jest do tworzenia:</div>
                    <div class="priw8-alchemy-items">-</div>
                </div>
            </div>
            `,

        "priw8-alchemy-item":
            `<div class="priw8-alchemy-item"></div>`,

        "item": `<div class="item"></div>`,

        "highlight-unique": `<div class="itemHighlighter t_uni"></div>`,
        "highlight-heroic": `<div class="itemHighlighter t_her"></div>`,
        "highlight-legendary": `<div class="itemHighlighter t_leg"></div>`
    }

    const Storage = new (function() {
        const path = "priw8-alchemy/";
        const Storage = interfaceType != "old" ? API.Storage : margoStorage;
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

    function itemTip(itemData) {
        if (interfaceType == "old")
            return window.itemTip(itemData);
        else
            return ""; // TODO NI
    }

    function addLock(name) {
        if (interfaceType == "old")
            g.lock.add(name);
        else 
            void 0; // TODO NI
    }
    function removeLock(name) {
        if (interfaceType == "old")
            g.lock.remove(name);
        else 
            void 0; // TODO NI
    }

    function itemStat(itemData) {
        if (interfaceType == "old")
            return window.parseItemStat(itemData.stat);
        else
            return {}; // TODO NI
    }

    function getItem(id) {
        if (interfaceType == "old")
            return g.item[id];
        else
            return null; // TODO NI
    }

    function setTip($el, txt, ctip="") {
        if (interfaceType == "new") {
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

    function getTemplateString(name) {
        const tpl = templateData[name];
        if (typeof tpl == "undefined") {
            throw new Error(`Template ${name} does not exist`);
        }
        return tpl;
    }
    function getTemplate(name) {
        const d = document.createElement("div");
        d.innerHTML = getTemplateString(name);
        const $el = d.firstChild;
        d.removeChild($el);
        return $el;
    }
    function getItemTemplate(id) {
        const itemData = ItemData[id];
        if (typeof itemData == "undefined") {
            throw new Error(`Item ${id} does not exist`);
        }
        const $item = getTemplate("item");
        $item.dataset.tpl = id;

        setTip($item, itemTip(itemData), "t_item");
        const stat = itemStat(itemData);
        if (["unique", "heroic", "legendary"].includes(stat.rarity)) {
            const $highlight = getTemplate(`highlight-${stat.rarity}`);
            $item.appendChild($highlight);
        }
        const $img = document.createElement("img");
        $img.src = `https://micc.garmory-cdn.cloud/obrazki/itemy/${itemData.icon}`;
        $item.appendChild($img);

        return $item;
    }
    function getItemTemplateWithWrapper(id) {
        const $item = getItemTemplate(id);
        const $el = getTemplate("priw8-alchemy-item");
        $el.appendChild($item);
        return $el;
    }

    function getAlchemyWnd() {
        return document.querySelector(".priw8-alchemy-window");
    }

    function makeWindowOnTop(id) {
        document.querySelector(".priw8-alchemy-wnd-on-top")?.classList.remove("priw8-alchemy-wnd-on-top");
        document.querySelector(`.priw8-alchemy-wnd-${id}`)?.classList.add("priw8-alchemy-wnd-on-top");
    }

    function getWindow(id, name) {
        const existing = document.querySelector(`.priw8-alchemy-wnd-${id}`);
        if (existing) {
            makeWindowOnTop(id);
            return existing;
        }

        const $el = getTemplate("en-window");
        $el.classList.add(`priw8-alchemy-wnd-${id}`);
        $el.style.top = Storage.get(`wnd-pos-${id}/top`);
        $el.style.left = Storage.get(`wnd-pos-${id}/left`);
        $($el).draggable({
            header: ".header-wrapper",
            start: () => {
                makeWindowOnTop(id);
                addLock(`priw8-alchemy-wnd-${id}`);
            },
            stop: () => {
                removeLock(`priw8-alchemy-wnd-${id}`);
                Storage.set(`wnd-pos-${id}/top`, $el.style.top);
                Storage.set(`wnd-pos-${id}/left`, $el.style.left);
            },
            containment: "body",
            scroll: false
        });
        $el.querySelector(".close-button").addEventListener("click", e => {
            document.body.removeChild($el);
        });
        const $name = $el.querySelector(".header-text-wrapper span");
        $name.innerText = name;
        $name.setAttribute("name", name);
        document.body.appendChild($el);
        makeWindowOnTop(id);
        return $el;
    } 

    function openMainWindow() {
        if (!getAlchemyWnd()) {
            currentMainItem = null;
            const $el = getWindow("main", "Pomocnik alchemika");
            const $wnd = getTemplate("priw8-alchemy-window");
            $el.querySelector(".content-inner").appendChild($wnd);
            $wnd.querySelector(".priw8-alchemy-main-item .priw8-alchemy-item").addEventListener("click", mainItemClick);
        }
    }
    window.__priw8_alchemy_openMainWindow = openMainWindow;

    function getItemDataFromElement($el) {
        const id = $el.getAttribute("id");
        if (id && id.match(/item[0-9]+/)) {
            const itemID = id.substring(4);
            const item = getItem(itemID);
            if (item)
                return ItemData[item.tpl];
            return ItemData[itemID];
        } else if ($el.dataset.tpl) {
            return ItemData[$el.dataset.tpl];
        }
        return null;
    }

    function getIngredientOf(id) {
        const res = [];
        for (const targetID in Recipes) {
            const recipe = Recipes[targetID];
            if (recipe.required.indexOf(id) > -1)
                res.push(recipe.target);
        }
        return res;
    }

    let currentMainItem = null;
    function mainItemClick(e) {
        if (!currentMainItem)
            return;

        const stat = itemStat(currentMainItem);
        if (stat.lootbox2) {
            _g(`moveitem&st=2&tpl=${currentMainItem.id}`);
        }
    }

    function setMainItem(itemData) {
        currentMainItem = itemData;
        const $wnd = getAlchemyWnd();
        const $item = getItemTemplate(itemData.id);
        $wnd.querySelector(".priw8-alchemy-item-name").innerText = itemData.name;
        const $mainItem = $wnd.querySelector(".priw8-alchemy-main-item .priw8-alchemy-item");
        $mainItem.innerHTML = "";
        $mainItem.appendChild($item);

        const recipe = Recipes[itemData.id];
        const $recipe = $wnd.querySelector(".priw8-alchemy-ingredients .priw8-alchemy-items");
        if (recipe) {
            $recipe.innerHTML = "";
            for (const id of recipe.required) {
                $recipe.appendChild(getItemTemplateWithWrapper(id));
            }
            if (recipe.note) {
                const $span = document.createElement("span");
                $span.innerText = recipe.note;
                $recipe.appendChild($span);
            }
        } else {
            $recipe.innerHTML = "";
            const rarity = itemStat(itemData).rarity;
            const ind = sliceIndicesByRarity[rarity];
            let lootboxes = null;
            if (redAlchemyItems.includes(itemData.id)) {
                lootboxes = redAlchemyLootboxes.slice(ind);
            } else if (blueAlchemyItems.includes(itemData.id)) {
                lootboxes = blueAlchemyLootboxes.slice(ind);
            }

            if (lootboxes) {
                for (const id of lootboxes) {
                    $recipe.appendChild(getItemTemplateWithWrapper(id));
                }
            } else {
                $recipe.innerText = `Brak danych (TPL#${itemData.id})`;
            }
        }

        const $recipeOf = $wnd.querySelector(".priw8-alchemy-ingredient-of .priw8-alchemy-items");
        const ingredientOf = getIngredientOf(itemData.id);
        if (ingredientOf.length) {
            $recipeOf.innerHTML = "";
            for (const id of ingredientOf) {
                $recipeOf.appendChild(getItemTemplateWithWrapper(id));
            }
        } else {
            $recipeOf.innerHTML = "-";
        }

        const stat = itemStat(itemData);
        const $preview = $wnd.querySelector(".priw8-alchemy-outfit-preview");
        if (stat.outfit) {
            $preview.style.height = "48px";
            const outfit = stat.outfit.split(",")[1];
            const url = `https://micc.garmory-cdn.cloud/obrazki/postacie/${outfit}`;
            $preview.style.backgroundImage = `url(${url})`;
        } else {
            $preview.style.height = "0px";
        }
    }

    document.body.addEventListener("click", e => {
        const $wnd = getAlchemyWnd();
        const $e = e.target;
        const $par = $e.parentElement;
        const $item = $e.classList.contains("item") && $e || $par.classList.contains("item") && $par;
        if ($item && $wnd) {
            const data = getItemDataFromElement($item);
            if (data)
                setMainItem(data);
        }
    });

    function createIcon() {
        const $icon = getTemplate("priw8-alchemy-icon");
        $icon.style.top = Storage.get("icon-pos/top");
        $icon.style.left = Storage.get("icon-pos/left");
        $($icon).draggable({
            start: () => {
                addLock("priw8-alchemy-icon");
            },
            stop: () => {
                removeLock("priw8-alchemy-icon");
                Storage.set("icon-pos/top", $icon.style.top);
                Storage.set("icon-pos/left", $icon.style.left);
            }
        })
        // TODO NI
        document.querySelector("#centerbox2").appendChild($icon);
        $icon.addEventListener("click", e => {
            // TODO NI
            showMenu(e, [["Sprawdź przedmiot", "__priw8_alchemy_openMainWindow()"], ["Lista przedmiotów", "__priw8_alchemy_openAllItemWindow()"]]);
        });
    }

    createIcon();

    // Bag detector
    const BagData = {
        "Czarna torba alchemika": [25, 50],
        "Brązowa torba alchemika": [51, 100],
        "Pomarańczowa torba alchemika": [101, 150],
        "Zielona torba alchemika": [151, 200],
        "Turkusowa torba alchemika": [201, 250],
        "Niebieska torba alchemika": [251, 500],
    }
    event.add("npc", npcs => {
        for (const id in npcs) {
            const npc = npcs[id];
            if (BagData[npc.nick]) {
                const $el = getWindow("bag-notif", "Znaleziono torbę!");
                const [minLvl, maxLvl] = BagData[npc.nick];
                $el.querySelector(".content-inner").innerHTML = 
`
<center>
<b>${npc.nick}</b><br>
<img src="https://micc.garmory-cdn.cloud/obrazki/npc/${npc.icon}"><br>
${map.name /* TODO NI */} - (${hero.x}, ${hero.y})<br>
${hero.lvl < minLvl || hero.lvl > maxLvl ? `<span style='color:red'>Torba na ${minLvl} - ${maxLvl} poziom!</span>` : ""}
</center>
`
            }
        }
    });

    const rarityValues = {
        "common": 0,
        "unique": 1,
        "heroic": 2,
        "legendary": 3
    }
    function openAllItemWindow() {
        const $el = getWindow("item-list", "Lista przedmiotów");
        const items = Object.values(ItemData).sort((it1, it2) => {
            const st1 = itemStat(it1), st2 = itemStat(it2);
            if (st1.outfit || st2.outfit) {
                if (st1.outfit && !st2.outfit)
                    return 1;
                if (!st1.outfit && st2.outfit)
                    return -1;
            }
            if (it1.cl != it2.cl) {
                return it1.cl - it2.cl;
            }
            if (st1.rarity != st2.rarity) {
                return rarityValues[st1.rarity] - rarityValues[st2.rarity];
            }
            return 0;
        });
        const $content = $el.querySelector(".content-inner");
        if ($content.childNodes.length > 0) {
            $content.innerHTML = "";
        } else {
            $content.addEventListener("click", openMainWindow);
        }
        const $c = document.createElement("div");
        $c.classList.add("priw8-alchemy-items");
        for (const item of items) {
            $c.appendChild(getItemTemplateWithWrapper(item.id));
        }
        $content.appendChild($c);
    }
    window.__priw8_alchemy_openAllItemWindow = openAllItemWindow;


    // lazy outfit animation xd
    const OFFSETS = [
        "0px 0px",
        "-32px 0px",
        "-64px 0px",
        "-96px 0px",
        "0px -48px",
        "-32px -48px",
        "-64px -48px",
        "-96px -48px",
        "0px -144px",
        "-32px -144px",
        "-64px -144px",
        "-96px -144px",
        "0px -96px",
        "-32px -96px",
        "-64px -96px",
        "-96px -96px",
    ];
    
    let currentFrame = 0;
    let maxFrame = OFFSETS.length - 1;
    
    setInterval(() => {
        const outfitPreviews = document.querySelectorAll(".priw8-alchemy-outfit-preview");
        currentFrame += 1;
        if (currentFrame > maxFrame)
            currentFrame = 0;
    
        const offset = OFFSETS[currentFrame];
        for (const preview of outfitPreviews) {
            preview.style.backgroundPosition = offset;
        }
    }, 500);
    
}();
