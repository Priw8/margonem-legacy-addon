// rawBattleLog - wyłącza parsowanie logu walki i pokazuje surowe nazwy statów

!function() {
    const _battleMsg = window.battleMsg;
    window.battleMsg = function(msg) {
        _battleMsg.apply(this, arguments);

        const spl = msg.split(";");
        const caster = g.battle.f[spl[0].split("=")[0]], target = g.battle.f[spl[1].split("=")[0]];
        const msgs = spl.slice(2);

        const casterName = caster?.name ?? "-";
        const targetName = target?.name ?? "-";

        const cl = (!caster && !target) ? "txt" : (caster.team == 1 ? "attack" : "attack2"); 

        return `<div class="${cl}"><b>caster</b>: ${casterName}<br><b>target</b>: ${targetName}<br><b>----stats----</b><br>${msgs.join("<br>")}</div>`;
    }
}();
