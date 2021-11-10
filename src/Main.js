import {getMouse,getRandomUnitVector} from './Utilities.js';
import {createImageSprites} from './Helpers.js';
export default init;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const screenWidth = 1000;
const screenHeight = 800;
const maxLevel = 5;
const maxScore = 18;

// fake enum
const GameState = Object.freeze({
    START:   	Symbol("START"),
    SCENE1:     Symbol("SCENE1"),
    SCENE2:     Symbol("SCENE2"),
    SCENE3:     Symbol("SCENE3"),
    SCENE4:     Symbol("SCENE4"),
    SCENE5:     Symbol("SCENE5"),
    MAIN:  		Symbol("MAIN"),
    LEVELOVER: 	Symbol("LEVELOVER"),
    GOODEND: 	Symbol("GOODEND"),
    BADEND:     Symbol("BADEND")
});

const MyErrors = Object.freeze({
    drawHUDswitch:  "Invalid value in drawHUD switch",
    mousedownSwitch: "Invalid value in mousedown switch",
    loadLevelSwitch: "Invalid value in loadLevel switch"
});


let gameState = GameState.START;
let imageData;
let sprites = [];
let currentLevel = 1;
let levelScore, levelGoal, levelTarget, levelTimeLimit;
let itemCount;
let vectorChangeProb;
let hitSound, hitWrongSound, winSound, failSound;
let startTime;
let lastTimeRemaining = 0; // time remaining in integer seconds
let displayTime;

function init(argImageData){
	imageData = argImageData;
	loadLevel(currentLevel);
	
	// Load Sounds
	hitSound = new Howl({
		src: ['sounds/hit.wav'],
		volume: 0.2
	});

	hitWrongSound = new Howl({
		src: ['sounds/wrong.wav'],
		volume: 0.1
	});
    
    winSound = new Howl({
        src:['sounds/win.wav'],
        volume: 0.8
    })
    
    failSound = new Howl({
        src:['sounds/fail.wav'],
        volume: 0.8
    })
														
	// hook up events
	canvas.onmousedown = doMousedown;
	loop();
}

function loop(timestamp){
	// schedule a call to loop() in 1/60th of a second
	requestAnimationFrame(loop);
	
	if (!startTime) startTime = timestamp; // this runs only once, when the game starts up
	
	// draw background
    ctx.fillStyle = "#282828";
	ctx.fillRect(0,0,screenWidth,screenHeight);
	
	// draw game sprites
	if (gameState == GameState.MAIN){
		// loop through sprites
		for (let s of sprites){
			// move sprites
			s.move();

			if(s.x <= 0 || s.x >= screenWidth-s.width){
				s.reflectX();
				s.move();
			}

			if(s.y <= 0 || s.y >= screenHeight-s.height){
				s.reflectY();
				s.move();
			}

			if (Math.random() < vectorChangeProb)	s.fwd = getRandomUnitVector();
			// note: getRandomUnitVector() is imported at the top from utilities.js

			// draw sprites
			s.draw(ctx);
		
		} // end for
		displayTime = checkLevelTimer(timestamp);
	} // end if
	
	// draw rest of UI, depending on current gameState
	drawHUD(ctx);
	
} // end loop()

