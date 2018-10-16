const MarkerMap: string[] = [];

const map = (k:{}, i:number) => i

const pushDice = (n: number) => {
  const array: number[] = Array.from({length: n}, map);
  array.forEach((value, face:number) => {
    MarkerMap.push(face.toString() + ' en d' + n.toString());
  })
}

([4, 6, 8, 10, 12, 20]).forEach((n) =>{
  pushDice(n);
});

export default MarkerMap;