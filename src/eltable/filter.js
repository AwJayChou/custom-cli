let arr = [
    {
      one: 1,
      two: 2,
      three: 6,
    },
    {
      one: 1,
      two: 2,
      three: 5,
    },
    {
      one: 1,
      two: 9,
      three: 5,
    },
    {
      one: 1,
      two: 9,
      three: 5,
    },
    {
      one: 2,
      two: 5,
      three: 3,
    },
    {
      one: 3,
      two: 5,
      three: 5,
    },
    {
      one: 3,
      two: 5,
      three: 4,
    },
    {
      one: 3,
      two: 2,
      three: 3,
    },
    {
      one: 1,
      two: 110,
      three: 111,
    },
    {
      one: 2,
      two: 90,
      three: 91,
    },
    {
      one: 3,
      two: 66,
      three: 67,
    },
    {
      one: 2,
      two: 66,
      three: 67,
    },
    {
      one: 2,
      two: 30,
      three: 31,
    },
    {
      one: 2,
      two: 30,
      three: 34,
    },
  ];
  // 很神奇，先按照 a 字段来排序，a字段排剩余下来的用 b 字段进行排序， 
  arr.sort(function (a, b) {
    return a['one'] - b['one'] || a['two'] - b['two'] || a['three'] - b['three'];
  });
  
  console.log('## arr -=> ', arr);
  