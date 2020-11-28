import tkinter


class Program:
    def __init__(self):
        win = tkinter.Tk()
        self.canvas = tkinter.Canvas(master=win, height=540, width=960, bg='grey')

        self.main_menu_bg_pictures = tkinter.PhotoImage(file=f"textures/background/1.png")
        self.hero_idle_right_pictures = [tkinter.PhotoImage(file=f"textures/hero/hero_idle_small/{i}.png") for i in range(0, 10)]

        self.canvas.pack()
        MainMenu(self.canvas, self.main_menu_bg_pictures, self.hero_idle_right_pictures)
        win.mainloop()


class MainMenu:
    def __init__(self, canvas: tkinter.Canvas, main_menu_bg_pictures, hero_idle_pictures):
        self.canvas = canvas
        self.main_menu_bg_pictures = main_menu_bg_pictures

        self.hero_idle_pictures = hero_idle_pictures

        self.background_image = self.canvas.create_image(480, 270, image=self.main_menu_bg_pictures)
        self.hero_image = self.canvas.create_image(360, 480, image=self.hero_idle_pictures[0])

        self.hero_image_counter = 0

        self.background_hero_animation()

    def background_hero_animation(self):
        self.canvas.itemconfig(self.hero_image, image=self.hero_idle_pictures[self.hero_image_counter])
        self.hero_image_counter += 1
        if self.hero_image_counter == len(self.hero_idle_pictures):
            self.hero_image_counter = 0
        self.canvas.after(300, self.background_hero_animation)
