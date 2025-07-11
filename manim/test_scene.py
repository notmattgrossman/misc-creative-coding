from manim import *

class TestScene(Scene):
    def construct(self):
        circle = Circle()
        square = Square()
        
        self.play(Create(circle))
        self.wait()
        self.play(Transform(circle, square))
        self.wait() 