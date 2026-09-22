"""
krishna_sketch.py
-----------------
Hyper-Realistic 3D Charcoal & Pencil Portrait Engine of Lord Krishna.
Features 5-level lead pencil gradation (9B Charcoal to White Highlight Pen),
3D face contour shading, realistic closed lotus eyes, detailed eyelashes,
hyper-realistic hair locks, Pagri turban folds, Mor Pankh barbs, and 3D Bansuri flute.
"""

import turtle
import math
import random
import time
import subprocess
import os

class HyperRealisticKrishnaPortraitEngine:
    def __init__(self):
        # 5-Level Pencil Lead Gradation Palette
        self.THEMES = {
            "CHARCOAL_PENCIL": {
                "name": "Hyper-Realistic 3D Charcoal Sketch",
                "bg": "#0a0a0d",
                "stroke_9b": "#030305",   # Deepest 9B Charcoal
                "stroke_6b": "#28282e",   # 6B Dark Shadow
                "stroke_2b": "#555560",   # 2B Midtone Shading
                "stroke_hb": "#8a8a98",   # HB Light Grain
                "stroke_white": "#ffffff",# White Highlight Pen
                "accent": "#d0d0dc"
            },
            "GOLDEN_CHARCOAL": {
                "name": "Divine Golden Shaded Charcoal",
                "bg": "#080916",
                "stroke_9b": "#0d1b2a",
                "stroke_6b": "#1b263b",
                "stroke_2b": "#415a77",
                "stroke_hb": "#e0a96d",
                "stroke_white": "#ffd700",
                "accent": "#00e5ff"
            }
        }

        self.theme_keys = list(self.THEMES.keys())
        self.current_theme_index = 0
        self.theme = self.THEMES[self.theme_keys[self.current_theme_index]]

        self.is_paused = False
        self.is_drawing = False
        self.mouse_particles = []
        self.mouse_x = 0
        self.mouse_y = 0

    def setup_canvas(self):
        self.screen = turtle.Screen()
        self.screen.setup(width=980, height=980)
        self.screen.title("✨ Lord Krishna - Hyper-Realistic 3D Charcoal Portrait ✨")
        self.screen.bgcolor(self.theme["bg"])
        self.screen.tracer(0)

        # Drawing pens for layered lead shading
        self.pen = turtle.Turtle()
        self.pen.hideturtle()
        self.pen.speed(0)

        self.particle_pen = turtle.Turtle()
        self.particle_pen.hideturtle()
        self.particle_pen.speed(0)

        self.hud_pen = turtle.Turtle()
        self.hud_pen.hideturtle()
        self.hud_pen.speed(0)

        # Mouse & Keyboard Bindings
        canvas = self.screen.getcanvas()
        canvas.bind("<Motion>", self.handle_mouse_move)

        self.screen.listen()
        self.screen.onkey(self.toggle_pause, "space")
        self.screen.onkey(self.restart_sketch, "r")
        self.screen.onkey(self.cycle_theme, "c")
        self.screen.onkey(self.save_hd_screenshot, "s")

    def handle_mouse_move(self, event):
        self.mouse_x = event.x - 490
        self.mouse_y = 490 - event.y

        if random.random() < 0.4:
            self.mouse_particles.append({
                "x": self.mouse_x,
                "y": self.mouse_y,
                "vx": (random.random() - 0.5) * 2,
                "vy": (random.random() - 0.5) * 2,
                "size": random.uniform(2, 4.5),
                "alpha": 1.0,
                "col": self.theme["stroke_white"]
            })
            if len(self.mouse_particles) > 40:
                self.mouse_particles.pop(0)

    def toggle_pause(self):
        self.is_paused = not self.is_paused

    def cycle_theme(self):
        self.current_theme_index = (self.current_theme_index + 1) % len(self.theme_keys)
        self.theme = self.THEMES[self.theme_keys[self.current_theme_index]]
        self.screen.bgcolor(self.theme["bg"])
        self.restart_sketch()

    def restart_sketch(self):
        self.is_drawing = False
        self.pen.clear()
        self.particle_pen.clear()
        self.hud_pen.clear()
        self.screen.update()
        self.run()

    def save_hd_screenshot(self):
        filename = f"krishna_realistic_portrait_{int(time.time())}.ps"
        try:
            canvas = self.screen.getcanvas()
            canvas.postscript(file=filename)
            self.show_toast(f"📸 Image Saved: {filename}")
        except Exception as e:
            print(f"⚠️ Screenshot save error: {e}")

    def show_toast(self, message):
        self.hud_pen.penup()
        self.hud_pen.goto(0, 440)
        self.hud_pen.color(self.theme["stroke_white"])
        self.hud_pen.write(message, align="center", font=("Georgia", 14, "bold"))
        self.screen.update()

    def refresh(self, delay=0.006):
        while self.is_paused:
            self.screen.update()
            time.sleep(0.1)

        self.update_mouse_particles()
        self.screen.update()
        time.sleep(delay)

    def draw_curve(self, points, width=2.0, color="#ffffff"):
        if not points: return
        self.pen.penup()
        self.pen.goto(points[0][0], points[0][1])
        self.pen.color(color)
        self.pen.width(width)
        self.pen.pendown()
        for pt in points[1:]:
            self.pen.goto(pt[0], pt[1])
            self.refresh(0.002)

    def draw_shading_hatch(self, x_start, y_start, w_span, h_span, density=25, angle=40, color="#444444", width=1.0):
        """Generates fine 3D pencil cross-hatching gradient."""
        self.pen.color(color)
        self.pen.width(width)
        rad = math.radians(angle)
        dx = math.cos(rad) * 20
        dy = math.sin(rad) * 20

        for i in range(density):
            px = x_start + (i / density) * w_span
            py = y_start + (i / density) * h_span
            self.pen.penup()
            self.pen.goto(px, py)
            self.pen.pendown()
            self.pen.goto(px + dx, py + dy)
        self.refresh(0.002)

    # --- HYPER-REALISTIC PORTRAIT DRAWING SEQUENCE ---

    def draw_background_atmosphere(self):
        """Scatters fine graphite dust particles in the background."""
        random.seed(2026)
        for _ in range(90):
            x = random.randint(-460, 460)
            y = random.randint(-460, 460)
            size = random.uniform(1, 3)
            col = random.choice([self.theme["stroke_hb"], self.theme["stroke_2b"], self.theme["stroke_white"]])
            self.pen.penup()
            self.pen.goto(x, y)
            self.pen.pendown()
            self.pen.dot(size, col)
        self.refresh(0.02)

    def draw_3d_face_structure(self):
        """Draws realistic 3D face structure, cheekbone volume, jawline, and neck shading."""
        cx, cy = 0, 10

        # 1. Dark Neck & Torso Shadow (9B Charcoal)
        self.pen.penup()
        self.pen.goto(cx - 70, cy - 40)
        self.pen.color(self.theme["stroke_6b"], self.theme["stroke_9b"])
        self.pen.width(2.5)
        self.pen.pendown()
        self.pen.begin_fill()
        self.pen.goto(cx - 95, cy - 140)
        self.pen.goto(cx - 120, cy - 260)
        self.pen.goto(cx + 120, cy - 260)
        self.pen.goto(cx + 95, cy - 140)
        self.pen.goto(cx + 70, cy - 40)
        self.pen.goto(cx - 70, cy - 40)
        self.pen.end_fill()
        self.refresh(0.015)

        # Cross-hatch neck shadow
        self.draw_shading_hatch(cx - 80, cy - 250, 160, 110, density=28, angle=35, color=self.theme["stroke_6b"])

        # 2. 3D Face Contour Fill (HB Midtone Fill with White Outlines)
        self.pen.penup()
        self.pen.goto(cx - 20, cy + 135)
        self.pen.color(self.theme["stroke_white"], self.theme["stroke_6b"])
        self.pen.width(3.0)
        self.pen.pendown()
        self.pen.begin_fill()

        # Anatomical Profile Points
        face_path = [
            (cx + 15, cy + 112),  # Forehead slope
            (cx + 36, cy + 82),   # Realistic Nose tip
            (cx + 22, cy + 66),   # Upper lip curve
            (cx + 31, cy + 54),   # Lower lip curve
            (cx + 22, cy + 32),   # Chin curve
            (cx - 15, cy + 24),   # Jawline curve
            (cx - 70, cy + 40),   # Ear & neck base
            (cx - 65, cy + 120),  # Back of head
            (cx - 20, cy + 135)   # Forehead top
        ]
        for pt in face_path:
            self.pen.goto(pt[0], pt[1])
        self.pen.end_fill()
        self.refresh(0.02)

        # 3. Cheekbone & Nose Shadow Cross-Hatching (2B Lead Shading)
        self.draw_shading_hatch(cx - 45, cy + 35, 55, 65, density=24, angle=42, color=self.theme["stroke_2b"])
        self.draw_shading_hatch(cx + 10, cy + 60, 20, 45, density=14, angle=-30, color=self.theme["stroke_2b"])

    def draw_realistic_eyes_and_lashes(self):
        """Draws realistic lotus eyes, multi-layer eyelashes, eyelids shadow, and Eyebrows."""
        cx, cy = 0, 10

        # 1. LEFT EYE & CREASE
        left_crease = [(-70, 78), (-45, 72), (-15, 62)]
        self.draw_curve(left_crease, width=1.5, color=self.theme["stroke_hb"])

        left_eye = [(-65, 55), (-45, 36), (-15, 32)]
        self.draw_curve(left_eye, width=3.5, color=self.theme["stroke_white"])

        # Real Eyelashes (Multiple layered tapered strokes)
        for i in range(9):
            t = i / 8.0
            lx = -65 + t * 50
            ly = 55 - math.sin(t * math.pi) * 20
            angle = -60 + t * 30
            rad = math.radians(angle)
            length = 12 + math.sin(t * math.pi) * 8
            
            self.draw_curve([(lx, ly), (lx + math.cos(rad) * length, ly + math.sin(rad) * length)], width=1.8, color=self.theme["stroke_white"])

        # Left Eyebrow (Pencil Strand Texture)
        left_brow = [(-75, 82), (-45, 76), (-12, 64)]
        self.draw_curve(left_brow, width=3.5, color=self.theme["stroke_white"])

        # 2. RIGHT EYE & CREASE
        right_crease = [(20, 108), (42, 130), (65, 148)]
        self.draw_curve(right_crease, width=1.5, color=self.theme["stroke_hb"])

        right_eye = [(25, 48), (45, 68), (62, 90)]
        self.draw_curve(right_eye, width=3.5, color=self.theme["stroke_white"])

        # Right Eyelashes
        for i in range(8):
            t = i / 7.0
            rx = 25 + t * 37
            ry = 48 + t * 42
            angle = 20 - t * 40
            rad = math.radians(angle)
            length = 12 + math.sin(t * math.pi) * 8
            
            self.draw_curve([(rx, ry), (rx + math.cos(rad) * length, ry + math.sin(rad) * length)], width=1.8, color=self.theme["stroke_white"])

        # Right Eyebrow
        right_brow = [(18, 108), (42, 132), (65, 150)]
        self.draw_curve(right_brow, width=3.5, color=self.theme["stroke_white"])
        self.refresh(0.02)

    def draw_3d_nose_and_lips(self):
        """Draws 3D realistic nose tip, nostril shadow, and voluptuous lip volume."""
        cx, cy = 0, 10

        # Nose Tip Highlight & Nostril Shadow
        self.draw_curve([(34, 82), (42, 55), (32, 28), (22, 26)], width=2.5, color=self.theme["stroke_white"])
        self.draw_curve([(30, 24), (24, 20), (18, 26)], width=3.0, color=self.theme["stroke_6b"])

        # Lip Volume & Smiling Curves
        upper_lip = [(12, -22), (28, -10), (38, -16), (48, -22)]
        lower_lip = [(14, -23), (30, -38), (46, -23)]
        lip_line  = [(10, -22), (30, -20), (50, -22)]

        self.draw_curve(upper_lip, width=2.8, color=self.theme["stroke_white"])
        self.draw_curve(lower_lip, width=2.5, color=self.theme["stroke_white"])
        self.draw_curve(lip_line, width=2.0, color=self.theme["stroke_6b"])
        self.refresh(0.02)

    def draw_vaishnava_tilak(self):
        """Draws detailed U-shaped Vaishnava Tilak with center Kasturi mark & dot."""
        cx, cy = 0, 10
        
        # U-Shape White Contour
        tilak_u = [(-18, 128), (-16, 88), (-8, 72), (0, 88), (2, 128)]
        self.draw_curve(tilak_u, width=2.5, color=self.theme["stroke_white"])

        # Center Dot (Bindi)
        self.pen.penup()
        self.pen.goto(-8, 78)
        self.pen.pendown()
        self.pen.dot(7, self.theme["stroke_white"])
        self.refresh(0.01)

    def draw_realistic_turban_and_feather(self):
        """Draws realistic Pagri (turban folds), Mor Pankh (peacock feather barbs), and pearl strands."""
        cx, cy = 0, 10

        # Turban Cloth Folds
        turban_folds = [
            [(-110, 260), (-40, 310), (50, 310), (130, 250), (160, 180)],
            [(-120, 235), (-50, 285), (40, 285), (120, 225), (145, 160)],
            [(-100, 205), (-40, 255), (35, 255), (105, 200), (125, 140)],
            [(-75, 180),  (-20, 225), (30, 225), (90, 175),  (110, 120)]
        ]
        for fold in turban_folds:
            self.draw_curve(fold, width=3.0, color=self.theme["stroke_white"])
            self.refresh(0.005)

        # Pearl Headband Strand
        for i in range(12):
            t = i / 11.0
            px = -60 + t * 125
            py = 175 - math.sin(t * math.pi) * 20
            self.pen.penup()
            self.pen.goto(px, py)
            self.pen.pendown()
            self.pen.dot(8, self.theme["stroke_white"])
            self.pen.dot(4, self.theme["stroke_6b"])
            self.refresh(0.005)

        # Realistic Mor Pankh Peacock Feather
        fx, fy = -160, 210
        num_barbs = 60
        for i in range(num_barbs):
            angle = (i / num_barbs) * 290 - 145
            rad = math.radians(angle)
            length = 75 + math.sin(i * 0.35) * 16

            self.pen.penup()
            self.pen.goto(fx, fy - 25)
            self.pen.color(self.theme["stroke_white"] if i % 2 == 0 else self.theme["stroke_hb"])
            self.pen.width(1.5 if i % 2 == 0 else 1.0)
            self.pen.pendown()
            self.pen.goto(fx + math.cos(rad) * length, fy + math.sin(rad) * length)
            self.refresh(0.002)

        # Concentric Feather Eye Rings
        for r, col, fill_c in [
            (35, "stroke_white", "stroke_9b"),
            (25, "stroke_hb", "stroke_6b"),
            (16, "stroke_white", "stroke_2b"),
            (9,  "stroke_hb", "stroke_9b"),
            (4,  "stroke_white", "stroke_white")
        ]:
            self.pen.penup()
            self.pen.goto(fx, fy - r)
            self.pen.setheading(0)
            self.pen.color(self.theme[col])
            self.pen.width(1.5)
            self.pen.pendown()
            self.pen.fillcolor(self.theme[fill_c])
            self.pen.begin_fill()
            self.pen.circle(r)
            self.pen.end_fill()
        self.refresh(0.015)

    def draw_flowing_hair_locks(self):
        """Draws hyper-detailed realistic hair strands flowing down neck and shoulders."""
        cx, cy = 0, 10
        hair_strands = [
            [(72, 125), (95, 100), (120, 80)],
            [(78, 105), (105, 75), (135, 50)],
            [(80, 80),  (110, 50), (145, 20)],
            [(78, 55),  (108, 25), (140, -10)],
            [(72, 30),  (100, 0),  (130, -35)],
            [(65, 5),   (90, -25), (115, -60)]
        ]
        for strand in hair_strands:
            self.draw_curve(strand, width=2.2, color=self.theme["stroke_white"])
            self.refresh(0.005)

    def draw_3d_bansuri_flute(self):
        """Draws 3D cylindrical Bansuri flute with finger holes, metallic bands, and silk tassels."""
        flute_top = [(-165, -185), (-50, -120), (60, -55), (170, 10)]
        flute_bottom = [(-150, -210), (-35, -145), (75, -80), (185, -15)]

        self.draw_curve(flute_top, width=3.2, color=self.theme["stroke_white"])
        self.draw_curve(flute_bottom, width=3.2, color=self.theme["stroke_white"])

        # End Cap & Finger Holes
        self.pen.penup()
        self.pen.goto(177, -2.5)
        self.pen.pendown()
        self.pen.dot(18, self.theme["stroke_white"])
        self.pen.dot(10, self.theme["stroke_6b"])

        holes = [(-110, -150), (-60, -120), (-10, -90), (40, -60), (90, -30), (140, 0)]
        for hx, hy in holes:
            self.pen.penup()
            self.pen.goto(hx, hy)
            self.pen.pendown()
            self.pen.dot(8, self.theme["stroke_white"])
            self.pen.dot(4, self.theme["stroke_6b"])
            self.refresh(0.005)

        # Hanging Tassels & Pearl Drops
        self.draw_curve([(185, -15), (200, -45)], width=2.0, color=self.theme["stroke_white"])
        self.pen.penup()
        self.pen.goto(202, -52)
        self.pen.pendown()
        self.pen.dot(10, self.theme["stroke_white"])
        self.refresh(0.01)

    def draw_hud_overlay(self):
        self.hud_pen.clear()
        
        self.hud_pen.penup()
        self.hud_pen.goto(0, 410)
        self.hud_pen.color(self.theme["stroke_white"])
        self.hud_pen.write("SHREE  KRISHNA", align="center", font=("Cinzel", 34, "bold"))

        self.hud_pen.goto(0, 380)
        self.hud_pen.color(self.theme["stroke_hb"])
        self.hud_pen.write(f"— {self.theme['name'].upper()} —", align="center", font=("Georgia", 11, "bold"))

        self.hud_pen.goto(0, -425)
        self.hud_pen.color(self.theme["accent"])
        self.hud_pen.write("[C] Cycle Color Theme   •   [S] Save Image   •   [R] Re-sketch   •   [Space] Pause", align="center", font=("Georgia", 12, "bold"))
        self.screen.update()

    def update_mouse_particles(self):
        self.particle_pen.clear()
        for p in self.mouse_particles[:]:
            p["x"] += p["vx"]
            p["y"] += p["vy"]
            p["alpha"] -= 0.04
            if p["alpha"] <= 0:
                self.mouse_particles.remove(p)
            else:
                self.particle_pen.penup()
                self.particle_pen.goto(p["x"], p["y"])
                self.particle_pen.dot(int(p["size"]), p["col"])

    def run(self):
        self.setup_canvas()
        self.is_drawing = True

        self.draw_background_atmosphere()
        self.draw_3d_face_structure()
        self.draw_flowing_hair_locks()
        self.draw_realistic_eyes_and_lashes()
        self.draw_3d_nose_and_lips()
        self.draw_vaishnava_tilak()
        self.draw_realistic_turban_and_feather()
        self.draw_3d_bansuri_flute()
        self.draw_hud_overlay()

        self.is_drawing = False
        print("✨ Hyper-Realistic 3D Charcoal Portrait Complete! Interactive mode active. ✨")
        self.start_interactive_loop()

    def start_interactive_loop(self):
        try:
            while not self.is_drawing:
                if not self.is_paused:
                    self.update_mouse_particles()
                    self.screen.update()
                time.sleep(0.02)
        except Exception:
            pass

if __name__ == "__main__":
    engine = HyperRealisticKrishnaPortraitEngine()
    engine.run()
