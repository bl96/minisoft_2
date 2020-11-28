import tkinter


def create_dictionary_for_images(path, image_list):
    images = {}

    for item in image_list:
        images[item] = tkinter.PhotoImage(file=f"{path}{item}.png")
    return images


def create_list_for_images(path, number_of_images):
    return [tkinter.PhotoImage(file=f"{path}{i}.png") for i in range(0, number_of_images)]


class Program:
    def __init__(self):
        win = tkinter.Tk()
        self.canvas = tkinter.Canvas(master=win, height=540, width=960, bg='grey')

        self.main_menu_bg_pictures = tkinter.PhotoImage(file=f"textures/background/1.png")
        self.main_menu_buttons_normal = create_dictionary_for_images("textures/buttons/menu/normal/",
                                                                     ["close", "editor", "load", "start"])
        self.main_menu_buttons_filled = create_dictionary_for_images("textures/buttons/menu/filled/",
                                                                     ["close", "editor", "load", "start"])
        self.hero_idle_pictures = {"r": create_list_for_images("textures/hero/hero_idle_right/", 11),
                                   "l": create_list_for_images("textures/hero/hero_idle_left/", 11)
                                   }
        self.hero_move_pictures = {"r": create_list_for_images("textures/hero/hero_move_right/", 19),
                                   "l": create_list_for_images("textures/hero/hero_move_left/", 19)
                                   }

        self.canvas.pack()
        MainMenu(self.canvas, self.main_menu_bg_pictures, self.hero_idle_pictures, self.main_menu_buttons_normal,
                 self.main_menu_buttons_filled)
        win.mainloop()


class MainMenu:
    def __init__(self, canvas: tkinter.Canvas, main_menu_bg_pictures, hero_idle_pictures, main_menu_buttons_normal,
                 main_menu_buttons_filled):
        self.canvas = canvas
        self.main_menu_bg_pictures = main_menu_bg_pictures

        self.main_menu_buttons_normal = main_menu_buttons_normal
        self.main_menu_buttons_filled = main_menu_buttons_filled

        self.hero_idle_pictures = hero_idle_pictures

        self.background_image = self.canvas.create_image(480, 270, image=self.main_menu_bg_pictures)
        self.hero_image = self.canvas.create_image(360, 480, image=self.hero_idle_pictures["r"][0])
        self.main_menu_buttons_image = {}

        self.hero_image_counter = 0

        self.background_hero_animation()
        self.create_buttons()

        self.buttons_bind = self.canvas.bind("<Motion>", self.filled_button)
        self.buttons_action_bind = self.canvas.tag_bind("button", "<Button-1>", self.buttons_action)

    def background_hero_animation(self):
        self.canvas.itemconfig(self.hero_image, image=self.hero_idle_pictures["r"][self.hero_image_counter])
        self.hero_image_counter += 1
        if self.hero_image_counter == len(self.hero_idle_pictures["r"]):
            self.hero_image_counter = 0
        self.canvas.after(300, self.background_hero_animation)

    def create_buttons(self):
        y = 50
        for buttonName in ["start", "load", "editor", "close"]:
            self.main_menu_buttons_image[buttonName] = self.canvas.create_image(120, y, image=self.main_menu_buttons_normal[buttonName], tag="button")
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
            return

        if self.is_clicked_button("load"):
            return

        if self.is_clicked_button("editor"):
            return

        if self.is_clicked_button("close"):
            quit()

    def is_clicked_button(self, button):
        return self.canvas.coords("current") == self.canvas.coords(self.main_menu_buttons_image[button])