function drawHUD(ctx){
		ctx.save(); 
		
		switch(gameState){
			case GameState.START:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.titleScreen,0,0);
				ctx.restore();
                
                // Draw Text
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"CLICK TO BEGIN!", screenWidth/2, 650, "35pt 'Concert One', cursive", "black");
                fillText(ctx,"CLICK TO BEGIN!", screenWidth/2, 650, "35pt 'Concert One', cursive", "black");
                fillText(ctx,"AIDEN THINN", 100, 10, "7pt 'Press Start 2P', cursive", "black");
				break;
                
            case GameState.SCENE1:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.scene1,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"A long time ago, in a far away land, there was once a princess who was so beautiful,", 930, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"her kingdom chooses to worship her instead of Venus, the goddess of love. Her name was", 945, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Psyche.", 102, 720, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click to continue...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				break;
                
            case GameState.SCENE2:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.scene2,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"To punish Psyche for her beauty, Venus sent Cupid to make the princess' life miserable.", 955, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"The kingdom mourned as Psyche was sent to marry a horrifying serpant, who unbeknownst to", 965, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"everyone was Cupid in disguise.", 360, 720, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click to continue...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				break;
                
            case GameState.SCENE3:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.scene3,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"Though Psyche lived isolation with a husband she was forbidden from ever seeing, she lived", 975, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"in the lap of luxury. Thus, her envious sisters tricked Psyche to look upon her husband's", 965, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"face during the night... Instead of a monster, she saw Cupid, the god of desire.", 870, 720, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click to continue...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				break;
                
            case GameState.SCENE4:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.scene4,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"Cupid awoken from his slumber and was engraged to find the promise has been broken. He", 935, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"flew out of the palace, leaving the heartbroken and guilt-ridden Psyche behind.", 865, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Psyche began to wander aimlessly, trying to find ways to meet Cupid again.", 810, 720, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click to continue...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				break;
                
            case GameState.SCENE5:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.levelEnd,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"Venus mocked Psyche for her failure to keep Cupid with her, but said she would reunite", 945, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Cupid with her, if she can complete trials assigned to her by Venus. For the first ", 900, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"trial, Psyche must collect 5 golden barley, and avoid leaves and dried flowers.", 860, 720, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click to begin...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				break;
                
			case GameState.MAIN:
				// draw score
				// fillText(string, x, y, css, color)
				fillText(ctx,`ITEM COLLECTED: ${levelScore}`, 10, 20, "14pt courier", "white");
				fillText(ctx,`TRIAL: ${currentLevel}`, screenWidth - 110, 20, "14pt courier", "white");
				fillText(ctx,`GOAL: ${levelGoal} ITEMS`, screenWidth - 180, screenHeight - 20, "14pt courier", "white");
				// draw level timer
				let displayColor = "white";           // normal color is white
				if (displayTime < 0) displayTime = 0; // don't display negative time remaining
				if (displayTime <= 3) displayColor = "yellow"; // "warning - running out of time" color
				if (displayTime == 0) displayColor = "red"  // "out of time and losing points!" color
				fillText(ctx,`TIME REMAINING: ${displayTime}`, 10, screenHeight - 20, "14pt courier", displayColor);
				break;
			
			case GameState.LEVELOVER:
                switch(currentLevel){
                    case 1:
                        ctx.save();
                        // Draw background
				        ctx.drawImage(imageData.levelEnd,0,0);
				        ctx.restore();
			
				        // Draw Text
				        ctx.textAlign = "right";
				        ctx.textBaseline = "middle";
				        // Dialogue
				        fillText(ctx,"'I guess you are not that stupid after all,' Venus said as she counted the barley,", 905, 650, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"then smirked haughtily. 'Now, go fetch the golden wool for me,' she grinned. For", 880, 685, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"the second trial, Psyche must sneak pass the guarding sheeps, and collect 6 golden wool.", 965, 720, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"Click to begin...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				        break;
                        
                    case 2:
                        ctx.save();
                        // Draw background
				        ctx.drawImage(imageData.levelEnd,0,0);
				        ctx.restore();
			
				        // Draw Text
				        ctx.textAlign = "right";
				        ctx.textBaseline = "middle";
				        // Dialogue
				        fillText(ctx,"'Not bad...But not good enough,' Venus scoffed and tossed the golden wool aside.'Now take", 970, 650, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"this vase and collect the water from Styx for me. Be careful, there is a dragon!' For", 935, 685, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"the third trial, Psyche must collect all vases containing black water, and avoid the fire.", 975, 720, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"Click to begin...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				        break;
                        
                    case 3:
                        ctx.save();
                        // Draw background
				        ctx.drawImage(imageData.levelEnd,0,0);
				        ctx.restore();
			
				        // Draw Text
				        ctx.textAlign = "right";
				        ctx.textBaseline = "middle";
				        // Dialogue
				        fillText(ctx,"'She lives!' Venus said with an amused yet cruel smile. 'For your last trial, go to the", 950, 650, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"underworld and grab Proserpina's beauty. Do be cautious, Cerberus bites!' Psyche must", 940, 685, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"sneak pass Cerberus by offering him muffins. Be sure to avoid pomegranate seeds!", 875, 720, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"Click to begin...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				        break;
                        
                    case 4:
                        ctx.save();
                        // Draw background
				        ctx.drawImage(imageData.levelEnd,0,0);
				        ctx.restore();
			
				        // Draw Text
				        ctx.textAlign = "right";
				        ctx.textBaseline = "middle";
				        // Dialogue
				        fillText(ctx,"'Oh...Did I say it was your last task?' Venus smiled. 'Here is one more.' For the final", 950, 650, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"trial, Psyche must collect all the Cupid's arrows, avoid the broken ones!", 810, 685, "8pt 'Press Start 2P', cursive", "black");
                        fillText(ctx,"Click to begin...", 915, 760, "7pt 'Press Start 2P', cursive", "black");
				        break;
                    
                    default:
			         throw new Error(MyErrors.drawHUDswitch);
                }
                break;
			
			case GameState.GOODEND:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.winScreen,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"Psyche completed all her trials successfully, and reunite with Cupid once again! All the", 960, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"gods and goddesses get together as they all celebrate the reunion between the two lovers.", 970, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click anywhere to begin the journey once again!", 750, 720, "8pt 'Press Start 2P', cursive", "black");
				break;
                
            case GameState.BADEND:
                ctx.save();
                // Draw background
				ctx.drawImage(imageData.failScreen,0,0);
				ctx.restore();
			
				// Draw Text
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";
				// Dialogue
				fillText(ctx,"After failing her trials, Psyche continues to wander aimlessly into the world...Hoping", 955, 650, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"to meet Cupid one day, but that wish will never be fulfilled.", 675, 685, "8pt 'Press Start 2P', cursive", "black");
                fillText(ctx,"Click anywhere to start over...", 650, 750, "8pt 'Press Start 2P', cursive", "black");
				break;
			
			default:
			throw new Error(MyErrors.drawHUDswitch);
		
		}
		
		ctx.restore();
		
	}
	
function loadLevel(levelNum){
	levelScore = 0;
	itemCount = 0;
	let margin = 50;
	let rect = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*3}
	sprites = [];
	switch(currentLevel){
			case 1:
				// Collect 5 barley, avoid 12 obstacles
				sprites = sprites.concat(	
					createImageSprites(5,60,60,imageData.barley,"item",rect),
					createImageSprites(16,60,60,imageData.leaf,"obstacle",rect),
                    createImageSprites(16,60,60,imageData.dried,"obstacle",rect)
				);
				
				levelGoal = 5;
				levelTarget = "item";
				vectorChangeProb = .005;
				levelTimeLimit = 5;
				break;

			case 2:
				// Collect 6 pieces of golden fleece, avoid 15 regular sheeps
				sprites = sprites.concat(
					createImageSprites(6,60,60,imageData.golden,"item",rect),
					createImageSprites(10,200,200,imageData.sheep,"obstacle",rect),
				);
				levelGoal = 6;
				levelTarget = "item";
				vectorChangeProb = .008;
				levelTimeLimit = 10;
				break;
            
			case 3:
				// Collect 5 vases, avoid 18 fire balls
				sprites = sprites.concat(
					createImageSprites(5,80,80,imageData.vase,"item",rect),
					createImageSprites(30,100,100,imageData.fire,"obstacle",rect),
				);
				levelGoal = 5;
				levelTarget = "item";
				vectorChangeProb = .01;
				levelTimeLimit = 10;
				break;
            
			case 4:
				// Collect 3 cakes, avoid 20 seeds
				sprites = sprites.concat(
					createImageSprites(3,60,60,imageData.muffin,"item",rect),
					createImageSprites(50,50,50,imageData.poma,"obstacle",rect),
				);
				levelGoal = 3;
				levelTarget = "item";
				vectorChangeProb = .01;
				levelTimeLimit = 5;
				break;
            
			case 5:
				// Collect 10 good arrows, avoid 20 broken arrows
				sprites = sprites.concat(
					createImageSprites(10,100,100,imageData.good,"item",rect),
					createImageSprites(15,150,150,imageData.broken,"obstacle",rect),
				);
				levelGoal = 10;
				levelTarget = "item";
				vectorChangeProb = .01;
				levelTimeLimit = 15;
				break;

			default:
			throw new Error(MyErrors.loadLevelSwitch);
	} // end switch

	startTime = performance.now();
}

	
function doMousedown(e){
	//console.log(e);
	let mouse=getMouse(e);
	//console.log(`canvas coordinates: x=${mouse.x} y=${mouse.y}`);

    // change scenes when click the mouse
	switch(gameState){
		case GameState.START:
			gameState = GameState.SCENE1;
			break;
            
        case GameState.SCENE1:
			gameState = GameState.SCENE2;
			break;
            
        case GameState.SCENE2:
			gameState = GameState.SCENE3;
			break;
            
        case GameState.SCENE3:
			gameState = GameState.SCENE4;
			break;
            
        case GameState.SCENE4:
			gameState = GameState.SCENE5;
			break;
            
        case GameState.SCENE5:
			currentLevel = 1;
			levelScore = 0;
			itemCount = 0;
			gameState = GameState.MAIN;
			loadLevel(currentLevel);
			break;

		case GameState.MAIN:
			// loop through the array backwards so we check the sprites that are "on top" first
			for (let i = sprites.length - 1; i >= 0; --i) {
				let s = sprites[i];
				if (s.getRect().containsPoint(mouse)){
					if (s.speed == 0) continue; // don't score the sprite if it's already been clicked
					if (s.type != levelTarget){
						// don't score the sprite if it is the wrong type
						s.speed = 0;
						hitWrongSound.play(); // we will write the sound code later
						sprites = sprites.filter((s) => {
							if(s.type != levelTarget && s.speed == 0) {return false;}
							return true;
						});
						break; // break out of loop so that we only penalize one sprite per click
					}
					s.speed = 0;
                    sprites = sprites.filter((s) => {
				        if(s.type == levelTarget && s.speed == 0) {return false;}
				        return true;
				    });
                    
					itemCount ++;
					levelScore ++;
					hitSound.play(); 
					break; // break out of loop 
				}

				
			} // end for loop
            
            // if item count is the same as level goal, go to next level
            if (itemCount == levelGoal){
				gameState = GameState.LEVELOVER;
			}
            
            // when all levels are completed, game is over
			if (currentLevel >= maxLevel && itemCount == levelGoal){
				gameState = GameState.GOODEND;
                winSound.play();
				break;
			}
			break;

        // reset and advance level
		case GameState.LEVELOVER:	
			currentLevel ++;	
			itemCount = 0;
			levelScore = 0;
			loadLevel(currentLevel);
			gameState = GameState.MAIN;
			break;

        // go back to start
		case GameState.GOODEND:
			gameState = GameState.START;
			break;
        
        // go back to the first trial
        case GameState.BADEND:
			gameState = GameState.SCENE5;
			break;
			
		default:
			throw new Error(MyErrors.mousedownSwitch);
	} // end switch
}

function fillText(ctx, string, x, y, css, color){
	ctx.save();
	ctx.font = css;
	ctx.fillStyle = color;
	ctx.fillText(string, x, y);
	ctx.restore();
}

function strokeText(ctx, string, x, y, css, color, lineWidth){
	ctx.save();
	ctx.font = css;
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.strokeText(string, x, y);
	ctx.restore();
}

function checkLevelTimer(timestamp){
	let elapsedTime = (timestamp - startTime)/1000;
	let timeRemaining = Math.ceil(levelTimeLimit - elapsedTime);
    
    // if time is up, game is over
	if(timeRemaining < 0 && timeRemaining < lastTimeRemaining){
		gameState = GameState.BADEND;
        failSound.play();
	}
	lastTimeRemaining = timeRemaining;
	//let displayTime = timeRemaining;
	return timeRemaining;
}