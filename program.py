import tkinter
from main_menu import MainMenu


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

        self.tiles_pictures = create_dictionary_for_images("textures/tiles/", ["0", "1"])

        self.flames_pictures = create_list_for_images("textures/flames/", 37)

        self.canvas.pack(fill="both", expand=True)
        MainMenu(self.canvas, self.main_menu_bg_pictures, self.hero_idle_pictures, self.main_menu_buttons_normal,
                 self.main_menu_buttons_filled, self.flames_pictures, self.tiles_pictures)
        win.mainloop()
