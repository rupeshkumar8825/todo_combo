console.log("this is the your arena page for the better experience of the user");

const inputhistory = document.querySelectorAll(".input-history h1");
console.log(inputhistory.length);
console.log(inputhistory);
console.log(inputhistory[0].innerText);




// defining the function to show the result after enntering the numbers 
function showresult(num) {
    num = String(num);
    console.log("right now i am in show result section");
    const result = document.querySelector('.result h1');
    result.innerText = num;
    console.log("say everything went fine ");
}



// defining the function to have the number in format 
function getNumFormat(num) {
    num = Number(num);
    num = num.toLocaleString("en");
    return num;
}



// defining the function to remove the format of the result 
function removeFormat(resultval) {
    resultval = Number(resultval.replace(/,/g, ''));
    return resultval;
}




// using the for loop for this purpose 
const numbers = document.getElementsByClassName('number');
console.log(numbers.length);
console.log(numbers);




// now using the for loop for this purpose
for (let i = 0; i < numbers.length; i++) {
    // adding the event listener for every button of class numbers 
    numbers[i].addEventListener('click', () => {
        console.log("the number clicked is as follows ");
        console.log(numbers[i].innerText);
        const result = document.querySelector(".total_result");
        console.log("the current value of the result is as follows ");
        console.log(result.innerText);
        
        
        if (result.innerText === "") {
            result.innerText = numbers[i].innerText;
            // num = String(result.innerText);
        }
        else {
            // applying the if else statement for this purpose 
            let result_content = String(result.innerText);
            let negative = false;
            if (result_content[0] == '-') {
                // this means  that this is negative value 
                negative = true;
                result_content = result_content.substr(1, result_content.length);
            }
            console.log("the value of the result_content is ", result_content);
            let curr_result = removeFormat(String(result_content));
            curr_result = curr_result + String(numbers[i].innerText);
            curr_result = getNumFormat(curr_result);
            
            if (negative == true) {
                result.innerText = '-' + curr_result;
                
            }
            else {
                result.innerText = curr_result;
            }

            
        }
    });
}




// defining the function to evaluate the res with the given operator 
function evaluate(temp_result, curr_operator, op1) {
    temp_result = Number(temp_result);
    op1 = Number(op1);

    console.log("the operation needs to be peformed between the following values");
    console.log("the temp result is ", temp_result);
    console.log("the operator is ", curr_operator);
    console.log("the op1 is ", op1);

    // applying the if else statement 
    if (curr_operator == "+") {
        temp_result = temp_result + op1;
    }
    else if (curr_operator == "*") {
        temp_result = temp_result * op1;
    }
    else if (curr_operator == "-") {
        temp_result = temp_result - op1;
    }
    else if (curr_operator == "/") {
        temp_result = temp_result / op1;
    }
    else if (curr_operator == "%") {
        // in this we have to find the remainder for this purpose 
        temp_result = temp_result % op1;
    }

    
    // say everything went fine 
    return temp_result;
}




// doing the same for the operators 
const operators = document.querySelectorAll(".operator");
console.log(operators);
console.log(operators.length);



let history_content = "";
let temp_result = "";
let curr_operator = "";
let op1 = "";
let op2 = "";
let equalto_pressed = false;




for (let i = 0; i < operators.length; i++) {
    operators[i].addEventListener("click", () => {
        console.log("the operator clicked is as follows ");
        console.log(operators[i].innerText);
        const history = document.querySelector(".input-history h1");
        const result = document.querySelector(".total_result");
        const result_temph1 = document.querySelector(".temp_result");

        if (operators[i].innerText == "=") {
            // once the user clicks the equalto operator 
            // then in this case we have to clear the history log and also the temp_result
            op1 = String(removeFormat(String(result.innerText)));
            let final_result = evaluate(temp_result, curr_operator, op1);
            console.log("the final result is as follows ");
            console.log(final_result);

            // setting the all the global variables 
            temp_result = "";
            curr_operator = "";
            op1 = "";
            history_content = "";
            history.innerText = "";
            result_temph1.innerText = "";
            result.innerText = String(getNumFormat(String(final_result)));
        }
        else if (operators[i].innerText == "C") {
            // then this means that we have to clear the history and the result for this operator 
            history.innerText = "";
            history_content = "";
            result.innerText = "";
            temp_result = "";
            result_temph1.innerText = "";
        }
        else if (operators[i].innerText == "CE" && result.innerText != "") {
            // then this means that we have to perform the functionality of backspace 
            let curr_result = String(result.innerText);
            if (curr_result[0] == '-' && curr_result.length == 2) {
                // then this means that this is the negative number hence we have to remove the 
                // negative sign also for the better approach 
                // and this way i will be completing all the features of the calculator
                curr_result = "";
                result.innerText = curr_result;
            }
            else if (curr_result.length == 1)
            {
                // then in this case we have to remove the values 
                // temp_result = "";
                result.innerText = "";
            }
            else{
                curr_result = String(removeFormat(curr_result));
                curr_result = curr_result.substr(0, curr_result.length - 1);
                curr_result = String(getNumFormat(curr_result));
                result.innerText = String(curr_result);
                
            }
        }
        else {
            // this means that this is the operator 
            if (result.innerText != "") {
                // this means that the result section is not empty 
                let curr_result = String(removeFormat(String(result.innerText)));
                curr_result = curr_result + String(operators[i].innerText);
            
                if (history.innerText == "") {
                    // then this means that i am adding the number to history for the first time 
                    curr_operator = String(operators[i].innerText);
                    op1 = String(removeFormat(String(result.innerText)));
                    temp_result = String(op1);
                    result_temph1.innerText = temp_result;
                    history.innerText = curr_result;
                    history_content = curr_result;
                }
                else {
                    // this means that there is an history hence exist an temp_result 
                    history_content = history_content + curr_result;
                    history.innerText = history_content;
                    op1 = String(removeFormat(String(result.innerText)));
                    // calling the evalutaion function for this purpose 
                    let res1 = evaluate(temp_result, curr_operator, op1);
                    curr_operator = String(operators[i].innerText);
                    temp_result = String(res1);
                    result_temph1.innerText = temp_result;
                }
                

                // updating the temp_result for the better experience of the user 


                result.innerText = "";
            }
            else if (result.innerText == "" && String(operators[i].innerText) == '-') {
                // then this is the negative number for this purpose
                result.innerText = "-";
            }

        }
    })
}