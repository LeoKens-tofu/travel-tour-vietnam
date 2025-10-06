var slider = document.getElementById('slider');

noUiSlider.create(slider, {
  start: [100000, 10000000],
  connect: true,
  step: 100000,
  range: {
    min: 0,
    max: 10000000
  },
  tooltips: [true, true],
  format: {
    to: value => Math.round(value),
    from: value => Number(value)
  }
});