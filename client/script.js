import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form=document.querySelector('form');
const chatContainer=document.querySelector('#chat_container');

let loadInterval;

function loader(element){
    element.textContent='';
    loadInterval=setInterval(()=>{
        element.textContent+='.';
        if(element.textContent==='....'){
            element.textContent='';
        }
    },300)
}

function typeText(element,text){
    let index=0;
    let interval=setInterval(()=>{
        if(index<text.length){
            element.innerHTML+=text.charAt(index);
            index++;
        }else{
            clearInterval(interval);
        }
    },20)
}

function generateUniqueId() {
    const timestamp=Date.now();
    const randomNumber=Math.random();
    const hexadecimalString=randomNumber.toString(16);

    return `id-${hexadecimalString}-${timestamp}`;
}

function stripe(isAi,value,uniqueId) {
    return (
        `
            <div class="max-w-[70%] p-[15px] ${isAi && 'grad2'} ${isAi || 'grad3'}">
                <div class="w-[100%] max-w-[1280px] my-0 mx-auto flex flex-row gap-[10px] items-start ">
                    <div class="w-[36px] h-[36px] rounded-full bg-[#5436DA] flex flex-row justify-center items-center ${isAi && 'bg-[#10a37f]'}">
                        <img 
                            src=${isAi ? bot : user} 
                            alt="${isAi ? 'bot' : 'user'}" 
                            class='w-[60%] h-[60%] object-contain '
                        />
                    </div>
                    <div class="flex-1 text-[#dcdcdc] text-[20px] max-w-[100%] overflow-x-scroll whitespace-pre-wrap no-scrollbar " id=${uniqueId}>${value}</div>
                </div>
            </div>
        `
    )
}

const handleSubmit=async(e)=>{
    e.preventDefault();

    const data=new FormData(form);
    chatContainer.innerHTML+=stripe(false,data.get('userquery'));
    form.reset();

    const uniqueId=generateUniqueId();
    chatContainer.innerHTML+=stripe(true," ",uniqueId);
    chatContainer.scrollTop=chatContainer.scrollHeight;
    const messageDiv=document.getElementById(uniqueId);

    loader(messageDiv);

    const response=await fetch('https://codebot-54zr.onrender.com',{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({userquery:data.get('userquery')})
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML='';

    if(response.ok){
        const data=await response.json();
        const parsedData=data.bot.trim();

        typeText(messageDiv,parsedData);
    }else{
        const err=await response.text();
        messageDiv.innerHTML="Something went wrong";
        alert(err);

    }
}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(e)=>{
    if(e.keyCode===13){
        handleSubmit(e);
    }
})