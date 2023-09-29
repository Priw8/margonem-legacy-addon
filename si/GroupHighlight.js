// groupHighlight: podświetlanie grupy

!function(_newNpc) {
    window.newNpc = function(npcs) {
        const ret = _newNpc.apply(this, arguments);
        onNPC(npcs);
        return ret;
    }

    // At first I wanted to generate the color based on the group ID... But I couldn't get it to work well enough.
    // The color list below comes from https://stackoverflow.com/questions/1168260/algorithm-for-generating-unique-colors
    const colors =
        ["#000000", "#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66",
         "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00",
         "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900",
         "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B",
         "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F",
         "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB",
         "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502",
         "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41",
         "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF"];
    function getBorderColorForGroup(grp) {
        // const n = Math.floor((grp * 45) / 360);
        // return `hsl(${(grp * 45) % 360}, 100%, ${40 + n * 20}%)`;
        return colors[grp % colors.length];
    }

    function makeNPCborder($npc, grp) {
        const color = getBorderColorForGroup(grp);
        $npc.style["filter"] = `drop-shadow(0 0 5px ${color})`;
        //$npc.style["box-shadow"] = `inset 0 0 10px ${color}, 0 0 3px ${color}`;
    }

    function onNPC(npcs) {
        for (const id in npcs) {
            const npc = npcs[id];
            if (npc.grp) {
                const $npc = document.querySelector(`#npc${id}`);
                if ($npc) {
                    makeNPCborder($npc, npc.grp);
                }
            }
        }
    }

    function colorTest() {
        let html = "";
        for (let i=0; i<60; ++i) {
            html += `<div style="width: 64px; height: 8px; background: ${getBorderColorForGroup(i)};"></div>`;
        }
        const $div = document.createElement("div");
        $div.innerHTML = html;
        document.body.appendChild($div);
    }

    //colorTest();
}(window.newNpc)