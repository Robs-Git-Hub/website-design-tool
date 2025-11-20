# Website Aesthetic Schema (WAS) — Masterplan

**Version:** 0.1  
**Authors:** Robert + AI collaborators  
**Status:** Draft but active  

---

# 1. Purpose & Vision

Modern AI-assisted design needs structure. Image generators, coding assistants, and design agents all respond best when given **precise, machine-readable specifications**.  
But aesthetic language today is fragmented — humans talk in vibes (“Hygge”, “Cold corporate SaaS”), designers talk in visual systems, and LLMs understand JSON vocabularies.

**The Website Aesthetic Schema (WAS)** creates a **shared language** that bridges:

- Humans with preferences  
- Designers (human or AI)  
- Coders (human or AI)  
- Image-generation systems  
- Research & retrieval agents  

The core vision is:

> **A structured, multi-layer system that represents “the feel of a website” in a machine-actionable format that humans can understand and AI systems can execute.**

This supports a future where:
- You can generate mood boards on demand  
- Agents can search the web for examples  
- Coding assistants can build components consistent with a chosen style  
- You can iterate fast by tweaking structured aesthetic “bundles”  
- Designs are reproducible, modifiable, and exportable  
- You’re never locked into one artist, model, or agent  

---

# 2. Architecture Overview — The Four-Layer System

Layer 1 — Fundamental axes (universal aesthetic dimensions)
Layer 2 — Canonical styles (evidence-backed UI/graphic design styles)
Layer 3 — Lexicon (fine-grained UI descriptors mapped to styles)
Layer 4 — Societal/Cultural/Industry trends (Hygge, SaaS 2018, Cottagecore, etc.)


### How they relate:
- **Higher layers constrain lower layers.**
- **Lower layers enrich higher layers with implementation detail.**
- Any user preference can be represented as a combination of L1 → L4 elements.
- Any image generator or coding assistant can consume these same elements in JSON.

---

# 3. Planned Deliverables

By completion of all phases, WAS will include:

### **Core Assets**
- Schemas for Layers 1–4  
- Curated instance datasets for Layers 1–4  
- A conversion workflow:
  - TOML → JSON (for AI prompts)
  - Optional JSON → TOML (for ingestion)

### **Aesthetic Bundles**
Reproducible “snapshots” of design settings that AI agents can use:

- image-bundle.json  
- ux-bundle.json  
- code-bundle.json  

Bundles act as:
- Design presets  
- Prompt templates  
- Reusable styles across projects  

### **Tooling**
- Basic validator scripts (LLM or code)  
- A moodboard generator (image + web search)  
- Templates for Designer Agent / Research Agent / Coder Agent  

---

# 4. Phased Roadmap

### **Phase 01 — Foundations (Current Phase)**
Goal: Establish repository structure, schemas, instance files, and planning docs.  
Outputs:
- Schemas for L1–L4  
- Initial instance datasets  
- Documentation structure (masterplan, phases, tasks)  
- Repo scaffold complete  

### **Phase 02 — Expansion & Curation**
Goal: Deepen datasets for L2–L4 using research agents; ensure quality, evidence, MECE structure.  
Outputs:
- Validated style list (L2)  
- Full lexicon (L3)  
- Robust trend dataset (L4)  
- Cross-layer mapping integrity checks  

### **Phase 03 — Bundle Design & Multi-Agent Framework**
Goal: Define WAS Bundle format and create prompt templates for:
- Image generation  
- Coding assistants  
- Web search/moodboard agents  

Outputs:
- bundle_schema.json  
- three family templates (image/ux/code)  
- Mapping rules from L1–L4 → bundle fields  

### **Phase 04 — Tooling & Playground**
Goal: Create interactive workflows:
- Generate mood boards  
- Retrieve real web examples  
- Build aesthetic-selector flows  
- Test bundles live  

Outputs:
- Example scripts / agents  
- “Aesthetic Picker” markdown flow  
- Demo repo / simple web UI  

### **Phase 05 — Finalisation & Externalisation**
Goal: Clean, document, and package the WAS for long-term use.  
Outputs:
- Documentation site or GitHub pages  
- Starter bundles  
- Agent instructions  
- Tutorial  
- Version 1.0 release  

---

# 5. Success Criteria

- Humans, designers, coders, and AIs can all understand and use the taxonomy.  
- Aesthetic bundles produce predictable, reproducible design outputs.  
- Systems (image models, coding assistants) can consume the structured JSON.  
- The ontology is stable, extendable, and evidence-based.  

---

# 6. Guiding Principles

- **Schemas at every layer** for consistency.  
- **TOML for authoring**, **JSON for runtime agents**.  
- **Evidence-driven**, not speculative.  
- **MECE**, clean, structured terminology.  
- **Multi-agent first**  
- **Avoid design inertia** — preserve exploration and fresh starts.  