// betterItemTip: ramki z NI i stowrzone na wzór NI tipy przedmiotów

//update10: wywalenie rzeczy sprzed rarity, naprawiony permbound, dodanie enhancement_point_add
//update9: statystyka rarity
//update8: poprawiono błędną wartość w legbon_dmgred
//update7: - lepsza kompatybilność z itemami generowanymi przed dodatki barlaga (zmiany nazwy klas),
//         - lepsza kompatybilność z motywem NewMargo (!important na border-color)
//         - używanie CFG.ipath
//         - obsługa artisan_worthless
//         - wszelkie blokady itemu (nodepo/artisan_worthless/noauction) przeniesiona do sections[8]
//update6: dodano stat bonus_not_selected
//update5: dodano brakujące staty od ulepszeń
//update4: naprawiono tipy zaśpiewów (statystyka battlestats)
//update3: drobne zmiany pokazywania ulepszeń z craftingu, żeby były bardziej widoczne; ususięto duplikowane ramki 
//update2: naprawiono wyświetlanie ilości
//update: dodano brakujące staty, zmieniono link do ramek bo teraz na SI nie da się z NI rzeczy pobrać

//ramki itemów:
!function(_newItem) {
	function initStyle() {
		var style = `
			.itemHighlighter {
                opacity: 1;
				background: url(https://priw8.com/margo/SI-addon/itemTipNI/img/borders.png);
				/*background: url(http://127.0.0.1:8080/SI-addon/itemTipNI/img/borders.png);*/
				background-position: 0 0;
                /*z-index: -1; wiecej psuje niż naprawia*/
			}
			.item:hover .itemHighlighter {
				filter: brightness(50%);
			}
			.itemHighlighter.t_uni {
				background-position: -32px 0px;
			}
			.itemHighlighter.t_her {
				background-position: -64px 0px;
			}
			.itemHighlighter.t_upg {
				background-position: -96px 0px;
			}
			.itemHighlighter.t_leg {
				background-position: -128px 0px;	
			}
			.itemHighlighter.t_art {
				background-position: -160px 0px;
			}
			.itemHighlighter.new {
				background: none;
				border: 1px solid #FFFFFF;
				border-radius: 3px;
				width: 28px !important;
				height: 28px !important;
				margin-top: 1px;
				margin-left: 1px;
			}
			.loot > .item > .itemHighlighter {
				margin-top: 0px !important;
				margin-left: 0px !important;
				width: 32px !important;
				height: 32px !important;
			}
		`;
		var $style = document.createElement("style");
		$style.innerHTML = style;
		document.head.appendChild($style);
	};
	g.loadQueue.push({
		fun: initStyle
	});
}(newItem);
  
