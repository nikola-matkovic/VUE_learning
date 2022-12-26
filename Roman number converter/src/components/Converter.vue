<script setup>
import { ref, computed } from "vue";

const text = ref("test");

function convert(numberToCovnert) {
    let convertedNumber = 0;
    let romanNumbers = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    };
    const current = (i) => romanNumbers[numberToCovnert[i]];
    const next = (i) => romanNumbers[numberToCovnert[i + 1]];
    for (let i = 0; i < numberToCovnert.length; i++) {
        current(i) < next(i)
            ? (convertedNumber += next(i) - current(i++))
            : (convertedNumber += current(i));
    }
    return convertedNumber;
}

const arabic = computed(() => {
    let capital = text.value.match(/[A-Z]+/g);
    let returnString = text.value;
    capital?.forEach((capitalGroup) => {
        if (
            capitalGroup.match(
                /[^IVXLCDM]{2,}|[IVXLCDM][^IVXLCDM]|[^IVXLCDM][IVXLCDM]/g
            )
        ) {
            returnString = "Invalid input";
            return;
        }
        if (capitalGroup.match(/[IVXLCDM]+/g)) {
            let convertedNumber = convert(capitalGroup);
            returnString = returnString.replace(capitalGroup, convertedNumber);
        }
    });
    return returnString;
});
</script>

<template>
    <textarea autofocus v-model="text"></textarea>
    <div class="arabic">{{ arabic }}</div>
</template>

<style>
textarea,
.arabic {
    width: 300px;
    height: 200px;
    border: 3px solid rgb(76, 76, 76);
    outline: none;
    resize: none;
    background: #fafafa;
    padding: 1rem;
    font-size: 1.2rem;
    border-radius: 10px;
}
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
</style>
