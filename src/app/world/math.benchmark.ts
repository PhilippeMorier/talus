suite('Integer division', () => {
  benchmark('Math.round()', () => {
    Math.floor(10 / 2);
    Math.floor(11 / 3);
    Math.floor(12 / 5);
  });

  benchmark('a/b >> 0', () => {
    (10 / 2) >> 0;
    (11 / 3) >> 0;
    (12 / 5) >> 0;
  });

  benchmark('~~(a/b)', () => {
    ~~(10 / 2);
    ~~(11 / 3);
    ~~(12 / 5);
  });

  benchmark('a/b | 0', () => {
    (10 / 2) | 0;
    (11 / 3) | 0;
    (12 / 5) | 0;
  });
});
