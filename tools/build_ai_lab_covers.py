#!/usr/bin/env python3
"""Build square AI Lab product mockups from real interfaces and local assets."""

from __future__ import annotations

from pathlib import Path
from random import Random

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "assets" / "lab" / "projects"
DESIGN = ROOT / "design"
PUBLIC = ROOT / "public"
SIZE = 1400
INK = (20, 22, 27, 255)
PAPER = (249, 244, 231, 255)
BLUE = (49, 88, 196, 255)
LIME = (211, 244, 111, 255)
PINK = (238, 157, 187, 255)


def texture(size: tuple[int, int], seed: int, base: tuple[int, int, int, int], amount: int = 8) -> Image.Image:
    rng = Random(seed)
    image = Image.new("RGBA", size, base)
    pixels = image.load()
    for y in range(size[1]):
        for x in range(size[0]):
            noise = rng.randint(-amount, amount)
            pixels[x, y] = tuple(max(0, min(255, channel + noise)) for channel in base[:3]) + (base[3],)
    return image


def rounded(source: Image.Image, radius: int) -> Image.Image:
    source = source.convert("RGBA")
    mask = Image.new("L", source.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, source.width - 1, source.height - 1), radius=radius, fill=255)
    source.putalpha(mask)
    return source


def fit(path: Path, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(Image.open(path).convert("RGBA"), size, Image.Resampling.LANCZOS)


def contain(path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    return image


def shadow_layer(image: Image.Image, blur: int = 30, opacity: int = 135) -> Image.Image:
    alpha = image.getchannel("A").point(lambda value: value * opacity // 255)
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow.putalpha(alpha)
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def paste_with_shadow(canvas: Image.Image, item: Image.Image, xy: tuple[int, int], blur: int = 30) -> None:
    canvas.alpha_composite(shadow_layer(item, blur), (xy[0] + 20, xy[1] + 26))
    canvas.alpha_composite(item, xy)


def stage(seed: int) -> Image.Image:
    canvas = texture((SIZE, SIZE), seed, (25, 25, 27, 255), 6)
    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.ellipse((1010, -170, 1530, 350), fill=(78, 89, 154, 42))
    draw.ellipse((-180, 970, 410, 1520), fill=(229, 178, 113, 28))
    paper = texture((1080, 1030), seed + 100, PAPER, 5)
    paper = rounded(paper, 18).rotate(-2.2, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, paper, (155, 180), 38)
    draw.rounded_rectangle((215, 118, 1125, 255), radius=18, fill=BLUE)
    draw.rounded_rectangle((235, 138, 520, 154), radius=8, fill=LIME)
    draw.rounded_rectangle((535, 138, 710, 154), radius=8, fill=PINK)
    draw.polygon([(202, 162), (330, 140), (350, 225), (220, 243)], fill=(226, 210, 175, 205))
    draw.polygon([(1090, 174), (1228, 192), (1204, 277), (1068, 252)], fill=(226, 210, 175, 205))
    return canvas


def browser(screen: Image.Image, size: tuple[int, int], accent: tuple[int, int, int, int] = BLUE) -> Image.Image:
    width, height = size
    frame = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame, "RGBA")
    draw.rounded_rectangle((0, 0, width - 1, height - 1), radius=28, fill=(15, 17, 22, 255), outline=(8, 8, 10, 255), width=4)
    draw.rounded_rectangle((4, 4, width - 5, 62), radius=24, fill=(238, 232, 216, 255))
    draw.rectangle((4, 34, width - 5, 65), fill=(238, 232, 216, 255))
    for index, color in enumerate(((239, 126, 136, 255), (242, 190, 102, 255), accent)):
        draw.ellipse((24 + index * 28, 22, 40 + index * 28, 38), fill=color)
    content = ImageOps.fit(screen.convert("RGBA"), (width - 20, height - 78), Image.Resampling.LANCZOS)
    frame.alpha_composite(rounded(content, 10), (10, 68))
    return frame


def phone(screen: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = size
    frame = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame, "RGBA")
    draw.rounded_rectangle((0, 0, width - 1, height - 1), radius=48, fill=(12, 13, 16, 255), outline=(2, 2, 3, 255), width=4)
    content = ImageOps.fit(screen.convert("RGBA"), (width - 24, height - 30), Image.Resampling.LANCZOS)
    frame.alpha_composite(rounded(content, 38), (12, 15))
    draw.rounded_rectangle((width // 2 - 42, 12, width // 2 + 42, 25), radius=8, fill=(4, 4, 5, 255))
    return frame


def save(canvas: Image.Image, name: str) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(OUTPUT / f"{name}.jpg", quality=92, optimize=True, progressive=True)


def perxio() -> None:
    canvas = stage(11)
    dashboard = fit(DESIGN / "cover-generation/sources/perxio/dashboard.png", (920, 650))
    main = browser(dashboard, (930, 720), (42, 201, 213, 255)).rotate(1.6, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, main, (245, 355), 32)
    survey = Image.new("RGBA", (260, 520), (22, 25, 35, 255))
    draw = ImageDraw.Draw(survey, "RGBA")
    draw.rounded_rectangle((24, 40, 236, 72), 12, fill=(112, 79, 235, 255))
    draw.rounded_rectangle((24, 110, 190, 134), 10, fill=(235, 236, 240, 230))
    for y in (174, 244, 314, 384):
        draw.rounded_rectangle((24, y, 236, y + 48), 13, fill=(42, 45, 58, 255), outline=(93, 77, 170, 255), width=2)
    mobile = phone(survey, (286, 590)).rotate(-7, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, mobile, (920, 650), 24)
    save(canvas, "perxio-workspace")


def hapopus() -> None:
    canvas = stage(22)
    source = fit(PUBLIC / "cases/projects/hapopus-haptics/cover-thumb.png", (920, 560))
    main = browser(source, (940, 650), (52, 182, 184, 255)).rotate(-1.8, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, main, (230, 395), 34)
    wave = Image.new("RGBA", (245, 520), (24, 28, 34, 255))
    draw = ImageDraw.Draw(wave, "RGBA")
    draw.ellipse((45, 60, 200, 215), fill=(27, 42, 64, 255), outline=(122, 218, 211, 255), width=5)
    points = []
    for x in range(24, 222, 6):
        y = 330 + int(55 * ((x % 36) / 36 - 0.5))
        points.append((x, y))
    draw.line(points, fill=(133, 239, 213, 255), width=6)
    draw.rounded_rectangle((35, 420, 210, 458), 18, fill=(52, 182, 184, 255))
    mobile = phone(wave, (270, 580)).rotate(7, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, mobile, (880, 640), 22)
    save(canvas, "hapopus-haptics")


def dance_plus() -> None:
    canvas = stage(33)
    source = fit(PUBLIC / "cases/projects/dance-plus/cover-square.png", (870, 720))
    main = browser(source, (920, 760), (126, 88, 226, 255)).rotate(1.3, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, main, (260, 330), 38)
    draw = ImageDraw.Draw(canvas, "RGBA")
    for index in range(4):
        x = 260 + index * 68
        draw.arc((x, 1080 - index * 14, x + 240, 1320 - index * 10), 180, 348, fill=(126, 88, 226, 120 - index * 18), width=8)
    save(canvas, "dance-plus")


def wildsit() -> None:
    canvas = stage(44)
    source = fit(PUBLIC / "cases/projects/wildsit-game/cover-thumb.png", (810, 560))
    main = browser(source, (920, 690), (89, 145, 88, 255)).rotate(-2.4, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, main, (235, 380), 32)
    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.ellipse((270, 1060, 1130, 1270), outline=(89, 145, 88, 90), width=8)
    save(canvas, "wildsit-game")


def navigator_screen() -> Image.Image:
    screen = Image.new("RGBA", (1000, 650), (244, 238, 222, 255))
    draw = ImageDraw.Draw(screen, "RGBA")
    draw.rectangle((0, 0, 1000, 92), fill=(32, 49, 96, 255))
    draw.rounded_rectangle((48, 29, 280, 56), 12, fill=LIME)
    draw.rounded_rectangle((750, 26, 940, 62), 16, fill=(255, 255, 255, 80))
    colors = (BLUE, (232, 160, 190, 255), (88, 168, 153, 255), (230, 181, 96, 255), (117, 92, 184, 255), (86, 116, 160, 255))
    for index, color in enumerate(colors):
        col, row = index % 3, index // 3
        x, y = 50 + col * 310, 132 + row * 230
        draw.rounded_rectangle((x, y, x + 270, y + 190), 20, fill=(255, 253, 247, 255), outline=(37, 38, 45, 255), width=3)
        draw.rounded_rectangle((x + 18, y + 18, x + 252, y + 78), 14, fill=color)
        draw.rounded_rectangle((x + 18, y + 105, x + 205, y + 124), 8, fill=(52, 55, 66, 220))
        draw.rounded_rectangle((x + 18, y + 142, x + 145, y + 158), 8, fill=(115, 116, 120, 155))
    return screen


def vibe_navigator() -> None:
    canvas = stage(55)
    main = browser(navigator_screen(), (980, 710), (86, 116, 160, 255)).rotate(1.8, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, main, (220, 350), 36)
    save(canvas, "vibe-coding-navigator")


def voice_chat() -> None:
    canvas = stage(66)
    screen = Image.new("RGBA", (320, 680), (18, 23, 38, 255))
    draw = ImageDraw.Draw(screen, "RGBA")
    draw.ellipse((72, 60, 248, 236), fill=(69, 91, 178, 255))
    draw.ellipse((112, 100, 208, 196), fill=(214, 244, 111, 255))
    for index in range(29):
        x = 28 + index * 9
        height = 18 + ((index * 17) % 74)
        draw.rounded_rectangle((x, 365 - height, x + 5, 365 + height), 3, fill=(117, 178, 217, 230))
    for y, width in ((455, 240), (502, 190), (549, 220)):
        draw.rounded_rectangle((40, y, 40 + width, y + 22), 10, fill=(239, 241, 247, 180))
    draw.ellipse((124, 600, 196, 672), fill=(238, 157, 187, 255))
    mobile = phone(screen, (380, 790)).rotate(-5, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, mobile, (500, 335), 38)
    draw = ImageDraw.Draw(canvas, "RGBA")
    for index in range(8):
        x = 280 + index * 115
        height = 50 + (index * 29) % 190
        draw.rounded_rectangle((x, 1075 - height, x + 24, 1075), 12, fill=(50, 102, 183, 90))
    save(canvas, "realtime-voice-chat")


def tarot_game() -> None:
    canvas = stage(77)
    draw = ImageDraw.Draw(canvas, "RGBA")
    colors = ((40, 50, 97, 255), (93, 66, 124, 255), (36, 92, 100, 255))
    positions = ((310, 400, -8), (560, 335, 2), (825, 410, 9))
    for index, ((x, y, angle), color) in enumerate(zip(positions, colors)):
        card = Image.new("RGBA", (300, 520), (0, 0, 0, 0))
        card_draw = ImageDraw.Draw(card, "RGBA")
        card_draw.rounded_rectangle((4, 4, 296, 516), 28, fill=color, outline=(232, 205, 135, 255), width=7)
        card_draw.ellipse((68, 100, 232, 264), fill=(245, 220, 140, 235))
        card_draw.polygon([(150, 128), (175, 205), (255, 205), (190, 250), (215, 330), (150, 282), (85, 330), (110, 250), (45, 205), (125, 205)], fill=(248, 242, 213, 235))
        for offset in (30, 246):
            card_draw.ellipse((offset, 430, offset + 24, 454), fill=PINK if index == 1 else LIME)
        card = card.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        paste_with_shadow(canvas, card, (x, y), 30)
    draw.ellipse((185, 1030, 1215, 1310), outline=(229, 198, 116, 80), width=8)
    save(canvas, "tarot-story-game")


def sprite_pipeline() -> None:
    canvas = stage(88)
    character_path = DESIGN / "ip-library/luobogou/source-archive/10_IP设计/定稿/三视图.png"
    scene_path = PUBLIC / "assets/ip/luobogou/hero-still.png"
    character = fit(character_path, (910, 455))
    sheet = browser(character, (900, 560), (92, 151, 105, 255)).rotate(-1.8, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, sheet, (245, 355), 34)
    scene = fit(scene_path, (440, 290))
    scene_window = browser(scene, (470, 370), PINK).rotate(5, expand=True, resample=Image.Resampling.BICUBIC)
    paste_with_shadow(canvas, scene_window, (750, 770), 26)
    save(canvas, "raddie-sprite-pipeline")


def main() -> None:
    perxio()
    hapopus()
    dance_plus()
    wildsit()
    vibe_navigator()
    voice_chat()
    tarot_game()
    sprite_pipeline()
    print(f"Built 8 AI Lab covers in {OUTPUT}")


if __name__ == "__main__":
    main()
