import React from "react";
import styled from "@emotion/styled";

interface SquareProps{
    sizeX:string
    sizeY:string
    wallColor:string
    pathColor:string
    environmentPictures:any;
    playerPictures:any;
    type:string;
    isPlayerOn: boolean;
}

interface SquareState{
    isPlayerOn: boolean;
}

export const SquareDiv = styled.div<{ sizeX: string; sizeY: string; color:string}>`
		height: ${p => p.sizeX}px;
		width: ${p => p.sizeY}px;
		background-color:${p => p.color} !important;
	`;

export class Square extends React.Component<SquareProps,SquareState> {
    squareRef: any;
    environmentPictures: any;
    playerPictures:any;
    type: string;

    constructor(props: SquareProps) {
        super(props);

        this.environmentPictures = props.environmentPictures;
        this.playerPictures = props.playerPictures;
        this.type = props.type;

        this.state = {
            isPlayerOn:props.isPlayerOn
        }

    }

    componentDidUpdate(prevProps: Readonly<SquareProps>, prevState: Readonly<SquareState>, snapshot?: any) {
        if(this.props.isPlayerOn !== prevProps.isPlayerOn){
            this.toggleIsPlayerOn();
        }
    }

    toggleIsPlayerOn(){
        this.setState({isPlayerOn:!this.state.isPlayerOn})
    }

    render() {
        return (
            <div>
                <img className={"square_properties"} ref={squareR => this.squareRef = squareR}
                     src={this.environmentPictures[this.type].default} alt={"background_image"}/>
                {(this.state.isPlayerOn) ?
                    <img className={"player-properties"} src={this.playerPictures[0].default}
                         alt={"background_image"}/>:
                    <div/>
                }
            </div>
        );
    }
}