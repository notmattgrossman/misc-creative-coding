from manim import *
import numpy as np

# Configure Manim settings
config.media_dir = "media"
config.video_dir = "videos"
config.images_dir = "images"
config.preview = True
config.quality = "high_quality"
config.save_last_frame = False
config.write_to_movie = True
config.write_all = True
config.output_file = "primitive_roots_video"

class PrimitiveRootsIntro(Scene):
    def construct(self):
        title = Text("Primitive Roots – The Key to Modular Mysteries", font_size=44)
        self.play(Write(title))
        self.wait(1.5)
        self.play(FadeOut(title))
        # Visual: clock, lock, number line
        # Clock: circle with ticks and numbers
        clock = Circle(radius=1.2, color=BLUE).shift(LEFT*3)
        ticks = VGroup(*[Line(
            start=clock.point_at_angle(i*TAU/12),
            end=0.9*clock.point_at_angle(i*TAU/12),
            color=WHITE
        ) for i in range(12)])
        clock_numbers = VGroup(*[Text(str(i if i != 0 else 12), font_size=20).move_to(1.05*clock.point_at_angle(i*TAU/12) + LEFT*3) for i in range(12)])
        # Lock: rectangle + semicircle
        lock_body = RoundedRectangle(width=0.7, height=1, corner_radius=0.2, color=YELLOW).shift(RIGHT*0.2)
        lock_shackle = Arc(radius=0.35, angle=PI, color=YELLOW).shift(UP*0.5 + RIGHT*0.2)
        lock = VGroup(lock_body, lock_shackle).shift(RIGHT*0.5)
        # Network: 4 dots connected by lines
        net_points = [RIGHT*3 + UP*0.5, RIGHT*3 + DOWN*0.5, RIGHT*2.2 + UP*0.8, RIGHT*2.2 + DOWN*0.8]
        net_dots = VGroup(*[Dot(p, color=GREEN) for p in net_points])
        net_lines = VGroup(*[Line(net_points[i], net_points[j], color=GREEN) for i in range(4) for j in range(i+1,4)])
        network = VGroup(net_dots, net_lines)
        number_line = NumberLine(x_range=[0,12,1], length=6).shift(RIGHT*3)
        self.play(FadeIn(clock), FadeIn(ticks), FadeIn(clock_numbers), FadeIn(lock), FadeIn(network), FadeIn(number_line))
        self.wait(1)
        self.play(FadeOut(clock), FadeOut(ticks), FadeOut(clock_numbers), FadeOut(lock), FadeOut(network), FadeOut(number_line))
        phrase = Text("Primitive Root", font_size=48, color=YELLOW)
        self.play(Write(phrase))
        self.wait(1)
        self.play(FadeOut(phrase))

class ModularArithmeticRefresher(Scene):
    def construct(self):
        title = Text("Modular Arithmetic", font_size=40)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        clock = Circle(radius=2, color=BLUE)
        numbers = VGroup(*[Text(str(i)).move_to(2*UP).rotate(i*TAU/12).move_to(2*Circle().point_at_angle(i*TAU/12)) for i in range(12)])
        self.play(Create(clock), *[FadeIn(num) for num in numbers])
        self.wait(0.5)
        # Animate 5 + 10
        five = Text("5", color=YELLOW).move_to(numbers[5].get_center() + DOWN*0.5)
        ten = Text("+10", color=YELLOW).next_to(five, DOWN)
        eq = Text("= 3 (mod 12)", color=GREEN).next_to(ten, DOWN)
        self.play(FadeIn(five), FadeIn(ten))
        self.wait(0.5)
        self.play(Transform(five, numbers[3]), FadeIn(eq))
        self.wait(1.5)
        self.play(FadeOut(clock), *[FadeOut(num) for num in numbers], FadeOut(five), FadeOut(ten), FadeOut(eq))

class WhatIsPrimitiveRoot(Scene):
    def construct(self):
        title = Text("What is a Primitive Root?", font_size=40)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        mod_text = Text("g, g², g³, ..., gᵏ (mod n)", font_size=36)
        self.play(Write(mod_text))
        self.wait(1)
        self.play(FadeOut(mod_text))
        circle = Circle(radius=2, color=WHITE)
        self.play(Create(circle))
        numbers = VGroup(*[Text(str(i)).move_to(2*Circle().point_at_angle(i*TAU/7)) for i in range(1,7)])
        self.play(*[FadeIn(num) for num in numbers])
        self.wait(1)
        self.play(FadeOut(circle), *[FadeOut(num) for num in numbers])

