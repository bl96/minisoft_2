import tkinter

from level import Level


class MainMenu:
    def __init__(self, canvas: tkinter.Canvas, main_menu_bg_pictures, hero_idle_pictures, main_menu_buttons_normal,
                 main_menu_buttons_filled, flames_pictures, tiles_pictures):
        self.canvas = canvas
        self.main_menu_bg_pictures = main_menu_bg_pictures

        self.main_menu_buttons_normal = main_menu_buttons_normal
        self.main_menu_buttons_filled = main_menu_buttons_filled

        self.hero_idle_pictures = hero_idle_pictures
        self.flames_pictures = flames_pictures
        self.tiles_pictures = tiles_pictures

        self.background_image = None
        self.hero_image = None
        self.flame_image = None
        self.main_menu_buttons_image = {}
        self.create_images()

        self.hero_image_counter = 0
        self.flame_image_counter = 0

        self.background_hero_animation()
        self.background_flame_animation()

        self.buttons_bind = self.canvas.bind("<Motion>", self.filled_button)
        self.buttons_action_bind = self.canvas.tag_bind("button", "<Button-1>", self.buttons_action)

    def create_images(self):
        self.background_image = self.canvas.create_image(480, 270, image=self.main_menu_bg_pictures)
        self.hero_image = self.canvas.create_image(360, 480, image=self.hero_idle_pictures["r"][0])
        self.flame_image = self.canvas.create_image(475, 193, image=self.flames_pictures[0])
        self.main_menu_buttons_image = {}
        self.create_buttons()

    def background_hero_animation(self):
        self.canvas.itemconfig(self.hero_image, image=self.hero_idle_pictures["r"][self.hero_image_counter])
        self.hero_image_counter += 1
        if self.hero_image_counter == len(self.hero_idle_pictures["r"]):
            self.hero_image_counter = 0
        self.canvas.after(300, self.background_hero_animation)

    def background_flame_animation(self):
        self.canvas.itemconfig(self.flame_image, image=self.flames_pictures[self.flame_image_counter])
        self.flame_image_counter += 1
        if self.flame_image_counter == len(self.flames_pictures):
            self.flame_image_counter = 0
        self.canvas.after(80, self.background_flame_animation)

    def create_buttons(self):
        y = 50
        for buttonName in ["start", "load", "editor", "close"]:
            self.main_menu_buttons_image[buttonName] = self.canvas.create_image(120, y,
                                                                                image=self.main_menu_buttons_normal[
                                                                                    buttonName], tag="button")
            y += 40
        self.canvas.update()

    def filled_button(self, event):
        for buttonsName in self.main_menu_buttons_image.keys():
            if self.main_menu_buttons_image[buttonsName] is not None and self.canvas.coords(
                    self.main_menu_buttons_image[buttonsName]) == self.canvas.coords("current"):
                self.canvas.itemconfig("current", image=self.main_menu_buttons_filled[buttonsName])
            else:
                self.canvas.itemconfig(self.main_menu_buttons_image[buttonsName],
                                       image=self.main_menu_buttons_normal[buttonsName])

    def buttons_action(self, event):
        if self.is_clicked_button("start"):
            self.canvas.delete("all")
            Level(self.canvas, self.hero_idle_pictures, self.tiles_pictures, self.tiles_pictures, self, None)

        if self.is_clicked_button("load"):
            return

        if self.is_clicked_button("editor"):
            return

        if self.is_clicked_button("close"):
            quit()

    def is_clicked_button(self, button):
        return self.canvas.coords("current") == self.canvas.coords(self.main_menu_buttons_image[button])

    def rework_main_menu(self):
        self.canvas.delete("all")
        self.create_images()

