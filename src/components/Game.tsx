import React from "react";
import {Menu} from "./Menu";
import {
    BACKGROUND_IMAGES, ENVIRONMENT_PICTURES,
    HERO_BACKGROUND_PICTURES,
    MENU_BUTTON_FILLED_PICTURES,
    MENU_BUTTON_NORMAL_PICTURES
} from "../const/images";
import {Level} from "./Level";
import {CustomTypes} from "../const/types";

export class Game extends React.Component<any,any>{
    pictures:any;
    interval:any;
    backgroundPicture:any = BACKGROUND_IMAGES;
    menuButtonsNormalPictures:any = MENU_BUTTON_NORMAL_PICTURES;
    menuButtonsFilledPictures:any = MENU_BUTTON_FILLED_PICTURES;
    heroBackgroundPictures:any = HERO_BACKGROUND_PICTURES;
    environmentPictures:any = ENVIRONMENT_PICTURES;
    playerPictures:any = HERO_BACKGROUND_PICTURES;
    gameMap:any;
    playerPosition: CustomTypes.Point;


    constructor(props:any) {
        super(props);
        this.state = {
            menuToggled: true
        };
        this.gameMap = [
            ["1","1","1","1","1","1","1","1","1","1","1","1"],
            ["1","0","0","0","0","0","0","0","0","0","0","1"],
            ["1","0","0","0","0","0","0","0","0","0","0","1"],
            ["1","0","0","0","0","0","0","0","0","0","0","1"],
            ["1","0","0","0","0","0","0","0","0","0","0","1"],
            ["1","0","0","0","0","0","0","0","0","0","0","1"],
            ["1","0","0","0","0","0","0","0","0","0","0","1"],
            ["1","1","1","1","1","1","1","1","1","1","1","1"]];
        this.playerPosition = [3,4]
        this.changePoints = this.changePoints.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    createObjectPictures(path:string,number:Number){
        let array = []
        for(let i=0;i<number;i++){
            let string = path+i+".png";
            array.push(require(string));
        }
        return array;
    }

    toggleMenu(boolean:boolean){
        this.setState({menuToggled:boolean});
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    resetGame(){
    }

    changePoints(){
    }

    render() {
        return (
            <div className={"main_grid"}>
                {this.state.menuToggled ?
                    <Menu backgroundPicture={this.backgroundPicture}
                          heroBackgroundPictures={this.heroBackgroundPictures}
                          menuButtonsFilledPictures={this.menuButtonsFilledPictures}
                          menuButtonsNormalPictures={this.menuButtonsNormalPictures} toggleMenu={this.toggleMenu}/> :
                    <div>
                        <Level blockType={"1"} playerPictures={this.playerPictures} playerPosition={this.playerPosition}
                               environmentPictures={this.environmentPictures} gameMap={this.gameMap} level={"0"}
                               toggleMenu={this.toggleMenu}/>
                    </div>
                }
            </div>
        );
    }
}
