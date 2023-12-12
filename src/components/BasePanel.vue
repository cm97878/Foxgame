<template>
    <div v-show="active === Tab.HOME">
        <div v-if="!(mapStore.isSpecial === SpecialAreaId.HOME)" >
            Not available while exploring.
        </div>
        <div v-else class="home-box">
            <div class="base-pic"></div>
            This is where you do base stuff!
        </div>
    </div>
</template>


<script setup lang="ts">
import { SpecialAreaId } from '@/enums/areaEnums';
import { useMapStore } from '@/stores/mapStore';
import { Tab } from '@/enums/panels';

const name = "basePanel";

const mapStore = useMapStore();

let props = defineProps({
    active: String
})

</script>
<style>
    .home-box {
        display: flex;
        flex-direction: column;
        margin: 10px;
        align-items: center;
        .base-pic {
            width: 80%;
            height: 200px;
            background-color: grey;
        }
    }
</style>