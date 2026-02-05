<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

import {
  type DateValue,
  DateFormatter,
  getLocalTimeZone,
  today,
  parseDate,
} from "@internationalized/date";

import { CalendarIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const modelValue = defineModel<string>();

const defaultPlaceholder = today(getLocalTimeZone());
const date = ref() as Ref<DateValue>;

watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal) {
      try {
        const datePart = newVal.includes("T") ? newVal.split("T")[0] : newVal;
        date.value = parseDate(datePart);
      } catch (e) {
        console.error("Gagal parse tanggal:", e);
      }
    }
  },
  { immediate: true },
);

const handleDateChange = (newDate: DateValue | undefined) => {
  if (newDate) {
    modelValue.value = newDate.toString();
  }
};

const df = new DateFormatter("id-ID", {
  dateStyle: "long",
});
</script>

<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal',
            props.class,
            !date && 'text-muted-foreground',
          )
        "
      >
        <CalendarIcon />
        {{ date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="date"
        :default-placeholder="defaultPlaceholder"
        layout="month-and-year"
        initial-focus
        @update:model-value="
          (val) => {
            handleDateChange(val);
            close();
          }
        "
      />
    </PopoverContent>
  </Popover>
</template>
