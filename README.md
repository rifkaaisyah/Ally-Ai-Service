# Ally AI Service

> AI and intelligent journey-generation service for the Ally scholarship
> preparation platform.

Ally AI Service is a Node.js and Express-based service that provides the
intelligent processing layer for the Ally platform.

The service supports assessment analysis, scholarship-related intelligence,
AI-assisted essay review, OCR/document processing, personalized journey
planning, gamified roadmap generation, mentor-related intelligence, and
retrieval-augmented generation (RAG).

It is designed to work alongside the Ally Frontend and Ally Backend as a
dedicated AI/service layer.

---

## Table of Contents

- [Overview](#overview)
- [Responsibilities](#responsibilities)
- [Key Capabilities](#key-capabilities)
- [Architecture](#architecture)
- [AI and Intelligence Layer](#ai-and-intelligence-layer)
- [Assessment Intelligence](#assessment-intelligence)
- [Scholarship Journey Generation](#scholarship-journey-generation)
- [Journey and Valley System](#journey-and-valley-system)
- [RAG System](#rag-system)
- [Essay Review](#essay-review)
- [OCR and Document Processing](#ocr-and-document-processing)
- [Mentor and Progress Services](#mentor-and-progress-services)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Service](#running-the-service)
- [Testing](#testing)
- [Integration with Ally](#integration-with-ally)
- [Data and Persistence](#data-and-persistence)
- [Security Considerations](#security-considerations)
- [Development Notes](#development-notes)
- [Related Repositories](#related-repositories)
- [License](#license)

---

# Overview

Ally is a scholarship preparation platform designed to help students
understand their readiness, identify suitable scholarship opportunities,
and follow a structured preparation journey.

The AI Service provides the intelligent and processing-oriented capabilities
used by the platform.

At a high level:

```text
                    ┌─────────────────────┐
                    │    Ally Student     │
                    │      / Mentor       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Ally Frontend     │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Ally Backend     │
                    │ Core Application API│
                    └──────────┬──────────┘
                               │
                         AI / Service Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Ally AI Service   │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
        AI Generation       RAG / Data       Processing Services
          / Ollama          Retrieval        OCR / Documents
