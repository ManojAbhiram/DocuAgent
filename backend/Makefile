ifeq ($(OS),Windows_NT)
	PYTHON = python
	PIP = .\venv\Scripts\pip
	UVICORN = .\venv\Scripts\uvicorn
	PYTEST = .\venv\Scripts\pytest
	FLAKE8 = .\venv\Scripts\flake8
	BLACK = .\venv\Scripts\black
	MYPY = .\venv\Scripts\mypy
	RM = rmdir /s /q
else
	PYTHON = python3
	PIP = ./venv/bin/pip
	UVICORN = ./venv/bin/uvicorn
	PYTEST = ./venv/bin/pytest
	FLAKE8 = ./venv/bin/flake8
	BLACK = ./venv/bin/black
	MYPY = ./venv/bin/mypy
	RM = rm -rf
endif

.PHONY: install run test lint clean

install:
	$(PYTHON) -m venv venv
	$(PIP) install -r requirements.txt
	@if exist requirements-dev.txt $(PIP) install -r requirements-dev.txt

run:
	$(UVICORN) app.main:app --reload --host 0.0.0.0 --port 8000

test:
	$(PYTEST) -v

lint:
	$(FLAKE8) app/
	$(BLACK) app/
	$(MYPY) app/

clean:
	$(RM) __pycache__ .pytest_cache
