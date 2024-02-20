const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

function cursor(){
    window.addEventListener("mousemove",function(dets)){
        console.log(dets);
    }

}

cursor();