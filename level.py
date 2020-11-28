import tkinter


class Level:
    def __init__(self, canvas: tkinter.Canvas, hero_pictures, tiles_pictures, objects_pictures, file_name=None):
        self.canvas = canvas
        self.canvas.configure(height=self.canvas.winfo_height()+400)

        self.size_of_image = 60

        self.hero_pictures = hero_pictures
        self.tiles_pictures = tiles_pictures
        self.objects_pictures = objects_pictures

        self.file_name = file_name
        self.level_number = None
        self.level_map = []

        self.select_load_level_file()
        self.create_level()

    def select_load_level_file(self):
        if self.file_name is None:
            self.level_number = 0  # must be None when loading custom level (not standard levels)
            return self.load_level_file("0")
        return self.load_level_file(self.file_name)

    def load_level_file(self, file_name):
        with open(f"misc/{file_name}.txt", "r") as file:
            for line in file:
                self.level_map.append(line.strip().split(" "))

    def create_level(self):
        for row_number, row in enumerate(self.level_map):
            for c_number, element_value in enumerate(row):
                if element_value in ["P", "C", "T"]:
                    pass
                else:
                    self.canvas.create_image(c_number * self.size_of_image + self.size_of_image / 2,
                                             row_number * self.size_of_image + self.size_of_image / 2,
                                             image=self.tiles_pictures[element_value])
