import React from "react";

interface MenuProps{
    backgroundPicture:any;
    menuButtonsNormalPictures:any;
    menuButtonsFilledPictures:any;
    heroBackgroundPictures:any;
    toggleMenu:any;
}

export class Menu extends React.Component<MenuProps,any> {
    mainMenuButtonsOrder = ["start", "editor", "load"]

    backgroundPicture: any;
    menuButtonsNormalPictures: any;
    menuButtonsFilledPictures: any;
    heroBackgroundPictures: any;
    heroInterval: any;
    imagesObjects: any = {};
    heroObject: any;
    heroObjCount: number;
    toggleMenu:any;

    constructor(props: any) {
        super(props);
        this.state = {
            gameMap: []
        };

        this.backgroundPicture = this.props.backgroundPicture;
        this.menuButtonsNormalPictures = this.props.menuButtonsNormalPictures;
        this.menuButtonsFilledPictures = this.props.menuButtonsFilledPictures;
        this.heroBackgroundPictures = this.props.heroBackgroundPictures;
        this.toggleMenu = this.props.toggleMenu;
        this.heroObjCount = 0;

        this.changeHeroImageOnTick = this.changeHeroImageOnTick.bind(this);
        this.changePoints = this.changePoints.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    componentDidMount() {
        this.heroInterval = setInterval(this.changeHeroImageOnTick, 150);
    }

    componentWillUnmount() {
        clearInterval(this.heroInterval);
    }

    resetGame() {
    }

    changeHeroImageOnTick() {
        this.heroObject.src = this.heroBackgroundPictures[this.heroObjCount].default;

        if (this.heroObjCount === this.heroBackgroundPictures.length - 1) {
            this.heroObjCount = 0;
        } else {
            this.heroObjCount = this.heroObjCount + 1;
        }
    }

    changeImageToFilled(pictureName: string) {
        this.imagesObjects[pictureName].src = this.menuButtonsFilledPictures[pictureName].default;
    }

    changeImageToNormal(pictureName: string) {
        this.imagesObjects[pictureName].src = this.menuButtonsNormalPictures[pictureName].default;
    }

    buttonClickAction(pictureName:string) {
        switch (pictureName){
            case "start":
                this.props.toggleMenu()
        }

    }

    changePoints() {
    }

    render() {
        return (
            <div className={"background_menu_properties"}>
                <img className={"background_image_properties"} src={this.backgroundPicture.default}
                     alt={"background_image"}/>
                <div className={"menu_buttons_properties"}>
                    {this.mainMenuButtonsOrder.map((pictureName: string) => (
                        <img onClick={() => this.buttonClickAction(pictureName)}
                             onMouseOutCapture={() => this.changeImageToNormal(pictureName)}
                             onMouseOverCapture={() => this.changeImageToFilled(pictureName)}
                             ref={imageObject => this.imagesObjects[pictureName] = imageObject}
                             key={"button_images" + pictureName} className={"menu_button_properties"}
                             src={this.menuButtonsNormalPictures[pictureName].default} alt={"background_image"}/>
                    ))}
                </div>
                <img ref={heroImage => this.heroObject = heroImage} className={"hero_background_image_properties"}
                     src={this.heroBackgroundPictures[0].default} alt={"background_image"}/>
            </div>
        );
    }
}