//tipy itemów:
new(function(_itemTip, _newITem) {
    var self = this;

    //weźcie to uzupełnijcie żeby nie wyświetlało undefined co
    //nwm kiedy napisałem to wyżej ale dzięki, już git
    //eq.classes[27] = "Recepty";

    function _t2(name, vals, cat) {
        var ret = _t(name, vals, cat);
        var before = ["~", "+", "1-"];
        var after = ["%"];
        var dontChange = ["(Można dzielić)", "(Nie można dzielić)", "(Can be split)", "(Cannot be split)", "s", "y", "ów"];
        var j;
        for (var i in vals) {
        	var old = ret;
        	var val = vals[i];
        	if (dontChange.indexOf(val) > -1) continue;
        	for (j=0; j<before.length; j++) {
        		ret = ret.replace(before[j] + val, '<span style="color: orange">'+before[j]+val+"</span>");
        	};
        	if (ret != old) continue;
        	for (j=0; j<after.length; j++) {
        		ret = ret.replace(val + after[j], '<span style="color: orange">'+val+after[j]+"</span>");
        	};
        	if (ret != old) continue;
        	ret = ret.replace(val, '<span style="color: orange">'+val+"</span>");
        };
        //workaround
        ret = ret.replace("</span>%", "%</span>");
        return ret;
    };
    this.generateTip = function(item) {
        var html = "";
        var sections = ["", "", "", "", "", "", "", "", "", "", ""];
        var stat = this.parseStat(item.stat);
        sections[0] = this.itemHeader(item, stat);
        this.generateSections(stat, sections, item);

        for (var i = 0; i < sections.length; i++) {
            if (sections[i] != "") {
                html += '<div class="tip-section tip-section-' + i + '">' + sections[i] + '</div>';
            };
        };
        return html;
    };
    this.generateSections = function(stat, sections, item) {
        var html = "";
        var boundState = 0;
        var cursedFlag = stat.cursed;
        var st = item.stat.split(';');
        sections[1] += "Typ: "+eq.classes[item.cl] + "<br>";
        for (var statName in stat) {
            var val = stat[statName];
            switch (statName) {
                //copypasta z /js/itemTip.js
                case 'bonus':
                    // ogólnie to słyszałem, że wywalacie z SI wszelkie nowe funkcjonalności js czy coś takiego?
                    // współczuję
                    // mnie to średnio w moim dodatkach interesuje
                    const [subStatName, subStatValue] = val.split(",");
                    let prefix = "+",
                        suffix = "",
                        unit = "",
                        trans = "itemtip_bonus_error";

                    switch(subStatName) {
                        case 'critmval':
                            unit = '%';
                            trans = _t2("bonus_of-".concat(subStatName, " %val%"), createTransVal(subStatValue, unit, prefix, suffix), 'newOrder');
                            break;
                
                        case 'sa':
                            trans = _t2('no_percent_bonus_sa %val%', createTransVal(subStatValue / 100, unit, prefix, suffix));
                            break;
                
                        case 'ac':
                            trans = _t2("item_".concat(subStatName, " %val%"), createTransVal(subStatValue, unit, prefix, suffix));
                            break;
                
                        case 'act':
                        case 'resfire':
                        case 'reslight':
                        case 'resfrost':
                            unit = '%';
                            trans = _t2("item_".concat(subStatName, " %val%"), createTransVal(subStatValue, unit, prefix, suffix), 'newOrder');
                            break;
                
                        case 'crit':
                        case 'critval':
                        case 'resdmg':
                            unit = '%';
                            trans = _t2("bonus_".concat(subStatName, " %val%"), createTransVal(subStatValue, unit, prefix, suffix), 'newOrder');
                            break;
                
                        case 'slow':
                            trans = _t2("bonus_".concat(subStatName, " %val%"), createTransVal(subStatValue / 100, unit, prefix, suffix));
                            break;
                
                        default:
                            trans = _t2("bonus_".concat(subStatName, " %val%"), createTransVal(subStatValue, unit, prefix, suffix));
                    }
                    sections[4] += "<span class=\"tip-enh-bonus-stat\">".concat(_t('enh_bonus %val%', {
                        '%val%': trans
                    }), "</span><br>");
                    break;
                case 'bonus_not_selected':
                    sections[4] += "<span class=\"tip-enh-bonus-stat not-selected\">".concat(_t('bonus_not_selected'), "</span><br>");
                    break;
                case 'improve':
                    var tmp = val.split(',');
                    var mpx = 1;
                    switch (tmp[0]) {
                        case 'armor':
                        case 'jewels':
                            mpx = 1.3;
                            break;
                        case 'armorb':
                        case 'weapon':
                            mpx = 1;
                            break;
                    }
                    sections[3] += _t('improves %items%', {
                        '%items%': _t('improve_' + tmp[0])
                    }) + '<br />';
                    sections[3] += _t('types_list %upg_normal% %upg_uni% %upg_hero%', {
                        '%upg_normal%': Math.round(mpx * tmp[1]),
                        '%upg_uni%': Math.round(mpx * tmp[1] * 0.7),
                        '%upg_hero%': Math.round(mpx * tmp[1] * 0.4)
                    }) + '<br />';
                    sections[3] += _t('improve_item_bound_info') + '<br />';
                    break;
                case 'ac':
                    sections[1] += _t2('item_ac %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Pancerz : '+val+'
                case 'act':
                    sections[1] += _t2('item_act %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //Odporność na truciznę '+mp(val)+'%
                case 'resfire':
                    sections[1] += _t2('item_resfire %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Odporność na ogień '+mp(val)+'%
                case 'reslight':
                    sections[1] += _t2('item_reslight %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Odporność na błyskawice '+mp(val)+'%<br>'
                case 'resfrost':
                    sections[1] += _t2('item_resfrost %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Odporność na zimno '+mp(val)+'%<br>'
                case 'dmg':
                    sections[1] += _t2('item_dmg %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Atak: '+val+'<br>'
                case 'pdmg':
                    sections[1] += _t2('item_pdmg %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Atak fizyczny: +'+val+'<br>'
                case 'perdmg':
                    sections[1] += _t2('item_perdmg %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Atak zwiększony o '+val+'%<br>'
                case 'zr':
                    sections[2] += _t2('item_zr %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Atak+zręczność/'+val+'<br>'
                case 'sila':
                    sections[2] += _t2('item_sila %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Atak+siła/'+val+'<br>'
                case 'int':
                    sections[2] += _t2('item_int %val%') + '<br>';
                    break; //'Atak magiczny<br>'
                    //after cursed items
                case 'lowcritallval':
                    sections[3] += _t2('bonus_lowcritallval %val%', {
                        '%val%': val
                    }) + '<br>';
                    break;
                case 'lowheal2turns':
                    sections[3] += _t2('bonus_lowheal2turns %val%', {
                        '%val%': val
                    }) + '<br>';
                    break;
                case 'resacdmg':
                    sections[3] += _t2('bonus_resacdmg %val%', {
                        '%val%': val
                    }) + '<br>';
                    break;
                case 'resmanaendest':
                    sections[3] += _t2('bonus_resmanaendest %val%', {
                        '%val%': val,
                        '%val2%': Math.max(1, Math.round(val / 3))
                    }) + '<br>';
                    break;

                case 'hp':
                    sections[3] += _t2('bonus_hp %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Życie '+mp(val)+'<br>'
                case 'sa1':
                case 'sa':
                    sections[3] += _t2('no_percent_bonus_sa %val%', {
                        '%val%': mp(val / 100)
                    }) + '<br>';
                    break; //'SA '+mp(val)+'%<br>'
                case 'ds':
                    sections[3] += _t2('bonus_ds %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Siła '+mp(val)+'<br>'
                case 'dz':
                    sections[3] += _t2('bonus_dz %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Zręczność '+mp(val)+'<br>'
                case 'di':
                    sections[3] += _t2('bonus_di %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Intelekt '+mp(val)+'<br>'
                case 'da':
                    sections[3] += _t2('bonus_da %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Wszystkie cechy '+mp(val)+'<br>'
                case 'gold':
                    if (val.split(':').length > 1) {
                        var newVal = val.replace(/[\(\)]/g, '');
                        var t = newVal.split(':');
                        newVal = _t2('start') + ' ' + t[0] + ' ' + _t2('stop') + ' ' + t[1];
                    } else newVal = mp(val);
                    sections[3] += _t2('bonus_gold %val%', {
                        '%val%': newVal
                    }) + '<br>';
                    break; //'Złoto '+mp(val)+'<br>'
                case 'creditsbon':
                    if (val && val > 1) {
                        sections[3] += _t2('bonus_creditsbon %val%', {
                            '%val%': val
                        }) + '<br>';
                    } else {
                        sections[3] += _t2('bonus_creditsbon') + '<br>';
                    }
                    break; //'Dodaje jedną Smoczą Łzę<br>'
                case 'runes':
                    sections[3] += _t2('bonus_runes %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Dodaje N smoczych run<br>'
                case 'goldpack':
                    sections[3] += _t2('bonus_goldpack %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Zawiera '+val+' złota<br>'
                case 'leczy':
                    if (val > 0) sections[3] += _t2('bonus_leczy %val%', {
                        '%val%': val
                    }) + '<br>'; //'Leczy '+val+' punktów życia<br>'
                    else {
                        if (val.split(':').length > 1) {
                            var newVal = val.replace(/[\(\)]/g, '');
                            var t = newVal.split(':');
                            newVal = _t2('start') + ' ' + t[0] + ' ' + _t2('stop') + ' ' + t[1];
                            sections[3] += _t2('bonus_truje2 %val%', {
                                '%val%': newVal
                            }) + '<br>';
                        } else sections[3] += _t2('bonus_truje %val%', {
                            '%val%': Math.abs(val)
                        }) + '<br>';
                    }
                    break; //'Trucizna, ujmuje '+Math.abs(val)+' punktów życia<br>'
                case 'fullheal':
                    sections[3] += _t2('bonus_fullheal %val%', {
                        '%val%': round(val, 2)
                    }) + '<br>';
                    break; //'Pełne leczenie, pozostało '+round(val,2)+' punktów uleczania.<br>'
                case 'perheal':
                    if (val > 0) {
                        sections[3] += _t2('bonus_perheal %val%', {
                            '%val%': val
                        }) + '<br>';
                    } else {
                        sections[3] += _t2('bonus_perheal_minus %val%', {
                            '%val%': `${-val}%`
                        }) + '<br>';
                    }
                    break; //'Leczy '+val+'% życia<br>'
                case 'blok':
                    sections[3] += _t2('bonus_blok %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Blok '+mp(val)+'<br>'
                case 'crit':
                    sections[3] += _t2('bonus_crit %val%', {
                        '%val%': val > 0 ? `+${val}` : val
                    }) + '<br>';
                    break; //'Cios krytyczny +'+val+'%<br>'
                case 'of-crit':
                    sections[3] += _t2('bonus_of-crit %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Cios krytyczny pomocniczy +'+val+'%<br>'
                case 'critval':
                    sections[3] += _t2('bonus_critval %val%', {
                        '%val%': (val.startsWith("-") ? "" : "+") + val
                    }) + '<br>';
                    break; //'Siła krytyka fizycznego +'+val+'%<br>'
                case 'of-critval':
                    sections[3] += _t2('bonus_of-critval %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Siła krytyka broni pomocniczej +'+val+'%<br>'
                case 'critmval':
                    sections[3] += _t2('bonus_of-critmval %val%', {
                        '%val%': (val.startsWith("-") ? "" : "+") + val
                    }) + '<br>';
                    break; //'Siła krytyka magicznego +'+val+'%<br>'
                case 'critmval_f':
                    sections[3] += _t2('bonus_critmval_f %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Siła krytycznego uderzenia magii ognia +'+val+'%<br>'
                case 'critmval_c':
                    sections[3] += _t2('bonus_critmval_c %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Siła krytycznego uderzenia magii zimna +'+val+'%<br>'
                case 'critmval_l':
                    sections[3] += _t2('bonus_critmval_l %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Siła krytycznego uderzenia magii błyskawic +'+val+'%<br>'
                case 'heal':
                    sections[3] += _t2('bonus_heal %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Przywraca '+val+' punktów życia podczas walki<br>'
                case 'evade':
                    sections[3] += _t2('bonus_evade %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Unik '+mp(val)+'<br>'
                case 'pierce':
                    sections[3] += _t2('bonus_pierce %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Przebicie pancerza +'+val+'%<br>'
                case 'pierceb':
                    sections[3] += _t2('bonus_pierceb %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //val+'% szans na zablokowanie przebicia<br>'
                case 'contra':
                    sections[3] += _t2('bonus_contra %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'+'+val+'% szans na kontrę po krytyku<br>'
                case 'revive':
                    sections[3] += _t2('revive %amount%', {
                        '%amount%': val
                    }) + '<br>';
                    break;
                case 'frost':
                    b = val.split(',');
                    sections[2] += _t2('bonus_frost %val% %slow%', {
                        '%val%': b[1],
                        '%slow%': (b[0] / 100)
                    }) + '<br>'; //'Obrażenia od zimna +'+b[1]+'<br>oraz spowalnia cel o '+(b[0]/100)+' SA<br>'
                    break;
                case 'poison':
                    b = val.split(',');
                    sections[2] += _t2('bonus_poison %val% %slow%', {
                        '%val%': b[1],
                        '%slow%': (b[0] / 100)
                    }) + '<br>';
                    break; //'Obrażenia od trucizny +'+b[1]+'<br>oraz spowalnia cel o '+(b[0]/100)+' SA<br>'
                case 'slow':
                    sections[3] += _t2('bonus_slow %val%', {
                        '%val%': (val / 100)
                    }) + '<br>';
                    break; //'Obniża SA przeciwnika o '+(val/100)+'<br>'
                case 'wound':
                    b = val.split(',');
                    sections[3] += _t2('bonus_wound %val% %dmg%', {
                        '%val%': b[0],
                        '%dmg%': b[1]
                    }) + '<br>'; //'Głęboka rana, '+b[0]+'% szans na +'+b[1]+' obrażeń<br>'
                    break;
                case 'fire':
                    sections[2] += _t2('bonus_fire %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Obrażenia od ognia ~'+val+'<br>'
                case 'light':
                    sections[2] += _t2('bonus_light %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Obrażenia od błyskawic 1-'+val+'<br>'
                case 'adest':
                    sections[3] += _t2('bonus_adest %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Zadaje '+val+' obrażeń właścicielowi<br>'
                case 'absorb':
                    sections[3] += _t2('bonus_absorb %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Absorbuje do '+val+' obrażeń fizycznych<br>'
                case 'absorbm':
                    sections[3] += _t2('bonus_absorbm %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Absorbuje do '+val+' obrażeń magicznych<br>'
                case 'hpbon':
                    sections[3] += _t2('bonus_hpbon %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'+'+val+' życia za 1 pkt siły<br>'
                case 'acdmg':
                    sections[3] += _t2('bonus_acdmg %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Niszczy '+val+' punktów pancerza podczas ciosu<br>'
                case 'resdmg':
                    sections[3] += _t2('bonus_resdmg %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Obniżenie odporności o '+val+'% podczas ciosu<br>'
                case 'energybon':
                    sections[3] += _t2('bonus_energybon %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Energia '+mp(val)+'<br>'
                case 'stamina':
                    sections[3] += _t2('stamina %val%', {
                        '%val%': val
                    }) + '<br>';
                    break;
                case 'manabon':
                    sections[3] += _t2('bonus_manabon %val%', {
                        '%val%': mp(val)
                    }) + '<br>';
                    break; //'Mana '+mp(val)+'<br>'
                case 'target_rarity':
                    // Wymagana rzadkość przedmiotu: %val%
                    var itemTypeTrans = _t("type_".concat(val));

                    sections[3] += _t("bonus_".concat(statName, " %val%"), {
                      '%val%': itemTypeTrans
                    }) + '<br>';
                    break;
                case 'bonus_reselect':
                    // Zastępuje aktualny bonus wzmocnienia innym, losowym
                    sections[3] += _t("bonus_".concat(statName)) + '<br>';
                    break;
                case 'force_binding':
                    // Wiążee z właścicielem ulepszany przedmiot
                    sections[3] += _t("".concat(statName)) + '<br>';
                    break;
                case 'abdest':
                    sections[3] += _t2('bonus_abdest %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Niszczenie '+val+' absorpcji przed atakiem<br>'
                case 'endest':
                    sections[3] += _t2('bonus_endest %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Niszczenie '+val+' energii podczas ataku<br>'
                case 'manadest':
                    sections[3] += _t2('bonus_manadest %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Niszczenie '+val+' many podczas ataku<br>'
                case 'lowevade':
                    sections[3] += _t2('bonus_lowevade %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Podczas ataku unik przeciwnika jest mniejszy o '+val+'<br>'
                case 'lowcrit':
                    sections[3] += _t2('bonus_lowcrit %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Podczas obrony szansa na cios krytyczny przeciwnika jest mniejsza o '+val+'%<br>'
                case 'arrowblock':
                    sections[3] += _t2('bonus_arrowblock %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Podczas obrony szansa na zablokowanie strzały/bełtu '+val+'%<br>'
                case 'honorbon':
                    sections[3] += _t2('bonus_honorbon %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'zwiększa ilość otrzymywanych punktów honoru<br>'
                case 'enhancement_add':
                    sections[3] += _t2('bonus_enhancement_add %val%', {
                        '%val%': val + "%"
                    }) + '<br>';
                    break;
                case 'enhancement_add_point':
                    sections[3] += _t2('bonus_enhancement_add_point') + "<br>";
                    break;
                case 'add_enhancement_refund':
                case 'reset_custom_teleport':
                case 'add_tab_deposit':
                    sections[4] += _t2('bonus_' +  statName) + '<br>';
                    break;
                case 'add_battleset': //Odblokowuje nowy zestaw do walki
                    sections[4] += _t2(statName) + '<br>';
                    break;
                case 'enhancement_refund' :
                    sections[4] += _t2('bonus_' +  statName) + '<br>';
                    if (val > 1) sections[4] += _t2('bonus_' +  statName + '_amount', {'%val%': val}) + '<br>';
                    break;
                case 'manafatig':
                case 'enfatig':
                    const p = val.split(',');
                    sections[3] += _t2('bonus_' +  statName, {'%val1%': mp(p[0]) + addUnit('%'), '%val2%': p[1]}) + '<br>';
                    break;
                case 'quest_expbon':
                    sections[3] += _t2('bonus_quest_expbon %val%', {
                        '%val%': val
                    }) + '%<br>';
                    break; //'zwiększa ilość zdobywanych punktów doświadczenia za questy<br>'
                case 'bag':
                    var posfix = _l() == 'pl' ? ($.inArray(val % 10, [2, 3, 4]) < 0 || val >= 6 && val <= 19 ? 'ów' : 'y') : (val > 1 ? 's' : '');
                    sections[3] += _t2('bonus_bag %val%', {
                        '%val%': val,
                        '%posfix%': posfix
                    }) + '<br>';
                    break; //'Mieści '+val+' przedmiot'+($.inArray(val%10,[2,3,4])<0||val>=6&&val<=19?'ów' : 'y')+'<br>'
                // case 'pkey': // W kodzie NI wykomentowane, więc deprecated chyba
                //     sections[3] += _t2('bonus_pkey') + '<br>';
                //     break; //'Klucz główny<br>'
                case 'rkeydesc' :
					sections[3] += _t('bonus_rkeydesc', { '%val%': val }) + '<br>';
					break; //'Otwiera: val'
                case 'btype':
                    sections[4] += _t2('bonus_btype %val%', {
                        '%val%': val.split(",").map(cl => eq.classes[cl]?.toLowerCase()).join(", ")
                    }) + '<br>';
                    break; //'Tylko '+eq.classes[val].toLowerCase()+'<br>'

                case 'respred':
                    sections[3] += _t2('bonus_respred %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Przyśpiesza wracanie do siebie o '+val+'%<br>'
                case 'afterheal':
                case 'afterheal2':
                    var b = val.split(',');
                    sections[3] += b[0] + _t2('bonus_afterheal2 %val%', {
                        '%val%': b[1]
                    }) + '<br>'; //'% szans na wyleczenie '+b[1]+' obrażeń po walce<br>'
                    break;
                case 'action':
                    var c = val.split(',');
                    switch (c[0]) {
                        case 'flee':
                            sections[3] += _t2('flee_item_description') + '<br />';
                            break;
                        case 'mail':
                            sections[3] += _t2('mail_item_description') + '<br />';
                            break;
                        case 'auction':
                            sections[3] += _t2('auction_item_description') + '<br />';
                            break;
                        case 'nloc':
                            if (c[1] == '*') sections[3] += _t2('nloc_heros_item_description') + '<br />';
                            else sections[3] += _t2('nloc_monster_item_description') + '<br />';
                            break;
                        case 'fatigue':
                            var f_val = parseInt(c[1]);
                            if (f_val > 0) {
                                sections[3] += _t2('fatigue_positive %val%', {
                                    '%val%': Math.abs(f_val)
                                }) + '<br />';
                            } else {
                                sections[3] += _t2('fatigue_negative %val%', {
                                    '%val%': Math.abs(f_val)
                                }) + '<br />';
                            }
                            break;
                        case 'fightperheal':
                            if (c.length == 2) sections[3] += _t2('fightperheal %amount%', {
                                '%amount%': c[1]
                            }) + '<br/>';
                            else if (c.length == 3) sections[3] += _t2('fightperheal %from% %to%', {
                                '%from%': c[1],
                                '%to%': c[2]
                            }) + '<br/>';
                            break;
                    }
                    break;
                case 'outfit_selector':
                        sections[3] += _t('outfit_selector') + '<br />';
                        break;
                case 'outfit':
                    var b=val.split(','),tm='',perm=false;
                    if(b[0]<1) {
                        perm = true;
                    }
                    if (b[0] < 1) tm = _t2('outfit_perm'); //'stałe';
                    else
                    if (b[0] == 1) tm = _t2('outfit_1min'); //'1 minutę'
                    else
                    if (b[0] < 5) tm = b[0] + _t2('outfit_mins1'); //" minuty"
                    else
                    if (b[0] < 99) tm = b[0] + _t2('outfit_mins2'); //" minut"
                    else
                    if (b[0] < 300) tm = round(b[0] / 60) + _t2('outfit_hrs1'); //" godziny"
                    else tm = round(b[0] / 60) + _t2('outfit_hrs2'); //" godzin"

                    var changeOn = '';
                    if (isset(b[2]))
                        changeOn = _t('in') + b[2];

                    if (perm) sections[3] += _t('outfit_change_perm') + changeOn +'<br>';
                    else sections[3] += _t2('outfit_change_for %time%', {'%time%': tm})+ changeOn +'<br>';

                    break;
                case 'battlestats':
                        if (!isset(g.skills)) {
                            g.skills = new skills();
                        }
                        sections[3] += _t('battlestats', {'%val%': g.skills.parseStatsToItemTip(val)})+'<br/>';
                        break;
                case 'freeskills':
                    sections[3] += _t('freeskills', {'%val%': val}) + '<br />';
                break;
                case 'npc_expbon':
                    if (val > 0) sections[3] += _t2('npx_expbon higher %amount%', {
                        '%amount%': val
                    }) + '%<br/>';
                    else if (val < 0) sections[3] += _t2('npx_expbon lower %amount%', {
                        '%amount%': -val
                    }) + '%<br/>';
                    else sections[3] += "Z jakiegoś powodu bonus do expa w tym błogosławieństwie to zero."
                    break;
                case 'npc_lootbon':
                    sections[3] += _t2('npx_lootbon higher %amount%', {
                        '%amount%': val
                    }) + '<br/>';
                    break;
                case 'timelimit':
                    var b = val.split(',');
                    if (b[0] < 1) sections[3] += _t2('timelimit_can be used %val% sec', {
                        '%val%': b[0]
                    }) + '<br>'; //'Można używać co '+b[0]+' sekund<br>'
                    else if (b[0] == 1) sections[3] += _t2('timelimit_can be used every min') + '<br>'; //'Można używać co 1 minutę<br>'
                    else if (b[0] < 5) sections[3] += _t2('timelimit_can be used %val% minutes', {
                        '%val%': b[0]
                    }) + '<br>'; //'Można używać co '+b[0]+' minuty<br>'
                    else sections[3] += _t2('timelimit_can be used %val% minutes2', {
                        '%val%': b[0]
                    }) + '<br>'; //'Można używać co '+b[0]+' minut<br>'
                    if (isset(b[1])) {
                        var sec = Math.floor((parseInt(b[1]) - unix_time()) / 60);
                        if (sec < 0) sections[3] += _t2('timelimit_readyToUse_now') + '<br>'; //'Gotowy do użycia<br>'
                        else if (sec < 1) sections[3] += _t2('timelimit_readyToUse_inawhile') + '<br>'; //'Gotowy do użycia za chwilę<br>'
                        else if (sec == 1) sections[3] += _t2('timelimit_readyToUse_inaminute') + '<br>'; //'Gotowy do użycia za minutę<br>'
                        else if (sec < 5) sections[3] += _t2('timelimit_readyToUse_in %val% sec', {
                            '%val%': sec
                        }) + '<br>'; //'Gotowy do użycia za '+sec+' minuty<br>';
                        else sections[3] += _t2('timelimit_readyToUse_in %val% min', {
                            '%val%': sec
                        }) + '<br>'; //'Gotowy do użycia za '+sec+' minut<br>'
                    }
                    break;
                case 'expires':
                    if (val - unix_time() < 0) sections[10] += '<span style="color: #ff6b6b;">' + _t('item_expired') + '</span>';
                    else sections[10] += _t('valid_to %date%', {
                        '%val%': ut_fulltime(val, true)
                    }); //'Ważny do: '+ut_date(val)+'<br>'
                    break;
                    case 'expire_date' :
                        sections[10] += _t('expire_date %date%', { '%date%': val }) + '<br>'; //'DziaÅ‚a do: dd.mm.rrrr'
                        break;
                      case 'expire_duration' :
                        var seconds = convertTimeToSec(val);
                        var timeObj = convertSecToTime(seconds);
                        var t = '';
                        for (var x in timeObj) {
                          if(timeObj[x] === 0) continue;
                          switch (x) {
                            case 'd':
                              t += _t('time_days %val%', { '%val%': timeObj[x] }, 'time_diff') + ' ';
                              break;
                            case 'h':
                              t += _t('time_h %val%', { '%val%': timeObj[x] }, 'time_diff') + ' ';
                              break;
                            case 'm':
                              t += _t('time_min %val%', { '%val%': timeObj[x] }, 'time_diff') + ' ';
                              break;
                            case 's':
                              t += _t('time_sec %val%', { '%val%': timeObj[x] }, 'time_diff');
                              break;
                          }
                        }
                        sections[10] += _t('expire_duration %time%', { '%time%': t }) + '<br>'; //'DziaÅ‚a przez: time'
                        break;
                case 'ttl':
                    const locs = ['t', 'n', 'o', 'r', 'g', 'r', 'd', 'c'];
                    if (item.cl == 25 && (locs.indexOf(item.loc) > -1 || (item.loc == 'g' && (item.st == 0 || item.st == 9) || (item.loc=='s'&&item.st==0)))) sections[4] += _t2('ttl1 %date%', {
                        '%val%': val
                    }) + '<br />'; //'Działa '+val+'min<br>';
                    else sections[4] += _t2('ttl2 %date%', {
                        '%val%': val
                    }) + '<br />'; //'Zniknie za '+val+'min<br>'
                    break;
                case 'ammo':
                case 'amount':
                    if (item.st != 10) {
                        if (cursedFlag) {
                            sections[4] += '<span class="amount-text">' + _t2('cursed_amount %val%', {
                              '%val%': val
                            }) + ' ('+_t('split_impossible')+')</span><br>';
                        } else {
                            let split = "";
                            if (stat.cansplit) {
                                if (item.st == 0 || item.st == 9 || item.loc == 'o') {
                                    split = `(${(parseInt(stat.cansplit) ? _t('split_possible') : _t('split_impossible'))})`;
                                }
                            }
                            if (stat.nosplit) {
                                split = `(${_t('split_impossible')})`;
                            }
                            sections[4] += '<span class="amount-text">' + _t2('amount %val% %split%', {
                                '%val%': val,
                                '%split%': split
                            }) + '</span><br>';
                        }
                    }
                    break;
                case 'capacity':
                    if (item.st != 10) sections[4] += _t2('capacity %val%', {
                        '%val%': val
                    }) + '<br>';
                    break; //'Maksimum '+val+' sztuk razem<br>'
                case 'ammo':
                    sections[4] += _t2('ammo %val% %split%', {
                        '%val%': val,
                        '%split%': splittxt
                    }) + '<br' + (val < 50 ? ' noammo' : '') + '>';
                    break; //'Strzał: '+val+' '+splittxt+'<br'+(val<50?' noammo' : '')+'>'
                case 'nodepo':
                    if (item.cl == 25 && (item.loc == 'g' && (item.st != 0 && item.st != 9))) break;
                    sections[8] += _t2('nodepo_info') + '<br />';
                    break; //'Przedmiotu nie można przechowywać w depozycie <br>'
                case 'nodepoclan':
                    sections[8] += _t2('nodepoclan_info') + '<br />';
                    break; //'Przedmiotu nie można przechowywać w depozycie <br>'
                case 'artisan_worthless':
                    sections[8] += _t('artisan_worthless') + '<br />';
                    break;

                case 'legbon':
                    sections[5] += '<i class=legbon>';
                    var b = val.split(',');
                    switch (b[0]) {
                        case 'verycrit':
                            sections[5] += _t2('legbon_verycrit').replace("%val%", 13);
                            break; //'Cios bardzo krytyczny: 10% szansy na podwojenie mocy ciosu krytycznego.'
                        case 'holytouch':
                            sections[5] += _t2('legbon_holytouch').replace("%val%", 7);
                            break; //'Dotyk anioła: podczas udanego ataku 5% szansy na ogromne uleczenie ran, nie więcej niż stan początkowego życia.'
                        case 'curse':
                            sections[5] += _t2('legbon_curse').replace("%val%", 9);
                            break; //'Klątwa: udany atak powoduje, iż przeciwnik otrzymuje 7% szans na chybienie przy jego następnym ataku.'
                        case 'pushback':
                            sections[5] += _t2('legbon_pushback');
                            break; //'Odrzut: 8% szans na cofnięcie przeciwnika o krok do tyłu. Dotyczy wyłącznie profesji dystansowych.'
                        case 'lastheal':
                            sections[5] += _t2('legbon_lastheal').replace("%val%", 18);
                            break; //'Ostatni ratunek: kiedy po otrzymanym ataku zostanie graczowi mniej niż 12% życia, zostaje jednorazowo uleczony do 30-50% swojego życia.'
                        case 'critred':
                            sections[5] += _t2('legbon_critred').replace("%val%", 20);
                            break; //'Krytyczna osłona: przyjmowane ciosy krytyczne są o 15% słabsze.'
                        case 'resgain':
                            sections[5] += _t2('legbon_resgain').replace("%val%", 16);
                            break; //'Ochrona żywiołów: 12% szans na podniesienie wszystkich odporności do maksimum (90%) przy przyjmowaniu ciosu magicznego.'
                        case 'dmgred':
                            sections[5] += _t2('legbon_dmgred').replace("%val%", 16);
                            break; //'Fizyczna osłona: obrażenia fizyczne zmniejszone o 12%.'
                        case "glare":
                            sections[5] += _t2('legbon_glare').replace("%val%", 9);
                            break;
                        case "cleanse":
                            sections[5] += _t2('legbon_cleanse').replace("%val%", 12);
                            break;
                        default:
                            sections[5] += _t2('legbon_undefined %val%', {
                                '%val%': b[0]
                            });
                            break; //'Nieznany bonus: '+b[0]
                    }
                    sections[5] += '</i>';
                    break;

                case 'lvlnext':
                    sections[10] += '<b class="lvl-next">' + _t2('match_bonus_' + statName + ' %val%', {
                        '%val%': val
                    }) + '</b>';
                    break;
                case 'lvlupgcost':
                case 'lvlupgs':
                    sections[4] += _t2('match_bonus_' + statName + ' %val%', {
                        '%val%': val
                    }) + '<br>';
                    break;
                case 'upglvl':
                    sections[4] += _t2('match_bonus_' + statName + ' %val%', {
                        '%val%': _t2(val)
                    }) + '<br>';
                    break;

                case 'expadd': //Dodaje %val%-krotność doświadczenia za zabicie przeciwnika na twoim poziomie
                    sections[4] += _t2('bonus_' + statName + ' %val%', {
                        '%val%': val
                    }) + '<br>';
                    break;


                case 'townlimit':
                    sections[5] += '<i class=idesc>' + _t2('townlimit') + '</i>';
                    break; //'Działa tylko w wybranych lokacjach<br>'
                case 'teleport': {
                    const tpCoords = val.split(",").slice(1);
                    sections[7] = '<i class=idesc>' + _t2('teleport') + `:<br>${tpCoords[2]} (${tpCoords[0]},${tpCoords[1]})` + '</i>' + sections[7];
                    break; //'Teleportuje gracza
                }
                case 'custom_teleport': {
                    const tpCoords = typeof val == "string" && val.split(",").slice(1);
                    if (val == true) sections[7] += '<i class=idesc>' +_t('dbl_click_to_set') +'</i>';
                    else sections[7] =  '<i class=idesc>' +_t('teleport') + `:<br>${tpCoords[2]} (${tpCoords[0]},${tpCoords[1]})` + '</i> '+ sections[7];
                break;
                }
                case 'furniture':
                    sections[6] += _t2('furniture', null, 'itemtip') + '<br>';
                    break;
                case 'nodesc':
                    sections[6] += '<i class=idesc>' + _t2('nodesc') + '</i>';
                    break; //Przedmiot niezidentyfikowany
                case 'created':
                    break;
                case 'pumpkin_weight':
                    const weight = `${val/1000}kg`; // xd
                    sections[7] += `<i class="idesc">${_t('pumpkin_weight')} ${weight}</i><br>`;
                    break;
                case 'opis':
                    val = val.replace(/#DATE#|#YEAR#/g, function(m) {
                        switch (m) {
                            case '#DATE#':
                                if (!isset(stat.created))
                                    return ut_date(unix_time());
                                return ut_date(stat.created);
                            case '#YEAR#':
                                if (!isset(stat.created)) {
                                    if (item.loc == 'n' || item.loc == 'v') {
                                        var tmp_date = new Date();
                                        return tmp_date.getFullYear();
                                    }
                                    return '2012';
                                }
                                return ut_date(stat.created).substr(-4);
                        }
                    });
                    //}
                    sections[7] += '<i class=idesc>' + htmlspecialchars(parseItemBB(val, true)) + '</i>';
                    break;

                case 'loot': //nick,plec,liczebność grupy,ts,npc
                    var b = val.split(','),
                        gr = '';
                    if (b[2] == 2) gr = _t2('with_player'); //' wraz z kompanem';
                    if (b[2] > 2) gr = _t2('with_company'); //' wraz z drużyną';
                    sections[8] += '<i class=looter>' + htmlspecialchars(_t('loot_with %day% %npc% %grpinf% %name%', {
                        '%day%': ut_date(b[3]),
                        '%npc%': b[4],
                        '%grpinf%': gr,
                        '%name%': b[0]
                    })) + '</i>'; //'W dniu '+ut_date(b[3])+' został(a) pokonany(a) '+b[4]+' przez '+b[0]+gr+'
                    break;
                case 'lootbox':
                    break;
                case 'lootbox2':
                    break;
                case 'animation':
                    break;
                case 'timelimit_upgmax' :
                    sections[3] += _t2('Corecttimelimit_upgmax', {'%val%':val}) + '<br>';
                    break;
                case 'upgtimelimit' :
                    sections[4] += _t2('Corectupgtimelimit') + '<br>';
                    break;
                case 'timelimit_upgs' :
                    sections[3] += _t2('Corecttimelimit_upgs', {'%val%':val}) + '<br>';
                break;
                case 'soulbound':
                    boundState |= 1;
                    break;
                case 'permbound':
                    boundState |= 3;
                    break;
                case 'canpreview':
                    sections[9] += _t2('canpreviewitem') + '<br>';
                    break;
                case 'recovered':
                    sections[9] += _t2('recovered') + '<br>';
                    break; //'Przedmiot odzyskany, obniżona wartość, nie może być wystawiany na aukcję<br>'
                case 'unbind':
                    sections[9] += _t2('unbind') + '<br>';
                    break; //'Przeciągnij na postać, by aktywować<br>' : 'Wiąże po założeniu<br>'
                case 'unbind_credits':
                    break;
                case 'undoupg':
                    sections[9] += _t2('undoupg') + '<br>';
                    break; //'Przeciągnij na postać, by aktywować<br>' : 'Wiąże po założeniu<br>'
                case 'notakeoff':
                    sections[8] = _t2('notakeoff') + '<br>';
                    break; //'Czar niemożliwy do zdjęcia<br>'

                case 'summonparty':
                    sections[9] = _t2('summonparty') + '<br>';
                    break; //'Przywołuje do Ciebie wszystkich członków Twojej drużyny<br>'

                case "lowreq":
                    if (!isNaN(parseInt(val))) {
                        var txt = _t('type_lower_req %val%', {
                            '%val%': val
                        });
                        txt = txt.charAt(0).toUpperCase() + txt.substring(1);
                        sections[10] += '<b class="att">' + txt + "</b><br>";
                    };
                    break;
                case 'lvl':
                    sections[10] += '<b class="att' + ((val > hero.lvl) ? ' noreq' : '') + '">' + _t('lvl %lvl%', {
                        '%lvl%': val
                    }) + '</b><br>';
                    break; //'Wymagany poziom: '+val+
                case 'reqp':
                    sections[10] += '<b class="att' + ((val.indexOf(hero.prof) < 0) ? ' noreq' : '') + '">' + _t2('reqp') + ' ';
                    for (var j = 0; j < val.length; j++)
                        sections[10] += (j ? ', ' : '') + eq.prof[val.charAt(j)];
                    sections[10] += '</b><br>'; //((j==2 && val.length!=2)?'<br>&nbsp;' : '')+
                    break;
                case 'reqgold':
                    sections[10] += '<b class="att' + ((val > hero.gold) ? ' noreq' : '') + '">' + _t2('reqgold %val%', {
                        '%val%': val
                    }) + '</b><br>';
                    break; //'Wymagane złoto: '+val+
                case 'reqs':
                    sections[10] += '<b class="att' + ((val > hero.bstr) ? ' noreq' : '') + '">' + _t2('reqs %val%', {
                        '%val%': val
                    }) + '</b><br>';
                    break; //'Wymagana siła: '+val+
                case 'reqz':
                    sections[10] += '<b class="att' + ((val > hero.bagi) ? ' noreq' : '') + '">' + _t2('reqz %val%', {
                        '%val%': val
                    }) + '</b><br>';
                    break; //'Wymagana zręczność: '+val+
                case 'reqi':
                    sections[10] += '<b class="att' + ((val > hero.bint) ? ' noreq' : '') + '">' + _t2('reqi %val%', {
                        '%val%': val
                    }) + '</b><br>';
                    break; //'Wymagana intelekt: '+val+
                case 'pet':
                    //if (val.match(/elite/))sections[0] += '<i style="color:yellow">'+_t2('pet_elite', null, 'pet_tip')+'</i>'; //elita
                    //if (val.match(/heroic/))sections[0] += '<i style="color:#2090FE">'+_t2('pet_heroic', null, 'pet_tip')+'</i>';
                    //if (val.match(/legendary/))sections[0] += '<i style="color:#FA9A20;">'+_t2('pet_legendary', null, 'pet_tip')+'</i>';
                    var tmplist = val.split(',');
                    for (var j = 2; j < tmplist.length; j++) {
                        if (tmplist[j] == 'elite' || tmplist[j] == 'quest' || tmplist[j] == 'heroic' || tmplist[j] == 'legendary') continue;
                        var alist = tmplist[j].split('|');
                        if (alist.length) {
                            sections[2] = '<span style="color:lime">' + _t2('pet_tasks') + '<br />'; //Wykonuje polecenia:
                            for (var k = 0; k < alist.length; k++) {
                                sections[2] += '- ' + alist[k].replace(/#.*/, '') + '<br />';
                            }
                            sections[2] += '</span>';
                        }
                        break;
                    }
                    if (val.match(/quest/)) sections[2] += _t2('pet_logout_hide') + '<br />'; //'Chowaniec znika po wyjściu z gry
                    break;
                case 'outexchange': //'Możliwość wymiany stroju na nowy.
                case 'personal': //Przedmiot spersonalizowany
                        sections[8] += _t2(statName) + '<br>';
                        break;                
                case 'noauction':
                    var stop = false;
                    for (var k in st) {
                        if (st[k] == "permbound") stop = true;
                    }
                    if (stop) break;
                    sections[8] += _t2('noauction') + '<br>'; // 'Tego przedmiotu nie można wystawić na aukcję'
                    break;
                case 'book':
                case 'price':
                case 'resp':
                case 'key':
                case 'mkey':
                case 'rkey':
                case 'rlvl':
                case 'motel':
                case 'emo':
                case 'quest':
                case 'play':
                case 'szablon':
                case 'null':
                case "unique":
                case "heroic":
                case "legendary":
                case "upgraded":
                case "artefact":
                case "cursed":
                case "upg":
                case "upgby":
                case "binds":
                case "recipe":
                case 'progress':
                case "cansplit":
                case "nosplit":
                case "enhancement_upgrade_lvl":
                case "rarity":
                    break;
                default:
                    if (statName != '') sections[3] += _t('unknown_stat %val%', {
                        '%val%': statName
                    }) + '=' + val + '<br>';
                    break; //'Nieznany stat: '+statName+'<br>'
            }
        }
        var bindInfo = "";
        switch (boundState) {
            case 0:
                if (stat.binds) bindInfo += (item.cl == 22) ? _t2('binds1') : _t2('binds2'); //'Przeciągnij na postać, by aktywować<br>' : 'Wiąże po założeniu<br>'
                break;
            case 1:
                if (item.loc == "n") { //shop
                    bindInfo += _t('soulbound');
                } else {
                    bindInfo += (item.cl == 22) ? _t('soulbound1') : _t('soulbound2'); // 'Aktywny i związany z właścicielem<br>'
                };
                break;
            case 3:
                if (item.loc == "n") { //shop
                    bindInfo += _t('permbound');
                } else {
                    bindInfo += _t("permbound_item");
                };
                break;
        };
        bindInfo = bindInfo.replace(" z właścicielem", "").replace("na stałe po kupieniu", "po kupieniu");
        var close = false;
        if (bindInfo != "") {
            close = true;
            sections[10] = sections[10] + '<div class="tip-bound-and-price-wrapper"><div class="tip-bound-info">' + bindInfo + '</div>';
        };
        if (item.pr && (item.cl != 25 || item.loc == 'n' || item.loc == 't')) {
            close = true;
            if (bindInfo == "") sections[10] += '<div class="tip-bound-and-price-wrapper">';
            sections[10] += '<div class="tip-price">' + _t('item_value %val%', {
                '%val%': round(item.pr, 3)
            }) + "</div>";
        };
        if (close) html += "</div>";
    };
    this.itemHeader = function(item, stat) {
        var html = "";
        //kompatybliność z pewnym dodatkiem który tworzę
        var src = item.icon.indexOf("obrazki/itemy/") == -1 && item.icon.indexOf("http") == -1 ? CFG.ipath + item.icon : item.icon;
        html += '<div class="tip-icon-wrapper"><img src="'+src+'"></div>';
        html += '<div class="tip-name-and-type-wrapper">';
        html += '<div class="tip-name">' + htmlspecialchars(item.name) + (stat.enhancement_upgrade_lvl ? ` <span class="tip-enh">(+${stat.enhancement_upgrade_lvl})</span>` : ``) + '</div>';
        if (stat.rarity == "unique") {
            html += '<div class="tip-type t_uni">' + (stat.cursed ? _t('type_cursed') + " " : "") + _t('type_unique') + this.upgraded(stat) + "</div>";
        } else if (stat.rarity == "heroic") {
            html += '<div class="tip-type t_her">' + (stat.cursed ? _t('type_cursed') + " " : "") + _t('type_heroic') + this.upgraded(stat) + "</div>";
        } else if (stat.rarity == "legendary") {
            html += '<div class="tip-type t_leg">' + (stat.cursed ? _t('type_cursed') + " " : "") + _t('type_legendary') + this.upgraded(stat) + "</div>";
        } else if (stat.rarity == "artefact") {
            html += '<div class="tip-type artefact">' + (stat.cursed ? _t('type_cursed') + " " : "") + _t('type_artifact') + this.upgraded(stat) + "</div>";
        } else if (stat.rarity == "upgraded") {
            html += '<div class="tip-type t_upg">' + (stat.cursed ? _t('type_cursed') + " " : "") + _t('type_modified') + this.upgraded(stat) + "</div>";
        } else if (stat.upg) {
            html += '<div class="tip-type t_norm">' + this.upgraded(stat, true) + "</div>";
        } else {
            html = html.replace('"tip-name"', '"tip-name only"');
        };
        html += "</div>";
        return html;
    };
    this.upgraded = function(stat, normal) {
        if (!stat.upg) return "";
        var html = normal ? "" : ", ";
        html += _t('type_modification %val%', {
            "%val%": stat.upg
        });
        return html;
    };
    this.parseStat = function(stat) {
        var tmp = stat.split(";");
        var parsed = {};
        for (var i = 0; i < tmp.length; i++) {
            var split = tmp[i].split("=");
            parsed[split[0]] = isset(split[1]) ? split[1] : true;
        }
        return parsed;
    };
    this.initHtml = function() {
        var style = `
    		#tip.t_item #tip-o1{
    			display: none;
    		}
    		#tip.t_item #tip-o2{
    			display: none;
    		}
    		#tip.t_item {
    			font-size: 10px;
    			background: rgba(0,0,0,.8);
    			border: 3px double;
                border-color: gray !important;
    			max-width: 350px;
    			min-width: 200px;
    		}
    		#tip.t_item.t_uni {
    			background: rgba(27, 26, 6, .8) !important;
    			border: 3px double;
                border-color: #9a9a0e !important;
    		}
    		#tip.t_item.t_her {
    			background: rgba(5, 0, 23, 0.8) !important;
    			border: 3px double;
                border-color: #8181ff !important;
    		}
    		#tip.t_item.t_leg {
    			background: rgba(19, 12, 0, 0.8) !important;
    			border: 3px double;
                border-color: #9c6500 !important;
    		}
    		#tip.t_item.artefact {
    			background: rgba(21, 0, 0, .8) !important;
    			border: 3px double;
                border-color: #940000 !important;
    		}
    		#tip.t_item.t_upg {
    			background: rgba(22, 0, 25, .8) !important;
    			border: 3px double;
                border-color: purple !important;
    		}
    		.tip-icon-wrapper {
    			width: 32px;
    			height: 32px;
    			float: left;
    		}
    		.tip-name-and-type-wrapper {
    			float: left;
    			margin-top: 5px;
    			margin-left: 5px;
    		}
    		.tip-section {
    			max-width: 280px;
    		}
    		.tip-section-0 {
    			height: 35px;
    			border-bottom: 1px solid #444444;
    			margin-bottom: 5px;
    			padding-right: 5px;
    			max-width: none;
    			background: rgba(50, 50, 50, 0.8);
    		}
    		#tip.t_item.t_uni .tip-section-0 {
    			background: rgba(70, 62, 40, 0.8);
    		}
    		#tip.t_item.t_her .tip-section-0 {
    			background: rgba(40, 40, 70, 0.8);
    		}
    		#tip.t_item.t_leg .tip-section-0 {
    			background: rgba(70, 58, 40, 0.8);
    		}
    		#tip.t_item.artefact .tip-section-0 {
    			background: rgba(70, 40, 40, 0.8);
    		}
    		#tip.t_item.t_upg .tip-section-0 {
    			background: rgba(70, 40, 70, 0.8);
    		}
    		.tip-section-5 {
    			border-top: 1px solid #444444;
    			margin-top: 4px;
    		}
    		.tip-section-7 {
    			border-top: 1px solid #444444;
    			margin-top: 4px;
    		}
    		.tip-section-8 {
    			margin-top: 4px;
    		}
    		.tip-section-10 {
    			border-top: 1px solid #444444;
    			margin-top: 4px;
    			padding-top: 4px;
    			min-height: 10px;
    		}
    		.tip-name {
    			font-weight: bold;
    		}
    		.tip-name.only {
    			margin-top: 5px;
    		}
    		.tip-type {
    			font-weight: bold;
    		}
    		.tip-type.t_uni {
    			color: #ffff00;
    		}
    		.tip-type.t_her {
    			color: #00c2ff;
    		}
    		.tip-type.t_leg {
    			color: #ffa500;
    		}
    		.tip-type.artefact {
    			color: #ff3d00;
    		}
    		.tip-type.t_upg {
    			color: #f281ff;
    		}
    		.tip-type.t_norm { /* ulepszony zwykłak */
    			color: #ffffb7;
    		}
    		.tip-bound-and-price-wrapper {
    			height: 10px;
    		}
    		.tip-price {
    			position: absolute;
				bottom: 4px;
				right: 5px;
    		}
    		.tip-bound-info {
    			float: left;
            }
            .tip-enh-bonus-stat {
                color: #87f187;
            }
            .tip-enh-bonus-stat.not-selected {
                color: red;
            }
            .tip-enh {
                color: #87f187;
                font-weight: bold;
            }
    		#tip .legbon, #tip .idesc, #tip .looter {
    			text-align: center !important;
    		}

    		.tipInnerContainer { /* jak jakiś dodatek by zmienił to by brzydkie było */
				font-family: Verdana, Arial, sans-serif !important;
			}
    	`;
        var $style = document.createElement("style");
        $style.innerHTML = style;
        document.head.appendChild($style);
    };
    itemTip = function(item) {
        //żeby zachować kompatybilność z dodatkami co w jakiś sposób potrzebują danych z tipu czy coś
        var ret = _itemTip(item);
        if (!item.name) return ret;
        return self.generateTip(item);
    };
    newItem = function(items) {
        var ret = _newITem.apply(this, arguments);
        for (var id in items) {
            if (items[id].stat) {
                var stat = self.parseStat(items[id].stat);
                var item = document.getElementById("item" + id);
                if (item) {
                    if (stat.rarity == "unique") item.setAttribute("ctip", "t_item t_uni");
                    else if (stat.rarity == "heroic") item.setAttribute("ctip", "t_item t_her");
                    else if (stat.rarity == "legendary") item.setAttribute("ctip", "t_item t_leg");
                    else if (stat.rarity == "artefact") item.setAttribute("ctip", "t_item artefact");
                    else if (stat.rarity == "upgraded") item.setAttribute("ctip", "t_item t_upg");
                };
            }
        };
        return ret;
    };

    //naprawa SEQ
    if (typeof addslashes == "function") {
    	var _addslashes = addslashes;
    	addslashes = function(str) {
    		if (str.indexOf("tip-section-0") > -1) return str;
    		return _addslashes(str);
    	}
    };

    // szczerze to nie mam słów... Edytowanie tak o html tipa? Serio? ._.
    // Eh... Najlepiej po prostu nadpiszę tą funkcję
    g.tplsManager.changeAMountInTip = function (stat, $item, newVal) {
        if (isNaN(newVal) && stat.amount) {
            // fix your garbage
            const match = stat.amount.match(/\(([0-9]+):([0-9]+)\)/);
            if (match) {
                const min = match[1];
                const max = match[2];
                newVal = `od ${min} do ${max}`;
            }
        }

        var tip = $item.attr('tip');
        var $tip = $(`<div>${tip}</div>`);
    
        var cursedFlag = isset(stat['cursed']);
        let split = "";
        if (stat.cansplit) {
            split = `(${(parseInt(stat.cansplit) ? _t('split_possible') : _t('split_impossible'))})`;
        }
        if (stat.nosplit) {
            split = `(${_t('split_impossible')})`;
        }
        var strTab = [_t2('cursed_amount %val%', {
          '%val%': newVal
        }), _t2('amount %val% %split%', {
          '%val%': newVal,
          '%split%': split
        })];

        var amountStr = strTab[cursedFlag ? 0 : 1];

        const $amt = $tip[0].querySelector(".amount-text");
        if (!$amt) {
            // Taki failsafe, wolę żeby nie zmieniło wartości niż żeby wywaliło grę
            return;
        }
        $amt.innerHTML = amountStr;
    
        $item.tip($tip.html());
      };
})(itemTip, newItem).initHtml();