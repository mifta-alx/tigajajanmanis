<script setup lang="ts">
const route = useRoute();
const searchQuery = useState("search_query", () => "");
const isSearching = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);

const placeholder = computed(
  () => (route.meta.searchPlaceholder as string) || "Cari produk",
);

const toggleSearch = () => {
  isSearching.value = !isSearching.value;
  if (!isSearching.value) {
    searchQuery.value = "";
  } else {
    setTimeout(() => searchInputRef.value?.focus(), 100);
  }
};

watch(
  () => route.path,
  () => {
    searchQuery.value = "";
    isSearching.value = false;
  },
);
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
    <header
      class="max-w-md mx-auto h-14 bg-background border border-white/20 dark:border-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-between px-2 overflow-hidden"
    >
      <div class="flex items-center flex-1 h-full relative">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-x-4"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-4"
        >
          <div v-if="!isSearching" class="flex items-center gap-3 px-2">
            <div
              class="size-8 rounded-[1rem] bg-primary flex items-center justify-center"
            >
              <Icon
                name="lucide:cookie"
                class="size-4 text-primary-foreground"
              />
            </div>
            <span class="text-lg font-bold leading-none tracking-tighter"
              >TigaJajan<span class="text-primary">.</span></span
            >
          </div>
        </Transition>

        <Transition
          enter-active-class="transition duration-300 delay-100 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-8"
        >
          <div
            v-if="isSearching"
            class="absolute inset-0 flex items-center px-2"
          >
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="placeholder"
              class="ms-2 w-full h-10 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none text-sm font-normal tracking-tight placeholder:text-muted-foreground/50 transition-all duration-300 ease-in-out"
            />
          </div>
        </Transition>
      </div>

      <div class="flex items-center pr-1">
        <button
          @click="toggleSearch"
          class="size-10 rounded-full hover:bg-secondary transition-all flex items-center justify-center active:scale-90"
        >
          <Icon
            :name="isSearching ? 'lucide:x' : 'lucide:search'"
            class="size-5 text-foreground transition-transform duration-300"
            :class="{ 'rotate-90': isSearching }"
          />
        </button>
      </div>
    </header>
  </div>
</template>