class PrimitiveRootExample(Scene):
    def construct(self):
        title = Text("Example: Primitive Root mod 7", font_size=40)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        circle = Circle(radius=2, color=WHITE)
        self.play(Create(circle))
        numbers = [1,2,3,4,5,6]
        num_mobs = VGroup(*[Text(str(n)).move_to(2*Circle().point_at_angle(i*TAU/6)) for i,n in enumerate(numbers)])
        self.play(*[FadeIn(num) for num in num_mobs])
        # Animate powers of 3
        powers = [3,2,6,4,5,1]
        for i, val in enumerate(powers):
            highlight = SurroundingRectangle(num_mobs[numbers.index(val)], color=YELLOW)
            power_text = Text(f"3^{i+1} ≡ {val} (mod 7)", font_size=32).to_edge(DOWN)
            self.play(Create(highlight), Write(power_text))
            self.wait(0.7)
            self.play(FadeOut(highlight), FadeOut(power_text))
        self.play(FadeOut(circle), *[FadeOut(num) for num in num_mobs])

class NotAllPrimitiveRoots(Scene):
    def construct(self):
        title = Text("Not All Numbers Are Primitive Roots", font_size=36)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        circle = Circle(radius=2, color=WHITE)
        self.play(Create(circle))
        numbers = [1,2,3,4,5,6]
        num_mobs = VGroup(*[Text(str(n)).move_to(2*Circle().point_at_angle(i*TAU/6)) for i,n in enumerate(numbers)])
        self.play(*[FadeIn(num) for num in num_mobs])
        # Animate powers of 2
        powers = [2,4,1]
        for i, val in enumerate(powers):
            highlight = SurroundingRectangle(num_mobs[numbers.index(val)], color=RED)
            power_text = Text(f"2^{i+1} ≡ {val} (mod 7)", font_size=32).to_edge(DOWN)
            self.play(Create(highlight), Write(power_text))
            self.wait(0.7)
            self.play(FadeOut(highlight), FadeOut(power_text))
        missing = VGroup(num_mobs[2], num_mobs[4], num_mobs[5])
        self.play(*[num.animate.set_color(GRAY) for num in missing])
        self.wait(1)
        self.play(FadeOut(circle), *[FadeOut(num) for num in num_mobs])

class PrimitiveRootsImportance(Scene):
    def construct(self):
        title = Text("Why Do Primitive Roots Matter?", font_size=40)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        # Lock: rectangle + semicircle
        lock_body = RoundedRectangle(width=0.7, height=1, corner_radius=0.2, color=YELLOW).shift(LEFT*2)
        lock_shackle = Arc(radius=0.35, angle=PI, color=YELLOW).shift(UP*0.5 + LEFT*2)
        lock = VGroup(lock_body, lock_shackle)
        # Network: 4 dots connected by lines
        net_points = [RIGHT*2 + UP*0.5, RIGHT*2 + DOWN*0.5, RIGHT*1.2 + UP*0.8, RIGHT*1.2 + DOWN*0.8]
        net_dots = VGroup(*[Dot(p, color=GREEN) for p in net_points])
        net_lines = VGroup(*[Line(net_points[i], net_points[j], color=GREEN) for i in range(4) for j in range(i+1,4)])
        network = VGroup(net_dots, net_lines)
        # Formula
        formula = Text("Diffie-Hellman: g^a, g^b", font_size=36).shift(RIGHT*2.5)
        self.play(FadeIn(lock), FadeIn(network), FadeIn(formula))
        self.wait(2)
        self.play(FadeOut(lock), FadeOut(network), FadeOut(formula))

class PrimitiveRootsSummary(Scene):
    def construct(self):
        summary = Text("Primitive roots unlock the full power of modular arithmetic!", font_size=36)
        self.play(Write(summary))
        self.wait(1.5)
        phrase = Text("Primitive Roots", font_size=48, color=YELLOW).next_to(summary, DOWN)
        numbers = VGroup(*[Text(str(i)).move_to(3*Circle().point_at_angle(i*TAU/8)) for i in range(1,8)])
        self.play(Write(phrase), *[FadeIn(num) for num in numbers])
        self.wait(1.5)
        self.play(FadeOut(summary), FadeOut(phrase), *[FadeOut(num) for num in numbers])

class FullPrimitiveRootsVideo(Scene):
    def construct(self):
        # Create a title for the full video
        main_title = Text("Graph Coloring and the Four Color Theorem", font_size=48)
        main_title.to_edge(UP)
        self.play(Write(main_title))
        self.wait()
        self.play(FadeOut(main_title))
        
        # Run all scenes in sequence
        scenes = [
            PrimitiveRootsIntro(),
            ModularArithmeticRefresher(),
            WhatIsPrimitiveRoot(),
            PrimitiveRootExample(),
            NotAllPrimitiveRoots(),
            PrimitiveRootsImportance(),
            PrimitiveRootsSummary()
        ]
        
        for scene in scenes:
            scene.construct()
            self.clear() 