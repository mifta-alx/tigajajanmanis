<script setup lang="ts">
import { getColumns } from "~/components/Users/column";
import EmptyView from "~/components/EmptyView.vue";
import { refDebounced } from "@vueuse/core";
import type { User } from "~/types/profiles";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "TigaJajan POS | Users",
  ogTitle: "TigaJajan POS | Users",
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

const { fetchUsers, toggleStatus, deleteUser } = useUser();

const searchQuery = ref("");
const { currentPage, perPage, totalPages, paginationRange, resetPage } =
  usePagination(
    computed(() => users.value?.total ?? 0),
    10,
  );
const debouncedSearch = refDebounced(searchQuery, 500);
watch(debouncedSearch, () => resetPage());

const {
  data: users,
  pending,
  refresh,
} = useLazyAsyncData(
  "users",
  () =>
    fetchUsers({
      search: debouncedSearch.value,
      page: currentPage.value,
      limit: perPage.value,
    }),
  {
    watch: [debouncedSearch, currentPage, perPage],
  },
);

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

const handleStatusChange = async (userId: string, newStatus: boolean) => {
  updatingIds.value.add(userId);
  try {
    await toggleStatus(userId, newStatus);

    const targetUser = users.value?.data.find((u) => u.id === userId);
    if (targetUser) {
      targetUser.is_active = newStatus;
    }

    const status = newStatus ? "activated" : "deactivated";
    success(`User has been ${status}`);
  } catch (err) {
    const action = newStatus ? "activate" : "deactivate";
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
      v-if="!pending && users?.total === 0 && !debouncedSearch"
      icon="users-round"
      name="user"
      :on-create="openAddModal"
    />
    <div v-else class="space-y-4">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput
              v-model="searchQuery"
              placeholder="Search user..."
              @input="currentPage = 1"
            />
            <InputGroupAddon>
              <Spinner v-if="pending && searchQuery" class="size-3.5" />
              <Icon v-else name="lucide:search" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" v-if="searchQuery">
              <InputGroupButton
                type="button"
                variant="ghost"
                aria-label="Clear"
                title="Clear"
                size="icon-xs"
                @click="searchQuery = ''"
              >
                <Icon name="lucide:x" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Button variant="outline" :disabled="pending" @click="openAddModal"
          ><Icon name="lucide:plus" />
          <span class="hidden lg:inline">Add User</span></Button
        >
      </div>
      <DataTable
        :columns="userColumns"
        :data="users?.data ?? []"
        :loading="pending"
      />
      <CustomPagination
        v-if="(users?.total && users.total > 0) || pending"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :pagination-range="paginationRange"
        :pending="pending"
        @update:page="(p) => (currentPage = p)"
        @update:per-page="(s) => (perPage = s)"
      />

      <DeleteDialog
        :open="!!selectedId"
        name="account"
        :is-deleting="isDeleting"
        @confirm="confirmDeleteUser"
        @cancel="selectedId = null"
      />
    </div>
    <Dialog v-model:open="isModalOpen">
      <DialogContent
        class="sm:max-w-xl"
        @interact-outside="(event) => event.preventDefault()"
      >
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
