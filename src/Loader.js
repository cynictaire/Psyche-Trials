import init from './Main.js';
import {loadImages} from './Helpers.js';

const imageSources = {
        titleScreen: 'images/title.png',
        scene1: 'images/scene1.png',
        scene2: 'images/scene2.png',
        scene3: 'images/scene3.png',
        scene4: 'images/scene4.png',
    
        levelEnd: 'images/level.png',
        winScreen: 'images/win.png',
        failScreen: 'images/failed.png',
    
        //level 1
        barley: 'images/barley.png',
        leaf: 'images/leaf.png',
        dried: 'images/dried.png',
    
        //level 2
        golden: 'images/golden.png',
        sheep: 'images/sheep.png',
    
        //level 3
        vase: 'images/vase.png',
        fire: 'images/fire.png',
    
        //level 4 
        muffin: 'images/muffin.png',
        poma: 'images/poma.png',
    
        //level 5
        good: 'images/goodarrow.png',
        broken: 'images/brokenarrow.png',
};

// loadImages(imageSourcesObject,callback);
loadImages(imageSources,startGame);


function startGame(imageData){
	init(imageData);
}
