"use strict";
const fs = require("fs");
const readline = require("readline");

const rs = fs.ReadStream("./popu-pref.csv");
//rlというオブジェクトもstreamのインタフェースを持っている
const rl = readline.createInterface({ input: rs, output: {} });

//新しくセットされたMap関数
const map = new Map();

rl.on("line", lineString => {
  //   console.log(lineString);
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
    let value = map.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 += popu;
    }
    if (year === 2015) {
      value.popu15 += popu;
    }
    map.set(prefecture, value);
  }
});
rl.resume();
rl.on("close", () => {
  for (let keyAndValue of map) {
    const value = keyAndValue[1];
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    //正負を入れ替えてランクを逆転
    return -(pair2[1].change - pair1[1].change);
  });
  const rankingStrings = rankingArray.map((keyAndValue, i) => {
    return (
      "人口減少ランキング" +
      (i + 1) +
      "位 " +
      keyAndValue[0] +
      ":" +
      keyAndValue[1].popu10 +
      "=>" +
      keyAndValue[1].popu15 +
      "変化率" +
      keyAndValue[1].change
    );
  });
  console.log(rankingStrings);
});
