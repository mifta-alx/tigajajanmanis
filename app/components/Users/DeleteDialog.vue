<script setup lang="ts">
const props = defineProps<{ userId: string | null }>();
const emit = defineEmits(["success", "cancel"]);

const { deleteUser } = useUser();
const { error, success } = useToast();
const isDeleting = ref(false);

const confirmDelete = async () => {
  if (!props.userId) return;

  const currentUser = useSupabaseUser();

  if (props.userId === currentUser.value?.sub) {
    error("You cannot delete your own account!");
    return;
  }

  isDeleting.value = true;
  try {
    await deleteUser(props.userId);
    success("User deleted successfully");

    emit("success");
  } catch (e) {
    error("Failed to delete user");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete tha account
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
