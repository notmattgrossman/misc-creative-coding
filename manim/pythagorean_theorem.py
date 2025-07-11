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
config.output_file = "pythagorean_theorem_video"

class PythagoreanIntro(Scene):
    def construct(self):
        # Title
        title = Text("The Pythagorean Theorem", font_size=48)
        subtitle = Text("a² + b² = c²", font_size=36, color=YELLOW).next_to(title, DOWN)
        
        self.play(Write(title))
        self.wait(0.5)
        self.play(Write(subtitle))
        self.wait(1)
        
        # Create a right triangle
        triangle = Triangle(color=WHITE)
        triangle.set_height(3)
        triangle.move_to(ORIGIN)
        
        # Label the sides
        a_label = MathTex("a").next_to(triangle, DOWN)
        b_label = MathTex("b").next_to(triangle, LEFT)
        c_label = MathTex("c").next_to(triangle, UP + RIGHT)
        
        self.play(
            FadeOut(title),
            FadeOut(subtitle),
            Create(triangle),
            Write(a_label),
            Write(b_label),
            Write(c_label)
        )
        self.wait(1)
        
        # Show the formula with the triangle
        formula = MathTex("a^2 + b^2 = c^2").to_edge(DOWN)
        self.play(Write(formula))
        self.wait(1)
        
        # Fade out everything
        self.play(
            FadeOut(triangle),
            FadeOut(a_label),
            FadeOut(b_label),
            FadeOut(c_label),
            FadeOut(formula)
        )

class VisualProof(Scene):
    def construct(self):
        # Create a right triangle
        triangle = Triangle(color=WHITE)
        triangle.set_height(3)
        triangle.move_to(ORIGIN)
        
        # Create squares on each side
        a_square = Square(side_length=triangle.get_height()*0.8, color=RED)
        b_square = Square(side_length=triangle.get_height()*0.6, color=BLUE)
        c_square = Square(side_length=triangle.get_height(), color=GREEN)
        
        # Position squares
        a_square.next_to(triangle, RIGHT)
        b_square.next_to(triangle, DOWN)
        c_square.move_to(triangle.get_center())
        c_square.rotate(triangle.get_angle())
        
        # Add area labels
        a2_label = MathTex("a^2", color=RED).move_to(a_square.get_center())
        b2_label = MathTex("b^2", color=BLUE).move_to(b_square.get_center())
        c2_label = MathTex("c^2", color=GREEN).move_to(c_square.get_center())
        
        # Animate everything
        self.play(Create(triangle))
        self.wait(0.5)
        
        self.play(
            Create(a_square),
            Create(b_square),
            Write(a2_label),
            Write(b2_label)
        )
        self.wait(0.5)
        
        self.play(
            Create(c_square),
            Write(c2_label)
        )
        self.wait(1)
        
        # Show the equation
        equation = MathTex("a^2 + b^2 = c^2").to_edge(DOWN)
        self.play(Write(equation))
        self.wait(1)
        
        # Fade out everything
        self.play(
            FadeOut(triangle),
            FadeOut(a_square),
            FadeOut(b_square),
            FadeOut(c_square),
            FadeOut(a2_label),
            FadeOut(b2_label),
            FadeOut(c2_label),
            FadeOut(equation)
        )

class InteractiveProof(Scene):
    def construct(self):
        # Create a right triangle
        triangle = Triangle(color=WHITE)
        triangle.set_height(3)
        triangle.move_to(ORIGIN)
        
        # Create squares on each side
        a_square = Square(side_length=triangle.get_height()*0.8, color=RED)
        b_square = Square(side_length=triangle.get_height()*0.6, color=BLUE)
        c_square = Square(side_length=triangle.get_height(), color=GREEN)
        
        # Position squares
        a_square.next_to(triangle, RIGHT)
        b_square.next_to(triangle, DOWN)
        c_square.move_to(triangle.get_center())
        c_square.rotate(triangle.get_angle())
        
        # Create pieces to move
        pieces = VGroup(*[Square(side_length=0.5, color=YELLOW) for _ in range(4)])
        pieces.arrange_in_grid(2, 2)
        pieces.move_to(a_square.get_center())
        
        # Animate everything
        self.play(Create(triangle))
        self.wait(0.5)
        
        self.play(
            Create(a_square),
            Create(b_square),
            Create(c_square)
        )
        self.wait(0.5)
        
        # Move pieces to fill c_square
        self.play(
            pieces.animate.move_to(c_square.get_center())
        )
        self.wait(1)
        
        # Fade out everything
        self.play(
            FadeOut(triangle),
            FadeOut(a_square),
            FadeOut(b_square),
            FadeOut(c_square),
            FadeOut(pieces)
        )

