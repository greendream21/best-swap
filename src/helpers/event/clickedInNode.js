import { some, invoke, inRange, isNil, first } from 'lodash';

const clickedInNode = (node, e) => {
  if (some([e, node], isNil)) return false;

  if (e.target) {
    invoke(e.target, 'setAttribute', 'data-suir-click-target', true);

    if (document.querySelector('[data-suir-click-target=true]')) {
      invoke(e.target, 'removeAttribute', 'data-suir-click-target');
      return node.contains(e.target);
    }
  }

  const { clientX, clientY } = e;
  if (some([clientX, clientY], isNil)) return false;

  // false if the node is not visible
  const clientRects = node.getClientRects();

  if (
    !node.offsetWidth ||
    !node.offsetHeight ||
    !clientRects ||
    !clientRects.length
  ) {
    return false;
  }

  const { top, bottom, left, right } = first(clientRects);
  if (some([top, bottom, left, right], isNil)) return false;

  return (
    inRange(clientY, top, bottom + 0.001) &&
    inRange(clientX, left, right + 0.001)
  );
};

export default clickedInNode;
