<template>
    <v-container>
        <v-card class="bg-primary">
            <v-data-table-virtual
            hide-default-footer
            :items="displayNotifications"
            :headers="headers"
            hide-details
            hide-no-data
            single-line
            >
                <template #item.date="{item}">
                    {{ formattedDateTime(item.date) }}
                </template>
                <template #item.actions="{item}">
                    <v-btn icon="mdi-check" color="transaction" v-if="item.read==false" @click="readNotification(item)"/>
                </template>
            </v-data-table-virtual>
            <v-card-actions class="justify-left">
                <v-btn 
                v-if="notifications.filter(n => n.read==true).length > 0" 
                variant="text" 
                :icon="showAll ? 'mdi-filter': 'mdi-clock-outline'"
                color="secondary" 
                @click="showAll = !showAll"
                />
                <v-btn
                @click="emits('closed')"
                icon="mdi-cancel"
                color="ternary"
                />
            </v-card-actions>
        </v-card>
    </v-container>
    <ErrorDialog @closed="showErrorDiag=false" :message="error" v-model="showErrorDiag"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { formattedDateTime } from '@/stores/util';
import { computed, ref } from 'vue';
import ErrorDialog from '@/components/ErrorDialog.vue';


const auth = useAuthStore()
const emits = defineEmits(['closed'])
const error = ref('')
const showErrorDiag = ref(false)
const showAll = ref(false)
const notifications = computed(() => auth.userInfo.notifications || [])
const displayNotifications = computed(() => {
    const sorted = [...notifications.value].sort((a,b) => {return new Date(b.date) - Date(a.date)})
    if(showAll.value) {
        return sorted
    }
    return sorted.filter(n => n.read == false)
})

const readNotification = async (notification) => {
    try {
        await auth.readNotification(new Number(notification.id))
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }
}

const headers = [

    {
        title:"Data",
        value: "date",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    {
        title:"Missatge",
        value: "message",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    {
        title:"Accions",
        value: "actions",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    {
        title:"Falla",
        value: "falla",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    
]

</script>
