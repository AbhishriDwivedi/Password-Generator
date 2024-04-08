// getting value from dom using custom attributes
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
// all elements with tag 'input' and type 'checkbox'
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initializing the values
let password = "";
// default set to 10
let passwordLength = 10;
let checkCount = 0;

// handle the slider movement
handleSlider();

// setting password length
function handleSlider(){
    // setting the slider to 10 while loading
    inputSlider.value = passwordLength;
    // displaying 10
    lengthDisplay.innerText = passwordLength;
    // find minimum of input slider
    const min = inputSlider.min;
    // find maximum of input slider
    const max = inputSlider.max;
    // length of background color of slider indicating the length of the slider
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}

// setting indicator color
function setIndicator(color){
    // setting color of the password strength indicator
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
        // api usage for copying to clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
        // display a copied tooltip if successfully copied
        copyMsg.innerText = "copied";
    }
    catch(e){
        // display a failed tooltip if not copied successfully
        copyMsg.innerText = "Failed";
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    // remove the displayed tooltip after 2 seconds.
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

// on checking unchecking dialog box
function handleCheckBoxChange(){
    checkCount = 0;
    // find the number of boxes checked
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // if boxes checked are greated than password length
    if(checkCount > passwordLength){
        // set the password length to the count of boxes checked
        passwordLength = checkCount;
        // update the slider since we just altered the password length
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
    // convert array to string
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach((checkbox)=>{
    // call function as soon as event of clicking is raised on checkbox
    checkbox.addEventListener('change', handleCheckBoxChange );
})

// this event is raised when the slider is moved
inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

// event will be raised when copy button is clicked
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

// event raised when generate button is clicked
generateBtn.addEventListener('click', ()=>{

    // return if no box is checked
    if(checkCount <= 0) return;

    // if boxes checked are greated than password length
    if(passwordLength < checkCount){
        // set the password length to the count of boxes checked
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old pswd
    password="";

    // this array will call functions
    let funcArr = [];

    // push functions for generating characters of all types
    // if box for upper case is checked
    if(uppercaseCheck.checked)
        // push function for generating uppercase characters
        funcArr.push(generateUpperCase);

    // if box for lower case is checked    
    if(lowercaseCheck.checked)
        // push function for generating lowercase characters
        funcArr.push(generateLowerCase);

    // if box for numbers is checked    
    if(numbersCheck.checked)
        // push functions for generating random integer
        funcArr.push(generateRandomInteger);

    // if box for symbols is checked
    if(symbolsCheck.checked)
        // push function for generating symbol
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        // add one from each type
        password+=funcArr[i]();
    }

    // add characters randomly for the remaining length
    for(let i=0; i<passwordLength - funcArr.length; i++){
        // find any random index
        let randIndex = getRndInteger(0, funcArr.length);
        // find generator function at that index at add the obtained character
        password += funcArr[randIndex]();
    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    // display the password
    passwordDisplay.value = password;

    //calculate strength of the password
    calcStrength();
})



