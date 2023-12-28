// ==UserScript==
// @name         utube playlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https?:\/\/.*youtube.*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("click", (e) => {
    let song_data;
    console.log(e.target.id);
    if (e.target.id == "content") {
      song_data = Array.from(e.target.children[2].children);
    } else if (e.target.tagName == "SPAN" && e.target.dir == "auto") {
      console.log(e.target.innerText);
    } else {
      return;
    }
    let song_arr = [];
    song_data.forEach((x, i) => {
      let link_text, target_element;
      try {
        const next_el = song_data[i + 1];
        if (!next_el) {
          return;
        }
        if (
          (next_el.tagName === "A" && !next_el.href.match(/t=\d*s$/gm)) ||
          (x.tagName === "A" && !x.href.match(/t=\d*s$/gm))
        ) {
          return;
        } else if (x.tagName === "SPAN" && next_el.tagName === "A") {
          target_element = x;
        } else if (x.tagName === "A" && next_el.tagName === "SPAN") {
          target_element = next_el;
        } else {
          return;
        }
        console.log("target: ", target_element);
        link_text = target_element.innerText.replace(/[-:"\'\[\]]/gm, "");
        console.log("link: ", link_text.replace(/\[.*\]/g, ""));
        if (link_text.match(/\S/)) {
          console.log("success: ", x, link_text);
          song_arr.push(link_text);
        }
      } catch (error) {
        console.log("end", i);
      }
    });
    console.log(song_arr);

    // Your code here...
    const create_tooltip = (e, wrapper) => {
      let curr = document.getElementById("sign-in-or-out-button");
      wrapper.setAttribute("class", "tooltip-wrapper");
      wrapper.style.backgroundColor = "black";
      wrapper.style.position = "absolute";
      wrapper.style.top = e.pageY + "px";
      wrapper.style.left = e.pageX + "px";
      let button = document.createElement("button");
      button.innerText = "test";
      wrapper.appendChild(button);
      document.body.insertBefore(wrapper, curr);
    };

    let wrapper = document.createElement("div");
    if (!document.querySelector(".tooltip-wrapper")) {
      create_tooltip(e, wrapper);
    } else if (e.pageY + "px" != wrapper.style.pageY) {
      document.querySelector(".tooltip-wrapper").remove();
      create_tooltip(e, wrapper);
    }
    console.log(e.target);
  });
})();
