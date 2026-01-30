<script setup lang="ts">
import { getColumns } from "~/components/Users/column";
import type { User } from "~/types/models";
import EmptyView from "~/components/EmptyView.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "Admin | Users",
  ogTitle: "Admin | Users",
  description: "",
  ogDescription: "",
});

const user = useSupabaseUser();
const isModalOpen = ref(false);
const updatingIds = ref(new Set<string>());
const selectedUser = ref<User | null>(null);
const { success, error } = useToast();

const selectedId = ref<string | null>(null);
const isDeleting = ref(false);
const { fetchAllUsers, toggleStatus, deleteUser } = useUser();

const {
  data: users,
  pending,
  refresh,
} = useLazyAsyncData("users", () => fetchAllUsers());

const openAddModal = () => {
  selectedUser.value = null;
  isModalOpen.value = true;
};

const openEditModal = (user: User) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const onSuccessMutation = () => {
  refresh();
  isModalOpen.value = false;
};

const handleStatusChange = async (userId: string, newStatus: number) => {
  updatingIds.value.add(userId);
  try {
    await toggleStatus(userId, newStatus);

    const targetUser = users.value?.find((u) => u.id === userId);
    if (targetUser) {
      targetUser.status = newStatus as 0 | 1;
    }

    const status = newStatus === 1 ? "activated" : "deactivated";
    success(`User has been ${status}`);
  } catch (err) {
    const action = newStatus === 1 ? "activate" : "deactivate";
    error(`Failed to ${action} user`);
    await refresh();
  } finally {
    updatingIds.value.delete(userId);
  }
};

const userColumns = computed(() => {
  return getColumns(
    (id: string) => {
      selectedId.value = id;
    },
    handleStatusChange,
    openEditModal,
    user.value?.sub,
    updatingIds,
  );
});

const onDeleteSuccess = () => {
  selectedId.value = null;
  refresh();
};

const confirmDeleteUser = async () => {
  if (!selectedId.value) return;

  const currentUser = useSupabaseUser();
  if (selectedId.value === currentUser.value?.sub) {
    error("You cannot delete your own account!");
    selectedId.value = null;
    return;
  }

  isDeleting.value = true;
  try {
    await deleteUser(selectedId.value);
    success("User deleted successfully");
    onDeleteSuccess();
  } catch (e) {
    error("Failed to delete user");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="min-h-0 h-full">
    <EmptyView
      v-if="!pending && users?.length === 0"
      icon="users-round"
      name="user"
      :on-create="openAddModal"
    />
    <div v-else class="space-y-4">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput placeholder="Search user..." />
            <InputGroupAddon>
              <Icon name="lucide:search" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Button variant="outline" :disabled="pending" @click="openAddModal"
          ><Icon name="lucide:plus" />
          <span class="hidden lg:inline">Add User</span></Button
        >
      </div>
      <AlertDialog
        :open="!!selectedId"
        @update:open="(val) => (!val ? (selectedId = null) : null)"
      >
        <DataTable
          :columns="userColumns"
          :data="users ?? []"
          :loading="pending"
        />
        <DeleteDialog
          name="account"
          :is-deleting="isDeleting"
          @confirm="confirmDeleteUser"
          @cancel="selectedId = null"
        />
      </AlertDialog>
    </div>
    <Dialog v-model:open="isModalOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{{
            selectedUser ? "Edit User" : "Add User"
          }}</DialogTitle>
          <DialogDescription>
            {{
              selectedUser
                ? "Make changes to the user details below."
                : "Enter the information below to add a new user."
            }}
          </DialogDescription>
        </DialogHeader>

        <UsersFormDialog
          v-if="isModalOpen"
          :user="selectedUser"
          @success="onSuccessMutation"
          @cancel="isModalOpen = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
