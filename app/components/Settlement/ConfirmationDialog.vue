<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  name: string | null;
  quantity: number | undefined;
  isReturning: boolean;
}>();

const emit = defineEmits(["cancel", "confirm"]);
</script>

<template>
  <AlertDialog :open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Stock Return</AlertDialogTitle>
        <AlertDialogDescription
          >You are about to return
          <span class="font-semibold text-primary">{{ props.quantity }}</span>
          units of
          <span class="font-semibold text-primary">{{ props.name }}</span
          >. This will settle the remaining stock for today. Are you sure?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button
          variant="outline"
          @click="$emit('cancel')"
          :disabled="isReturning"
          >Cancel</Button
        >
        <Button @click="$emit('confirm')" :disabled="isReturning">
          <Spinner class="size-4" v-if="isReturning" />
          {{ isReturning ? "Processing..." : "Confirm" }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
