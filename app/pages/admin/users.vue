<script setup lang="ts">
import { getColumns } from "~/components/Users/column";
import type { User } from "~/types/models";
import DeleteDialog from "~/components/Users/DeleteDialog.vue";

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

const { fetchAllUsers } = useUser();

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
    await $fetch(`/api/users/${userId}`, {
      method: "PATCH",
      body: { status: newStatus },
    });

    const user = users.value?.find((u) => u.id === userId);
    if (user) {
      user.status = newStatus as 0 | 1;
    }

    success("User status changed");
  } catch (err) {
    console.log(err);
    error("User status failed to changed");
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
</script>

<template>
  <div class="space-y-4">
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
      <UsersDataTable
        :columns="userColumns"
        :data="users ?? []"
        :loading="pending"
      />
      <DeleteDialog
        :user-id="selectedId"
        @success="onDeleteSuccess"
        @cancel="selectedId = null"
      />
    </AlertDialog>
    <Dialog v-model:open="isModalOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{{
            selectedUser ? "Edit User" : "Add User"
          }}</DialogTitle>
          <DialogDescription>
            {{
              selectedUser
                ? "Update user information below."
                : "Fill in the details to create a new user."
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
