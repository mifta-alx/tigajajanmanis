<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  name: string | null;
  isDeleting: boolean;
}>();

const emit = defineEmits(["cancel", "confirm"]);
</script>

<template>
  <AlertDialog :open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete that
          {{ props.name }}
          and remove the data from the servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button
          variant="outline"
          @click="$emit('cancel')"
          :disabled="isDeleting"
          >Cancel</Button
        >
        <Button @click="$emit('confirm')" :disabled="isDeleting">
          <Spinner class="size-4" v-if="isDeleting" />
          {{ isDeleting ? "Deleting..." : "Continue" }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
