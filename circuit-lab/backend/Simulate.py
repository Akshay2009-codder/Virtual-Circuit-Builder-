from collections import defaultdict, deque
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Project

simulate_bp = Blueprint("simulate", __name__, url_prefix="/api/projects")

SOURCE_CATEGORIES = {"source", "board"}


def build_suggestions(status, nodes, edges, powered_ids, node_by_id):
    suggestions = []

    if not nodes:
        suggestions.append("Drag a power source onto the board to get started — try a 9V Battery or an ESP32.")
        return suggestions

    if status == "no_source":
        suggestions.append(
            "Add a power source (battery, solar panel, or dev board) — nothing can run without one."
        )
    elif status == "open":
        suggestions.append(
            "Wire a path from every part back to the source's other terminal to close the loop."
        )
    elif status == "short":
        suggestions.append(
            "Put a resistor between the source and the rest of the circuit — a bare wire loop has nothing to limit current."
        )

    # LED without a resistor anywhere in the powered loop
    led_ids = [n["id"] for n in nodes if n.get("key") == "led"]
    resistor_ids = {n["id"] for n in nodes if n.get("key") == "resistor"}
    if status == "complete":
        for led_id in led_ids:
            if led_id in powered_ids and not (resistor_ids & powered_ids):
                suggestions.append(
                    "Add a resistor in series with your LED — without one it can draw too much current and burn out."
                )
                break

    # circuit has parts sitting completely unwired
    wired_ids = {e["sourceId"] for e in edges} | {e["targetId"] for e in edges}
    stray = [n["name"] for n in nodes if n["id"] not in wired_ids]
    if stray:
        names = ", ".join(stray[:3])
        suggestions.append(f"{names} {'is' if len(stray) == 1 else 'are'} sitting unconnected — wire them in or remove them.")

    if status == "complete" and not suggestions:
        suggestions.append("Looks solid! Try adding a switch so you can turn it on and off.")

    return suggestions[:3]  # keep it short - a wall of tips is worse than no tips


@simulate_bp.post("/<int:project_id>/simulate")
@jwt_required()
def simulate_circuit(project_id):
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found."}), 404

    circuit = project.circuit_json or {"nodes": [], "edges": []}
    nodes = circuit.get("nodes", [])
    edges = circuit.get("edges", [])
    node_by_id = {n["id"]: n for n in nodes}

    # Graph over terminal points: ("nodeId", "a"|"b"). Every component
    # conducts between its own two terminals; every wire connects two
    # terminals. A closed loop exists if we can walk from a source's "a"
    # terminal back to its "b" terminal via some external path.
    adj = defaultdict(set)
    for n in nodes:
        a, b = (n["id"], "a"), (n["id"], "b")
        adj[a].add(b)
        adj[b].add(a)
    for e in edges:
        p1 = (e["sourceId"], e["sourceTerminal"])
        p2 = (e["targetId"], e["targetTerminal"])
        adj[p1].add(p2)
        adj[p2].add(p1)

    sources = [n for n in nodes if n.get("category") in SOURCE_CATEGORIES]

    if not sources:
        suggestions = build_suggestions("no_source", nodes, edges, set(), node_by_id)
        return jsonify({
            "status": "no_source",
            "message": "No power source on the board. Add a battery, solar panel, or dev board to power the circuit.",
            "poweredIds": [],
            "suggestions": suggestions,
        }), 200

    powered_ids = set()
    any_complete = False
    is_short = False

    for src in sources:
        start = (src["id"], "a")
        goal = (src["id"], "b")

        visited = {start}
        queue = deque([(start, [start])])
        found_path = None
        while queue:
            current, path = queue.popleft()
            if current == goal and len(path) > 1:
                found_path = path
                break
            for nxt in adj[current]:
                if current == start and nxt == goal:
                    continue  # skip the trivial direct a-b jump inside the source itself
                if nxt in visited:
                    continue
                visited.add(nxt)
                queue.append((nxt, path + [nxt]))

        if found_path:
            any_complete = True
            powered_ids |= {p[0] for p in found_path}

            # crude short-circuit heuristic: the entire external path back to
            # the source is nothing but wire - nothing limits the current
            intermediate = [node_by_id.get(p[0]) for p in found_path[1:-1]]
            if intermediate and all((c or {}).get("key") == "wire" for c in intermediate):
                is_short = True

    lit_leds = [
        node_by_id[nid]["name"]
        for nid in powered_ids
        if node_by_id.get(nid, {}).get("key") == "led"
    ]

    if is_short:
        status = "short"
        message = "Short circuit detected — current has nothing to limit it. In real life this could damage the source or components."
    elif any_complete:
        status = "complete"
        if lit_leds:
            names = ", ".join(lit_leds)
            message = f"Circuit complete! Current is flowing — {names} lights up."
        else:
            message = "Circuit complete! Current is flowing through the loop."
    else:
        status = "open"
        message = "Open circuit — there's no complete path back to the power source, so no current flows. Check your wiring."

    suggestions = build_suggestions(status, nodes, edges, powered_ids, node_by_id)

    return jsonify({
        "status": status,
        "message": message,
        "poweredIds": list(powered_ids),
        "suggestions": suggestions,
    }), 200