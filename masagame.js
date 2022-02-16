let ctx;

//General variable
let canvasWidth = 500;  //doubled background image wiedh
let canvasHeight = 700; //doubled background image wiedh
let i = 0;
let j = 0;
let timerID; //interval function
let timerTP;
let startStopflag = true;
let transParentLevel = 0;

//Hero variable
let masaX = 250;  //main charactor's initial location (vertical)
let masaY = 600;  //main charactor's initial location (horizon)
let masaGo;
let HeroObj;
let heroArr = [];
let bulletSpead = 0;
let bulletX = 0;
let bulletY = 0;

//Enemy variable
let enemyObj;
let enemyArr = [];
let enemyTime = 0;
let enemySpeed = 0;
let numberOfEnemy =0;

//Option
let difficulty = document.getElementById("difficulty");
let point = 0;
let restTime = 50;

//Image

let bgW = 771;
let bgH = 819;

let sourceX = 0;
let sourceEnd = 771;

let bgimage = new Image();
bgimage.src = "background.png";
let heroimage = new Image();
heroimage.src = "herohouse.png";
let enemyimage = new Image();
enemyimage.src = "enemy.png";
let bulletimage = new Image();
bulletimage.src = "santa2.png";
let crashimage = new Image();
crashimage.src = "crashhouse_proto2.png";
let getPoint = new Image();
getPoint.src = "enemygage.png";
let gift = new Image();
gift.src = "christmasgift.png";


// -----------------------------------------------------------

function setUp(){
   ctx = document.getElementById("gameCanvas").getContext("2d");
   titleCall();
   gameStart();
   HeroObj = new HeroAttack(bulletX,bulletY-50);
   heroArr.push(HeroObj);
   
}

function gameStart(){

   addEventListener("keydown",function(){
      if(event.keyCode ==90 ){

         bulletX = masaX;
         bulletY = masaY;

         HeroObj = new HeroAttack(bulletX,bulletY);
         heroArr.push(HeroObj);

      }
   });

   addEventListener("keydown",function(){             
      if(event.keyCode == 32){
         if(startStopflag === true){
         timerID = setInterval(function(){

            ctx.clearRect(0,0,canvasWidth,canvasHeight);

            drawBackground();
            charactorMove(masaX,masaY);
            meter();
            restTime -= 0.01;
            if(restTime.toFixed(1) == 0){
               gameOver();
               return;
            }

            // -------------enemy coming--------------
         
            enemyTime += 1;

            // if(difficulty.value == 1){
            // enemyTime += 5; //adjust the number of enemy per second
            // }else if(difficulty.value == 2){
            //    enemyTime += 10;   //should be even because of %150
            // }else{
            //    enemyTime += 15;  //should be even because of %150
            // }

            // if(enemyTime % 150 === 0){

            if(difficulty.value == 1){
            numberOfEnemy = 150;
            }else if(difficulty.value == 2){
               numberOfEnemy = 90;
            }else if(difficulty.value == 3){
               numberOfEnemy = 30;
            }

            if(enemyTime % numberOfEnemy === 0){
            enemyObj = new EnemyCome(Math.floor(Math.random() * canvasWidth-50),-100);
            enemyArr.push(enemyObj);
            }

            enemySpeed = -3*difficulty.value;

            for(j = 0 ; j < enemyArr.length ; j++){
               enemyArr[j].y = enemyArr[j].y - enemySpeed;
               enemyArr[j].x += Math.cos(restTime*difficulty.value*7);
               enemyArr[j].createEnemy();
            }

           // -------------hero moving---------------

         addEventListener("keydown",function(){
            if(event.keyCode == 39){
               masaGo = 1;
            }else if(event.keyCode == 37){
               masaGo = 2;
            }
         });

         if(masaGo == 1 && masaX < canvasWidth-50){
            masaX += 2;
         }
         if(masaGo == 2 && masaX > 0){
            masaX -= 2; 
         }
         
         // -------------bullet-----------------
                  
         bulletSpead = -3;

         if(heroArr.length === 0){
            return;
         }else{
            
            for(i = 0 ; i < heroArr.length ; i++){
               heroArr[i].y = heroArr[i].y + bulletSpead;
               heroArr[i].bullet();
            }
         }

         
         // -------------attack enemy-----------

         for(i = 0 ; i < heroArr.length ; i++){

            for(j = 0 ; j < enemyArr.length ; j++){
               if(heroArr[i] && enemyArr[j] && (Math.sqrt(Math.pow((heroArr[i].y+27)-(enemyArr[j].y+50),2) + Math.pow((heroArr[i].x+27)-(enemyArr[j].x+50),2)) < 40)){
                  heroArr.splice(i,1);
                  enemyArr.splice(j,1);
                  point += 1;
               }
               
               if(enemyArr[j] && Math.sqrt(Math.pow((masaY+15)-(enemyArr[j].y+50),2) + Math.pow((masaX+15)-(enemyArr[j].x+50),2)) < 40 ){
                  gameOver();
                  transParentLevel = 0;
                  return;
               }
               // }else if(enemyArr[j] && Math.floor(enemyArr[j].y) > 1000){
               //    enemyArr.splice(j,1);
               // }else if(heroArr[i] && heroArr[i].y < -200){
               //    heroArr.splice(i,1);
               // }

            }
         }

         if(point == 10){
            transParentLevel = 0;
            gameClear();
            
         }

      },10);
      startStopflag = false;

      }
   }
   
});
}

