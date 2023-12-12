<template>
    <button class="tooltip-button">
        {{ upgradeName }}
        <div class="tooltiptext">
            {{ tooltipText }}
            <div class="divider"></div>
            {{ effect }}
            <div class="divider"></div>
            {{ upgradeCost }}
        </div>
    </button>
</template>
<script setup lang="ts">
    let props = defineProps({
        upgradeName: String,
        tooltipText: String,
        effect: String,
        upgradeCost: String
    })
</script>
<style>
    .tooltip-button {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
    }

    .tooltip-button .tooltiptext {
        visibility: hidden;
        width: 200px;
        background-color: grey;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        border: 1px solid;
        padding: 8px;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        top: -5px;
        left: 105%;
    }

    .tooltip-button:hover .tooltiptext {
        visibility: visible;
    }
    .divider {
        border-bottom: 1px solid;
    }
</style>