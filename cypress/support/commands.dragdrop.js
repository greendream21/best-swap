Cypress.Commands.add('dragAndDrop', (draggableSelector, droppableSelector) => {
  // convert to macro
  cy.get(droppableSelector).then(selection => {
    const [element] = selection;
    const coords = element.getBoundingClientRect();
    cy.get(draggableSelector)
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 10, clientY: 0 })
      .trigger('mousemove', {
        clientX: coords.x + 10,
        clientY: coords.y + 10,
      })
      .trigger('mouseup');
  });
});
