arr = [...document.getElementById("list").children];
let i = 0;
async function test() {
  while (i < arr.length) {
    await sleep(100);
    const bar = document.querySelector(".progress-bar");
    let slider = document.querySelector(".slider");
    p_width = (i / (arr.length - 1)) * 100 + "%";
    console.log(i, p_width);
    slider.style.width = p_width;
    i++;
  }

}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
test();
