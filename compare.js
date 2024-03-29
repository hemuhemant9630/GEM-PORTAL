const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});
var timeout;

function cursorshape(){
    //define default scale value
    var xscale=1;
    var yscale=1;

    var xprev=0;
    var yprev=0;

    window.addEventListener("mousemove",function(dets){
        clearTimeout(timeout);

        xscale=gsap.utils.clamp(.8,1.2,dets.clientX-xprev);
        yscale=gsap.utils.clamp(.8,1.2,dets.clientY-yprev);

        xprev = dets.clientX;
        yprev = dets.clientY;

        cursor(xscale,yscale);

        timeout = setTimeout(function(){
            document.querySelector("#cursor").style.transform=translate(${dets.clientX}px,${dets.clientY}px) scale(1,1);
        }, 100);
    });
}

function cursor(xscale,yscale){
    window.addEventListener("mousemove",function(dets){
        document.querySelector("#cursor").style.transform=translate(${dets.clientX}px,${dets.clientY}px) scale(${xscale},${yscale});
    });
}

cursor();
cursorshape();

document.querySelectorAll(".ele").forEach(function (ele){
    var rotate= 0;
    var difference = 0;
    ele.addEventListener("mousemove",function(dets){
    var diff = dets.clientY - ele.getBoundingClientRect().top;
    difference = dets.clientX-rotate;
    rotate = dets.clientX;
    gsap.to(ele.querySelector("img"), {
        opacity: 1,
        ease: Power1,
        top: diff,
        left: dets.clientX,
        rotate: gsap.utils.clamp(-10,10,difference),
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchButton').addEventListener('click', function() {
        let productName = document.getElementById('productInput').value;
        if (productName) {
            fetchPrices(productName);
        }
    });

    

    async function fetchPrices(productName) {
        const urls = {
            amazonPrice: `http://127.0.0.1:8000/amazonPrice/${productName}`,
            flipkartPrice: `http://127.0.0.1:8000/flipkartPrice/${productName}`,
            indiamartPrice: `http://127.0.0.1:8000/indiamartPrice/${productName}`,
            gemPrice: `http://127.0.0.1:8000/gemPrice/${productName}`
        };

        for (const [key, url] of Object.entries(urls)) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productName: productName })
                });
                const data = await response.json();
                displayData(key, data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    function displayData(source, data) {
        let card = document.getElementById(`${source}Card`);
        console.log(card);
        card.innerHTML = `<h2>${source.replace('Price', '')}</h2>`; // Reset card and add title

        // Custom formatting for each source
        if (source === 'amazonPrice') {
            data.forEach(item => {
                card.innerHTML += `<p>Title: ${item.Title}<br>Price: ${item.Price}<br>Rating: ${item.Rating}</p>`;
            });
        } else {
            card.innerHTML += `<p>Product Name: ${data.productName}<br>Price: ${data.productPrice || data.lowestPrice}</p>`;
        }
    }

    document.getElementById('chatSubmit').addEventListener('click', function() {
        let message = document.getElementById('chatInput').value;
        if (message) {
            sendChatMessage(message);
        }
    });

    async function sendChatMessage(message) {
        const url = `http://127.0.0.1:8000/chatbot`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            const data = await response.json();
            displayChatResponse(data);
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    }

    function displayChatResponse(data) {
        let responseDiv = document.getElementById('chatResponse');
        responseDiv.innerHTML = `<p><strong>User:</strong> ${data.message}</p><p><strong>Response:</strong> ${data.response}</p>`;
    }

    document.getElementById('increaseSize').addEventListener('click', function() {
        resizeChatModule(20); // Increase size by 20px
    });

    document.getElementById('decreaseSize').addEventListener('click', function() { // Corrected ID
        resizeChatModule(-20);
    });

    function resizeChatModule(change) {
        let chatModule = document.querySelector('.chat-module');
        let currentHeight = chatModule.offsetHeight;
        let currentWidth = chatModule.offsetWidth;
        
        let newHeight = currentHeight + change;
        let newWidth = currentWidth + change;
    
        // Ensure the chat module does not go below minimum dimensions
        newHeight = Math.max(newHeight, 100); // Minimum height: 100px
        newWidth = Math.max(newWidth, 200); // Minimum width: 200px
    
        chatModule.style.height = `${newHeight}px`;
        chatModule.style.width = `${newWidth}px`;
    }    
});