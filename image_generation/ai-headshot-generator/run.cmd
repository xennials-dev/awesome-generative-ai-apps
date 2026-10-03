@echo off
title AI Headshot Generator - Free Zero-Friction Mode (localhost:3001)
cd /d "%~dp0"
echo ==========================================================
echo Starting AI Headshot Generator on http://localhost:3001
echo Mode: Zero-Friction (No Auth, No Tokens, Unlimited Credits)
echo ==========================================================
npm run dev -- -p 3001
pause
