const BACKGROUND_IMAGES = require(process.env.PUBLIC_URL+"../textures/background/1.png");
const MENU_BUTTON_NORMAL_PICTURES = {"editor":require("../textures/buttons/menu/normal/editor.png"),
    "load":require("../textures/buttons/menu/normal/load.png"),
    "start":require("../textures/buttons/menu/normal/start.png")};
const MENU_BUTTON_FILLED_PICTURES = {"editor":require("../textures/buttons/menu/filled/editor.png"),
    "load":require("../textures/buttons/menu/filled/load.png"),
    "start":require("../textures/buttons/menu/filled/start.png")};
const HERO_BACKGROUND_PICTURES = [
    require("../textures/hero/hero_idle_right/0.png"),require("../textures/hero/hero_idle_right/1.png"),require("../textures/hero/hero_idle_right/2.png"),
    require("../textures/hero/hero_idle_right/3.png"),require("../textures/hero/hero_idle_right/4.png"),require("../textures/hero/hero_idle_right/5.png"),
    require("../textures/hero/hero_idle_right/6.png"),require("../textures/hero/hero_idle_right/7.png"),require("../textures/hero/hero_idle_right/8.png"),
    require("../textures/hero/hero_idle_right/9.png"),require("../textures/hero/hero_idle_right/10.png")]
const ENVIRONMENT_PICTURES = {
    "0":require("../textures/tiles/0.png"),"1":require("../textures/tiles/1.png")
}
export {BACKGROUND_IMAGES,MENU_BUTTON_NORMAL_PICTURES,MENU_BUTTON_FILLED_PICTURES,HERO_BACKGROUND_PICTURES,ENVIRONMENT_PICTURES}