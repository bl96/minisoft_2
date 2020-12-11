import React from "react";

interface LevelProps{
    toggleMenu:any;
}

interface MainState{

}

export class Level extends React.Component<LevelProps,MainState> {

    toggleMenu: any;
    level:any;

    constructor(props: any) {
        super(props);
        this.toggleMenu = this.props.toggleMenu;
    }

    componentDidMount() {
        this.focusThis();
    }

    componentDidUpdate(prevProps: Readonly<LevelProps>, prevState: Readonly<MainState>, snapshot?: any) {
        this.focusThis();
    }

    focusThis(){
        this.level.focus();
    }

    render() {
        return (
            <div className={"level_properties"} tabIndex={1} onKeyDown={(e: any) => {
                if (e.key === "Escape") {
                    this.toggleMenu(true);
                }
            }} ref={current => this.level = current}>a</div>
        );
    }
}