let drawBackground = function(){
ctx.save();
ctx.restore();
ctx.drawImage(bgimage,sourceX,0,sourceEnd,bgH,0,0,sourceEnd,bgH);
ctx.drawImage(bgimage,0,0,bgW,bgH,sourceEnd,0,bgW,bgH);
sourceX = (sourceX + 1)%771;
   if(sourceEnd < 2){
      sourceEnd = 771;
      }else{sourceEnd-= 1;
   }
}


let gameClear = function(){
   clearInterval(timerID);
   timerTP = setInterval(function(){
   transParentLevel += 0.05;
   ctx.clearRect(0,0,canvasWidth,canvasHeight);
   ctx.save();
   ctx.globalAlpha = transParentLevel;
   drawBackground();

   ctx.beginPath();
   ctx.font = "50px Arial";
   ctx.textAlign = "center";
   ctx.fillText("Game Clear",canvasWidth/2,canvasHeight/2-200);
   if(transParentLevel > 1){
      ctx.fillText("PressSpaceKey",canvasWidth/2,canvasHeight/2);
   }
   ctx.restore();

},100);

addEventListener("keydown",function(e){
   if(e.keyCode == 32){
      restart();
      setUp();
   }
});

}

let gameOver = function(){
   clearInterval(timerID);
   timerTP = setInterval(function(){
   transParentLevel += 0.05;
   ctx.clearRect(0,0,canvasWidth,canvasHeight); 
   ctx.save();
   ctx.globalAlpha = transParentLevel;
   ctx.drawImage(crashimage,0,0);

   ctx.beginPath();
   ctx.font = "50px Arial";
   ctx.textAlign = "center";
   ctx.fillText("Game Over",canvasWidth/2,canvasHeight/2-200);
    if(transParentLevel > 1){
      ctx.fillText("PressSpaceKey",canvasWidth/2,canvasHeight/2);
   }
   ctx.restore();

},100);

addEventListener("keydown",function(e){
   if(e.keyCode == 32){
      restart();
      setUp();
   }
})

}

function titleCall(){
ctx.clearRect(0,0,canvasWidth,canvasHeight); 

ctx.save();
ctx.beginPath();
ctx.fillStyle = "black";
ctx.fillRect(0,0,500,700);   
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.font = "50px Arial";
ctx.textAlign = "center";
ctx.fillStyle = "white";
ctx.fillText("Game Start",canvasWidth/2,canvasHeight/2);
ctx.fillText("PressSpaceKey",canvasWidth/2,(canvasHeight/2)+60);
ctx.restore();

}

function HeroAttack(x,y){

this.x = x;
this.y = y;

this.bullet=function(){

   ctx.save();
   ctx.beginPath();
   ctx.translate(this.x,this.y);
   ctx.drawImage(bulletimage,0,0);
   // ctx.beginPath();
   // ctx.arc(0,10,10,0,2*Math.PI);
   // ctx.fill();
   // ctx.stroke();
   ctx.restore();
}
}

function charactorMove(masaX,masaY){
   
ctx.save();
ctx.beginPath();
ctx.drawImage(heroimage,masaX,masaY);
// ctx.fillStyle = "blue";
// ctx.arc(masaX,masaY,30,0,2*Math.PI);
// ctx.fill();
ctx.restore();

}

function EnemyCome(x,y){ 

this.x = x;
this.y = y;

this.createEnemy = function(){
   ctx.save();
   ctx.beginPath();
   ctx.drawImage(enemyimage,this.x,this.y);
   ctx.restore();
}

}

function meter(){
ctx.save();
ctx.translate(0,masaY+60);
ctx.globalAlpha = 0.2;
ctx.fillStyle = "cyan";
ctx.fillRect(0,0,canvasWidth,canvasHeight);
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.translate((point) * 25,masaY+60);
ctx.drawImage(getPoint,0,0);
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.translate(250 ,masaY+60);
ctx.drawImage(gift,0,0);
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.translate(290 ,masaY+95);
ctx.font = "20px Gergia";
ctx.fillText(point,0,0);
ctx.restore();

ctx.save();
ctx.beginPath();
ctx.translate(315 ,masaY+95);
ctx.font = "40px Gergia";
ctx.fillText("TIME " + restTime.toFixed(1),0,0);
ctx.restore();

}

function restart(){
   return location.reload();
// clearInterval(timerTP); 
// clearInterval(timerID);
// enemyArr = [];
// heroArr = []; 
// restTime = 50;
// point = 0;
// startStopflag = true;

}

// -----------Download image citation--------------------

// background.png - https://www.uihere.com/free-cliparts/christmas-santa-claus-euclidean-vector-illustration-christmas-town-962168
// herohouse.png - https://illalet.com/christmas-house/
//size (55.56)
// enemy.png - https://www.pngfans.com/middle-3652c51b81e31f25-icon-rusa.html
//size (100.100)
// santa2.png - https://imgbin.com/png/gMaaWwcD/santa-claus-christmas-scalable-graphics-icon-png
//size (30.30)
// crashhouse.png - https://ja.pngtree.com/freepng/earthquake-disaster-house-collapse-hand-painted-house-cartoon-house_3830175.html
// christmasgift.png - http://clipart-library.com/clip-art/christmas-presents-transparent-background-21.htm