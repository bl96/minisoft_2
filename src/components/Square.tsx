import React from "react";
import styled from "@emotion/styled";

interface SquareProps{
    type:string
    sizeX:string
    sizeY:string
    wallColor:string
    pathColor:string
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
    constructor(props: SquareProps) {
        super(props);
        this.state={
            ...props
        }
    }

    render() {
        return (
            <SquareDiv sizeX={this.state.sizeX} sizeY={this.state.sizeX} color={this.state.type==="x"?this.state.wallColor:this.state.pathColor}>

            </SquareDiv>
        );
    }
}