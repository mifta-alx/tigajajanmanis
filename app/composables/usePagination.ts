export const usePagination = (
  totalItems: ComputedRef<number>,
  initialPerPage = 1,
) => {
  const currentPage = ref(1);
  const perPage = ref(initialPerPage);

  const totalPages = computed(() => {
    const pages = Math.ceil(totalItems.value / perPage.value);
    return pages > 0 ? pages : 1;
  });

  const resetPage = () => (currentPage.value = 1);

  const paginationRange = computed(() => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages.value) {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage.value - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage.value + siblingCount,
      totalPages.value,
    );

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages.value - 2;

    if (!showLeftDots && showRightDots) {
      return [
        ...Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1),
        "ellipsis",
        totalPages.value,
      ];
    }

    if (showLeftDots && !showRightDots) {
      return [
        1,
        "ellipsis",
        ...Array.from(
          { length: 3 + 2 * siblingCount },
          (_, i) => totalPages.value - (3 + 2 * siblingCount) + i + 1,
        ),
      ];
    }

    return [
      1,
      "ellipsis",
      ...Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      ),
      "ellipsis",
      totalPages.value,
    ];
  });

  watch(perPage, () => resetPage());

  return {
    currentPage,
    perPage,
    totalPages,
    paginationRange,
    resetPage,
  };
};
