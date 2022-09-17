var character = document.getElementById("character");
var game = document.getElementById("game");
var interval;
var both = 0;
var counter = 0;    //Keep the count of blocks
var currentBlocks = [];

function moveLeft(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left>0) //Stop from moving outside the game board in the left
    {
        character.style.left = left - 2 + "px";
    }
}
function moveRight(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left<380) //Stop from moving outside the game board in the right
    {
        character.style.left = left + 2 + "px";
    }
}
document.addEventListener("keydown", event => {
    if(both==0)   //If we click both left and right at once, then dont move
    {
        both++;
        if(event.key === "ArrowLeft"){
            interval = setInterval(moveLeft,1);
        }
        if(event.key ==="ArrowRight"){
            interval = setInterval(moveRight,1);
        }
    }
});

//To stop when we unclick 
document.addEventListener("keyup", event => {
    clearInterval(interval);
    both=0;
});

var blocks = setInterval(function()         //Function to create blocks and holes again and again
{
    var blockLast = document.getElementById("block"+(counter-1));
    var holeLast = document.getElementById("hole"+(counter-1));
    if(counter>0){
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }
    if(blockLastTop<400||counter==0){
        var block = document.createElement("div");
        var hole = document.createElement("div");
        block.setAttribute("class", "block");  //class for html to access css
        hole.setAttribute("class", "hole");
        block.setAttribute("id", "block"+counter); //id for html to access js
        hole.setAttribute("id", "hole"+counter);
        block.style.top = blockLastTop + 100 + "px"; //distance between each blocks
        hole.style.top = holeLastTop + 100 + "px";
        var random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";
        game.appendChild(block);
        game.appendChild(hole);
        currentBlocks.push(counter);  //No of blocks = counter value
        counter++;
    }
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    var drop = 0;
    if(characterTop <= 0){
        alert("Game over. Score: "+(counter-9));
        clearInterval(blocks);
        location.reload();
    }
    for(var i = 0; i < currentBlocks.length;i++){
        let current = currentBlocks[i];
        let iblock = document.getElementById("block"+current);
        let ihole = document.getElementById("hole"+current);
        let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));  // parseFloat because we are using 0.5 below
        let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));  // parseFloat because we are using 0.5 below
        iblock.style.top = iblockTop - 0.5 + "px";
        ihole.style.top = iblockTop - 0.5 + "px";
        if(iblockTop < -20)    //Blocks that passed up is removed from the array to reduce memory
        {
            currentBlocks.shift();
            iblock.remove();
            ihole.remove();
        }
        if(iblockTop-20<characterTop && iblockTop>characterTop)     //Increments drop if ball is currently above block after jump
        {
            drop++;
            if(iholeLeft<=characterLeft && iholeLeft+20>=characterLeft)     //Drop is 0 when it is above the hole
            {
                drop = 0;
            }
        }
    }
    if(drop==0)   //If drop is 0, then make ball drop
    {
        if(characterTop < 480)  //If reaches the bottom, then let it not drop out of the game box. Let it stay there
        {
            character.style.top = characterTop + 2 + "px";
        }
    }else           //Else it moves up along with blocks moving up
    {
        character.style.top = characterTop - 0.5 + "px";
    }

},1);