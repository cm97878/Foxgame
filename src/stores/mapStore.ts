import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Enemy } from '@/types/enemy'
import { useVueFlow, type GraphNode } from '@vue-flow/core'
import type { AreaData } from '@/types/areaData'
import { SpecialAreaId, Zone } from '@/enums/areaEnums'
import { useCombatStore } from '@/stores/combatStore';
import { computed, ref, toRaw } from 'vue'
import { useGameFlags } from './gameFlags'
import { useEventStore } from './eventStore'
import { FlagEnum } from '@/enums/flagEnum'
import { useUpgradeStore } from './upgradeStore'


/* LEAVE THIS HERE >:(
name: "",
attack: new Decimal(""),
defense: new Decimal(""),
maxHP: new Decimal(""),
spd: ,
soulAbsorb: new Decimal(""),
soulKill: new Decimal(""),
*/


export const useMapStore = defineStore('mapStuff', () => {

    const gameFlags = useGameFlags();
    const eventStore = useEventStore();
    const upgradeStore = useUpgradeStore();
    const { getConnectedEdges, fitView, findNode, setNodes, setEdges, nodes, addNodes, updateNodeData } = useVueFlow({ id:"map"});

    // -- State --

    //TODO: Properly balance new zone enemies.
    const enemyList = new Map<Zone, Enemy[]>([
        [Zone.FOREST, [{
            name: "Rat",
            attack: new Decimal("2"),
            defense: new Decimal("0"),
            maxHP: new Decimal("7"),
            spd: 300,
            soulAbsorb: new Decimal("1"),
            soulKill: new Decimal("1"),
        },
        {
            name: "Chipmunk",
            attack: new Decimal("3"),
            defense: new Decimal("1"),
            maxHP: new Decimal("10"),
            spd: 300,
            soulAbsorb: new Decimal("1"),
            soulKill: new Decimal("1"),
        },
        {
            name: "Mouse",
            attack: new Decimal("1"),
            defense: new Decimal("0"),
            maxHP: new Decimal("5"),
            spd: 100,
            soulAbsorb: new Decimal("1"),
            soulKill: new Decimal("1"),
        }]],
        [Zone.DEEP_FOREST, [{
            name: "Creeper Vines",
            attack: new Decimal("35"),
            defense: new Decimal("45"),
            maxHP: new Decimal("120"),
            spd: 300,
            soulAbsorb: new Decimal("15"),
            soulKill: new Decimal("15"),
        },
        {
            name: "Stag",
            attack: new Decimal("50"),
            defense: new Decimal("35"),
            maxHP: new Decimal("100"),
            spd: 300,
            soulAbsorb: new Decimal("15"),
            soulKill: new Decimal("15"),
        }]],
        [Zone.RIVERBANK, [{
            name: "Hawk",
            attack: new Decimal("10"),
            defense: new Decimal("4"),
            maxHP: new Decimal("25"),
            spd: 200,
            soulAbsorb: new Decimal("5"),
            soulKill: new Decimal("5"),
        },
        {
            name: "Otter",
            attack: new Decimal("7"),
            defense: new Decimal("5"),
            maxHP: new Decimal("40"),
            spd: 300,
            soulAbsorb: new Decimal("5"),
            soulKill: new Decimal("5"),
        }]]
    ])

    const nodeFunctions = new Map<string, Function>([
        ["home", function() {
            if(!gameFlags.flagList.get(FlagEnum.SHRINE_UNLOCKED) && 
            gameFlags.flagList.get(FlagEnum.STATUE_OBTAINED)){
                eventStore.callCutscene(eventStore.cutscenes.get("idolReturned"))
                gameFlags.setFlag(FlagEnum.SHRINE_UNLOCKED, true)
            } 
        }],
        ["clearing", function() {
            if(!gameFlags.flagList.get(FlagEnum.EXPLORE_UNLOCKED)){
                eventStore.callCutscene(eventStore.cutscenes.get("idolFind"))
                gameFlags.setFlag(FlagEnum.EXPLORE_UNLOCKED, true)
                //TODO: Could probably make helper functions in upgradeStore for this.
                const ropeUpgrade = upgradeStore.home.get(4)
                if (!!ropeUpgrade) {
                    ropeUpgrade.show = true
                    upgradeStore.home.set(4, ropeUpgrade)
                }
            } else if (!gameFlags.flagList.get(FlagEnum.STATUE_OBTAINED) && upgradeStore.home.get(4)?.bought) {
                eventStore.callCutscene(eventStore.cutscenes.get("idolGet"))
                gameFlags.setFlag(FlagEnum.STATUE_OBTAINED, true)
                //TODO: Could probably make helper functions in upgradeStore for this.
                const ropeUpgrade = upgradeStore.home.get(4)
                if (!!ropeUpgrade) {
                    ropeUpgrade.show = false
                    upgradeStore.home.set(4, ropeUpgrade)
                }
            }
        }]
    ])

    const callNodeFunc = function(id: string) {
        nodeFunctions.get(id)?.call({});
    }


    const areaData = {
        //holds the thing to display and the list of things that can be displayed
        random: {
            descAppend: "",
            forest: [
                " Test addon 1",
                " test addon 2",
                " test addon 3"
            ]
        },
        //special doesnt do anything yet
        special: {
            Home: {

            }
        }
    };
    const selectedNode =  ref({data: {}} as GraphNode);
    let scouted$ = ref("");

    // --- Getters/Computeds ---
    const isSpecial = computed(() => selectedNode.value.data.areaSpecialID);
    const getAreaName = computed(() => hasData ? selectedNode.value.data.areaName : "");
    const getDescription = computed(() => hasData ? selectedNode.value.data.description : "");
    const getDescAppend = computed(() => hasData ? areaData.random.descAppend  : "");
    const getKillCount = computed(() => hasData ? selectedNode.value.data.killCount  : "");

    //TODO: actual scouted prop now so we can just check that instead
    const isScouted = computed(() => {
        const x = !!selectedNode.value.data ? selectedNode.value.data.killCount : "";
        return x.gte(selectedNode.value.data.scoutThreshold);
    });
    const hasData = computed(() => !!selectedNode.value.data);

    const totalKills = ref(0);
    
    //TODO: actual scouted prop now so we can just count that instead
    const totalScouted = computed(() => {
        let val = 0;
        nodes.value.forEach(element => {
            if(!element.data.areaSpecialID && element.data.killCount >= element.data.scoutThreshold) {
                val++;
            }
        })
        return val;
    })


    // --- Actions ---
    function setTextAppend(): void {
        if(hasData && (Math.floor(Math.random() * 100) <= 20)) {
            switch(selectedNode.value.data.zone) {
                case "forest": {
                    areaData.random.descAppend = areaData.random.forest[Math.floor(Math.random() * 3)]
                    break;
                }
                default: {
                    console.log("somethin fucky with random text switch case")
                }
            }
        }
        else {
            areaData.random.descAppend = "";
        }
    }

    function callRandomEncounter(zone: Zone): void {
        let list = [] as Array<Enemy>;
        switch(zone) {
            //TODO: Add Deep Forest Zone and spawn list!
            case Zone.FOREST: { 
                list = enemyList.get(Zone.FOREST) || []
                break;
            }
            case Zone.DEEP_FOREST: { 
                list = enemyList.get(Zone.DEEP_FOREST) || [] 
                break;
            }
            case Zone.RIVERBANK: { 
                list = enemyList.get(Zone.RIVERBANK) || [] 
                break;
            }
        }
        if(!!list && list.length > 1) {
            const encounterIdx = Math.floor(Math.random() * list.length );
            const combatStore = useCombatStore();
            combatStore.startCombat(list[encounterIdx]);
        }
    }


    //
    function addKills(amnt:number) {
        if(hasData) {
            console.log("addkills");
            let nodeAdd = findNode(selectedNode.value.id);

            if(nodeAdd) {
                totalKills.value += amnt;
                updateNodeData(nodeAdd.id, {killCount: nodeAdd.data.killCount+1})
                if(nodeAdd.data.killCount >= nodeAdd.data.scoutThreshold) {
                    scouted$.value = nodeAdd.id; //TODO: Bit beyond the scope of what I wanted to do with this but we should definitely just change this to update a scouted flag once and then not do it again. Would require a decent bit of refactoring w/ the map refresh and such, though
                }
            }
            else {console.log("Couldn't update killcount. addKills()")}
        }
    }
    function returnHome(): void {
        const startingNode = findNode("Home")!;
        selectedNode.value = startingNode;
        centerMap(startingNode);
        callNodeFunc(startingNode.id);
    }

    function centerMap(node:GraphNode) {
        const nodesToShow = getConnectedNodes(node.id);
        nodesToShow.push(node.id)
        fitView({
            nodes: nodesToShow,
            duration: 600,
        })
    }
    function getConnectedNodes(id: string): string[] {
        return getConnectedEdges(id).map( 
            edge => edge.target === id ? edge.source : edge.target
        )
    }

    const mouseoverNode = ref<GraphNode | undefined>({data: {}} as GraphNode);
    mouseoverNode.value = undefined;
    const mouseoverDelayCheck = "";
    

    return {
        //State
        enemyList, areaData, selectedNode, scouted$, mouseoverNode, mouseoverDelayCheck,
        //Computed
        isSpecial, getAreaName, getDescription, getDescAppend, getKillCount, isScouted, hasData, totalKills, totalScouted,
        //Actions
        setTextAppend, callRandomEncounter, addKills, centerMap, returnHome, callNodeFunc, getConnectedNodes,
    }
})