const {clipboard} = require('electron');

let permCrosshair = true;
let noLoadingTimes = true;
let customCss = false;
let hpNumber = true;
let hideWeaponsAds = true;
let hideArms = false;
let playerHighLight = true;
let fullBlack = false;
let wireframe = false;
let rainbow = false;

let inspecting = false;

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
                if (el.classList?.contains("loading-scene") && noLoadingTimes) el.parentNode.removeChild(el);
                if (el.id === "cmpPersistentLink") el.parentNode.removeChild(el);
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
    if (typeof arguments[0] == "string" && arguments[0].includes("refresh") && arguments[0].includes("ad") && !arguments[0].includes("added")) {
        throw "ad's blocked by overengineered ad block " + Math.random().toString().split(".")[1];
    }
    oldLog(...arguments);
};


document.addEventListener("DOMContentLoaded", () => {

    if (customCss) {
        let cssLinkElem = document.createElement("link");
        cssLinkElem.href = "https://cdn.discordapp.com/attachments/738010330780926004/955078958918033438/Titans.css";
        cssLinkElem.rel = "stylesheet";
        document.head.append(cssLinkElem);
    }

    let btn = document.createElement("button");
    btn.classList.add("animation");


    btn.style = "background-color: var(--primary-1);\n" +
        "    --hover-color: var(--primary-2);\n" +
        "    --top: var(--primary-2);\n" +
        "    --bottom: var(--primary-3);" +
        "    display: flex;\n" +
        "    justify-content: center;\n" +
        "    align-items: center;\n" +
        "    border: none;\n" +
        "    position: absolute;\n" +
        "    color: var(--white);\n" +
        "    font-size: 1rem;\n" +
        "    transition: all .3s ease;\n" +
        "    font-family: Rowdies;\n" +
        "    padding: .9em 1.4em;\n" +
        "    transform: skew(-10deg);\n" +
        "    font-weight: 900;\n" +
        "    overflow: hidden;\n" +
        "    text-transform: uppercase;\n" +
        "    border-radius: .2em;\n" +
        "    outline: none;\n" +
        "    text-shadow: 0 0.1em 0 #000;\n" +
        "    -webkit-text-stroke: 1px var(--black);\n" +
        "    box-shadow: 0 0.15rem 0 rgba(0,0,0,.315);\n" +
        "    cursor: pointer;" +
        "    box-shadow: 0 5.47651px 0 rgba(0,0,0,.5)!important;\n" +
        "    text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 3px 1px rgba(0,0,0,.486)!important;" +
        "    width: 150px;" +
        "    height: 50px;" +
        "    bottom: 0px;" +
        "    right: 100%;" +
        "    margin-right: 10px;" +
        "    font-size: 20px;"


    btn.innerText = "Join Link"

    btn.onclick = () => {
        window.open(clipboard.readText());
    }

    document.getElementsByClassName('play-content')[0].append(btn)


});


window.addEventListener("mouseup", (e) => {
    if (e.button === 3 || e.button === 4)
        e.preventDefault();
});


const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        document.getElementsByClassName('hp-title')[0].innerText = hpNumber ? mutation.target.style.width.slice(0, -1) : "HP";
    });
});

let scoped = false;

document.addEventListener('mousedown', (e) => {
    if (e.button === 2) scoped = true
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 2) scoped = false
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'j') {
        inspecting = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'j') {
        inspecting = false;
    }
});

let r = 255;
let g = 0;
let b = 0;

function animate() {
    window.requestAnimationFrame(animate);
    console.log(inspecting)
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
        let color = hexToRgb("#ff0000");
        r = color.r;
        g = color.g;
        b = color.b;
    }

    if (crosshair && permCrosshair) {
        crosshair.style.setProperty('visibility', 'visible', 'important');
        crosshair.style.setProperty('opacity', '1', 'important');
        crosshair.style.setProperty('display', 'block', 'important');
    }

    try {

        let weap = document.getElementsByClassName('list-weapons')[0].children[0].children[0].innerText;
        let num = 4;

        if (weap === "Weatie" || weap === "MAC-10") num = 5;

        if (weap === "AR-9") num = 5;


        let arms = true;
        if ((scoped && hideWeaponsAds) || hideArms) {
            arms = false;
        }

        scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"]["visible"] = arms;

        if (hideWeaponsAds) scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"]["visible"] = !scoped;

        //console.log(scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num].rotation.x, scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num].rotation.y, scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num].rotation.z)
        // scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num].rotation.x = 10
        // console.log(scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.x, scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.y, scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.z)

        if (inspecting) {
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.x = 0
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.y = -0.3
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.z = -0.4

            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].position.y = 0.05;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].position.z = -0.08;
        }else{
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.x = -0.116
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.y = -1.3688
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].rotation.z = 0.0267

            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].position.y = 0.0673;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"].position.z = 0.0733;
        }

        if (wireframe) {
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].wireframe = true;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].color.r = r / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].color.g = g / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].color.b = b / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].emissive.r = r / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].emissive.g = g / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].emissive.b = b / 255;

            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].wireframe = true;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].color.r = r / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].color.g = g / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].color.b = b / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].emissive.r = r / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].emissive.g = g / 255;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].emissive.b = b / 255;
        } else {
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].wireframe = false;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].color.r = 1;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].color.g = 1;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].color.b = 1;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["parent"]["children"]["0"]["material"].emissive = null;


            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].wireframe = false;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].color.r = 1;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].color.g = 1;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].color.b = 1;
            scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"]["children"][num]["material"].emissive = null;
        }

    } catch {
    }
    try {
        for (let i = 0; i < scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"].length; i++) {

            let localPlayerClass = scene["children"]["0"]["parent"]["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["38"].wnWmN;
            let player = scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]["_components"];
            let mat = scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]._components[0].value.children[0].children[0].children[1].material;

            if ((mat.color.r === 1 && mat.color.g < 1 && mat.color.b < 1) || !playerHighLight) continue;

            let color = hexToRgb("#0000ff");
            if (!localPlayerClass.team || localPlayerClass.team !== player["50"].team) {
                color = hexToRgb("#ff0000");
            }
            if (fullBlack) color = hexToRgb('#000000')

            let r = color.r * Number.MAX_SAFE_INTEGER;
            let g = color.g * Number.MAX_SAFE_INTEGER;
            let b = color.b * Number.MAX_SAFE_INTEGER;

            mat.map = null;
            mat.color.r = r;
            mat.color.g = g;
            mat.color.b = b;

            mat.needsUpdate = true;

        }
    } catch {
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

