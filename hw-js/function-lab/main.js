
function maxOfTwoNumbers(a,b) { 
  if (a>b) { return a; }
  else { return b; }  
}

function maxOfThree(a,b,c) { return Math.max(Math.max(a,b),c); }



function isCharacterAVowel(c) { 
  return (c=='a' || c=='e' || c=='i' || c=='o' || c=='u');
}


function sumArray(arr) {
  var num= 0;
  for (var i=0; i<arr.length;) { num+= arr[i++]; } 
  return num;
}

function multiplyArray(arr) {
  var num= 1;
  for (var i=0; i<arr.length;) { num*= arr[i++]; } 
  return num;
}


function numFuncArgs() {
  return arguments.length;
}


function reverseString(str) {
  var strArr= str.split("");
  var res="";
  for (var i=strArr.length-1;i>=0;i--) { res+=strArr[i]; }
  return res;
} 


function findLongestWord(wordArr) {
  var max= 0;
  for (var i=0;i<wordArr.length;i++) {
    max= Math.max(max,wordArr[i].length);
  }
  return max;
}

function filterLongWords(wordArr,i) {
  var res= [];
  for (var k=0;k<wordArr.length;k++) {
    if (wordArr[k].length>i) res.push(wordArr[k]);
  }
  return res;
}

function testSuite() {
  console.log("max of (10,24)="+maxOfTwoNumbers(10,24));
  console.log("max of (76,45)="+maxOfTwoNumbers(76,45));
  console.log(maxOfTwoNumbers(10,10));
  console.log("max of (7,10,-2)="+maxOfThree(7,10,-2));
  console.log("e is character= "+isCharacterAVowel('e'));
  console.log("p is character= "+isCharacterAVowel('p'));
  console.log("sum of [1,2,3,4,5,6]= "+sumArray([1,2,3,4,5,6]));
  console.log("product of [1,2,3,4,5,6]= "+multiplyArray([1,2,3,4,5,6]));
  console.log("number of arguments= "+numFuncArgs(1,2,3));
  console.log("number of arguments= "+numFuncArgs(5,[2,'cat','dog']));
  console.log("reverse of \'I love coding\'= "+reverseString('I love coding'));
  console.log(findLongestWord(['hello','abracadabra','work','applebee']));
  console.log(filterLongWords(['apple','tea','pie','orange','cat','mouse'],4));
}

testSuite();
