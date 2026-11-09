import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, KeepTogether)

OUT = sys.argv[1]
F = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("Arial", F + "arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", F + "arialbd.ttf"))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold")

GREEN = colors.HexColor("#1DB954")
DARK = colors.HexColor("#191414")
GREY = colors.HexColor("#F2F2F2")

title = ParagraphStyle("t", fontName="Arial-Bold", fontSize=22, leading=26, textColor=DARK)
sub = ParagraphStyle("s", fontName="Arial", fontSize=11, leading=15, textColor=colors.HexColor("#555555"))
h = ParagraphStyle("h", fontName="Arial-Bold", fontSize=14, leading=18, textColor=GREEN, spaceBefore=10, spaceAfter=6)
body = ParagraphStyle("b", fontName="Arial", fontSize=9.5, leading=12.5, textColor=DARK)
cell = ParagraphStyle("c", fontName="Arial", fontSize=8.5, leading=11, textColor=DARK)
cellb = ParagraphStyle("cb", parent=cell, fontName="Arial-Bold", textColor=colors.white)

PHASES = [
    ("Fase A — Definición (qué y con qué)", [
        ("1", "ADR 0001–0003 (reproducción, auth, Randomizer)", "Aceptar / cambiar", "Redactar (hecho)", "docs/adr/"),
        ("2", "PRD", "Brainstorming corto", "Redactar", "docs/prd.md: objetivo, historias, criterios de aceptación, fuera de alcance"),
        ("3", "ADR-0004: stack tecnológico", "Revisar tabla", "Redactar", "Stack cerrado"),
        ("4", "Arquitectura", "Revisar", "Diagrama de componentes y flujo", "docs/architecture.md"),
    ]),
    ("Fase B — Planificación", [
        ("5", "Instalar plugin Notion", "/plugin install + autorizar", "—", "Conexión lista"),
        ("6", "Desglose + esfuerzo", "Revisar / ajustar", "Épicas → tareas (horas, riesgo, supuestos)", "Lista revisada"),
        ("7", "Tablero Notion", "—", "Crear BD y volcar tareas", "Backlog en Notion"),
    ]),
    ("Fase C — Diseño", [
        ("8", "Conectar Penpot", "Crear cuenta, abrir plugin", "Configurar MCP en el proyecto", "Conexión lista"),
        ("9", "Design tokens", "Elegir estilo / aprobar", "Proponer", "Sistema de diseño base"),
        ("10", "Pantallas (Login, Randomizer, estados, responsive)", "Revisar / iterar", "Diseñar (subagente ui-designer)", "Diseño aprobado"),
    ]),
    ("Fase D — Cimientos técnicos", [
        ("11", "Scaffold", "—", "Next.js, TS strict, Tailwind, shadcn, carpetas, géneros", "Proyecto en local"),
        ("12", "Calidad", "—", "ESLint, Prettier, Husky, commitlint, Vitest, Playwright, MSW", "lint / test / e2e OK"),
        ("13", "Configuración de Claude", "Revisar", "CLAUDE.md, subagentes, plantilla PR", "Flujo IA definido"),
        ("14", "GitHub", "Aprobar creación", "Repo público, main protegida, Actions", "CI en cada PR"),
        ("15", "Spotify + Vercel", "Crear app, secretos, vincular repo", "Guiarte", "Preview deploy"),
        ("16", "Hito walking skeleton", "Comprobar", "—", "Web vacía desplegada con CI verde"),
    ]),
    ("Fase F — Puesta en producción", [
        ("17", "Hardening", "—", "CSP, Lighthouse, /security-review", "Checklist en verde"),
        ("18", "Spotify producción", "Redirect URI + usuarios (máx. 5)", "Guiarte", "Login en producción"),
        ("19", "Release v1.0.0", "Aprobar", "Tag, CHANGELOG, GitHub Release", "Versión publicada"),
        ("20", "Portfolio", "Revisar", "README con GIF, diagrama, decisiones", "Listo para enseñar"),
        ("21", "Retrospectiva", "Reflexionar", "Comparar horas estimadas vs reales", "Aprendizaje para iteración 2"),
    ]),
]

CYCLE = [
    "Notion: tarea Todo → In progress",
    "Rama feat/&lt;tarea&gt;",
    "TDD: test que falla → código → test pasa → refactor",
    "Commits convencionales (feat:, fix:, test:…)",
    "Pull Request con plantilla (enlace Notion, capturas, checklist)",
    "CI: lint · typecheck · unit · build · e2e",
    "Vercel preview: probar en URL real",
    "Review: subagente code-reviewer + tú",
    "Squash merge a main → Notion Done",
]
EPICS = [
    "<b>Auth</b>: login/logout PKCE, sesión cifrada, refresh token",
    "<b>Cliente Spotify</b>: server-only, zod, errores, 429",
    "<b>Randomizer lógica</b>: query, offset, reintentos (TDD puro)",
    "<b>Randomizer UI</b>: botón, lista, embed, enlace a Spotify, estados",
    "<b>Pulido</b>: accesibilidad, responsive, SEO, páginas de error",
]


def phase_table(rows):
    data = [[Paragraph(x, cellb) for x in ("#", "Paso", "Tú", "Claude", "Resultado")]]
    for r in rows:
        data.append([Paragraph(x, cell) for x in r])
    t = Table(data, colWidths=[8*mm, 45*mm, 36*mm, 48*mm, 43*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GREY]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#DDDDDD")),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def bullets(items, numbered=False):
    return [Paragraph(f"{i+1}. {x}" if numbered else f"• {x}", body) for i, x in enumerate(items)]


story = [
    Paragraph("That Music Is New — Hoja de ruta", title), Spacer(1, 4),
    Paragraph("De las decisiones de arquitectura a producción · Iteración 1 (Randomizer)", sub),
    Spacer(1, 6),
    Paragraph("Stack: Next.js + TypeScript · Spotify Web API (OAuth PKCE) · Vercel · Supabase (iteración 2) · "
              "Notion (tareas) · Penpot (diseño) · GitHub Actions (CI)", body),
]
for i, (name, rows) in enumerate(PHASES):
    story.append(KeepTogether([Paragraph(name, h), phase_table(rows)]))
    if i == 3:  # after Fase D -> Fase E
        story.append(KeepTogether(
            [Paragraph("Fase E — Desarrollo (un ciclo por cada tarea de Notion)", h)]
            + bullets(CYCLE, numbered=True)
            + [Spacer(1, 6), Paragraph("<b>Orden aproximado de épicas</b>", body)]
            + bullets(EPICS, numbered=True)))

story += [
    Paragraph("Claves para entrevistas", h),
    *bullets([
        "Las ADR (docs/adr/) muestran que razonas tus decisiones técnicas.",
        "La comparativa estimado vs real (paso 21) demuestra planificación y medición.",
        "Spotify limita a 5 usuarios en modo desarrollo → el GIF del README es la demo principal.",
    ]),
]

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm,
                        topMargin=15*mm, bottomMargin=15*mm,
                        title="That Music Is New — Hoja de ruta")
doc.build(story)
print("OK", OUT)
