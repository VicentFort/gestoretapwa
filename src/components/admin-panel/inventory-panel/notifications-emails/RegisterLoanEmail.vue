<template>

    <Html lang="es">
        <Text>
            {{ title }}
        </Text>
        <Hr/>
    </Html>

</template>

<script setup>
import { Hr, Html } from '@vue-email/components';


const props = defineProps({
    title:String
})

</script>