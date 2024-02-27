import { SkillEnum, type Skill } from "@/types/enemy"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useCombatStore } from "./combatStore";
import Decimal from "break_infinity.js";

export const useSkills = defineStore('skillsStore', () => {

    const combatStore = useCombatStore();

	// --- State ---
    const skillList = ref<Map<SkillEnum, Skill>>(new Map<SkillEnum, Skill>([
        [SkillEnum.MEDITATION, {
            cost: 2,
            obtained: false,
            displayName: "Deep Medititation",
            effect: function () {
                console.log('test!')
            }
        }],
        [SkillEnum.DEBUG_METEOR, {
            cost: 1,
            obtained: true,
            displayName: "Meteo",
            effect: function () {
                combatStore.pushToCombatLog("A large meteor impacts the earth!")
                combatStore.dealDamage(new Decimal(100000))
            }
        }]
    ]))

    //Computeds
    const getAvailableSkills = computed(() => Array.from(skillList.value.entries()).filter( skill => skill[1].obtained === true))

	//Actions
    function unlockSkill(x: SkillEnum): void { 
        const skill = skillList.value.get(x)
        if(skill) {
            skill.obtained = true;
            skillList.value.set(x, skill)
        }  
    }

	return {
		skillList, getAvailableSkills, unlockSkill,  
	}
})