from manim import *
import numpy as np

class MapToGraph(Scene):
    def construct(self):
        # Title
        title = Text("From Maps to Graphs", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait()

        # Create overlapping circles
        circles = VGroup(
            Circle(radius=1.5, color=BLUE).shift(LEFT * 2),
            Circle(radius=1.5, color=RED).shift(RIGHT * 2),
            Circle(radius=1.5, color=GREEN).shift(UP * 1.5 + LEFT * 1)
        )
        
        # Create nodes at intersections
        nodes = VGroup(
            Dot(point=[-1, 0, 0], color=WHITE),
            Dot(point=[1, 0, 0], color=WHITE),
            Dot(point=[0, 1, 0], color=WHITE),
            Dot(point=[0, -1, 0], color=WHITE)
        )
        
        # Create edges
        edges = VGroup(
            Line(nodes[0].get_center(), nodes[1].get_center(), color=WHITE),
            Line(nodes[0].get_center(), nodes[2].get_center(), color=WHITE),
            Line(nodes[1].get_center(), nodes[2].get_center(), color=WHITE),
            Line(nodes[0].get_center(), nodes[3].get_center(), color=WHITE),
            Line(nodes[1].get_center(), nodes[3].get_center(), color=WHITE)
        )

        # Animate circles
        self.play(Create(circles))
        self.wait()
        
        # Transform to graph
        self.play(
            FadeOut(circles),
            Create(nodes),
            Create(edges)
        )
        self.wait(2)

class ColoringTheGraph(Scene):
    def construct(self):
        # Title
        title = Text("Coloring the Graph", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait()

        # Create graph
        nodes = VGroup(
            Dot(point=[-2, 0, 0], color=WHITE),
            Dot(point=[0, 2, 0], color=WHITE),
            Dot(point=[2, 0, 0], color=WHITE),
            Dot(point=[0, -2, 0], color=WHITE)
        )
        
        edges = VGroup(
            Line(nodes[0].get_center(), nodes[1].get_center(), color=WHITE),
            Line(nodes[1].get_center(), nodes[2].get_center(), color=WHITE),
            Line(nodes[2].get_center(), nodes[3].get_center(), color=WHITE),
            Line(nodes[3].get_center(), nodes[0].get_center(), color=WHITE),
            Line(nodes[0].get_center(), nodes[2].get_center(), color=WHITE)
        )

        # Show graph
        self.play(Create(nodes), Create(edges))
        self.wait()

        # Color nodes
        colors = [RED, BLUE, GREEN, YELLOW]
        for i, node in enumerate(nodes):
            self.play(
                node.animate.set_color(colors[i]),
                run_time=0.5
            )
            self.wait(0.5)

        self.wait(2)

class PlanarVsNonPlanar(Scene):
    def construct(self):
        # Title
        title = Text("Planar vs Non-Planar Graphs", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait()

        # Create planar graph (K4)
        planar_nodes = VGroup(
            Dot(point=[-2, 0, 0], color=WHITE),
            Dot(point=[0, 2, 0], color=WHITE),
            Dot(point=[2, 0, 0], color=WHITE),
            Dot(point=[0, -2, 0], color=WHITE)
        )
        
        planar_edges = VGroup(
            Line(planar_nodes[0].get_center(), planar_nodes[1].get_center(), color=WHITE),
            Line(planar_nodes[1].get_center(), planar_nodes[2].get_center(), color=WHITE),
            Line(planar_nodes[2].get_center(), planar_nodes[3].get_center(), color=WHITE),
            Line(planar_nodes[3].get_center(), planar_nodes[0].get_center(), color=WHITE),
            Line(planar_nodes[0].get_center(), planar_nodes[2].get_center(), color=WHITE),
            Line(planar_nodes[1].get_center(), planar_nodes[3].get_center(), color=WHITE)
        )

        # Create non-planar graph (K5)
        nonplanar_nodes = VGroup(
            Dot(point=[-2, 0, 0], color=WHITE),
            Dot(point=[0, 2, 0], color=WHITE),
            Dot(point=[2, 0, 0], color=WHITE),
            Dot(point=[0, -2, 0], color=WHITE),
            Dot(point=[0, 0, 0], color=WHITE)
        )
        
        nonplanar_edges = VGroup()
        for i in range(5):
            for j in range(i+1, 5):
                nonplanar_edges.add(Line(
                    nonplanar_nodes[i].get_center(),
                    nonplanar_nodes[j].get_center(),
                    color=WHITE
                ))

        # Show planar graph
        planar_label = Text("Planar Graph (K4)", font_size=36)
        planar_label.next_to(planar_nodes, DOWN)
        self.play(
            Create(planar_nodes),
            Create(planar_edges),
            Write(planar_label)
        )
        self.wait()

        # Transform to non-planar graph
        nonplanar_label = Text("Non-Planar Graph (K5)", font_size=36)
        nonplanar_label.next_to(nonplanar_nodes, DOWN)
        self.play(
            Transform(planar_nodes, nonplanar_nodes),
            Transform(planar_edges, nonplanar_edges),
            Transform(planar_label, nonplanar_label)
        )
        self.wait(2)

class FourColorTheorem(Scene):
    def construct(self):
        # Title
        title = Text("The Four Color Theorem", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait()

        # Create complex graph
        nodes = VGroup()
        edges = VGroup()
        
        # Create nodes in a circular pattern
        num_nodes = 8
        for i in range(num_nodes):
            angle = i * TAU / num_nodes
            node = Dot(
                point=[2 * np.cos(angle), 2 * np.sin(angle), 0],
                color=WHITE
            )
            nodes.add(node)

        # Create edges
        for i in range(num_nodes):
            for j in range(i+1, num_nodes):
                if (i - j) % num_nodes not in [1, num_nodes-1, num_nodes//2]:
                    edges.add(Line(
                        nodes[i].get_center(),
                        nodes[j].get_center(),
                        color=WHITE
                    ))

        # Show graph
        self.play(Create(nodes), Create(edges))
        self.wait()

        # Color nodes
        colors = [RED, BLUE, GREEN, YELLOW]
        for i, node in enumerate(nodes):
            self.play(
                node.animate.set_color(colors[i % 4]),
                run_time=0.3
            )
            self.wait(0.2)

        # Add theorem text
        theorem = Text(
            "Any planar graph can be colored\nusing at most four colors",
            font_size=36
        )
        theorem.to_edge(DOWN)
        self.play(Write(theorem))
        self.wait(2)

class FullGraphColoringVideo(Scene):
    def construct(self):
        # Create a title for the full video
        main_title = Text("Graph Coloring and the Four Color Theorem", font_size=48)
        main_title.to_edge(UP)
        self.play(Write(main_title))
        self.wait()
        self.play(FadeOut(main_title))
        
        # Run MapToGraph scene
        map_to_graph = MapToGraph()
        map_to_graph.construct()
        self.clear()
        
        # Run ColoringTheGraph scene
        coloring = ColoringTheGraph()
        coloring.construct()
        self.clear()
        
        # Run PlanarVsNonPlanar scene
        planar = PlanarVsNonPlanar()
        planar.construct()
        self.clear()
        
        # Run FourColorTheorem scene
        theorem = FourColorTheorem()
        theorem.construct() 