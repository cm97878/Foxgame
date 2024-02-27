import { SkillEnum, type Skill } from "@/types/enemy"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useSkills = defineStore('skillsStore', () => {

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
            cost: 5,
            obtained: true,
            displayName: "Meteo",
            effect: function () {
                console.log('test!')
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