import {getRandomUnitVector} from './Utilities.js';
import ImageSprite from './ImageSprite.js';
export {loadImages,createImageSprites};

function loadImages(imageSources,callback) {
	let numImages = Object.keys(imageSources).length
	let numLoadedImages = 0;
	
	// load images
	for(let imageName in imageSources) {
		let img = new Image();
		img.src = imageSources[imageName];
		imageSources[imageName] = img;
		img.onload = function() {
			//console.log("SUCCESS: Image named '" + imageName + "' at " + this.src + " loaded!");
			if(++numLoadedImages >= numImages){
				callback(imageSources);
			}
		}
		img.onerror = function(){
			//console.log("ERROR: image named '" + imageName + "' at " + this.src + " did not load!");
		}
	}
}

function createImageSprites(num=10,width=50,height=50,image,type,rect={left:0,top:0,width:300,height:300}){
	let sprites = [];
	for(let i=0; i < num; i++){
		let s = new ImageSprite(
			Math.random() * rect.width + rect.left,
			Math.random() * rect.height + rect.top,
			getRandomUnitVector(),
			120,
			width,
			height,
			image,
			type);
		sprites.push(s);
	}

	return sprites;
}