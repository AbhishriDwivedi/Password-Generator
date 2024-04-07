// getting value from doms
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initializing the values
let password = "";
let passwordLength = 10;
let checkCount = 0;

// handle the slider movement
handleSlider();

// setting password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}

// setting indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
}

// get any random integer between min and max
function getRndInteger(min, max){
   return Math.floor(Math.random()*(max-min)) + min;
}

// get any random integer
function generateRandomInteger(){
    return getRndInteger(0,9);
}

// get any random lower case character
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

// get any random upper case character
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

// get any random symbol character
function generateSymbol(){
    const rndNum = getRndInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

// function to calculate strength of generated password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// on clicking copy button
async function copyContent(){
    try{
        // api
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

// on checking unchecking dialog box
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(checkCount > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }
}

// shuffle the characters of password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange );
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', ()=>{

    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old pswd
    password="";

    // this array will call functions
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomInteger);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
})



