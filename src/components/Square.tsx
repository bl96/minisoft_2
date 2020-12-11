import React from "react";
import styled from "@emotion/styled";

interface SquareProps{
    sizeX:string
    sizeY:string
    wallColor:string
    pathColor:string
    environmentPictures:any;
    type:string;
}

interface SquareState{
    type:string
    sizeX:string
    sizeY:string
    wallColor:string
    pathColor:string
}

export const SquareDiv = styled.div<{ sizeX: string; sizeY: string; color:string}>`
		height: ${p => p.sizeX}px;
		width: ${p => p.sizeY}px;
		background-color:${p => p.color} !important;
	`;

export class Square extends React.Component<SquareProps,SquareState> {
    squareRef:any;
    environmentPictures:any;
    type:string;

    constructor(props: SquareProps) {
        super(props);

        this.environmentPictures = this.props.environmentPictures;
        this.type = this.props.type;

        this.state={
            ...props
        }
    }

    render() {
        return (
            <div>
                <img className={"square_properties"} ref={squareR => this.squareRef = squareR}
                     src={this.environmentPictures[this.type].default} alt={"background_image"}/>
            </div>
        );
    }
}