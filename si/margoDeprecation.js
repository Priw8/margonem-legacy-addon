// ==UserScript==
// @name         Margonem łatka API dla dodatków
// @namespace    margonem-deprecation
// @version      1.0
// @description  Przywraca popularne elementy API w celu poprawieniu działania dododatków.
// @author       Priw8#9873
// @match        https://*.margonem.pl/
// @exclude      https://www.margonem.pl/
// @exclude      https://forum.margonem.pl/
// @exclude      https://addons2.margonem.pl/
// @match        https://*.margonem.com/
// @exclude      https://www.margonem.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=margonem.pl
// @grant        none
// ==/UserScript==

!function() {
    const SI = typeof window.g != "undefined" && typeof window.Engine == "undefined";
    const NI = !SI;

    function detourBefore(obj, key, clb, exArgs=[]) {
        const _prev = obj[key];
        obj[key] = function() {
            const fullArgs = [];
            for (let i=0; i<arguments.length; ++i) {
                fullArgs.push(arguments[i]);
            }
            for (let i=0; i<exArgs.length; ++i) {
                fullArgs.push(exArgs[i]);
            }
            clb.apply(this, fullArgs);
            return _prev.apply(this, arguments);
        }
    }

    function detourAfter(obj, key, clb, exArgs=[]) {
        const _prev = obj[key];
        obj[key] = function() {
            const fullArgs = [];
            for (let i=0; i<arguments.length; ++i) {
                fullArgs.push(arguments[i]);
            }
            for (let i=0; i<exArgs.length; ++i) {
                fullArgs.push(exArgs[i]);
            }
            const ret = _prev.apply(this, arguments);
            clb.apply(this, fullArgs);
            return ret;
        }
    }

    function deprecateProperty(obj, key, textInfo, getter, setter) {
        let wasDeprecationInfoShown = false;
        let wasDeprecationWriteErrorShown = false;
        let val = undefined;

        function showDeprecationInfoIfNeeded() {
            if (!wasDeprecationInfoShown) {
                wasDeprecationInfoShown = true;
                console.warn("[MargoDeprecationWarning] " + (textInfo ? textInfo : `property ${key} is deprecated`));
            }
        }

        function showDeprecationErrorIfNeeded() {
            if (!wasDeprecationWriteErrorShown) {
                wasDeprecationWriteErrorShown = true;
                console.error("[MargoDeprecationError] property is not writable; " + (textInfo ? textInfo : `property ${key} is deprecated`));
            }
        }

        Object.defineProperties(obj, {
            [key]: {
                get: () => {
                    showDeprecationInfoIfNeeded();
                    return getter ? getter() : val;
                },
                set: (newVal) => {
                    showDeprecationInfoIfNeeded();
                    if (setter) {
                        setter(newVal);
                    } else if (!getter) {
                        val = newVal;
                    } else {
                        showDeprecationErrorIfNeeded();
                    }
                }
            }
        })
    }

    if (SI) {
        deprecateProperty(window.g, "worldname",
            "g.worldname is deprecated; use g.worldConfig.getWorldName() instead.",
            () => g.worldConfig.getWorldName()
        )
        deprecateProperty(window.g, "apiDomain",
            "g.apiDomain is deprecated; use g.worldConfig.getApiDomain() instead.",
            () => g.worldConfig.getApiDomain()
        )
        deprecateProperty(window.g, "npcresp",
            "g.npcresp is deprecated; use g.worldConfig.getNpcResp() instead.",
            () => g.worldConfig.getNpcResp()
        )
    } else if (NI) {
        deprecateProperty(window.Engine, "worldName",
            "Engine.worldName is deprecated; use Engine.worldConfig.getWorldName() instead.",
            () => Engine.worldConfig.getWorldName()
        )
        deprecateProperty(window.Engine, "apiDomain",
            "Engine.apiDomain is deprecated; use Engine.worldConfig.getApiDomain() instead.",
            () => Engine.worldConfig.getApiDomain()
        )
        deprecateProperty(window.Engine, "npcresp",
            "Engine.npcresp is deprecated; use Engine.worldConfig.getNpcResp() instead.",
            () => Engine.worldConfig.getNpcResp()
        )
    }

    detourBefore(SI ? window : Engine.communication, SI ? "parseInput" : "parseJSON", function(data) {
        if (data.worldConfig) {
            deprecateProperty(data, "worldname",
                "ServerResponse.worldname is deprecated; use ServerResponse.worldConfig.worldname instead.",
                () => data.worldConfig.worldname,
                (val) => {data.worldConfig.worldname = val}
            )
            deprecateProperty(data, "api_domain",
                "ServerResponse.api_domain is deprecated; use ServerResponse.worldConfig.api_domain instead.",
                () => data.worldConfig.api_domain,
                (val) => {data.worldConfig.api_domain = val}
            )
        }
    });
}();
