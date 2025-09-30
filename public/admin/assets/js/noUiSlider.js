var slider = document.getElementById('slider');

noUiSlider.create(slider, {
  start: [0, 10000000],
  connect: true,
  step: 100000,
  range: {
    min: 0,
    max: 10000000
  },
  tooltips: [true, true], // 2 đầu đều hiện tooltip
  format: {
    to: value => Math.round(value),
    from: value => Number(value)
  }
});