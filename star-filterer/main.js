// ==UserScript==
// @name         star filterer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       27bslash
// @match        https://osrsportal.com/shooting-stars-tracker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=osrsportal.com
// @updateURL    https://github.com/27bslash/tamperMonkey-scripts/raw/main/star-filterer/main.js
// @downloadURL  https://github.com/27bslash/tamperMonkey-scripts/raw/main/star-filterer/main.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const targetNode = document.querySelector(".container");
  // TODO
  // local storage these variables
  let showFilter = false;
  const total1250worlds = [529, 447, 429, 364, 353];
  const total1500worlds = [366, 416, 420, 448, 528];
  const total1750worlds = [373, 391, 467, 449];
  const total2000worlds = [349, 361, 396, 428, 527];
  const total2200worlds = [363, 415, 450, 526];

  const totalWorlds = {
    1250: total1250worlds,
    1500: total1500worlds,
    1750: total1750worlds,
    2000: total2000worlds,
    2200: total2200worlds,
  };
  const f2pWorlds = [
    301, 308, 316, 326, 335, 371, 372, 379, 380, 381, 382, 393, 394, 397, 398,
    399, 413, 414, 417, 418, 419, 427, 430, 431, 432, 433, 434, 435, 436, 437,
    451, 452, 453, 454, 455, 456, 468, 469, 470, 471, 475, 476, 483, 497, 498,
    499, 500, 501, 542, 543, 544, 545, 546, 547, 552, 553, 554, 555, 556, 557,
    562, 563, 570, 571, 575,
  ];
  const playerTotalLevel = localStorage.getItem("totalLevel");
  const filterTotalWorlds = localStorage.getItem("filterTotalWorlds");
  const filterf2p = localStorage.getItem("filterf2pWorlds");
  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (mutation.target.getAttribute("class") === "styledtablebody") {
          main();
          break;
        }
        /*for (const node of mutation.addedNodes) {
                    if (node.id === 'stars-track') {
                        console.log('Detected the element!');
                        // Do something when the element is detected
                    }
                } */
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  try {
    observer.observe(targetNode, config);
  } catch (e) {
    console.log(e);
  }

  const findTableHeaderIndex = (table, header) => {
    return [...table[0].children].findIndex((x, i) => {
      //   console.log(col);
      return x.textContent.toLowerCase() === header;
    });
  };
  const filterByTotalLevel = (playerTotalLevel) => {
    let totalWorldsAbovePlayer = [];
    for (const key in totalWorlds) {
      if (playerTotalLevel < key) {
        totalWorldsAbovePlayer = totalWorldsAbovePlayer.concat(
          totalWorlds[key]
        );
      }
    }
    return totalWorldsAbovePlayer;
  };
  const main = () => {
    const storedValues = JSON.parse(localStorage.getItem("textValues")) || [];
    const starTable = document.querySelectorAll("tr");
    const worldCol = findTableHeaderIndex(starTable, "world");
    const timeCol = findTableHeaderIndex(starTable, "time");
    const locationCol = findTableHeaderIndex(starTable, "location");

    const tooHightotalWorlds = filterByTotalLevel(playerTotalLevel);
    for (let row of starTable) {
      let display = true;
      for (let [i, cell] of [...row.children].entries()) {
        if (i !== locationCol && i !== worldCol && i !== timeCol) continue;
        if (i === worldCol) {
          const world = +cell.textContent;
          if (
            (tooHightotalWorlds.includes(world) &&
              filterTotalWorlds === "true") ||
            (f2pWorlds.includes(world) && filterf2p === "true")
          ) {
            display = false;
            console.log(
              `filtered by ${
                tooHightotalWorlds.includes(world) ? "total" : "f2p"
              } world: ${world}`
            );
          }
        }
        if (i === timeCol) {
          const minTime = cell.textContent.replace("m ago", "");
          if (minTime > 25) {
            // console.log("filtered by time", cell, minTime);
            display = false;
          }
        }
        if (i === locationCol) {
          for (let value of storedValues) {
            if (cell.textContent.toLowerCase().includes(value.toLowerCase())) {
              console.log("filtered by location: ", cell.textContent);
              display = false;
            }
          }
        }
        if (display) {
          cell.parentNode.style.display = "";
        } else {
          cell.parentNode.style.display = "none";
        }
      }
    }
    if (!document.querySelector(".star-filterer")) {
      const parentElement = document.getElementById("stars-track");
      const starFiltererTextTitle = document.createElement("h3");
      starFiltererTextTitle.style.userSelect = "none";
      const listContainer = document.createElement("div");
      listContainer.setAttribute("class", "star-filterer");
      parentElement.insertBefore(listContainer, parentElement.firstChild);
      starFiltererTextTitle.textContent = "Star Filterer";
      showFilter
        ? (document.querySelector(".star-filterer").style.display = "")
        : (document.querySelector(".star-filterer").style.display = "none");
      starFiltererTextTitle.onclick = () => {
        showFilter = !showFilter;
        showFilter
          ? (document.querySelector(".star-filterer").style.display = "")
          : (document.querySelector(".star-filterer").style.display = "none");
      };
      parentElement.insertBefore(
        starFiltererTextTitle,
        parentElement.firstChild
      );
      addTextBox("textValues", "text", "   Filter By Location Column");
      addTextBox("totalLevel", "number", "  Player Total Level");
      addCheckBox("Filter Total Worlds", "filterTotalWorlds");
      addCheckBox("Filter F2P Worlds", "filterf2pWorlds");
      for (let value of storedValues) {
        addText(value);
      }
    }
  };
  const addText = (text) => {
    const container = document.querySelector(".star-filterer");
    const div = document.createElement("div");
    const textContainer = document.createElement("p");
    const button = document.createElement("button");
    container.style.width = "50%";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";

    div.setAttribute("class", "filtered-location");
    button.textContent = "Delete";
    button.onclick = function () {
      removeTextBox(this);
    };
    textContainer.textContent = text;

    div.appendChild(textContainer);
    div.appendChild(button);
    container.appendChild(div);
  };
  function addTextBox(key, type, labelText) {
    const container = document.querySelector(".star-filterer");
    const div = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    label.textContent = labelText;
    input.type = type;
    input.max = type === "number" ? 2376 : 99;
    input.value = type === "number" ? playerTotalLevel : "";
    input.onkeydown = function (event) {
      if (type === "text") {
        saveValue(event, key);
      } else {
        localStorage.setItem("totalLevel", input.value);
      }
    };
    input.textContent = label;
    div.appendChild(input);
    div.appendChild(label);
    container.appendChild(div);
  }
  function saveValue(event, key) {
    if (event.key === "Enter") {
      const input = event.target;
      const value = input.value;
      const storedValues = JSON.parse(localStorage.getItem(key)) || [];
      storedValues.push(value);
      localStorage.setItem(key, JSON.stringify(storedValues));
      addText(value);
      main();
    }
  }

  function removeTextBox(button) {
    const container = document.getElementById("container");
    const inputValue = button.parentNode.querySelector("p").textContent;
    const storedValues = JSON.parse(localStorage.getItem("textValues")) || [];
    const index = storedValues.indexOf(inputValue);
    if (index > -1) {
      storedValues.splice(index, 1);
      localStorage.setItem("textValues", JSON.stringify(storedValues));
    }
    button.parentNode.remove();
    main();
  }
  const addCheckBox = (labelText, type) => {
    const container = document.querySelector(".star-filterer");
    const div = document.createElement("div");
    div.style.display = "flex";
    const input = document.createElement("input");
    const text = document.createElement("p");
    text.textContent = labelText;
    input.type = "checkbox";
    input.checked = localStorage.getItem(type) === "true" ? true : false;
    input.onclick = () => {
      localStorage.setItem(type, input.checked);
      //   console.log(variable);
      main();
    };
    div.appendChild(input);
    div.appendChild(text);
    container.appendChild(div);
  };
  document.addEventListener("DOMContentLoaded", () => {
    main();
  });
  // Your code here...
})();
