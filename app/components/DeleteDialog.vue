<script setup lang="ts">
const props = defineProps<{
  name: string | null;
  isDeleting: boolean;
}>();

const emit = defineEmits(["cancel", "confirm"]);
const confirmDelete = async () => {
  emit("confirm");
};
</script>

<template>
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
      <Button variant="outline" @click="$emit('cancel')" :disabled="isDeleting"
        >Cancel</Button
      >
      <Button @click="confirmDelete" :disabled="isDeleting">
        <Icon
          name="lucide:loader-2"
          v-if="isDeleting"
          class="h-4 w-4 animate-spin"
        />
        {{ isDeleting ? "Deleting..." : "Continue" }}
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</template>
