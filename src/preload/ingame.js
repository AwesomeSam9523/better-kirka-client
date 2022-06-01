let permCrosshair = true;
let noLoadingTimes = true;
let customCss = true;
let hpNumber = true;
let hideWeaponsAds = true;
let hideArms = false;
let rainbow = true;

let scene;

WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
    apply(target, thisArg, argArray) {

        if (argArray[0] && argArray[0].type === 'Scene' && argArray[0].children[0].type === 'AmbientLight') {
            console.log(...arguments);
            scene = argArray[0];
        }

        return Reflect.apply(...arguments);
    }
});

let crosshair;

new MutationObserver(mutationRecords => {
    try {
        mutationRecords.forEach(record => {
            record.addedNodes.forEach(el => {
                if (el.classList?.contains("loading-scene")) el.parentNode.removeChild(el);
                if (el.classList?.contains("game-interface")) {
                    crosshair = document.getElementById("crosshair-static");
                    let hpElem = document.getElementsByClassName("hp-progress")[0];
                    document.getElementsByClassName('hp-title')[0].innerText = hpElem.style.width.slice(0, -1);
                    observer.observe(hpElem, {
                        attributeFilter: ["style"],
                    });
                }
            });
        });
    } catch {
    }
}).observe(document, {childList: true, subtree: true});


let oldLog = console.log;

console.log = (...arguments) => {
    if (typeof arguments[0] == "string" && arguments[0].includes("ad")) {
        throw "ad's blocked by overengineered ad block " + Math.random().toString().split(".")[1];
    }
    oldLog(...arguments);
};


document.addEventListener("DOMContentLoaded", () => {

    let cssLinkElem = document.createElement("link");
    cssLinkElem.href = "https://cdn.discordapp.com/attachments/738010330780926004/955078958918033438/Titans.css";
    cssLinkElem.rel = "stylesheet";

    document.head.append(cssLinkElem);

});


window.addEventListener("mouseup", (e) => {
    if (e.button === 3 || e.button === 4)
        e.preventDefault();
});


const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        document.getElementsByClassName('hp-title')[0].innerText = mutation.target.style.width.slice(0, -1);
    });
});

let scoped = false;

document.addEventListener('mousedown', (e) => {
    if (e.button === 2) scoped = true
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 2) scoped = false
});

let r = 255;
let g = 0;
let b = 0;

function animate() {
    window.requestAnimationFrame(animate);

    if (crosshair) {
        crosshair.style.setProperty('visibility', 'visible', 'important');
        crosshair.style.setProperty('opacity', '1', 'important');
        crosshair.style.setProperty('display', 'block', 'important');
    }

    let weap = document.getElementsByClassName('list-weapons')[0].children[0].children[0].innerText;
    let num = 4;

    if (weap === "Weatie" || weap === "MAC-10") num = 5;

    if (weap === "AR-90") num = 5;

    try {
        let arms = true;
        if ((scoped && hideWeaponsAds) || hideArms) {
            arms = false;
        }

        scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"]["visible"] = arms;

        if (hideWeaponsAds) scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"]["visible"] = !scoped;


    } catch {
    }

    if (rainbow) {
        if (r > 0 && b === 0) {
            r--;
            g++;
        }
        if (g > 0 && r === 0) {
            g--;
            b++;
        }
        if (b > 0 && g === 0) {
            r++;
            b--;
        }
    } else {
        let color = hexToRgb("#ff9900");
        r = color.r;
        g = color.g;
        b = color.b;
    }

    let entListSize = scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"].length;
    for (let i = 0; i < entListSize; i++) {
        try {
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]._components[0].value.children[0].children[0].children[1].material.map = null;

            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]._components[0].value.children[0].children[0].children[1].material.color.r = 0.1 + r / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]._components[0].value.children[0].children[0].children[1].material.color.g = 0.1 + g / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]._components[0].value.children[0].children[0].children[1].material.color.b = 0.1 + b / 255;

        }catch(e){
            console.log(e)
        }
    }
}

animate();


function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
