let params = {
    title: localStorage.getItem("myTitle"),
    language: localStorage.getItem("myLang")
};
let levelOne = [];
let levelTwo = [];
let levelThree = [];

const languages = [
    {
        abr: "en",
        name: "English"
    },
  {
    abr: "de",
    name: "Deutsch"
  },
  {
    abr: "id",
    name: "Bahasa Indonesia"
  },
  {
    abr: "es",
    name: "Español"
  },
  {
    abr: "ru",
    name: "Русский"
  },
  {
    abr: "ka",
    name: "დაგლას ადამსი – Georgian"
  },
  {
    abr: "zh",
    name: "道格拉斯·亚当斯 – Chinese"
  },
  {
    abr: "ur",
    name: "ڈگلس ایڈمس – Urdu"
  },
  {
    abr: "pt",
    name: "Português"
  },
  {
    abr: "ar",
    name: "دوغلاس آدمز – Arabic"
  }
];

onChange = e => {
  params[e.name] = e.value;
};

newPage =(data)=> {
    
 var url = `${window.location.href}#${data.id}`;
   window.open(url, '_blank');
//    location.hash = hash
}

populateLangDropdown = () => {
  let options = '<option value="">--select--</option>';
  for (let i in languages) {
    options += `<option value="${languages[i].abr}">${languages[i].name}</option>`;
  }
  document.getElementById("select-lang").innerHTML = options;
};

getData = () => {
    localStorage.myTitle = params.title;
    localStorage.myLang = params.language;
  if (params.title || localStorage.getItem("myTitle")) {
    fetch(
      `https://${
        params.language ? params.language : "en"
      }.wikipedia.org/api/rest_v1/page/html/${(params.title)?params.title: localStorage.getItem("myTitle") }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(
        response => response.text()
        // if(response.status >= 400)   throw new Error(`request rejected with status code: ${response.status}`)
      )
      .then(response => {
        levelOne = [];
        levelTwo = [];
        levelThree = [];
        document.getElementById("newText").innerHTML = response;
        document.querySelectorAll("section").forEach(function(node) {
          if (node.firstChild.nodeName == "H2") {
            for (let i in node.children) {
              let levelOneObj = {};
              if (node.children[i].tagName === "H2") {
                levelOneObj.h2 = node.children[i].id;
                levelOneObj.innerText = node.children[i].innerText;
                levelOneObj.num = node.getAttribute("data-mw-section-id");
              }
              if (node.children[i].tagName === "SECTION") {
                for (let k in node.children[i].children) {
                  let levelTwoObj = {};
                  if (node.children[i].children[k].tagName === "H3") {
                    levelTwoObj.h3 = node.children[i].children[k].id;
                    levelTwoObj.innerText =
                      node.children[i].children[k].innerText;
                    levelTwoObj.num = node.getAttribute("data-mw-section-id");
                    if (Object.keys(levelTwoObj).length !== 0) {
                      levelTwo.push(levelTwoObj);
                    }
                  }
                  if (node.children[i].children[k].tagName === "SECTION") {
                    for (let l in node.children[i].children[k].children) {
                      let levelThreeObj = {};
                      if (
                        node.children[i].children[k].children[l].tagName ===
                        "H4"
                      ) {
                        levelThreeObj.h4 =
                          node.children[i].children[k].children[l].id;
                        levelThreeObj.innerText =
                          node.children[i].children[k].children[l].innerText;
                        levelThreeObj.num = node.getAttribute(
                          "data-mw-section-id"
                        );
                        levelThreeObj.i = i;
                        if (Object.keys(levelThreeObj).length !== 0) {
                          levelThree.push(levelThreeObj);
                        }
                      }
                    }
                  }
                }
              }
              if (Object.keys(levelOneObj).length !== 0) {
                levelOne.push(levelOneObj);
              }
            }
          }
        });
      })
      .then(() => {
        let toc = "<h2> Contents </h2><ol>";
        let toc_levelOne = "<ol>";
        let toc_levelTwo = "<ol>";

        for (let i in levelOne) {
          toc += `<li><a name="${levelOne[i].h2}" onclick="newPage(${levelOne[i].h2})"> ${levelOne[i].innerText} </a>`;
          for (let j in levelTwo) {
            if (levelOne[i].num === levelTwo[j].num) {
              toc_levelOne += `<li ><a name="${levelTwo[j].h3}" onclick="newPage(${levelTwo[j].h3})"> ${levelTwo[j].innerText} </a> `;
              for (let k in levelThree) {
                if (
                  levelOne[i].num === levelThree[k].num &&
                  levelThree[k].i == j
                ) {
                  toc_levelTwo += `<li><a name="${levelThree[k].h4}"  onclick="newPage(${levelThree[k].h4})"> ${levelThree[k].innerText} </a> </li>`;
                }
                if (k == levelThree.length - 1) {
                  toc_levelOne = toc_levelOne + toc_levelTwo + "</ol>";
                  toc_levelTwo = "<ol>";
                }
              }
              +` </li>`;
            }
            if (j == levelTwo.length - 1) {
              toc = toc + toc_levelOne + "</ol></li>";
              toc_levelOne = "<ol>";
            }
          }
        }
        toc += "</ol>";
        document.getElementById("toc").innerHTML = toc;
      })

      .catch(error => {
        alert(error);
      });
  } else {
    alert("please enter article name");
  }
};

if (window.location.hash) {
  document.getElementById("newText").style.display = "block";
  getData();
}

fetchData = () => {
  getData();
};

window.onload = () => {
  this.populateLangDropdown();
};
