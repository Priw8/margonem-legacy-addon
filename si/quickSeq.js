// quickSeq - pokazywanie informacji o ekwipunku graczy w tipach

quickSeq = new (function(_startGame, _newOther) {
	let that = this;
	this.parseOther = function(other, id) {
		if (!g.other[id] && !other.del) {
			this.getTip(id, this.appendOtherTip);
		};
	};
	this.appendOtherTip = function(tip, id) {
		let $other = $("#other"+id);
		if ($other.length) {
			$other.attr("tip", $other.attr("tip")+"<br>"+tip);
		};
	};
	newOther = function(data) {
		for (let i in data) {
			that.parseOther(data[i], i);
		};
		return _newOther.apply(this, arguments);
	};
    this.getWorld = function() {
        return window.g.worldConfig.getWorldName();
    }
    this.getEq = function(id, clb) {
        const domain = window._l();
        const dir = id % 128;
        const url = `https://mec.garmory-cdn.cloud/${domain}/${this.getWorld()}/${dir}/${id}.json?` + new Date().getTime();
        fetch(url).then(res => {
            if (res.ok) {
                res.text().then(jsonString => {
                    clb(JSON.parse(jsonString));
                });
            } else {
                clb({});
            }
        }).catch(() => {
            clb({});
        });
    }
	this.getTip = function(id, callback) {
		this.getEq(id, function(eq) {
            let tip = '';
            let nor = 0;
            let uni = 0;
            let her = 0;
            let upg = 0;
            let leg = 0;
            let art = 0;
            let lvlSum = 0;
            let equippedItemCount = 0;
            let playerLevel = id == hero.id ? hero.lvl : g.other[id]?.lvl;
            if (playerLevel) {
                for (let i in eq) {
                    let item = eq[i];
                    let stat = window.parseItemStat(item.stat);
                    if (item.st != 9 && item.st != 10) {
			    		equippedItemCount++;
                        if (stat.rarity == "artefact") {
                            art++;
                        } else if (stat.rarity == "legendary") {
                            leg++;
                        } else if (stat.rarity == "upgraded") {
                            upg++;
                        } else if (stat.rarity == "heroic") {
                            her++;
                        } else if (stat.rarity == "unique") {
                            uni++;
                        } else {
                            nor++;
                        };

                        let lvl = parseInt(stat.lvl);
                        if (isNaN(lvl)) lvl = 1;

                        let enhanceLvl = parseInt(stat.enhancement_upgrade_lvl);
                        if (isNaN(enhanceLvl)) enhanceLvl = 0;

                        lvl += lvl * (enhanceLvl * 0.03); // each enhance level increases effective level by 3%

			    		if (!isNaN(lvl)) lvlSum += Math.pow(lvl/playerLevel, 1.2)*100;
                    };
                };
			    if (art > 0) {
                    tip += '<font color=red>Artefakty: ' + art + '</font>';
                };
                if (leg > 0) {
			    	if (tip != '') {
                        tip += '<br>';
                    };
                    tip += '<font color=orange>Legendarne: ' + leg + '</font>';
                };
                if (upg > 0) {
                    if (tip != '') {
                        tip += '<br>';
                    };
                    tip += '<font color=yellow>Ulepszone: ' + upg + '</font>';
                };
                if (her > 0) {
                    if (tip != '') {
                        tip += '<br>';
                    };
                    tip += '<font color=lightblue>Heroiczne: ' + her + '</font>';
                };
                if (uni > 0) {
                    if (tip != '') {
                        tip += '<br>';
                    };
                    tip += '<font color=lightgreen>Unikatowe: ' + uni + '</font>';
                };
                if (nor > 0) {
                    if (tip != '') {
                        tip += '<br>';
                    };
                    tip += '<font color=white>Pospolite: ' + nor + '</font>';
                };
                lvlSum = lvlSum/(equippedItemCount > 0 ? equippedItemCount : 1);
			    if (tip != '') {
                    tip += '<br><br><font color=white>Wsp. eq/lvl: '+lvlSum.toFixed(2)+'</font>';
                };
            }
            callback(tip, id);
        });
	};
	this.onGameStart = function() {
		that.getTip(hero.id, that.appendHeroTip);
	};
	this.oldHeroTip = false;
	this.appendHeroTip = function(tip) {
		let $hero = $("#hero");
		if (!that.oldHeroTip) that.oldHeroTip = $("#hero").attr("tip");
		$hero.attr("tip", "<center>" + that.oldHeroTip + "<br>" + (tip != "" ? tip : "Nie widać Twojego eq.") + "</center>");
	};
	startGame = function() {
		_startGame.apply(this, arguments);
		g.loadQueue.push({
			fun: that.onGameStart,
			data: ""
		});
	};
})(startGame, newOther);