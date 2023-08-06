const LetterNum = [];
for (let i = 48; i <= 57; i++) {
  LetterNum.push(String.fromCharCode(i));
}
for (let i = 65; i <= 90; i++) {
  LetterNum.push(String.fromCharCode(i));
}

for (let i = 97; i <= 122; i++) {
  LetterNum.push(String.fromCharCode(i));
}
let randIdMap = {};
export function getRandLetterNum(len) {
  let str = [];

  for (let i = 0; i < len; i++) {
    str.push(LetterNum[Math.round(Math.random() * LetterNum.length) % LetterNum.length]);
  }
  let id = str.join('');
  if (randIdMap[id]) {
    return getRandLetterNum(len);
  }
  randIdMap[id] = true;
  return id;
}
