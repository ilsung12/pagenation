// Pagenation Hooks 는 Pagenation 에 필요한 Prop 을 전달 받고
// 그걸 조합해서  items 를 return 해주는 custom Hook이 됨.

interface Props {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number; // 현재페이지 전후에 항상 표시되는 수
  boundaryCount?: number; // 시작과 끝에서 항상 표시되는 수
}

const usePagenation = ({
  count,
  page,
  onPageChange,
  disabled,
  siblingCount = 1,
  boundaryCount = 1,
}: Props) => {
  // 시작과 끝값을 입력하면 그사이의 값을 반환하는 함수
  const range = (start: number, end: number) => {
    const length = end - start + 1;

    return Array.from({ length }).map((_, index) => index + start);
  };

  // 단수
  const startPage = 1;
  const endPage = count;
  // 복수
  const startPages = range(startPage, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount - 1),
    count
  );
  // 항상표시되는수
  const siblingStart = Math.max(
    Math.min(
      page + 1 - siblingCount,
      count - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );

  const siblingEnd = Math.min(
    Math.max(page + 1 + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : endPage - 1
  );

  const itemList = [
    "prev",
    ...startPages,
    ...(siblingStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),
    ...range(siblingCount, siblingEnd),
    ...(siblingEnd < count - boundaryCount - 1
      ? ["end-ellipsis"]
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),
    ...endPages,
    "next",
  ];

  const items = itemList.map((item, index) => {
    typeof item === "number"
      ? {
          key: index,
          onClick: () => onPageChange(item - 1),
          disabled,
          selected: item - 1 === page,
          item,
        }
      : {
          key: index,
          onClick: () => onPageChange(item === "next" ? page + 1 : page - 1),
          // ellipsis 의 경우에는 disabled 시켜줄 것이기 때문에 해당 onClick이 동작하지 않음.
          disabled:
            disabled ||
            item.indexOf("ellipsis") > -1 ||
            (item === "next" ? page >= count - 1 : page < 1),
          selected: false,
          item,
        };
  });
  return { items };
};

export default usePagenation;
