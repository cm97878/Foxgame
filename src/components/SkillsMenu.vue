<template>
    <div v-if="props.open" class="skill-menu">
        <div v-for="(skill) in skills.getAvailableSkills" class="skill">
            <span>{{ skill[1].displayName }}</span><span>{{ "SP" + skill[1].cost }}</span>
        </div>
        
    </div>
</template>
<script setup lang="ts">
    import { useSkills } from '@/stores/skillsStore';
    let props = defineProps<{
        open: boolean
    }>()

    const skills = useSkills();
</script>
<style>
.skill-menu {
    position:absolute;
    width: 100%;
    min-height: 94px;
    background-image: linear-gradient(rgb(173, 173, 173), rgb(85, 85, 133));
    border: 3px white outset;
    z-index: 3;
    display:flex;
    font-size:26px;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    border-radius: 8px;
    padding: 2px 0;
}
.skill {
    display:flex;
    justify-content: space-between;
    flex-basis:47%;
    color: white;
    margin:0 4px;
    padding: 0 4px;
    border-radius: 4px;
    cursor: pointer;
}

.skill:hover {
    animation: hoverSelect 1s linear infinite;
}

@keyframes hoverSelect {
    0%, 100% {
        background-color: rgba(255, 255, 255, 0.2)
    }

    50% {
        background-color: rgba(255, 255, 255, 0.6)
    }
}
</style>