class RealWorldExample(Scene):
    def construct(self):
        # Create a house
        house = VGroup()
        
        # Base
        base = Rectangle(height=2, width=3, color=WHITE)
        
        # Roof
        roof = Triangle(color=RED)
        roof.set_height(1.5)
        roof.move_to(base.get_top() + UP*0.75)
        
        # Door
        door = Rectangle(height=1, width=0.5, color=BLUE)
        door.move_to(base.get_bottom() + UP*0.5)
        
        # Window
        window = Square(side_length=0.5, color=YELLOW)
        window.move_to(base.get_center() + RIGHT)
        
        house.add(base, roof, door, window)
        
        # Create a ladder
        ladder = Line(
            start=house.get_bottom() + DOWN*2 + LEFT*2,
            end=house.get_top() + RIGHT*2,
            color=GREEN
        )
        
        # Add measurements
        height = MathTex("12\\text{ ft}").next_to(ladder, LEFT)
        base = MathTex("5\\text{ ft}").next_to(ladder, DOWN)
        ladder_length = MathTex("13\\text{ ft}").next_to(ladder, UP + RIGHT)
        
        # Animate everything
        self.play(Create(house))
        self.wait(0.5)
        
        self.play(
            Create(ladder),
            Write(height),
            Write(base),
            Write(ladder_length)
        )
        self.wait(0.5)
        
        # Show the calculation
        calc = MathTex("5^2 + 12^2 = 13^2").to_edge(DOWN)
        self.play(Write(calc))
        self.wait(1)
        
        # Fade out everything
        self.play(
            FadeOut(house),
            FadeOut(ladder),
            FadeOut(height),
            FadeOut(base),
            FadeOut(ladder_length),
            FadeOut(calc)
        )

class PythagoreanSummary(Scene):
    def construct(self):
        # Create a right triangle
        triangle = Triangle(color=WHITE)
        triangle.set_height(3)
        triangle.move_to(ORIGIN)
        
        # Add labels
        a_label = MathTex("a").next_to(triangle, DOWN)
        b_label = MathTex("b").next_to(triangle, LEFT)
        c_label = MathTex("c").next_to(triangle, UP + RIGHT)
        
        # Show the formula
        formula = MathTex("a^2 + b^2 = c^2").to_edge(DOWN)
        
        # Animate everything
        self.play(Create(triangle))
        self.wait(0.5)
        
        self.play(
            Write(a_label),
            Write(b_label),
            Write(c_label)
        )
        self.wait(0.5)
        
        self.play(Write(formula))
        self.wait(1)
        
        # Add applications
        applications = Text(
            "Applications:\n• Architecture\n• Navigation\n• Physics\n• Engineering",
            font_size=24
        ).to_edge(RIGHT)
        
        self.play(Write(applications))
        self.wait(1)
        
        # Fade out everything
        self.play(
            FadeOut(triangle),
            FadeOut(a_label),
            FadeOut(b_label),
            FadeOut(c_label),
            FadeOut(formula),
            FadeOut(applications)
        )

class FullPythagoreanVideo(Scene):
    def construct(self):
        # Create a title for the full video
        main_title = Text("The Pythagorean Theorem", font_size=48)
        main_title.to_edge(UP)
        self.play(Write(main_title))
        self.wait()
        self.play(FadeOut(main_title))
        
        # Run all scenes in sequence
        scenes = [
            PythagoreanIntro(),
            VisualProof(),
            InteractiveProof(),
            RealWorldExample(),
            PythagoreanSummary()
        ]
        
        for scene in scenes:
            scene.construct()
            self.clear() 