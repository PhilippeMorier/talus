suite('Array iteration', () => {
  benchmark('for', () => {
    for (let i = 0; i < 3; i++) {}
  });

  benchmark('native forEach', () => {
    [1, 2, 3].forEach(el => el);
  });
});
